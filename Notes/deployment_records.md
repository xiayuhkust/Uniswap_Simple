# Deployment Records

## Core Contracts

### Test Tokens
- WTURA: 0xF0e8a104Cc6ecC7bBa4Dc89473d1C64593eA69be
- TT1: 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9
- TT2: 0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122

### Factory Contract
- Address: 0xdf5F4d3239391716A4F5928d57E2AaDd3f644C70
- Features:
  * Pool creation and management
  * Fee tier configuration (0.05%, 0.3%, 1%)
  * Owner management

### Manager Contract
- Address: 0xeA55332dDe678746aCC684D323e357Df05B6F767
- Features:
  * Position management
  * Liquidity provision
  * Factory integration

## Environment Configuration
- Chain ID: 1337
- RPC URL: https://rpc-beta1.turablockchain.com

## Frontend Implementation (2025-02-24)
### Core Features
- Separate pages for Swap and Pool functionality
- Wallet connection with proper persistence and signature handling
- Pool list with 7-day volume sorting
- Token selection with search and balance display
- Support for 0.05% and 0.3% fee tiers
- Standardized number input validation with centralized error handling
- Robust BigInt handling for price calculations and token amounts
- UI optimizations:
  * Uniswap color scheme with vibrant pink buttons
  * Enhanced text visibility with black text colors
  * Improved input field contrast with gray.700 placeholders
  * Consistent border radius (16px) and spacing
  * Better button hover effects and visibility

### Technical Stack
- React 18 with TypeScript 5.3
- Vite 6.1.1 build system
- Chakra UI for components
- wagmi v1.4.13 for Web3 interactions
- viem v1.21.4 for Ethereum operations

### Contract Integration
- Factory: 0xdf5F4d3239391716A4F5928d57E2AaDd3f644C70
- Manager: 0xeA55332dDe678746aCC684D323e357Df05B6F767
- WTURA: 0xc8F7d7989a409472945b00177396f4e9b8601DF3

## Frontend Deployment
- GitHub Pages: https://xiayuhkust.github.io/Uniswap_Simple
