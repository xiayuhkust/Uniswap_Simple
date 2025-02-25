const Token = require('../models/Token');
const { logger } = require('../utils');
const config = require('../config');

/**
 * Create a new token
 * @param {Object} tokenData - Token data
 * @returns {Promise<Object>} Created token
 */
const createToken = async (tokenData) => {
  try {
    // Check if token already exists
    const existingToken = await Token.findOne({
      where: {
        address: tokenData.address.toLowerCase(),
        chainId: tokenData.chainId || config.blockchain.chainId
      }
    });
    
    if (existingToken) {
      // Update existing token
      await existingToken.update(tokenData);
      logger.info(`Token updated: ${existingToken.symbol} (${existingToken.address})`);
      return existingToken;
    }
    
    // Create new token
    const token = await Token.create({
      ...tokenData,
      address: tokenData.address.toLowerCase(),
      chainId: tokenData.chainId || config.blockchain.chainId
    });
    
    logger.info(`Token created: ${token.symbol} (${token.address})`);
    return token;
  } catch (error) {
    logger.error('Error creating token', error);
    throw error;
  }
};

/**
 * Get all tokens
 * @param {Number} chainId - Chain ID
 * @returns {Promise<Array>} List of tokens
 */
const getTokens = async (chainId = config.blockchain.chainId) => {
  try {
    return await Token.findAll({
      where: { chainId }
    });
  } catch (error) {
    logger.error('Error getting tokens', error);
    throw error;
  }
};

/**
 * Get token by address
 * @param {String} address - Token address
 * @param {Number} chainId - Chain ID
 * @returns {Promise<Object>} Token
 */
const getTokenByAddress = async (address, chainId = config.blockchain.chainId) => {
  try {
    return await Token.findOne({
      where: {
        address: address.toLowerCase(),
        chainId
      }
    });
  } catch (error) {
    logger.error('Error getting token by address', error);
    throw error;
  }
};

/**
 * Get token list in Uniswap format
 * @param {Number} chainId - Chain ID
 * @returns {Promise<Object>} Token list
 */
const getTokenList = async (chainId = config.blockchain.chainId) => {
  try {
    return await Token.getTokenList(chainId);
  } catch (error) {
    logger.error('Error getting token list', error);
    throw error;
  }
};

/**
 * Initialize default tokens
 * @returns {Promise<void>}
 */
const initializeDefaultTokens = async () => {
  try {
    // Use default tokens from config
    const defaultTokens = config.defaultTokens || [
      {
        address: '0xF0e8a104Cc6ecC7bBa4Dc89473d1C64593eA69be',
        name: 'Wrapped Tura',
        symbol: 'WTURA',
        decimals: 18,
        chainId: config.blockchain.chainId
      },
      {
        address: '0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9',
        name: 'Test Token 1',
        symbol: 'TT1',
        decimals: 18,
        chainId: config.blockchain.chainId
      },
      {
        address: '0xC8F7D7989A409472945b00177396f4E9b8601df3',
        name: 'Test Token 2',
        symbol: 'TT2',
        decimals: 18,
        chainId: config.blockchain.chainId
      }
    ];
    
    for (const tokenData of defaultTokens) {
      await createToken(tokenData);
    }
    
    logger.info('Default tokens initialized');
  } catch (error) {
    logger.error('Error initializing default tokens', error);
    throw error;
  }
};

module.exports = {
  createToken,
  getTokens,
  getTokenByAddress,
  getTokenList,
  initializeDefaultTokens
};
