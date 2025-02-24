import { BigNumber } from '@ethersproject/bignumber'

export interface Position {
  tokenId: string
  token0Symbol: string
  token1Symbol: string
  fee: number
  liquidity: BigNumber
  tickLower: number
  tickUpper: number
  amount0: BigNumber
  amount1: BigNumber
}
