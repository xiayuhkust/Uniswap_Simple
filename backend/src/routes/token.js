const express = require('express');
const tokenService = require('../services/token');
const { logger } = require('../utils');

const router = express.Router();

/**
 * @route GET /api/tokens
 * @description Get all tokens
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    const chainId = req.query.chainId ? parseInt(req.query.chainId, 10) : undefined;
    const tokens = await tokenService.getTokens(chainId);
    res.json(tokens);
  } catch (error) {
    logger.error('Error getting tokens', error);
    res.status(500).json({ error: 'Failed to get tokens' });
  }
});

/**
 * @route GET /api/tokens/list
 * @description Get token list in Uniswap format
 * @access Public
 */
router.get('/list', async (req, res) => {
  try {
    const chainId = req.query.chainId ? parseInt(req.query.chainId, 10) : undefined;
    const tokenList = await tokenService.getTokenList(chainId);
    res.json(tokenList);
  } catch (error) {
    logger.error('Error getting token list', error);
    res.status(500).json({ error: 'Failed to get token list' });
  }
});

/**
 * @route GET /api/tokens/:address
 * @description Get token by address
 * @access Public
 */
router.get('/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const chainId = req.query.chainId ? parseInt(req.query.chainId, 10) : undefined;
    
    const token = await tokenService.getTokenByAddress(address, chainId);
    
    if (!token) {
      return res.status(404).json({ error: 'Token not found' });
    }
    
    res.json(token);
  } catch (error) {
    logger.error('Error getting token by address', error);
    res.status(500).json({ error: 'Failed to get token' });
  }
});

/**
 * @route POST /api/tokens
 * @description Create a new token
 * @access Public
 */
router.post('/', async (req, res) => {
  try {
    const tokenData = req.body;
    
    if (!tokenData.address || !tokenData.name || !tokenData.symbol) {
      return res.status(400).json({ error: 'Address, name, and symbol are required' });
    }
    
    const token = await tokenService.createToken(tokenData);
    res.status(201).json(token);
  } catch (error) {
    logger.error('Error creating token', error);
    res.status(500).json({ error: 'Failed to create token' });
  }
});

module.exports = router;
