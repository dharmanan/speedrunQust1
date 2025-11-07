"use client";
import React from "react";

export default function IPFSUploadPage() {
  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [result, setResult] = React.useState("");

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setResult("");

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Bu frontend'den doğrudan Pinata'ya upload için örnek
      // Gerçek uygulamada backend API kullanmalısınız
      const response = await fetch('/api/upload-to-ipfs', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setResult(`File uploaded: ${data.url}`);
    } catch (e) {
      setResult(`Error: ${e.message}`);
    }
    setUploading(false);
  };

  return (
    <section style={{ padding: 56, maxWidth: 600, margin: "0 auto" }}>
      <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 32 }}>IPFS Upload</h2>
      <div style={{ background: "var(--card-bg, #fafafa)", border: "1px solid #eee", borderRadius: 12, padding: 32 }}>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Select File:</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ width: "100%", padding: "12px", borderRadius: 8, border: "1px solid #ccc" }}
          />
        </div>
        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          style={{
            width: "100%",
            padding: "16px",
            fontSize: 18,
            borderRadius: 8,
            background: "#0879ff",
            color: "#fff",
            border: "none",
            fontWeight: 600,
            cursor: uploading ? "not-allowed" : "pointer"
          }}
        >
          {uploading ? "Uploading..." : "Upload to IPFS"}
        </button>
        {result && (
          <div style={{ marginTop: 16, padding: 12, background: "#e8f5e8", borderRadius: 8 }}>
            {result}
          </div>
        )}
        <div style={{ marginTop: 16, fontSize: 14, color: "#666" }}>
          Note: This is a frontend demo. In production, you should create a backend API (e.g., /api/upload-to-ipfs).
          <br />
          Alternatively, upload files directly to the Pinata website.
        </div>
      </div>
    </section>
  );
}
