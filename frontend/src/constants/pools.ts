import { type Abi } from 'viem';
import IUniswapV3Pool from '../abi/IUniswapV3Pool.json';
import { CONTRACT_ADDRESSES } from '../constants/addresses';
import { FACTORY_ABI } from '../utils/contracts';

export const TOKENS = {
  TT1: CONTRACT_ADDRESSES.TEST_TOKEN_1,
  TT2: CONTRACT_ADDRESSES.TEST_TOKEN_2,
  WTURA: CONTRACT_ADDRESSES.WETH
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

export { FACTORY_ABI };
export const POOL_ABI = IUniswapV3Pool.abi as Abi;
