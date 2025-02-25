const { ethers } = require('ethers');
const config = require('../config');
const tokenService = require('./token');
const poolService = require('./pool');
const websocketService = require('./websocket');
const { logger } = require('../utils');
const { sequelize } = require('../config/database');

// ABI for Factory contract (only the events and functions we need)
const FACTORY_ABI = [
  'event PoolCreated(address indexed token0, address indexed token1, uint24 indexed fee, int24 tickSpacing, address pool)',
  'function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)'
];

// ABI for Pool contract (only the events and functions we need)
const POOL_ABI = [
  'event Initialize(uint160 sqrtPriceX96, int24 tick)',
  'event Mint(address indexed sender, address indexed owner, int24 indexed tickLower, int24 tickUpper, uint128 amount, uint256 amount0, uint256 amount1)',
  'event Burn(address indexed owner, int24 indexed tickLower, int24 indexed tickUpper, uint128 amount, uint256 amount0, uint256 amount1)',
  'event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)',
  'function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)',
  'function liquidity() external view returns (uint128)'
];

// Provider and contract instances
let provider;
let factoryContract;
let poolContracts = {};

/**
 * Initialize blockchain provider and contracts
 * @returns {Promise<void>}
 */
const initializeProvider = async () => {
  try {
    // Create provider
    provider = new ethers.JsonRpcProvider(config.blockchain.rpcUrl);
    
    // Create wallet from private key
    const wallet = new ethers.Wallet(config.blockchain.privateKey, provider);
    
    // Create factory contract instance
    factoryContract = new ethers.Contract(
      config.blockchain.factoryAddress,
      FACTORY_ABI,
      wallet
    );
    
    logger.info(`Blockchain provider initialized for chain ID ${config.blockchain.chainId}`);
    logger.info(`Factory address: ${config.blockchain.factoryAddress}`);
  } catch (error) {
    logger.error('Error initializing blockchain provider', error);
    throw error;
  }
};

/**
 * Get pool contract instance
 * @param {String} poolAddress - Pool address
 * @returns {ethers.Contract} Pool contract instance
 */
const getPoolContract = (poolAddress) => {
  if (!poolContracts[poolAddress]) {
    poolContracts[poolAddress] = new ethers.Contract(
      poolAddress,
      POOL_ABI,
      provider
    );
  }
  
  return poolContracts[poolAddress];
};

/**
 * Handle PoolCreated event
 * @param {Object} event - Event data
 * @returns {Promise<void>}
 */
const handlePoolCreated = async (event) => {
  try {
    const { token0, token1, fee, tickSpacing, pool } = event.args;
    
    logger.info(`Pool created: ${pool} (${token0}/${token1})`);
    
    // Ensure tokens exist in database
    const token0Data = await ensureTokenExists(token0);
    const token1Data = await ensureTokenExists(token1);
    
    // Create pool in database
    const poolData = {
      address: pool,
      token0Address: token0,
      token1Address: token1,
      fee,
      tickSpacing,
      createdAtBlock: event.blockNumber
    };
    
    const createdPool = await poolService.createPool(poolData);
    
    // Update WebSocket cache and emit event
    websocketService.addToken(token0Data);
    websocketService.addToken(token1Data);
    websocketService.addPool(createdPool);
  } catch (error) {
    logger.error('Error handling PoolCreated event', error);
  }
};

/**
 * Handle Initialize event
 * @param {Object} event - Event data
 * @param {String} poolAddress - Pool address
 * @returns {Promise<void>}
 */
const handleInitialize = async (event, poolAddress) => {
  try {
    const { sqrtPriceX96, tick } = event.args;
    
    logger.info(`Pool initialized: ${poolAddress} (tick: ${tick})`);
    
    // Update pool in database
    const updateData = {
      sqrtPriceX96: sqrtPriceX96.toString(),
      tick,
      initialized: true
    };
    
    const updatedPool = await poolService.updatePool(poolAddress, updateData);
    
    // Update WebSocket cache and emit event
    websocketService.updatePool(updatedPool);
  } catch (error) {
    logger.error('Error handling Initialize event', error);
  }
};

