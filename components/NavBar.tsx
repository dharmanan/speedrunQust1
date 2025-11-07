
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaImage, FaExchangeAlt, FaUpload, FaDownload, FaBug, FaSearch, FaWallet } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const items = [
  { href: "/myNFTs", label: "My NFTs", icon: <FaImage /> },
  { href: "/transfers", label: "Transfers", icon: <FaExchangeAlt /> },
  { href: "/ipfs-upload", label: "IPFS Upload", icon: <FaUpload /> },
  { href: "/ipfs-download", label: "IPFS Download", icon: <FaDownload /> },
  { href: "/debug-contracts", label: "Debug Contracts", icon: <FaBug /> },
  { href: "/block-explorer", label: "Block Explorer", icon: <FaSearch /> },
];

export default function NavBar() {
  const pathname = usePathname();
  const [userAddress, setUserAddress] = useState("");
  const [loading, setLoading] = useState(false);

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

  const disconnectWallet = () => {
    setUserAddress("");
  };

  useEffect(() => {
    // Check if already connected
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts: string[]) => {
        if (accounts.length > 0) {
          setUserAddress(accounts[0]);
        }
      });
    }
  }, []);

  return (
    <nav style={{ background: "var(--nav, #e8fbfb)", padding: "0 32px", borderBottom: "1px solid #e0e0e0", display: "flex", alignItems: "center", height: 64, justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ fontWeight: 700, fontSize: 22, marginRight: 32, color: "var(--accent, #0b78ff)" }}>
          Tokenization
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {items.map(item => (
            <Link key={item.href} href={item.href} style={{
              display: "flex", alignItems: "center", gap: 8, fontWeight: 500, fontSize: 17,
              color: pathname === item.href ? "var(--accent, #0b78ff)" : "var(--muted, #6b7280)",
              textDecoration: "none", padding: "8px 12px", borderRadius: 8,
              background: pathname === item.href ? "#e0f0ff" : "transparent"
            }}>
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {userAddress ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              fontFamily: "monospace",
              fontSize: 14,
              background: "#f0f9ff",
              padding: "6px 12px",
              borderRadius: 6,
              color: "#0369a1",
              border: "1px solid #bae6fd"
            }}>
              {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
            </div>
            <button
              onClick={disconnectWallet}
              style={{
                padding: "6px 12px",
                background: "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 14
              }}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              background: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: 14,
              fontWeight: 500
            }}
          >
            <FaWallet />
            {loading ? "Connecting..." : "Connect Wallet"}
          </button>
        )}
      </div>
    </nav>
  );
}
