"use client";
import React from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function BlockExplorerPage() {
  const [userAddress, setUserAddress] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const contractAddress = "0x096a1E215C5A1ec86FC1FD8e7D2dff782f557a77"; // YourCollectible contract address

  const connectWallet = async () => {
    setLoading(true);
    try {
      if (!window.ethereum) throw new Error("MetaMask required!");
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setUserAddress(address);
    } catch (e) {
      console.error("Wallet connection failed:", e);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    connectWallet();
  }, []);

  const openEtherscan = (type: 'address' | 'contract', addr: string) => {
    const baseUrl = "https://sepolia.etherscan.io";
    window.open(`${baseUrl}/${type}/${addr}`, '_blank');
  };

  return (
    <section style={{ padding: 56, maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 32 }}>Block Explorer</h2>
      <div style={{ background: "var(--card-bg, #fafafa)", border: "1px solid #eee", borderRadius: 12, padding: 32 }}>
        <h3 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Contract Information</h3>
        <div style={{ marginBottom: 16 }}>
          <strong>Contract Address:</strong>
          <div style={{ fontFamily: "monospace", background: "#f5f5f5", padding: "8px", borderRadius: 4, marginTop: 4 }}>
            {contractAddress}
          </div>
          <button
            onClick={() => openEtherscan('address', contractAddress)}
            style={{
              marginTop: 8,
              padding: "8px 16px",
              background: "#0879ff",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer"
            }}
          >
            View on Etherscan
          </button>
        </div>

        <h3 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24, marginTop: 32 }}>Your Wallet</h3>
        {userAddress ? (
          <div style={{ marginBottom: 16 }}>
            <strong>Your Address:</strong>
            <div style={{ fontFamily: "monospace", background: "#f5f5f5", padding: "8px", borderRadius: 4, marginTop: 4 }}>
              {userAddress}
            </div>
            <button
              onClick={() => openEtherscan('address', userAddress)}
              style={{
                marginTop: 8,
                padding: "8px 16px",
                background: "#0879ff",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer"
              }}
            >
              View on Etherscan
            </button>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            disabled={loading}
            style={{
              padding: "12px 24px",
              background: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: 16
            }}
          >
            {loading ? "Connecting..." : "Connect Wallet"}
          </button>
        )}

        <div style={{ marginTop: 32, padding: 16, background: "#fff3cd", borderRadius: 8, border: "1px solid #ffeaa7" }}>
          <strong>Note:</strong> This is Sepolia testnet explorer. Use mainnet.etherscan.io for mainnet.
        </div>
      </div>
    </section>
  );
}
