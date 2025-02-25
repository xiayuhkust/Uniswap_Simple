const { logger } = require('../utils');

/**
 * WebSocket service for real-time updates
 */
class WebSocketService {
  constructor() {
    this.io = null;
    this.connectedClients = 0;
    this.cache = {
      pools: new Map(),
      tokens: new Map()
    };
  }

  /**
   * Initialize WebSocket service
   * @param {Object} io - Socket.io instance
   */
  initialize(io) {
    this.io = io;

    // Set up connection event handlers
    this.io.on('connection', (socket) => {
      this.connectedClients++;
      logger.info(`Client connected. Total clients: ${this.connectedClients}`);

      // Send cached data to new client
      this.sendCachedData(socket);

      // Handle subscription to specific pool updates
      socket.on('subscribe:pool', (poolAddress) => {
        logger.info(`Client subscribed to pool: ${poolAddress}`);
        socket.join(`pool:${poolAddress}`);
      });

      // Handle unsubscription from specific pool updates
      socket.on('unsubscribe:pool', (poolAddress) => {
        logger.info(`Client unsubscribed from pool: ${poolAddress}`);
        socket.leave(`pool:${poolAddress}`);
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        this.connectedClients--;
        logger.info(`Client disconnected. Total clients: ${this.connectedClients}`);
      });
    });

    logger.info('WebSocket service initialized');
  }

  /**
   * Send cached data to new client
   * @param {Object} socket - Socket.io socket
   */
  sendCachedData(socket) {
    // Send cached pools
    if (this.cache.pools.size > 0) {
      socket.emit('cache:pools', Array.from(this.cache.pools.values()));
    }

    // Send cached tokens
    if (this.cache.tokens.size > 0) {
      socket.emit('cache:tokens', Array.from(this.cache.tokens.values()));
    }
  }

  /**
   * Update pool in cache and emit update event
   * @param {Object} pool - Pool data
   */
  updatePool(pool) {
    if (!this.io) return;

    // Update cache
    this.cache.pools.set(pool.address, pool);

    // Emit update event to all clients
    this.io.emit('pool:updated', pool);

    // Emit update event to clients subscribed to this pool
    this.io.to(`pool:${pool.address}`).emit('pool:detail:updated', pool);
  }

  /**
   * Add new pool to cache and emit creation event
   * @param {Object} pool - Pool data
   */
  addPool(pool) {
    if (!this.io) return;

    // Update cache
    this.cache.pools.set(pool.address, pool);

    // Emit creation event
    this.io.emit('pool:created', pool);
  }

  /**
   * Update token in cache and emit update event
   * @param {Object} token - Token data
   */
  updateToken(token) {
    if (!this.io) return;

    // Update cache
    this.cache.tokens.set(token.address, token);

    // Emit update event
    this.io.emit('token:updated', token);
  }

  /**
   * Add new token to cache and emit creation event
   * @param {Object} token - Token data
   */
  addToken(token) {
    if (!this.io) return;

    // Update cache
    this.cache.tokens.set(token.address, token);

    // Emit creation event
    this.io.emit('token:created', token);
  }

  /**
   * Update token list in cache and emit update event
   * @param {Object} tokenList - Token list data
   */
  updateTokenList(tokenList) {
    if (!this.io) return;

    // Emit update event
    this.io.emit('tokenList:updated', tokenList);
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.pools.clear();
    this.cache.tokens.clear();
    logger.info('WebSocket cache cleared');
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getCacheStats() {
    return {
      pools: this.cache.pools.size,
      tokens: this.cache.tokens.size,
      clients: this.connectedClients
    };
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

module.exports = websocketService;
