# Environment Setup Guide

This document provides detailed instructions for setting up the development environment for the Uniswap Simple project, including both frontend and backend components.

## Prerequisites

- Node.js (v16+)
- npm (v8+)
- Git
- MetaMask browser extension

## Blockchain Configuration

### Tura Blockchain

The project uses the Tura blockchain testnet with the following configuration:

- **Chain ID**: 1337
- **RPC URL**: https://rpc-beta1.turablockchain.com
- **Currency Symbol**: TURA
- **Block Explorer**: http://43.135.127.231:3000/

### Environment Variables

Create a `.env` file in the project root with the following variables:

```
# Blockchain configuration
TURA_RPC_URL=https://rpc-beta1.turablockchain.com
TURA_CHAIN_ID=1337
PRIVATE_KEY=ad6fb1ceb0b9dc598641ac1cef545a7882b52f5a12d7204d6074762d96a8a474

# For frontend
VITE_TURA_RPC_URL=https://rpc-beta1.turablockchain.com
VITE_TURA_CHAIN_ID=1337
VITE_BACKEND_URL=http://localhost:3000
```

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory with:
   ```
   VITE_TURA_RPC_URL=https://rpc-beta1.turablockchain.com
   VITE_TURA_CHAIN_ID=1337
   VITE_BACKEND_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Access the frontend at http://localhost:5173

## Backend Setup

1. Clone the backend repository:
   ```bash
   git clone https://github.com/xiayuhkust/Uniswap_SImple_backend.git
   cd Uniswap_SImple_backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with:
   ```
   # Blockchain configuration
   TURA_RPC_URL=https://rpc-beta1.turablockchain.com
   TURA_CHAIN_ID=1337
   PRIVATE_KEY=ad6fb1ceb0b9dc598641ac1cef545a7882b52f5a12d7204d6074762d96a8a474

   # Server configuration
   PORT=3000

   # Database configuration
   DB_STORAGE=database/uniswap-simple.sqlite

   # Factory contract address
   FACTORY_ADDRESS=0xdf5F4d3239391716A4F5928d57E2AaDd3f644C70
   ```

4. Create the database directory:
   ```bash
   mkdir -p database
   ```

5. Start the backend server:
   ```bash
   npm start
   ```

6. The backend API will be available at http://localhost:3000

## MetaMask Configuration

1. Install the MetaMask browser extension if you haven't already.

2. Add the Tura network to MetaMask:
   - Open MetaMask and click on the network dropdown
   - Select "Add Network"
   - Fill in the following details:
     - Network Name: Tura Testnet
     - New RPC URL: https://rpc-beta1.turablockchain.com
     - Chain ID: 1337
     - Currency Symbol: TURA
     - Block Explorer URL: http://43.135.127.231:3000/

3. Import the test account using the private key:
   - Click on the account icon in MetaMask
   - Select "Import Account"
   - Paste the private key: `ad6fb1ceb0b9dc598641ac1cef545a7882b52f5a12d7204d6074762d96a8a474`
   - Click "Import"

4. Add the test tokens to MetaMask:
   - Click on "Import tokens" in MetaMask
   - Enter the token contract addresses:
     - WTURA: 0xc8F7d7989a409472945b00177396f4e9b8601DF3
     - TT1: 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9
     - TT2: 0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122
     - TT3: 0x8Ba1cD55391a3FC2B4A76aC0D99058D0572aF608
     - TT4: 0x74DfD646cA939e0aBfbd37dA9F5fb7F885cE44Cb
     - TT5: 0xe26Cc979Fee6213160ee903474D3E39CA8486A8a
     - TT6: 0xD6F72636B35A065eAAe03522800AfEFfB91416fF
     - TT7: 0xFd04a3b44A875DCa7d6751acDe7F578d34e35B75
     - TT8: 0xdE1E1D1730587Cbcf06995FADbF06DEAedA9869D

## Smart Contract Development

### Foundry Setup

