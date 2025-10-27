
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaImage, FaExchangeAlt, FaUpload, FaDownload, FaBug, FaSearch } from "react-icons/fa";
import React from "react";

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
  return (
    <nav style={{ background: "var(--nav, #e8fbfb)", padding: "0 32px", borderBottom: "1px solid #e0e0e0", display: "flex", alignItems: "center", height: 64 }}>
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
    </nav>
  );
}
