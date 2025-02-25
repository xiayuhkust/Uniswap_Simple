import { useContractRead } from 'wagmi'
import { type Address } from 'viem'
import IUniswapV3Pool from '../abi/IUniswapV3Pool.json'
import { Q96_SHIFT, stringToBigInt, formatPrice, ZERO_BIGINT } from '../utils/bigint'
import { isValidAmount } from '../utils/validation'

interface Slot0Result {
  sqrtPriceX96: bigint
  tick: number
  observationIndex: number
  observationCardinality: number
  observationCardinalityNext: number
  feeProtocol: number
  unlocked: boolean
}

const POOL_INTERFACE = IUniswapV3Pool.abi

export function usePoolData(poolAddress?: Address) {
  const { data: slot0Data, isLoading: slot0Loading } = useContractRead({
    address: poolAddress,
    abi: POOL_INTERFACE,
    functionName: 'slot0',
    enabled: !!poolAddress
  })

  const { data: liquidity, isLoading: liquidityLoading } = useContractRead({
    address: poolAddress,
    abi: POOL_INTERFACE,
    functionName: 'liquidity',
    enabled: !!poolAddress
  })

  const { data: fee, isLoading: feeLoading } = useContractRead({
    address: poolAddress,
    abi: POOL_INTERFACE,
    functionName: 'fee',
    enabled: !!poolAddress
  })

  const calculateAmount1ForAmount0 = (amount0: string): string => {
    try {
      if (!amount0 || !isValidAmount(amount0)) return ''
      
      // For empty pools, don't calculate ratio
      if (!liquidity || BigInt(liquidity.toString()) === ZERO_BIGINT) {
        return amount0
      }
      
      const slot0 = slot0Data ? parseSlot0Data(slot0Data) : null
      if (!slot0 || slot0.sqrtPriceX96 === undefined) {
        console.error('Invalid slot0 data:', slot0Data)
        return ''
      }
      
      // Calculate price using BigInt throughout
      const sqrtPriceX96 = slot0.sqrtPriceX96
      
      // Convert amount0 to BigInt with proper decimal precision
      const amount0BigInt = stringToBigInt(amount0)
      
      // Calculate result maintaining precision with BigInt operations
      // For token0 to token1, multiply by sqrtPriceX96 squared and shift by Q96*2
      const squared = sqrtPriceX96 * sqrtPriceX96
      const result = (amount0BigInt * squared) >> (Q96_SHIFT * 2n)
      
      // Convert back to decimal string with proper precision
      return formatPrice(result)
    } catch (error) {
      console.error('Error calculating amount1:', error)
      return ''
    }
  }

  const calculateAmount0ForAmount1 = (amount1: string): string => {
    try {
      if (!amount1 || !isValidAmount(amount1)) return ''
      
      // For empty pools, don't calculate ratio
      if (!liquidity || BigInt(liquidity.toString()) === ZERO_BIGINT) {
        return amount1
      }
      
      const slot0 = slot0Data ? parseSlot0Data(slot0Data) : null
      if (!slot0 || slot0.sqrtPriceX96 === undefined) {
        console.error('Invalid slot0 data:', slot0Data)
        return ''
      }
      
      // Calculate price using BigInt throughout
      const sqrtPriceX96 = slot0.sqrtPriceX96
      
      // Convert amount1 to BigInt with proper decimal precision
      const amount1BigInt = stringToBigInt(amount1)
      
      // Calculate result maintaining precision with BigInt operations
      // For token1 to token0, scale by Q96*2 and divide by sqrtPriceX96 squared
      const squared = sqrtPriceX96 * sqrtPriceX96
      const scaledAmount = amount1BigInt << (Q96_SHIFT * 2n)
      const result = scaledAmount / squared
      
      // Convert back to decimal string with proper precision
      return formatPrice(result)
    } catch (error) {
      console.error('Error calculating amount0:', error)
      return ''
    }
  }

  const parseSlot0Data = (data: any): Slot0Result => {
    try {
      return {
        sqrtPriceX96: BigInt(data?.sqrtPriceX96?.toString() || '0'),
        tick: Number(data?.tick || 0),
        observationIndex: Number(data?.observationIndex || 0),
        observationCardinality: Number(data?.observationCardinality || 0),
        observationCardinalityNext: Number(data?.observationCardinalityNext || 0),
        feeProtocol: Number(data?.feeProtocol || 0),
        unlocked: Boolean(data?.unlocked)
      }
    } catch (error) {
      console.error('Error parsing slot0 data:', error)
      return {
        sqrtPriceX96: 0n,
        tick: 0,
        observationIndex: 0,
        observationCardinality: 0,
        observationCardinalityNext: 0,
        feeProtocol: 0,
        unlocked: false
      }
    }
  }

  return {
    slot0: slot0Data ? parseSlot0Data(slot0Data) : null,
    liquidity,
    fee,
    isLoading: slot0Loading || liquidityLoading || feeLoading,
    calculateAmount1ForAmount0,
    calculateAmount0ForAmount1
  }
}
