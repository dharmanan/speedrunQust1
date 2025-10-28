"use client";
import React from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function TransfersPage() {
  const [tokenId, setTokenId] = React.useState("");
  const [toAddress, setToAddress] = React.useState("");
  const [transferring, setTransferring] = React.useState(false);
  const [txHash, setTxHash] = React.useState("");
  const [error, setError] = React.useState("");

  // Kontrat adresi ve ABI
  const contractAddress = "0xE547D16b26A71034aC902c86f3757Ab3d92AB727";
  const abi = [
    "function transferFrom(address from, address to, uint256 tokenId) public",
    "function ownerOf(uint256 tokenId) view returns (address)"
  ];

  const handleTransfer = async () => {
    setTransferring(true);
    setError("");
    setTxHash("");
    try {
      if (!window.ethereum) throw new Error("MetaMask required!");
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      // Token sahibini kontrol et
      const owner = await contract.ownerOf(tokenId);
      if (owner.toLowerCase() !== userAddress.toLowerCase()) {
        throw new Error("This NFT doesn't belong to you!");
      }

      const tx = await contract.transferFrom(userAddress, toAddress, tokenId);
      setTxHash(tx.hash);
      await tx.wait();
      alert("Transfer successful!");
      setTokenId("");
      setToAddress("");
    } catch (e) {
      setError(e.message || "Transfer failed");
    }
    setTransferring(false);
  };

  return (
    <section style={{ padding: 56, maxWidth: 600, margin: "0 auto" }}>
      <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 32 }}>NFT Transfer</h2>
      <div style={{ background: "var(--card-bg, #fafafa)", border: "1px solid #eee", borderRadius: 12, padding: 32 }}>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Token ID:</label>
          <input
            type="number"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            placeholder="e.g: 1"
            style={{ width: "100%", padding: "12px", borderRadius: 8, border: "1px solid #ccc", fontSize: 16 }}
          />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Recipient Address:</label>
          <input
            type="text"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            placeholder="0x..."
            style={{ width: "100%", padding: "12px", borderRadius: 8, border: "1px solid #ccc", fontSize: 16 }}
          />
        </div>
        <button
          onClick={handleTransfer}
          disabled={transferring || !tokenId || !toAddress}
          style={{
            width: "100%",
            padding: "16px",
            fontSize: 18,
            borderRadius: 8,
            background: "#0879ff",
            color: "#fff",
            border: "none",
            fontWeight: 600,
            cursor: transferring ? "not-allowed" : "pointer"
          }}
        >
          {transferring ? "Transferring..." : "Transfer"}
        </button>
        {txHash && (
          <div style={{ marginTop: 16, padding: 12, background: "#e8f5e8", borderRadius: 8 }}>
            Transfer sent! Tx: <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer">{txHash}</a>
          </div>
        )}
        {error && (
          <div style={{ marginTop: 16, padding: 12, background: "#ffe8e8", borderRadius: 8, color: "red" }}>
            {error}
          </div>
        )}
      </div>
    </section>
  );
}
