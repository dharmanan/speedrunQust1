import React from "react";
import Image from "next/image";

function ipfsToHttp(url?: string) {
  if (!url) return "";
  if (url.startsWith("ipfs://")) {
    return url.replace("ipfs://", "https://ipfs.io/ipfs/");
  }
  if (url.startsWith("Qm") && url.length > 40) {
    return `https://ipfs.io/ipfs/${url}`;
  }
  return url;
}

export default function NFTCard({ tokenId, tokenURI }: { tokenId: string; tokenURI: string }) {
  const imgUrl = ipfsToHttp(tokenURI);
  return (
    <div style={{ background: "var(--card-bg, #fafafa)", border: "1px solid #eee", borderRadius: 12, padding: 16, margin: 8, width: 220, textAlign: "center" }}>
      <div style={{ width: 180, height: 180, margin: "0 auto", background: "#f0f0f0", borderRadius: 8, overflow: "hidden" }}>
        {imgUrl ? (
          <Image src={imgUrl} alt={tokenId} width={180} height={180} style={{ objectFit: "cover" }} />
        ) : (
          <div style={{ width: 180, height: 180, lineHeight: "180px", color: "#bbb" }}>No Image</div>
        )}
      </div>
      <div style={{ marginTop: 8, fontWeight: 600 }}>Token #{tokenId}</div>
      <div style={{ fontSize: 12, color: "#888", wordBreak: "break-all" }}>{tokenURI}</div>
    </div>
  );
}
