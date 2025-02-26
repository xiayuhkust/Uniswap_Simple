# Deployment Records

## Core Contracts

### Test Tokens
- WTURA: 0xc8F7d7989a409472945b00177396f4e9b8601DF3
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

## Additional Token Deployment (2025-02-26)
### New Test Tokens
| Token | Address | Deployment Date | Decimals | Notes |
|-------|---------|----------------|----------|-------|
| TT3   | 0x8Ba1cD55391a3FC2B4A76aC0D99058D0572aF608 | 2025-02-26 | 18 | Minted 1,000,000 tokens to owner, added to frontend tokenlist |
| TT4   | 0x74DfD646cA939e0aBfbd37dA9F5fb7F885cE44Cb | 2025-02-26 | 18 | Minted 1,000,000 tokens to owner, added to frontend tokenlist |
| TT5   | 0xe26Cc979Fee6213160ee903474D3E39CA8486A8a | 2025-02-26 | 18 | Minted 1,000,000 tokens to owner, added to frontend tokenlist |
| TT6   | 0xD6F72636B35A065eAAe03522800AfEFfB91416fF | 2025-02-26 | 18 | Minted 1,000,000 tokens to owner, added to frontend tokenlist |
| TT7   | 0xFd04a3b44A875DCa7d6751acDe7F578d34e35B75 | 2025-02-26 | 18 | Minted 1,000,000 tokens to owner, added to frontend tokenlist |
| TT8   | 0xdE1E1D1730587Cbcf06995FADbF06DEAedA9869D | 2025-02-26 | 18 | Minted 1,000,000 tokens to owner, added to frontend tokenlist |

### Deployment Method
- Used Forge scripts for deployment
- Each token configured with 18 decimals
- Minted 1,000,000 tokens to owner address: 0x08Bb6eA809A2d6c13D57166Fa3ede48C0ae9a70e
- Updated frontend tokenlist with all new token addresses
