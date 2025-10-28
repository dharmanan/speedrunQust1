# Speedrun Ethereum Challenge - NFT Platform

A complete NFT minting platform built for the Speedrun Ethereum challenge, featuring ERC721 smart contracts, IPFS metadata storage, and a modern React frontend.

## 🚀 Live Demo

**Frontend**: https://speedrunqst.vercel.app/

**Smart Contract**: https://sepolia.etherscan.io/address/0xE547D16b26A71034aC902c86f3757Ab3d92AB727

## 📋 Challenge Requirements Completed

- ✅ Deploy ERC721 NFT smart contract on Sepolia testnet
- ✅ Mint 8 NFTs with unique metadata
- ✅ Store metadata on IPFS
- ✅ Verify contract on Etherscan
- ✅ Build responsive frontend for NFT minting
- ✅ Deploy frontend to Vercel

## 🏗️ Project Structure

```
speedrunQust1/
├── packages/
│   ├── hardhat/                 # Smart contract development
│   │   ├── contracts/           # Solidity contracts
│   │   ├── scripts/             # Deployment & utility scripts
│   │   ├── test/               # Contract tests
│   │   ├── hardhat.config.ts    # Hardhat configuration
│   │   └── flattened.sol        # Flattened contract for verification
│   └── nextjs/                  # Frontend application
│       ├── app/                 # Next.js app router pages
│       │   ├── myNFTs/          # NFT minting interface
│       │   ├── block-explorer/  # Contract explorer
│       │   ├── debug-contracts/ # Contract debugging tools
│       │   └── transfers/       # NFT transfer interface
│       ├── components/          # Reusable React components
│       └── metadata/            # NFT metadata files
└── README.md
```

## 🛠️ Technology Stack

### Smart Contracts
- **Solidity**: ^0.8.20
- **OpenZeppelin**: ERC721 with extensions (Enumerable, URIStorage, Ownable)
- **Hardhat**: Development framework, testing, deployment
- **Ethers.js**: Ethereum interaction library

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **MetaMask**: Wallet connection
- **Vercel**: Cloud deployment platform

### Infrastructure
- **IPFS**: Decentralized metadata storage
- **Sepolia Testnet**: Ethereum test network
- **Etherscan**: Contract verification
- **Sourcify**: Additional contract verification

## 📦 Key Features

### Smart Contract (`YourCollectible.sol`)
- ERC721 compliant NFT contract
- Minting functionality with custom metadata URIs
- Owner-only controls
- Gas-optimized implementation

### Frontend Application
- **NFT Minting**: User-friendly interface to mint NFTs
- **Wallet Integration**: MetaMask connection and network switching
- **Contract Interaction**: Read/write contract functions
- **Responsive Design**: Mobile-friendly UI
- **Real-time Updates**: Live transaction status

### Development Tools
- Automated deployment scripts
- Contract verification workflows
- Environment configuration
- TypeScript support throughout

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MetaMask wallet
- Sepolia ETH for gas fees

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dharmanan/speedrunQust1.git
   cd speedrunQust1
   ```

2. **Install dependencies**
   ```bash
   # Root directory
   npm install

   # Hardhat package
   cd packages/hardhat
   npm install

   # Next.js package
   cd ../nextjs
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp packages/hardhat/.env.example packages/hardhat/.env

   # Add your keys to .env
   INFURA_API_KEY=your_infura_key
   PRIVATE_KEY=your_private_key
   ETHERSCAN_API_KEY=your_etherscan_key
   ```

### Development

1. **Start Hardhat network** (optional)
   ```bash
   cd packages/hardhat
   npx hardhat node
   ```

2. **Deploy contracts**
   ```bash
   npx hardhat deploy --network sepolia
   ```

3. **Verify contracts**
   ```bash
   npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
   ```

4. **Start frontend**
   ```bash
   cd packages/nextjs
   npm run dev
   ```

5. **Deploy frontend**
   ```bash
   npm run build
   npx vercel --prod
   ```

## 🎨 NFT Metadata

Each NFT includes:
- Unique name and description
- IPFS-hosted image
- Standardized ERC721 metadata format

Metadata is stored on IPFS and referenced by contract URIs.

## 🔍 Contract Verification

Contracts are verified on both:
- **Etherscan Sepolia**: https://sepolia.etherscan.io/
- **Sourcify**: https://repo.sourcify.dev/

## 📊 Testing

```bash
cd packages/hardhat
npx hardhat test
```

## 🤝 Contributing

This is a challenge submission project. For improvements or questions, please open an issue.

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- Speedrun Ethereum challenge organizers
- OpenZeppelin for secure contract templates
- Scaffold-ETH for project structure inspiration
- Ethereum community for documentation and support

---

**Built with ❤️ for Speedrun Ethereum Challenge**