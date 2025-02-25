# Token and Pool List Management System Documentation

## Overview

The Token and Pool List Management System is a comprehensive solution for tracking and managing tokens and liquidity pools in the Uniswap V3 implementation. It consists of a backend service that monitors blockchain events and maintains a database of tokens and pools, and a frontend integration that consumes this data to display and interact with the pools.

## System Architecture

The system follows a client-server architecture with the following components:

1. **Backend Service**: A Node.js application that:
   - Connects to the blockchain
   - Listens for relevant events
   - Maintains a database of tokens and pools
   - Provides REST API endpoints
   - Broadcasts real-time updates via WebSocket

2. **Frontend Integration**: React components and hooks that:
   - Fetch data from the backend API
   - Subscribe to WebSocket events for real-time updates
   - Display token and pool information
   - Enable user interaction with pools

3. **Database**: SQLite database for storing:
   - Token information
   - Pool information
   - Relationships between tokens and pools

4. **WebSocket Service**: Real-time communication channel for:
   - Broadcasting updates to connected clients
   - Maintaining subscription-based updates
   - Providing initial cache data on connection

## Backend Components

### Configuration (`/backend/src/config/`)

- **index.js**: Central configuration module that loads environment variables and defines system-wide settings
- **database.js**: Database connection configuration using Sequelize ORM

### Models (`/backend/src/models/`)

- **Token.js**: Defines the Token model with properties like address, name, symbol, decimals, and chainId
- **Pool.js**: Defines the Pool model with properties like address, token0, token1, fee, tickSpacing, and liquidity
- **db.js**: Sets up database associations and initialization

### Services (`/backend/src/services/`)

- **blockchain.js**: Connects to the blockchain, initializes contracts, and sets up event listeners
- **token.js**: Manages token-related operations like fetching, creating, and updating tokens
- **pool.js**: Manages pool-related operations like fetching, creating, and updating pools
- **websocket.js**: Handles WebSocket connections, subscriptions, and broadcasts
- **scheduler.js**: Manages scheduled tasks for periodic data updates

### Routes (`/backend/src/routes/`)

- **token.js**: Defines API endpoints for token-related operations
- **pool.js**: Defines API endpoints for pool-related operations

### Utils (`/backend/src/utils/`)

- **index.js**: Utility functions for logging, error handling, and data formatting

### Entry Point (`/backend/src/index.js`)

- Initializes the Express application
- Sets up middleware
- Registers routes
- Starts the HTTP server
- Initializes services

## Frontend Integration

### Types (`/frontend/src/types/`)

- **pool.ts**: Defines TypeScript interfaces for pool and token data

### Hooks (`/frontend/src/hooks/`)

- **useWebSocket.ts**: Custom hook for WebSocket connection and event handling
- **usePoolListWebSocket.ts**: Custom hook for fetching and subscribing to pool list updates
- **usePoolData.ts**: Custom hook for fetching and processing pool data
- **useAddLiquidity.ts**: Custom hook for adding liquidity to pools

### Components (`/frontend/src/components/Pool/`)

- **PoolList/index.tsx**: Component for displaying the list of pools

## API Endpoints

### Token Endpoints

- `GET /api/tokens`: Returns all tokens
- `GET /api/tokens/:address`: Returns a specific token by address
- `GET /api/tokens/list`: Returns tokens in Uniswap token list format

### Pool Endpoints

- `GET /api/pools`: Returns all pools
- `GET /api/pools/:address`: Returns a specific pool by address
- `GET /api/pools/token/:address`: Returns pools containing a specific token

### Utility Endpoints

- `GET /health`: Returns server status
- `GET /api/stats/websocket`: Returns WebSocket cache statistics

## WebSocket Events

### Connection Events

- `connection`: Triggered when a client connects
- `disconnect`: Triggered when a client disconnects

### Subscription Events

- `subscribe:pool`: Subscribe to updates for a specific pool
- `unsubscribe:pool`: Unsubscribe from updates for a specific pool

### Data Events

- `pool:updated`: Triggered when pool data is updated
- `pool:created`: Triggered when a new pool is created
- `pool:detail:updated`: Triggered when detailed pool data is updated
- `token:updated`: Triggered when token data is updated
- `token:created`: Triggered when a new token is created
- `tokenList:updated`: Triggered when the token list is updated
- `cache:pools`: Provides initial pool cache data on connection
- `cache:tokens`: Provides initial token cache data on connection

## Blockchain Event Listeners

### Factory Contract Events

- `PoolCreated`: Triggered when a new pool is created
  - Parameters: token0, token1, fee, tickSpacing, pool

### Pool Contract Events

- `Initialize`: Triggered when a pool is initialized
  - Parameters: sqrtPriceX96, tick
