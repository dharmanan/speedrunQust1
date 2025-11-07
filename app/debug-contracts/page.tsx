"use client";
import React from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function DebugContractsPage() {
  const [contractInfo, setContractInfo] = React.useState<any>({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const contractAddress = "0xE547D16b26A71034aC902c86f3757Ab3d92AB727";
  const abi = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function totalSupply() view returns (uint256)",
    "function owner() view returns (address)"
  ];

  const loadContractInfo = async () => {
    setLoading(true);
    setError("");
    try {
      if (!window.ethereum) throw new Error("MetaMask required!");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);

      const [name, symbol, totalSupply, owner] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.totalSupply(),
        contract.owner()
      ]);

      setContractInfo({ name, symbol, totalSupply: totalSupply.toString(), owner });
    } catch (e) {
      setError(e.message || "Failed to fetch contract information");
    }
    setLoading(false);
  };

  React.useEffect(() => {
    loadContractInfo();
  }, []);

  return (
    <section style={{ padding: 56, maxWidth: 800, margin: "0 auto" }}>
      <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 32 }}>Contract Debug</h2>
      <div style={{ background: "var(--card-bg, #fafafa)", border: "1px solid #eee", borderRadius: 12, padding: 32 }}>
        <button
          onClick={loadContractInfo}
          disabled={loading}
          style={{ padding: "12px 24px", borderRadius: 8, background: "#0879ff", color: "#fff", border: "none", fontWeight: 600, marginBottom: 24 }}
        >
          {loading ? "Loading..." : "Refresh Contract Info"}
        </button>

        {contractInfo.name && (
          <div style={{ marginBottom: 16 }}>
            <strong>Contract Name:</strong> {contractInfo.name}
          </div>
        )}
        {contractInfo.symbol && (
          <div style={{ marginBottom: 16 }}>
            <strong>Symbol:</strong> {contractInfo.symbol}
          </div>
        )}
        {contractInfo.totalSupply && (
          <div style={{ marginBottom: 16 }}>
            <strong>Total Supply:</strong> {contractInfo.totalSupply}
          </div>
        )}
        {contractInfo.owner && (
          <div style={{ marginBottom: 16 }}>
            <strong>Owner:</strong> {contractInfo.owner}
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