1. Install Foundry:
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. Create a `foundry.toml` file in the project root:
   ```toml
   [profile.default]
   src = 'src'
   out = 'out'
   libs = ['lib']
   remappings = [
       '@openzeppelin/=lib/openzeppelin-contracts/',
       'forge-std/=lib/forge-std/src/'
   ]
   ```

3. Install dependencies:
   ```bash
   forge install OpenZeppelin/openzeppelin-contracts
   forge install foundry-rs/forge-std
   ```

### Hardhat Setup (Alternative)

1. Install Hardhat:
   ```bash
   npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers
   ```

2. Create a `hardhat.config.js` file:
   ```javascript
   require("@nomiclabs/hardhat-ethers");

   module.exports = {
     solidity: "0.8.19",
     networks: {
       tura: {
         url: "https://rpc-beta1.turablockchain.com",
         chainId: 1337,
         accounts: ["ad6fb1ceb0b9dc598641ac1cef545a7882b52f5a12d7204d6074762d96a8a474"]
       }
     }
   };
   ```

## Token Deployment

### Using Forge Scripts

1. Create a deployment script (e.g., `DeployToken.s.sol`):
   ```solidity
   // SPDX-License-Identifier: BUSL-1.1
   pragma solidity =0.8.19;

   import "forge-std/Script.sol";
   import "../test/ERC20Mintable.sol";

   contract DeployToken is Script {
       function run() public {
           uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
           vm.startBroadcast(deployerPrivateKey);

           ERC20Mintable token = new ERC20Mintable("Token Name", "SYMBOL", 18);
           console.log("Token deployed at:", address(token));

           vm.stopBroadcast();
       }
   }
   ```

2. Run the deployment script:
   ```bash
   forge script script/DeployToken.s.sol --rpc-url https://rpc-beta1.turablockchain.com --private-key ad6fb1ceb0b9dc598641ac1cef545a7882b52f5a12d7204d6074762d96a8a474 --broadcast
   ```

### Using Hardhat Scripts

1. Create a deployment script (e.g., `scripts/deploy-token.js`):
   ```javascript
   const { ethers } = require("hardhat");

   async function main() {
     const [deployer] = await ethers.getSigners();
     console.log("Deploying with account:", deployer.address);

     const ERC20 = await ethers.getContractFactory("ERC20Mintable");
     const token = await ERC20.deploy("Token Name", "SYMBOL", 18);
     await token.deployed();

     console.log("Token deployed to:", token.address);
   }

   main()
     .then(() => process.exit(0))
     .catch((error) => {
       console.error(error);
       process.exit(1);
     });
   ```

2. Run the deployment script:
   ```bash
   npx hardhat run scripts/deploy-token.js --network tura
   ```

## Troubleshooting

### MetaMask Connection Issues

- **Problem**: MetaMask not connecting to the Tura network
  - **Solution**: Verify the RPC URL and Chain ID in MetaMask settings

- **Problem**: "Authentication needed: password or unlock" error
  - **Solution**: Make sure your MetaMask is unlocked and the account is properly imported

### Backend Connection Issues

- **Problem**: Frontend cannot connect to backend API
  - **Solution**: Check that the backend server is running and CORS is properly configured

- **Problem**: WebSocket connection fails
  - **Solution**: Verify that the WebSocket server is running and the connection URL is correct

### Contract Interaction Issues

- **Problem**: "Gas estimation failed" error
  - **Solution**: Check that you have enough TURA tokens for gas fees

- **Problem**: Transaction fails with "execution reverted"
  - **Solution**: Check the contract parameters and ensure they meet the contract requirements

## References

- [Uniswap V3 Book](https://uniswapv3book.com/)
- [Uniswap V3 Book (Chinese Version)](https://y1cunhui.github.io/uniswapV3-book-zh-cn/)
- [Foundry Documentation](https://book.getfoundry.sh/)
- [Hardhat Documentation](https://hardhat.org/docs)
