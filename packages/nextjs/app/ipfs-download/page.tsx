"use client";
import React from "react";

export default function IPFSDownloadPage() {
  const [hash, setHash] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [content, setContent] = React.useState<string | null>(null);
  const [error, setError] = React.useState("");

  const handleDownload = async () => {
    if (!hash.trim()) return;
    setLoading(true);
    setContent(null);
    setError("");

    try {
      // Pinata gateway kullanarak IPFS içeriğini al
      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${hash.trim()}`);
      if (!response.ok) throw new Error('File not found');

      const contentType = response.headers.get('content-type');
      if (contentType?.startsWith('image/')) {
        // Resim için base64 encode et
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onload = () => {
          setContent(reader.result as string);
        };
        reader.readAsDataURL(blob);
      } else {
        // Metin içeriği için
        const text = await response.text();
        setContent(text);
      }
    } catch (e) {
      setError(`Error: ${e.message}`);
    }
    setLoading(false);
  };

  return (
    <section style={{ padding: 56, maxWidth: 600, margin: "0 auto" }}>
      <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 32 }}>IPFS Download</h2>
      <div style={{ background: "var(--card-bg, #fafafa)", border: "1px solid #eee", borderRadius: 12, padding: 32 }}>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>IPFS Hash:</label>
          <input
            type="text"
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            placeholder="Qm..."
            style={{ width: "100%", padding: "12px", borderRadius: 8, border: "1px solid #ccc", fontSize: 16 }}
          />
        </div>
        <button
          onClick={handleDownload}
          disabled={loading || !hash.trim()}
          style={{
            width: "100%",
            padding: "16px",
            fontSize: 18,
            borderRadius: 8,
            background: "#0879ff",
            color: "#fff",
            border: "none",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Loading..." : "Fetch from IPFS"}
        </button>
        {error && (
          <div style={{ marginTop: 16, padding: 12, background: "#ffebee", borderRadius: 8, color: "#c62828" }}>
            {error}
          </div>
        )}
        {content && (
          <div style={{ marginTop: 16, padding: 12, background: "#e8f5e8", borderRadius: 8 }}>
            {content.startsWith('data:image/') ? (
              <img src={content} alt="IPFS Content" style={{ maxWidth: "100%", borderRadius: 8 }} />
            ) : (
              <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{content}</pre>
            )}
          </div>
        )}
        <div style={{ marginTop: 16, fontSize: 14, color: "#666" }}>
          Note: Some IPFS gateways may apply rate limiting. Alternatives:
          <br />• https://ipfs.io/ipfs/[HASH]
          <br />• https://cloudflare-ipfs.com/ipfs/[HASH]
          <br />• https://dweb.link/ipfs/[HASH]
        </div>
      </div>
    </section>
  );
}
