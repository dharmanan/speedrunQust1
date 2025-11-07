
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
  const [ipfsHash, setIpfsHash] = React.useState("QmYwAPJzv5CZsnAzt8auVTL7D1R6ZaaEXSXy4CkqB5tFh7");

  // Kontrat adresi ve ABI
  const contractAddress = "0xE547D16b26A71034aC902c86f3757Ab3d92AB727";
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
      if (!window.ethereum) throw new Error("MetaMask required!");
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      console.log("User address:", userAddress);
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const balance = await contract.balanceOf(userAddress);
      console.log("Balance:", balance.toString());
      const nftsFetched = [];
      for (let i = 0; i < balance.toNumber(); i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(userAddress, i);
        console.log("Token ID:", tokenId.toString());
        let tokenURI = "";
        try {
          tokenURI = await contract.tokenURI(tokenId);
          console.log("Token URI:", tokenURI);
        } catch (e) {
          console.log("Token URI error:", e);
          tokenURI = "";
        }
        nftsFetched.push({ tokenId: tokenId.toString(), tokenURI });
      }
      console.log("NFTs fetched:", nftsFetched);
      setNfts(nftsFetched);
    } catch (e) {
      console.log("Fetch error:", e);
      setError(e.message || "Failed to fetch NFTs");
    }
    setLoading(false);
  };

  // Mint fonksiyonu
  const handleMint = async () => {
    setMinting(true);
    setError("");
    setTxHash("");
    try {
      if (!window.ethereum) throw new Error("MetaMask required!");
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      // Kullanıcının girdiği IPFS hash'ini kullan
      const tx = await contract.mintItem(userAddress, ipfsHash);
      setTxHash(tx.hash);
      await tx.wait();
      await fetchNFTs();
    } catch (e) {
      setError(e.message || "Mint operation failed");
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

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>IPFS Hash (Metadata URI):</label>
          <input
            type="text"
            value={ipfsHash}
            onChange={(e) => setIpfsHash(e.target.value)}
            placeholder="Enter IPFS hash (e.g., QmYwAPJzv5CZsnAzt8auVTL7D1R6ZaaEXSXy4CkqB5tFh7)"
            style={{
              width: "100%",
              padding: "12px",
              fontSize: 16,
              borderRadius: 8,
              border: "1px solid #ccc",
              marginBottom: 16,
              fontFamily: "monospace"
            }}
          />
        </div>

        <button onClick={handleMint} disabled={minting} style={{ padding: "20px 48px", fontSize: 22, borderRadius: 12, background: "#0879ff", color: "#fff", border: "none", marginBottom: 32, fontWeight: 600, boxShadow: "0 2px 8px #0001" }}>
          {minting ? "Minting..." : "MINT NFT"}
        </button>
        {txHash && <div style={{ marginBottom: 16 }}>Mint transaction sent! Tx: <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer">{txHash}</a></div>}
        {error && <div style={{ color: "red", marginBottom: 16 }}>{error}</div>}
      </div>
      <div style={{ flex: 2, display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {loading ? <div>Loading NFTs...</div> : nfts.length === 0 ? <div>You don't have any NFTs.</div> : nfts.map(nft => <NFTCard key={nft.tokenId} tokenId={nft.tokenId} tokenURI={nft.tokenURI} />)}
      </div>
    </div>
  );
}
