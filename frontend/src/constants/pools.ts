import { type Abi } from 'viem';
import IUniswapV3Pool from '../abi/IUniswapV3Pool.json';
import { TT1_ADDRESS, TT2_ADDRESS, WTURA_ADDRESS, FACTORY_ABI } from '../utils/contracts';

export const TOKENS = {
  TT1: TT1_ADDRESS,
  TT2: TT2_ADDRESS,
  WTURA: WTURA_ADDRESS
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
