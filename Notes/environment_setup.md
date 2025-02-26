# Environment Setup Guide

## Prerequisites
- Node.js (v16+)
- npm (v7+)
- Foundry (for smart contract development)
- Hardhat (for JavaScript-based contract interactions)
- MetaMask wallet extension

## Blockchain Configuration
- Network Name: Tura Testnet
- RPC URL: https://rpc-beta1.turablockchain.com
- Chain ID: 1337
- Currency Symbol: TURA

## Frontend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/xiayuhkust/Uniswap_Simple.git
   cd Uniswap_Simple/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following content:
   ```
   VITE_TURA_RPC_URL=https://rpc-beta1.turablockchain.com
   VITE_TURA_CHAIN_ID=1337
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

3. Create a `.env` file with the following content:
   ```
   # Blockchain configuration
   TURA_RPC_URL=https://rpc-beta1.turablockchain.com
   TURA_CHAIN_ID=1337
   PRIVATE_KEYS=ad6fb1ceb0b9dc598641ac1cef545a7882b52f5a12d7204d6074762d96a8a474

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

## Token Deployment
To deploy new ERC20 tokens using Foundry:

1. Set up environment variables:
   ```bash
   export PRIVATE_KEY=ad6fb1ceb0b9dc598641ac1cef545a7882b52f5a12d7204d6074762d96a8a474
   ```

2. Run the deployment script:
   ```bash
   forge script script/DeployToken.s.sol --rpc-url https://rpc-beta1.turablockchain.com --private-key $PRIVATE_KEY --broadcast -vvv
   ```

3. Verify the deployment:
   ```bash
   forge script script/VerifyToken.s.sol --rpc-url https://rpc-beta1.turablockchain.com -vvv
   ```

## Connecting MetaMask
1. Open MetaMask and add a new network with the following details:
   - Network Name: Tura Testnet
   - RPC URL: https://rpc-beta1.turablockchain.com
   - Chain ID: 1337
   - Currency Symbol: TURA

2. Import the test account using the private key:
   ```
   ad6fb1ceb0b9dc598641ac1cef545a7882b52f5a12d7204d6074762d96a8a474
   ```

3. To add the deployed tokens to MetaMask:
   - Click "Import tokens"
   - Enter the token contract address
   - The token symbol and decimals should be detected automatically
   - Click "Add Custom Token"

## Deployed Contract Addresses
- Factory: 0xdf5F4d3239391716A4F5928d57E2AaDd3f644C70
- WTURA: 0xF0e8a104Cc6ecC7bBa4Dc89473d1C64593eA69be
- TT1: 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9
- TT2: 0xC8f7D7989a409472945B00177396F4e9B8601dF3
- TT3: 0x8Ba1cD55391a3FC2B4A76aC0D99058D0572aF608
- TT4: 0x74DfD646cA939e0aBfbd37dA9F5fb7F885cE44Cb
- TT5: 0xe26Cc979Fee6213160ee903474D3E39CA8486A8a
- TT6: 0xD6F72636B35A065eAAe03522800AfEFfB91416fF
- TT7: 0xFd04a3b44A875DCa7d6751acDe7F578d34e35B75
- TT8: 0xdE1E1D1730587Cbcf06995FADbF06DEAedA9869D
