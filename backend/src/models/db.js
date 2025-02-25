const { sequelize, testConnection } = require('../config/database');
const { logger } = require('../utils');

// Import models
const Token = require('./Token');
const Pool = require('./Pool');

// Define associations
const setupAssociations = () => {
  // Pool belongs to Token (token0)
  Pool.belongsTo(Token, { as: 'token0', foreignKey: 'token0Id' });
  
  // Pool belongs to Token (token1)
  Pool.belongsTo(Token, { as: 'token1', foreignKey: 'token1Id' });
  
  // Token has many Pools (as token0)
  Token.hasMany(Pool, { as: 'poolsAsToken0', foreignKey: 'token0Id' });
  
  // Token has many Pools (as token1)
  Token.hasMany(Pool, { as: 'poolsAsToken1', foreignKey: 'token1Id' });
};

// Initialize database
const initializeDatabase = async () => {
  try {
    // Test connection
    await testConnection();
    
    // Set up associations
    setupAssociations();
    
    // Sync models with database
    await sequelize.sync({ force: true }); // Use force: true to recreate tables
    
    logger.info('Database initialized successfully');
    return true;
  } catch (error) {
    logger.error('Failed to initialize database', error);
    return false;
  }
};

module.exports = {
  sequelize,
  initializeDatabase
};
