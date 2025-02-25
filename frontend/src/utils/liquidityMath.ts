import { type Address } from 'viem'

export interface LiquidityAmount {
  amount0: bigint
  amount1: bigint
}

export const LiquidityMath = {
  /**
   * Calculates the amount of liquidity for a given amount of token0 and price range
   */
  getLiquidityForAmount0: (
    sqrtPriceX96: bigint,
    sqrtPriceAX96: bigint,
    sqrtPriceBX96: bigint,
    amount0: bigint
  ): bigint => {
    if (sqrtPriceAX96 > sqrtPriceBX96) {
      [sqrtPriceAX96, sqrtPriceBX96] = [sqrtPriceBX96, sqrtPriceAX96]
    }

    const intermediate = (sqrtPriceBX96 - sqrtPriceAX96) * amount0
    return intermediate / ((sqrtPriceBX96 - sqrtPriceX96) >> 96n)
  },

  /**
   * Calculates the amount of liquidity for a given amount of token1
   */
  getLiquidityForAmount1: (
    sqrtPriceX96: bigint,
    sqrtPriceAX96: bigint,
    sqrtPriceBX96: bigint,
    amount1: bigint
  ): bigint => {
    if (sqrtPriceAX96 > sqrtPriceBX96) {
      [sqrtPriceAX96, sqrtPriceBX96] = [sqrtPriceBX96, sqrtPriceAX96]
    }

    return (amount1 * ((sqrtPriceBX96 - sqrtPriceAX96) >> 96n)) / (sqrtPriceBX96 - sqrtPriceX96)
  },

  /**
   * Calculates the maximum amount of liquidity received for a given amount of token0, token1, the current
   * pool prices and the prices at the tick boundaries
   */
  getLiquidityForAmounts: (
    sqrtPriceX96: bigint,
    sqrtPriceAX96: bigint,
    sqrtPriceBX96: bigint,
    amount0: bigint,
    amount1: bigint
  ): bigint => {
    if (sqrtPriceAX96 > sqrtPriceBX96) {
      [sqrtPriceAX96, sqrtPriceBX96] = [sqrtPriceBX96, sqrtPriceAX96]
    }

    if (sqrtPriceX96 <= sqrtPriceAX96) {
      return LiquidityMath.getLiquidityForAmount0(sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96, amount0)
    } else if (sqrtPriceX96 < sqrtPriceBX96) {
      const liquidity0 = LiquidityMath.getLiquidityForAmount0(sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96, amount0)
      const liquidity1 = LiquidityMath.getLiquidityForAmount1(sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96, amount1)
      return liquidity0 < liquidity1 ? liquidity0 : liquidity1
    } else {
      return LiquidityMath.getLiquidityForAmount1(sqrtPriceX96, sqrtPriceAX96, sqrtPriceBX96, amount1)
    }
  },

  /**
   * Computes the token0 and token1 value for a given amount of liquidity, the current
   * pool prices and the prices at the tick boundaries
   */
  getAmountsForLiquidity: (
    sqrtPriceX96: bigint,
    sqrtPriceAX96: bigint,
    sqrtPriceBX96: bigint,
    liquidity: bigint
  ): LiquidityAmount => {
    if (sqrtPriceAX96 > sqrtPriceBX96) {
      [sqrtPriceAX96, sqrtPriceBX96] = [sqrtPriceBX96, sqrtPriceAX96]
    }

    let amount0 = 0n
    let amount1 = 0n

    if (sqrtPriceX96 <= sqrtPriceAX96) {
      amount0 = (liquidity * (sqrtPriceBX96 - sqrtPriceAX96)) >> 96n
    } else if (sqrtPriceX96 < sqrtPriceBX96) {
      amount0 = (liquidity * (sqrtPriceBX96 - sqrtPriceX96)) >> 96n
      amount1 = (liquidity * (sqrtPriceX96 - sqrtPriceAX96)) >> 96n
    } else {
      amount1 = (liquidity * (sqrtPriceBX96 - sqrtPriceAX96)) >> 96n
    }

    return { amount0, amount1 }
  }
}