/**
 * Handle Swap event
 * @param {Object} event - Event data
 * @param {String} poolAddress - Pool address
 * @returns {Promise<void>}
 */
const handleSwap = async (event, poolAddress) => {
  try {
    const { amount0, amount1, sqrtPriceX96, liquidity, tick } = event.args;
    
    // Calculate volume (absolute value of amount0 or amount1)
    const volume = amount0 > 0 ? amount0.toString() : amount1.toString();
    const absVolume = volume.startsWith('-') ? volume.substring(1) : volume;
    
    logger.info(`Swap in pool: ${poolAddress} (volume: ${absVolume})`);
    
    // Update pool in database
    const updateData = {
      sqrtPriceX96: sqrtPriceX96.toString(),
      liquidity: liquidity.toString(),
      tick
    };
    
    const updatedPool = await poolService.updatePool(poolAddress, updateData);
    
    // Update pool volume
    await poolService.updatePoolVolume(poolAddress, absVolume);
    
    // Update WebSocket cache and emit event
    websocketService.updatePool(updatedPool);
  } catch (error) {
    logger.error('Error handling Swap event', error);
  }
};

/**
 * Ensure token exists in database
 * @param {String} tokenAddress - Token address
 * @returns {Promise<Object>} Token
 */
const ensureTokenExists = async (tokenAddress) => {
  try {
    // Check if token exists
    const token = await tokenService.getTokenByAddress(tokenAddress);
    
    if (token) {
      return token;
    }
    
    // Token doesn't exist, fetch token data from blockchain
    const tokenContract = new ethers.Contract(
      tokenAddress,
      [
        'function name() external view returns (string)',
        'function symbol() external view returns (string)',
        'function decimals() external view returns (uint8)'
      ],
      provider
    );
    
    // Fetch token data
    const [name, symbol, decimals] = await Promise.all([
      tokenContract.name().catch(() => 'Unknown Token'),
      tokenContract.symbol().catch(() => 'UNKNOWN'),
      tokenContract.decimals().catch(() => 18)
    ]);
    
    // Create token in database
    const tokenData = {
      address: tokenAddress,
      name,
      symbol,
      decimals,
      chainId: config.blockchain.chainId
    };
    
    const createdToken = await tokenService.createToken(tokenData);
    
    // Update WebSocket cache
    websocketService.addToken(createdToken);
    
    return createdToken;
  } catch (error) {
    logger.error('Error ensuring token exists', error);
    
    // Create a placeholder token if we can't fetch data
    const tokenData = {
      address: tokenAddress,
      name: 'Unknown Token',
      symbol: 'UNKNOWN',
      decimals: 18,
      chainId: config.blockchain.chainId
    };
    
    const createdToken = await tokenService.createToken(tokenData);
    
    // Update WebSocket cache
    websocketService.addToken(createdToken);
    
    return createdToken;
  }
};

/**
 * Initialize event listeners
 * @param {Object} io - Socket.io instance
 * @returns {Promise<void>}
 */
const initializeEventListeners = async (io) => {
  try {
    // Initialize provider and contracts
    await initializeProvider();
    
    // Initialize default tokens
    await tokenService.initializeDefaultTokens();
    
    // Ensure database is ready
    await sequelize.authenticate();
    logger.info('Database connection authenticated');
    
    // Listen for PoolCreated events
    factoryContract.on('PoolCreated', async (token0, token1, fee, tickSpacing, pool, event) => {
      await handlePoolCreated(event);
      
      // Set up listeners for the new pool
      const poolContract = getPoolContract(pool);
      
      // Listen for Initialize events
      poolContract.on('Initialize', async (sqrtPriceX96, tick, event) => {
        await handleInitialize(event, pool);
      });
      
      // Listen for Swap events
      poolContract.on('Swap', async (sender, recipient, amount0, amount1, sqrtPriceX96, liquidity, tick, event) => {
        await handleSwap(event, pool);
      });
    });
    
    logger.info('Event listeners initialized');
    
    // Fetch existing pools
    await fetchExistingPools();
  } catch (error) {
    logger.error('Error initializing event listeners', error);
    throw error;
  }
};

