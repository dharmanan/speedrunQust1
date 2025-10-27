
"use client";
import React from "react";
import { ethers } from "ethers";
import NFTCard from "../../components/NFTCard";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function MyNFTsPage() {
  const [minting, setMinting] = React.useState(false);
  const [txHash, setTxHash] = React.useState("");
  const [error, setError] = React.useState("");
  const [nfts, setNfts] = React.useState<{ tokenId: string; tokenURI: string }[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Kontrat adresi ve ABI
  const contractAddress = "0xfA6B9b65beDB1a854C3a115315AD58ff2dC9A88b";
  const abi = [
    "function mintItem(address to, string memory tokenURI) public returns (uint256)",
    "function balanceOf(address owner) view returns (uint256)",
    "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
    "function tokenURI(uint256 tokenId) view returns (string)"
  ];

  // Kullanıcının NFT'lerini çek
  const fetchNFTs = async () => {
    setLoading(true);
    setError("");
    try {
      if (!(window as any).ethereum) throw new Error("Metamask gerekli!");
      await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const balance = await contract.balanceOf(userAddress);
      const nftsFetched = [];
      for (let i = 0; i < balance.toNumber(); i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(userAddress, i);
        let tokenURI = "";
        try {
          tokenURI = await contract.tokenURI(tokenId);
        } catch {
          tokenURI = "";
        }
        nftsFetched.push({ tokenId: tokenId.toString(), tokenURI });
      }
      setNfts(nftsFetched);
    } catch (e) {
      setError(e.message || "NFT'ler alınamadı");
    }
    setLoading(false);
  };

  // Mint fonksiyonu
  const handleMint = async () => {
    setMinting(true);
    setError("");
    setTxHash("");
    try {
      if (!(window as any).ethereum) throw new Error("Metamask gerekli!");
      await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider((window as any).ethereum);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      // Örnek çalışan bir IPFS görsel hash'i (bir kedi resmi)
      const ipfsHash = "QmYwAPJzv5CZsnAzt8auVTL7D1R6ZaaEXSXy4CkqB5tFh7";
      const tx = await contract.mintItem(userAddress, ipfsHash);
      setTxHash(tx.hash);
      await tx.wait();
      await fetchNFTs();
    } catch (e) {
      setError(e.message || "Mint işlemi başarısız oldu");
    }
    setMinting(false);
  };

  React.useEffect(() => {
    fetchNFTs();
    // eslint-disable-next-line
  }, []);

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 48, maxWidth: 1200, margin: "0 auto", padding: 32 }}>
      <div style={{ flex: 1, minWidth: 280 }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 32, textAlign: "left" }}>My NFTs</h2>
        <button onClick={handleMint} disabled={minting} style={{ padding: "20px 48px", fontSize: 22, borderRadius: 12, background: "#0879ff", color: "#fff", border: "none", marginBottom: 32, fontWeight: 600, boxShadow: "0 2px 8px #0001" }}>
          {minting ? "Minting..." : "MINT NFT"}
        </button>
        {txHash && <div style={{ marginBottom: 16 }}>Mint işlemi gönderildi! Tx: <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer">{txHash}</a></div>}
        {error && <div style={{ color: "red", marginBottom: 16 }}>{error}</div>}
      </div>
      <div style={{ flex: 2, display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {loading ? <div>NFT'ler yükleniyor...</div> : nfts.length === 0 ? <div>Hiç NFT'niz yok.</div> : nfts.map(nft => <NFTCard key={nft.tokenId} tokenId={nft.tokenId} tokenURI={nft.tokenURI} />)}
      </div>
    </div>
  );
}
