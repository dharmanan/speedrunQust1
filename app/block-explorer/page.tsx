"use client";
import React from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function BlockExplorerPage() {
  const contractAddress = "0xE547D16b26A71034aC902c86f3757Ab3d92AB727"; // YourCollectible contract address

  // Removed auto-connect on page load for better user control

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

        <h3 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24, marginTop: 32 }}>Contract Information</h3>

        <div style={{ marginTop: 32, padding: 16, background: "#fff3cd", borderRadius: 8, border: "1px solid #ffeaa7" }}>
          <strong>Note:</strong> This is Sepolia testnet explorer. Use mainnet.etherscan.io for mainnet.
        </div>
      </div>
    </section>
  );
}
