const Pool = require('../models/Pool');
const Token = require('../models/Token');
const { logger } = require('../utils');
const config = require('../config');

/**
 * Create a new pool
 * @param {Object} poolData - Pool data
 * @returns {Promise<Object>} Created pool
 */
const createPool = async (poolData) => {
  try {
    // Check if pool already exists
    const existingPool = await Pool.findOne({
      where: {
        address: poolData.address.toLowerCase()
      }
    });
    
    if (existingPool) {
      logger.info(`Pool already exists: ${existingPool.address}`);
      return existingPool;
    }
    
    // Find tokens
    const token0 = await Token.findOne({
      where: {
        address: poolData.token0Address.toLowerCase()
      }
    });
    
    const token1 = await Token.findOne({
      where: {
        address: poolData.token1Address.toLowerCase()
      }
    });
    
    if (!token0 || !token1) {
      throw new Error('Token not found');
    }
    
    // Create new pool
    const pool = await Pool.create({
      ...poolData,
      address: poolData.address.toLowerCase(),
      token0Id: token0.address,
      token1Id: token1.address,
      token0Address: poolData.token0Address.toLowerCase(),
      token1Address: poolData.token1Address.toLowerCase()
    });
    
    logger.info(`Pool created: ${pool.address} (${token0.symbol}/${token1.symbol})`);
    return pool;
  } catch (error) {
    logger.error('Error creating pool', error);
    throw error;
  }
};

/**
 * Get all pools
 * @returns {Promise<Array>} List of pools
 */
const getPools = async () => {
  try {
    return await Pool.findAll({
      include: ['token0', 'token1'],
      order: [['createdAt', 'DESC']]
    });
  } catch (error) {
    logger.error('Error getting pools', error);
    throw error;
  }
};

/**
 * Get pool by address
 * @param {String} address - Pool address
 * @returns {Promise<Object>} Pool
 */
const getPoolByAddress = async (address) => {
  try {
    return await Pool.findOne({
      where: {
        address: address.toLowerCase()
      },
      include: ['token0', 'token1']
    });
  } catch (error) {
    logger.error('Error getting pool by address', error);
    throw error;
  }
};

/**
 * Get pools by token address
 * @param {String} tokenAddress - Token address
 * @returns {Promise<Array>} List of pools
 */
const getPoolsByTokenAddress = async (tokenAddress) => {
  try {
    return await Pool.findByTokenAddress(tokenAddress.toLowerCase());
  } catch (error) {
    logger.error('Error getting pools by token address', error);
    throw error;
  }
};

/**
 * Get pool by token addresses and fee
 * @param {String} token0Address - Token 0 address
 * @param {String} token1Address - Token 1 address
 * @param {Number} fee - Fee tier
 * @returns {Promise<Object>} Pool
 */
const getPoolByTokenAddressesAndFee = async (token0Address, token1Address, fee) => {
  try {
    return await Pool.findByTokenAddressesAndFee(
      token0Address.toLowerCase(),
      token1Address.toLowerCase(),
      fee
    );
  } catch (error) {
    logger.error('Error getting pool by token addresses and fee', error);
    throw error;
  }
};

/**
 * Update pool data
 * @param {String} address - Pool address
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated pool
 */
const updatePool = async (address, updateData) => {
  try {
    const pool = await Pool.findOne({
      where: {
        address: address.toLowerCase()
      }
    });
    
    if (!pool) {
      throw new Error('Pool not found');
    }
    
    // Update pool data
    await pool.update(updateData);
    
    logger.info(`Pool updated: ${pool.address}`);
    return pool;
  } catch (error) {
    logger.error('Error updating pool', error);
    throw error;
  }
};

/**
 * Update pool volume
 * @param {String} address - Pool address
 * @param {String} amount - Amount to add to volume
 * @returns {Promise<Object>} Updated pool
 */
const updatePoolVolume = async (address, amount) => {
  try {
    const pool = await Pool.findOne({
      where: {
        address: address.toLowerCase()
      }
    });
    
    if (!pool) {
      throw new Error('Pool not found');
    }
    
    // Update volume data
    const volumeTotal = BigInt(pool.volumeTotal || '0') + BigInt(amount);
    const volume24h = BigInt(pool.volume24h || '0') + BigInt(amount);
    const volumeWeek = BigInt(pool.volumeWeek || '0') + BigInt(amount);
    
    // Calculate fees
    const fee = pool.fee / 1000000; // Convert to decimal
    const feeAmount = BigInt(Math.floor(Number(amount) * fee));
    const feesTotal = BigInt(pool.feesTotal || '0') + feeAmount;
    
    // Update pool
    await pool.update({
      volumeTotal: volumeTotal.toString(),
      volume24h: volume24h.toString(),
      volumeWeek: volumeWeek.toString(),
      feesTotal: feesTotal.toString(),
      txCount: pool.txCount + 1
    });
    
    logger.info(`Pool volume updated: ${pool.address}`);
    return pool;
  } catch (error) {
    logger.error('Error updating pool volume', error);
    throw error;
  }
};

/**
 * Reset 24h volume for all pools
 * @returns {Promise<void>}
 */
const reset24hVolume = async () => {
  try {
    await Pool.update({ volume24h: '0' }, { where: {} });
    logger.info('24h volume reset for all pools');
  } catch (error) {
    logger.error('Error resetting 24h volume', error);
    throw error;
  }
};

/**
 * Reset weekly volume for all pools
 * @returns {Promise<void>}
 */
const resetWeeklyVolume = async () => {
  try {
    await Pool.update({ volumeWeek: '0' }, { where: {} });
    logger.info('Weekly volume reset for all pools');
  } catch (error) {
    logger.error('Error resetting weekly volume', error);
    throw error;
  }
};

module.exports = {
  createPool,
  getPools,
  getPoolByAddress,
  getPoolsByTokenAddress,
  getPoolByTokenAddressesAndFee,
  updatePool,
  updatePoolVolume,
  reset24hVolume,
  resetWeeklyVolume
};
