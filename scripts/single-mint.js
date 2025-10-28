// Usage: node scripts/single-mint.js <metadataUrl> <PRIVATE_KEY> <RPC_URL> <CONTRACT_ADDRESS>
const { ethers } = require('ethers');

async function main() {
  const [, , metadataUrl, privateKey, rpcUrl, contractAddress] = process.argv;
  if (!metadataUrl || !privateKey || !rpcUrl || !contractAddress) {
    console.error('Usage: node scripts/single-mint.js <metadataUrl> <PRIVATE_KEY> <RPC_URL> <CONTRACT_ADDRESS>');
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  const abi = [
    "function mintItem(address to, string memory uri) public returns (uint256)"
  ];
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  const tx = await contract.mintItem(wallet.address, metadataUrl);
  console.log(`Minted: tx ${tx.hash}`);
  await tx.wait();
  console.log('Mint completed successfully!');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});