/**
 * Fetch existing pools from factory contract
 * @returns {Promise<void>}
 */
const fetchExistingPools = async () => {
  try {
    // Get default tokens
    const tokens = await tokenService.getTokens();
    
    // Define fee tiers
    const feeTiers = [500, 3000, 10000]; // 0.05%, 0.3%, 1%
    
    // Log the tokens we're checking
    logger.info(`Checking for pools among ${tokens.length} tokens: ${tokens.map(t => t.symbol).join(', ')}`);
    
    // Fetch pools for all token pairs and fee tiers
    for (let i = 0; i < tokens.length; i++) {
      for (let j = i + 1; j < tokens.length; j++) {
        for (const fee of feeTiers) {
          try {
            const token0 = tokens[i];
            const token1 = tokens[j];
            
            logger.info(`Checking for pool: ${token0.symbol}/${token1.symbol} (${fee})`);
            
            // Get pool address from factory
            const poolAddress = await factoryContract.getPool(token0.address, token1.address, fee);
            
            // Skip if pool doesn't exist
            if (poolAddress === ethers.ZeroAddress) {
              logger.info(`No pool found for ${token0.symbol}/${token1.symbol} (${fee})`);
              continue;
            }
            
            logger.info(`Found existing pool: ${poolAddress} (${token0.symbol}/${token1.symbol})`);
            
            // Create pool in database
            const poolData = {
              address: poolAddress,
              token0Address: token0.address,
              token1Address: token1.address,
              fee,
              tickSpacing: getTickSpacing(fee),
              createdAtBlock: 0 // We don't know the block number
            };
            
            const pool = await poolService.createPool(poolData);
            
            // Add pool to WebSocket cache
            websocketService.addPool(pool);
            
            // Fetch pool data
            await fetchPoolData(poolAddress);
            
            // Set up listeners for the pool
            const poolContract = getPoolContract(poolAddress);
            
            // Listen for Initialize events
            poolContract.on('Initialize', async (sqrtPriceX96, tick, event) => {
              await handleInitialize(event, poolAddress);
            });
            
            // Listen for Swap events
            poolContract.on('Swap', async (sender, recipient, amount0, amount1, sqrtPriceX96, liquidity, tick, event) => {
              await handleSwap(event, poolAddress);
            });
          } catch (error) {
            logger.error(`Error fetching pool for ${tokens[i].symbol}/${tokens[j].symbol} (${fee})`, error);
          }
        }
      }
    }
    
    logger.info('Existing pools fetched');
  } catch (error) {
    logger.error('Error fetching existing pools', error);
  }
};

/**
 * Fetch pool data from blockchain
 * @param {String} poolAddress - Pool address
 * @returns {Promise<void>}
 */
const fetchPoolData = async (poolAddress) => {
  try {
    const poolContract = getPoolContract(poolAddress);
    
    // Fetch slot0 and liquidity
    const [slot0, liquidity] = await Promise.all([
      poolContract.slot0().catch(() => ({ sqrtPriceX96: 0, tick: 0 })),
      poolContract.liquidity().catch(() => 0)
    ]);
    
    // Update pool in database
    const updateData = {
      sqrtPriceX96: slot0.sqrtPriceX96.toString(),
      tick: slot0.tick,
      liquidity: liquidity.toString(),
      initialized: true
    };
    
    const updatedPool = await poolService.updatePool(poolAddress, updateData);
    
    // Update WebSocket cache and emit event
    websocketService.updatePool(updatedPool);
  } catch (error) {
    logger.error('Error fetching pool data', error);
  }
};

/**
 * Get tick spacing for fee tier
 * @param {Number} fee - Fee tier
 * @returns {Number} Tick spacing
 */
const getTickSpacing = (fee) => {
  switch (fee) {
    case 500:
      return 10;
    case 3000:
      return 60;
    case 10000:
      return 200;
    default:
      return 60;
  }
};

module.exports = {
  initializeEventListeners,
  fetchExistingPools,
  fetchPoolData
};
