export const FACTORY_ADDRESS = '0xdf5F4d3239391716A4F5928d57E2AaDd3f644C70'

export const TOKENS = {
  TT1: '0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9',
  TT2: '0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122',
  WTURA: '0xF0e8a104Cc6ecC7bBa4Dc89473d1C64593eA69be'
} as const

export const TOKEN_PAIRS = [
  { token0: TOKENS.TT1, token1: TOKENS.TT2, token0Symbol: 'TT1', token1Symbol: 'TT2' },
  { token0: TOKENS.TT1, token1: TOKENS.WTURA, token0Symbol: 'TT1', token1Symbol: 'WTURA' },
  { token0: TOKENS.TT2, token1: TOKENS.WTURA, token0Symbol: 'TT2', token1Symbol: 'WTURA' }
] as const

export const FEE_TIERS = {
  LOW: 500,    // 0.05%
  MEDIUM: 3000, // 0.3%
  HIGH: 10000   // 1%
} as const

export const FACTORY_ABI = [
  'event PoolCreated(address indexed token0, address indexed token1, uint24 indexed fee, int24 tickSpacing, address pool)',
  'function createPool(address tokenA, address tokenB, uint24 fee) external returns (address pool)',
  'function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)'
]

import IUniswapV3Pool from '../abi/IUniswapV3Pool.json';

export const POOL_ABI = IUniswapV3Pool.abi;
  'function token1() external view returns (address)',
  'function fee() external view returns (uint24)',
  'function liquidity() external view returns (uint128)',
  'function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)',
  'function positions(bytes32 key) external view returns (uint128 liquidity, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, uint128 tokensOwed0, uint128 tokensOwed1)'
]
