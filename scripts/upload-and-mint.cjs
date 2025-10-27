#!/usr/bin/env node
/**
 * Usage:
 * NFT_STORAGE_API_KEY="..." MNEMONIC="..." ALCHEMY_API_KEY="..." node scripts/upload-and-mint.cjs ./images ./metadataList.json 0xContractAddress
 *
 * If contractAddress is omitted, only upload is performed.
 */
const fs = require('fs');
const path = require('path');
const { NFTStorage, File } = require('nft.storage');
const mime = require('mime');
const { ethers } = require('ethers');

const apiKey = process.env.NFT_STORAGE_API_KEY;
const mnemonic = process.env.MNEMONIC;
const alchemyKey = process.env.ALCHEMY_API_KEY;

const [,, imagesDir, outputJson, contractAddress] = process.argv;
if (!imagesDir || !outputJson) {
  console.error('Usage: node scripts/upload-and-mint.cjs <imagesDir> <outputJson> [contractAddress]');
  process.exit(1);
}
if (!apiKey) {
  console.error('NFT_STORAGE_API_KEY env required');
  process.exit(1);
}

async function uploadImages() {
  const client = new NFTStorage({ token: apiKey });
  const files = fs.readdirSync(imagesDir).filter(f => !f.startsWith('.'));
  const results = [];
  for (const filename of files) {
    const filePath = path.join(imagesDir, filename);
    const content = fs.readFileSync(filePath);
    const type = mime.getType(filePath);
    const imageFile = new File([content], filename, { type });
    const metadata = {
      name: path.parse(filename).name,
      description: `NFT image for ${filename}`,
      image: imageFile,
    };
    const stored = await client.store(metadata);
    results.push({ filename, metadataUrl: stored.url });
    console.log(`Uploaded ${filename} -> ${stored.url}`);
  }
  fs.writeFileSync(outputJson, JSON.stringify(results, null, 2));
  console.log(`Metadata list written to ${outputJson}`);
  return results;
}

async function batchMint(metadataList) {
  if (!mnemonic || !alchemyKey || !contractAddress) {
    console.error('MNEMONIC, ALCHEMY_API_KEY env and contractAddress required for minting');
    process.exit(1);
  }
  const rpcUrl = `https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`;
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = ethers.Wallet.fromPhrase(mnemonic).connect(provider);
  // Update with your contract ABI
  const abi = [
    "function mint(address to, string memory tokenURI) public returns (uint256)"
  ];
  const contract = new ethers.Contract(contractAddress, abi, wallet);
  for (const entry of metadataList) {
    const tx = await contract.mint(wallet.address, entry.metadataUrl);
    console.log(`Minted ${entry.filename}: tx ${tx.hash}`);
    await tx.wait();
  }
}

(async () => {
  const metadataList = await uploadImages();
  if (contractAddress) {
    await batchMint(metadataList);
  }
})();