- `Swap`: Triggered when a swap occurs in a pool
  - Parameters: sender, recipient, amount0, amount1, sqrtPriceX96, liquidity, tick

## Database Schema

### Token Table

- `id`: Primary key
- `address`: Token contract address (unique)
- `name`: Token name
- `symbol`: Token symbol
- `decimals`: Token decimals
- `chainId`: Chain ID
- `logoURI`: Token logo URI (optional)
- `createdAt`: Creation timestamp
- `updatedAt`: Update timestamp

### Pool Table

- `id`: Primary key
- `address`: Pool contract address (unique)
- `token0Id`: Foreign key to Token table (token0)
- `token1Id`: Foreign key to Token table (token1)
- `fee`: Pool fee
- `tickSpacing`: Pool tick spacing
- `sqrtPriceX96`: Current sqrt price
- `liquidity`: Current liquidity
- `tick`: Current tick
- `volume24h`: 24-hour volume
- `volumeWeek`: Weekly volume
- `volumeMonth`: Monthly volume
- `tvl`: Total value locked
- `createdAt`: Creation timestamp
- `updatedAt`: Update timestamp

## Environment Variables

### Backend Environment Variables

- `TURA_RPC_URL`: Tura blockchain RPC URL
- `TURA_CHAIN_ID`: Tura blockchain chain ID
- `PRIVATE_KEYS`: Private keys for blockchain interaction
- `PORT`: Server port
- `DB_STORAGE`: SQLite database file path
- `FACTORY_ADDRESS`: Factory contract address

### Frontend Environment Variables

- `VITE_BACKEND_URL`: Backend service URL

## Setup and Deployment

### Backend Setup

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Create .env file with required environment variables

3. Start the server:
   ```bash
   npm start
   ```

### Frontend Integration

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Create .env file with required environment variables

3. Import and use the hooks in your components:
   ```typescript
   import { usePoolListWebSocket } from '../hooks/usePoolListWebSocket';
   
   function PoolListComponent() {
     const { pools, loading, error } = usePoolListWebSocket();
     
     // Render component using pools data
   }
   ```

## Data Flow

1. **Blockchain Events**:
   - Factory contract emits PoolCreated event
   - Pool contract emits Initialize and Swap events

2. **Backend Processing**:
   - Event listeners capture events
   - Services process event data
   - Database is updated with new information

3. **Real-time Updates**:
   - WebSocket service broadcasts updates to connected clients
   - Clients receive updates and update their UI

4. **API Requests**:
   - Frontend makes HTTP requests to API endpoints
   - Backend retrieves data from database
   - Frontend receives and displays data

## Error Handling

### Backend Error Handling

- **Blockchain Connection Errors**: Retry mechanism with exponential backoff
- **Database Errors**: Transaction rollback and error logging
- **API Errors**: Proper HTTP status codes and error messages

### Frontend Error Handling

- **API Request Errors**: Error state in hooks with user-friendly messages
- **WebSocket Connection Errors**: Automatic reconnection with fallback to HTTP

## Performance Considerations

### Backend Optimizations

- **Caching**: In-memory cache for frequently accessed data
- **Database Indexing**: Indexes on frequently queried columns
- **Connection Pooling**: Database connection pooling for efficient resource usage

### Frontend Optimizations

- **Data Fetching**: Fetch only necessary data
- **Real-time Updates**: Subscribe only to relevant events
- **Rendering**: Optimize rendering with memoization and virtualization

## Security Considerations

### Backend Security

- **Input Validation**: Validate all API inputs
- **Rate Limiting**: Limit request frequency
- **CORS**: Configure proper CORS settings

### Frontend Security

- **Data Sanitization**: Sanitize data before rendering
- **Error Handling**: Do not expose sensitive information in error messages

## Monitoring and Maintenance

### Backend Monitoring

- **Logging**: Comprehensive logging of events and errors
- **Health Checks**: Regular health checks of services
- **Performance Metrics**: Track API response times and resource usage

### Frontend Monitoring

- **Error Tracking**: Track and report frontend errors
- **Performance Monitoring**: Monitor rendering and data fetching performance

## Future Enhancements

1. **Authentication and Authorization**: Add user authentication and role-based access control
2. **Advanced Filtering**: Implement advanced filtering and sorting options for pools and tokens
3. **Analytics**: Add analytics for pool performance and user activity
4. **Multi-chain Support**: Extend the system to support multiple blockchains
5. **Notifications**: Add notification system for important events

## Conclusion

The Token and Pool List Management System provides a robust solution for tracking and managing tokens and liquidity pools in the Uniswap V3 implementation. It offers real-time updates, efficient data storage, and a user-friendly interface for interacting with pools.
