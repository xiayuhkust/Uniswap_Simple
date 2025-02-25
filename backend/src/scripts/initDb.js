require('dotenv').config();
const { sequelize } = require('../config/database');
const Token = require('../models/Token');
const Pool = require('../models/Pool');
const { logger } = require('../utils');

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
    await sequelize.authenticate();
    logger.info('Database connection has been established successfully.');
    
    // Set up associations
    setupAssociations();
    
    // Sync models with database (force: true to recreate tables)
    await sequelize.sync({ force: true });
    
    logger.info('Database initialized successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Failed to initialize database', error);
    process.exit(1);
  }
};

// Run initialization
initializeDatabase();
