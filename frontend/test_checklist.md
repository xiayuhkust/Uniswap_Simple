# Pool Creation and Liquidity Addition Test Checklist

## WebSocket Connection
- [x] WebSocket connection is established between frontend and backend
- [x] "LIVE UPDATES" badge is displayed in the UI
- [x] Connection status is properly reflected in the UI
- [x] Ping-pong test is successful (backend responds to ping with pong)

## PoolList Component
- [ ] PoolList component loads successfully
- [ ] Initial pool data is fetched from backend API
- [ ] Loading spinner is displayed while fetching data
- [ ] Error messages are displayed when API requests fail
- [ ] WebSocket connection status is correctly reflected in the UI
- [ ] "LIVE UPDATES" badge is green when connected
- [ ] "UPDATES PAUSED" badge is red when disconnected
- [ ] Refresh button triggers a new API request
- [ ] Pool data is updated in real-time when new pools are created
- [ ] Pool data is updated in real-time when existing pools are updated

## Pool Creation Process
- [ ] Pool creation transaction is submitted successfully
- [ ] Pool creation transaction is mined successfully
- [ ] Pool address is correctly retrieved from the factory contract
- [ ] Pool creation event is emitted and captured by the backend
- [ ] Pool appears in the backend API response at `/api/pools`
- [ ] Pool appears in the frontend UI

## Liquidity Addition Process
- [ ] Token approvals are completed successfully
- [ ] Liquidity addition transaction is submitted successfully
- [ ] Liquidity addition transaction is mined successfully
- [ ] Pool contains the correct amount of tokens after liquidity addition
- [ ] Pool is not empty after creation

## Error Handling
- [ ] Proper error messages are displayed for failed transactions
- [ ] Loading states are shown during transaction processing
- [ ] Success messages are displayed for completed transactions
- [ ] Network errors are handled gracefully
- [ ] WebSocket reconnection attempts are made when connection is lost

## Console Logs for Verification
Expected console logs for successful pool creation:
```javascript
// Pool creation
console.log('Pool creation transaction submitted:', data.hash);
console.log('Waiting for pool creation transaction to be mined...');
console.log('Pool creation transaction mined:', receipt);
console.log('Created pool address:', poolAddress);

// Token approvals
console.log('Approving tokens:', token0Amount, token0?.symbol, token1Amount, token1?.symbol);
console.log('Tokens approved successfully');

// Liquidity addition
console.log('Adding liquidity:', lowerTick, upperTick, token0Amount, token1Amount);
console.log('Liquidity addition transaction submitted:', tx.hash);
console.log('Liquidity addition transaction mined:', receipt);
console.log('Liquidity added successfully');
```

## Backend Event Listener Verification
Expected backend logs for pool creation event:
```javascript
console.log('Received PoolCreated event:', eventData);
console.log('New pool created:', poolAddress);
console.log('Notifying clients about new pool');
```

## WebSocket Event Verification
Expected WebSocket events for pool updates:
```javascript
// When a new pool is created
socket.on('pool:created', (data) => {
  console.log('New pool created:', data);
});

// When a pool is updated
socket.on('pool:updated', (data) => {
  console.log('Pool updated:', data);
});

// When the pool cache is updated
socket.on('cache:pools', (data) => {
  console.log('Pool cache updated:', data);
});
```

## Test Parameters
For testing pool creation with the following parameters:
- Token pair: WTURA/TT1
  - WTURA: 0xF0e8a104Cc6ecC7bBa4Dc89473d1C64593eA69be
  - TT1: 0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9
- Fee rate: 0.05%
- Initial liquidity ratio: 1:111
