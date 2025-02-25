const WebSocket = require('ws');

// Connect to WebSocket server
const ws = new WebSocket('ws://localhost:3000');

// Connection opened
ws.on('open', () => {
  console.log('Connected to WebSocket server');
  
  // Subscribe to pool updates
  ws.send(JSON.stringify({ type: 'subscribe', channel: 'pools' }));
  
  // Subscribe to token updates
  ws.send(JSON.stringify({ type: 'subscribe', channel: 'tokens' }));
});

// Listen for messages
ws.on('message', (data) => {
  const message = JSON.parse(data);
  console.log('Received message:', message);
});

// Connection closed
ws.on('close', () => {
  console.log('Disconnected from WebSocket server');
});

// Connection error
ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});

// Keep the connection open for 10 seconds
setTimeout(() => {
  ws.close();
  console.log('Test completed');
  process.exit(0);
}, 10000);
