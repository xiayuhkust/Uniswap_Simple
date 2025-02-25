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

## Backend Service (2025-02-25)
### Core Features
- Token and pool list management
- Real-time updates via WebSocket
- Blockchain event listeners
- API endpoints for frontend integration
- SQLite database for lightweight storage

### Technical Stack
- Node.js with Express.js
- SQLite database with Sequelize ORM
- Socket.io for WebSocket communication
- ethers.js for blockchain interaction
- node-cron for scheduled tasks

### API Endpoints
- Token Endpoints:
  * GET /api/tokens - Returns all tokens
  * GET /api/tokens/:address - Returns a specific token
  * GET /api/tokens/list - Returns tokens in Uniswap format
- Pool Endpoints:
  * GET /api/pools - Returns all pools
  * GET /api/pools/:address - Returns a specific pool
  * GET /api/pools/token/:address - Returns pools containing a specific token
- Utility Endpoints:
  * GET /health - Returns server status
  * GET /api/stats/websocket - Returns WebSocket cache statistics

### WebSocket Events
- Connection Events:
  * 'connection' - Client connected
  * 'disconnect' - Client disconnected
- Subscription Events:
  * 'subscribe:pool' - Subscribe to specific pool updates
  * 'unsubscribe:pool' - Unsubscribe from specific pool updates
- Data Events:
  * 'pool:updated' - Pool data updated
  * 'pool:created' - New pool created
  * 'pool:detail:updated' - Detailed pool data updated
  * 'token:updated' - Token data updated
  * 'token:created' - New token created
  * 'tokenList:updated' - Token list updated
  * 'cache:pools' - Initial pool cache data
  * 'cache:tokens' - Initial token cache data

### Database Configuration
- SQLite database file: database/uniswap-simple.sqlite
- Models:
  * Token: Stores token information (address, name, symbol, decimals, chainId)
  * Pool: Stores pool information (address, token0, token1, fee, tickSpacing, etc.)
- Associations:
  * Pool belongs to Token (token0, token1)
  * Token has many Pools (as token0, token1)

### Blockchain Integration
- Factory Contract: 0xdf5F4d3239391716A4F5928d57E2AaDd3f644C70
- Event Listeners:
  * PoolCreated - Triggered when a new pool is created
  * Initialize - Triggered when a pool is initialized
  * Swap - Triggered when a swap occurs in a pool
- Default Tokens:
  * WTURA: 0xF0e8a104Cc6ecC7bBa4Dc89473d1C64593eA69be
  * TT1: 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9
  * TT2: 0xC8F7D7989A409472945b00177396f4E9b8601df3
