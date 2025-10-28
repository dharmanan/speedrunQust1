#!/usr/bin/env node
/**
 * Usage:
 * PINATA_API_KEY="..." PINATA_API_SECRET="..." MNEMONIC="..." ALCHEMY_API_KEY="..." node scripts/upload-and-mint.cjs ./images ./metadataList.json 0xContractAddress
 *
 * If contractAddress is omitted, only upload is performed.
 */
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const mime = require('mime-types');
const { ethers } = require('ethers');

const apiKey = process.env.PINATA_API_KEY;
const apiSecret = process.env.PINATA_API_SECRET;
const mnemonic = process.env.MNEMONIC;
const alchemyKey = process.env.ALCHEMY_API_KEY;

const [,, imagesDir, outputJson, contractAddress] = process.argv;
if (!imagesDir || !outputJson) {
  console.error('Usage: node scripts/upload-and-mint.cjs <imagesDir> <outputJson> [contractAddress]');
  process.exit(1);
}
if (!apiKey || !apiSecret) {
  console.error('PINATA_API_KEY and PINATA_API_SECRET env required');
  process.exit(1);
}

async function uploadImages() {
  const files = fs.readdirSync(imagesDir).filter(f => !f.startsWith('.'));
  const results = [];
  for (const filename of files) {
    const filePath = path.join(imagesDir, filename);
    const content = fs.readFileSync(filePath);
    const type = mime.lookup(filePath);
    
    const formData = new FormData();
    formData.append('file', content, {
      filename: filename,
      contentType: type
    });
    
    const metadata = JSON.stringify({
      name: filename,
      keyvalues: {
        description: `NFT image for ${filename}`
      }
    });
    formData.append('pinataMetadata', metadata);
    
    const options = JSON.stringify({
      cidVersion: 0
    });
    formData.append('pinataOptions', options);
    
    try {
      const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          ...formData.getHeaders(),
          pinata_api_key: apiKey,
          pinata_secret_api_key: apiSecret
        }
      });
      
      const metadataUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      results.push({ filename, metadataUrl });
      console.log(`Uploaded ${filename} -> ${metadataUrl}`);
    } catch (error) {
      console.error(`Failed to upload ${filename}:`, error.response?.data || error.message);
      throw error;
    }
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
