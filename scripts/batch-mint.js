// Usage: node scripts/batch-mint.js <metadataList.json> <PRIVATE_KEY> <RPC_URL> <CONTRACT_ADDRESS>
const fs = require('fs');
const { ethers } = require('ethers');

async function main() {
  const [,, metadataListPath, privateKey, rpcUrl, contractAddress] = process.argv;
  if (!metadataListPath || !privateKey || !rpcUrl || !contractAddress) {
    console.error('Usage: node scripts/batch-mint.js <metadataList.json> <PRIVATE_KEY> <RPC_URL> <CONTRACT_ADDRESS>');
    process.exit(1);
  }

  const metadataList = JSON.parse(fs.readFileSync(metadataListPath));
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  // Update with your contract ABI
  const abi = [
    "function mintItem(address to, string memory uri) public returns (uint256)"
  ];
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  for (const entry of metadataList) {
    const tx = await contract.mintItem(wallet.address, entry.metadataUrl);
    console.log(`Minted ${entry.filename}: tx ${tx.hash}`);
    await tx.wait();
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
