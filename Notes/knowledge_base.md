# Uniswap V3 Implementation Knowledge Base

## Project Overview
This project implements a Uniswap V3-style DEX on the Tura blockchain, focusing on concentrated liquidity and efficient capital utilization.

## Core Components

### Smart Contracts
1. Factory Contract
   - Deploys and manages liquidity pools
   - Supports 500/3000 fee tiers
   - Handles pool initialization

2. Manager Contract
   - Manages liquidity positions
   - Handles token swaps
   - Collects and distributes fees

3. WTURA Contract
   - Wrapped version of native TURA token
   - Standard ERC20 interface
   - Supports wrap/unwrap operations

### Frontend Architecture
1. Technology Stack
   - React 18 with TypeScript 5.3
   - Vite 6.1.1 build system
   - wagmi v1.4.13 for Web3 interactions
   - Chakra UI for components
   - Environment management with .env

2. Key Components
   - ConnectionProvider: Web3 connection management
   - WalletConnect: MetaMask integration
   - (Planned) TokenSelector: Token selection interface
   - (Planned) PositionManager: Liquidity position management

## Network Configuration
- Chain: Tura Testnet
- Chain ID: 1337
- RPC URL: https://rpc-beta1.turablockchain.com
- Block Explorer: TBA

## Test Tokens
1. WTURA (Wrapped TURA)
   - Address: 0xF0e8a104Cc6ecC7bBa4Dc89473d1C64593eA69be
   - Decimals: 18
   - Usage: Native token wrapper

2. Test Token 1 (TT1)
   - Address: 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9
   - Supply: 1M
   - Decimals: 18

3. Test Token 2 (TT2)
   - Address: 0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122
   - Supply: 1M
   - Decimals: 18

## Liquidity Pools
1. WTURA/TT1
   - Ratio: 1:100
   - Initial Liquidity: Set
   - Fee Tier: Available in 500/3000

2. WTURA/TT2
   - Ratio: 1:100
   - Initial Liquidity: Set
   - Fee Tier: Available in 500/3000

3. TT1/TT2
   - Ratio: 1:1
   - Initial Liquidity: Set
   - Fee Tier: Available in 500/3000

## Development Guidelines
1. Documentation
   - deployment_records.md: Contract deployment history
   - test.md: Test results and coverage
   - progress.md: Development progress tracking
   - knowledge_base.md: Project knowledge base

2. Testing Requirements
   - Unit tests for components
   - Integration tests for contract interactions
   - End-to-end testing for complete flows

3. Environment Setup
   - Node.js 16+
   - pnpm (preferred) or npm/yarn
   - MetaMask wallet
   - Tura testnet configuration

## Reference Implementation
Based on Jeiwan's Uniswap V3 implementation:
https://github.com/Jeiwan/uniswapv3-code/tree/milestone_6

## Deployment Process
1. Smart Contracts
   - Deploy Factory
   - Deploy Manager
   - Initialize pools
   - Add initial liquidity

2. Frontend
   - Configure environment
   - Build application
   - Deploy to hosting service
   - Verify functionality
