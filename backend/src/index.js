const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const config = require('./config');
const { logger } = require('./utils');
const { initializeDatabase } = require('./models/db');
const tokenRoutes = require('./routes/token');
const poolRoutes = require('./routes/pool');
const websocketService = require('./services/websocket');
const schedulerService = require('./services/scheduler');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Initialize WebSocket service
websocketService.initialize(io);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tokens', tokenRoutes);
app.use('/api/pools', poolRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// WebSocket stats endpoint
app.get('/api/stats/websocket', (req, res) => {
  res.status(200).json(websocketService.getCacheStats());
});

// Initialize database and start server
initializeDatabase()
  .then(() => {
    logger.info('Database initialized successfully');
    
    // Start blockchain event listeners
    require('./services/blockchain').initializeEventListeners(io);
    
    // Initialize scheduled tasks
    schedulerService.initializeScheduledTasks();
    
    // Start server
    server.listen(config.server.port, () => {
      logger.info(`Server running on port ${config.server.port}`);
    });
  })
  .catch((error) => {
    logger.error('Failed to initialize database', error);
    process.exit(1);
  });

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled promise rejection', error);
  process.exit(1);
});
