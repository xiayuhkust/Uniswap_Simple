const express = require('express');
const poolService = require('../services/pool');
const { logger } = require('../utils');

const router = express.Router();

/**
 * @route GET /api/pools
 * @description Get all pools
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    const pools = await poolService.getPools();
    res.json(pools);
  } catch (error) {
    logger.error('Error getting pools', error);
    res.status(500).json({ error: 'Failed to get pools' });
  }
});

/**
 * @route GET /api/pools/:address
 * @description Get pool by address
 * @access Public
 */
router.get('/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    const pool = await poolService.getPoolByAddress(address);
    
    if (!pool) {
      return res.status(404).json({ error: 'Pool not found' });
    }
    
    res.json(pool);
  } catch (error) {
    logger.error('Error getting pool by address', error);
    res.status(500).json({ error: 'Failed to get pool' });
  }
});

/**
 * @route GET /api/pools/token/:address
 * @description Get pools by token address
 * @access Public
 */
router.get('/token/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    const pools = await poolService.getPoolsByTokenAddress(address);
    
    res.json(pools);
  } catch (error) {
    logger.error('Error getting pools by token address', error);
    res.status(500).json({ error: 'Failed to get pools' });
  }
});

/**
 * @route GET /api/pools/pair/:token0/:token1
 * @description Get pool by token addresses and fee
 * @access Public
 */
router.get('/pair/:token0/:token1', async (req, res) => {
  try {
    const { token0, token1 } = req.params;
    const fee = req.query.fee ? parseInt(req.query.fee, 10) : 3000; // Default to 0.3%
    
    const pool = await poolService.getPoolByTokenAddressesAndFee(token0, token1, fee);
    
    if (!pool) {
      return res.status(404).json({ error: 'Pool not found' });
    }
    
    res.json(pool);
  } catch (error) {
    logger.error('Error getting pool by token addresses and fee', error);
    res.status(500).json({ error: 'Failed to get pool' });
  }
});

/**
 * @route POST /api/pools
 * @description Create a new pool
 * @access Public
 */
router.post('/', async (req, res) => {
  try {
    const poolData = req.body;
    
    if (!poolData.address || !poolData.token0Address || !poolData.token1Address || !poolData.fee) {
      return res.status(400).json({ error: 'Address, token0Address, token1Address, and fee are required' });
    }
    
    const pool = await poolService.createPool(poolData);
    res.status(201).json(pool);
  } catch (error) {
    logger.error('Error creating pool', error);
    res.status(500).json({ error: 'Failed to create pool' });
  }
});

/**
 * @route PUT /api/pools/:address
 * @description Update pool data
 * @access Public
 */
router.put('/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const updateData = req.body;
    
    const pool = await poolService.updatePool(address, updateData);
    
    res.json(pool);
  } catch (error) {
    logger.error('Error updating pool', error);
    res.status(500).json({ error: 'Failed to update pool' });
  }
});

module.exports = router;
