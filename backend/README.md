# Uniswap Simple Backend

Backend service for Uniswap Simple token and pool list management.

## Overview

This backend service provides:
- Token list management following Uniswap's token list specification
- Pool list management with real-time updates
- Blockchain event listeners for pool creation events
- REST API endpoints for frontend integration
- WebSocket support for real-time updates

## Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- Tura Blockchain RPC access

### Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file with the following variables:
   ```
   TURA_RPC_URL=https://rpc-beta1.turablockchain.com
   TURA_CHAIN_ID=1337
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/uniswap-simple
   FACTORY_ADDRESS=0xdf5F4d3239391716A4F5928d57E2AaDd3f644C70
   ```

### Running the Service

Development mode:
```
npm run dev
```

Production mode:
```
npm start
```

## API Endpoints

### Token Endpoints

- `GET /api/tokens` - Get all tokens
- `GET /api/tokens/:address` - Get a specific token

### Pool Endpoints

- `GET /api/pools` - Get all pools
- `GET /api/pools/:address` - Get a specific pool
- `GET /api/pools/token/:address` - Get pools containing a specific token

## WebSocket Events

- `pool:created` - Emitted when a new pool is created
- `pool:updated` - Emitted when a pool is updated

## Database Schema

### Token Schema

```
{
  address: String,          // Token contract address
  name: String,             // Token name
  symbol: String,           // Token symbol
  decimals: Number,         // Token decimals
  chainId: Number,          // Chain ID
  logoURI: String,          // Logo URI
  tags: [String],           // Tags for categorization
  createdAt: Date,          // Creation timestamp
  updatedAt: Date           // Update timestamp
}
```

### Pool Schema

```
{
  address: String,          // Pool contract address
  token0: {                 // Token 0 reference
    type: ObjectId,
    ref: 'Token'
  },
  token1: {                 // Token 1 reference
    type: ObjectId,
    ref: 'Token'
  },
  fee: Number,              // Fee tier
  tickSpacing: Number,      // Tick spacing
  sqrtPriceX96: String,     // Current price
  liquidity: String,        // Current liquidity
  tick: Number,             // Current tick
  volume24h: String,        // 24-hour volume
  volumeWeek: String,       // Weekly volume
  createdAt: Date,          // Creation timestamp
  updatedAt: Date           // Update timestamp
}
```
