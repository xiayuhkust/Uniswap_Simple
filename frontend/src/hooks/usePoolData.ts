import { useContractRead } from 'wagmi'
import { type Address } from 'viem'
import IUniswapV3Pool from '../abi/IUniswapV3Pool.json'

const DECIMALS = 18
const Q96_SHIFT = 96n
const ZERO_BIGINT = 0n

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
      if (!amount0 || isNaN(Number(amount0))) return ''
      
      const slot0 = slot0Data ? parseSlot0Data(slot0Data) : null
      if (!slot0) return ''
      
      // For empty pools, use 1:1 ratio
      if (slot0.sqrtPriceX96 === 0n) {
        return amount0
      }
      
      // Calculate price using BigInt throughout
      const sqrtPriceX96 = slot0.sqrtPriceX96
      if (sqrtPriceX96 === 0n) return amount0
      
      // Convert amount0 to BigInt with proper decimal precision
      // Convert to BigInt using string operations to avoid floating point precision issues
      const amount0Scaled = amount0.includes('.') 
        ? amount0.padEnd(amount0.indexOf('.') + DECIMALS + 1, '0').replace('.', '')
        : amount0 + '0'.repeat(DECIMALS)
      const amount0BigInt = BigInt(amount0Scaled)
      
      // Calculate price maintaining precision using bit shifting
      const priceX192 = sqrtPriceX96 * sqrtPriceX96
      const price = priceX192 >> Q96_SHIFT
      if (price === ZERO_BIGINT) return amount0
      
      // Calculate result maintaining precision with BigInt operations
      const result = (amount0BigInt * price) >> Q96_SHIFT
      
      // Convert back to decimal string with proper precision
      return (Number(result) / (10 ** DECIMALS)).toString()
    } catch (error) {
      console.error('Error calculating amount1:', error)
      return ''
    }
  }

  const calculateAmount0ForAmount1 = (amount1: string): string => {
    try {
      if (!amount1 || isNaN(Number(amount1))) return ''
      
      const slot0 = slot0Data ? parseSlot0Data(slot0Data) : null
      if (!slot0) return ''
      
      // For empty pools, use 1:1 ratio
      if (slot0.sqrtPriceX96 === 0n) {
        return amount1
      }
      
      // Calculate price using BigInt throughout
      const sqrtPriceX96 = slot0.sqrtPriceX96
      if (sqrtPriceX96 === 0n) return amount1
      
      // Convert amount1 to BigInt with proper decimal precision
      // Convert to BigInt using string operations to avoid floating point precision issues
      const amount1Scaled = amount1.includes('.') 
        ? amount1.padEnd(amount1.indexOf('.') + DECIMALS + 1, '0').replace('.', '')
        : amount1 + '0'.repeat(DECIMALS)
      const amount1BigInt = BigInt(amount1Scaled)
      
      // Calculate price maintaining precision using bit shifting
      const priceX192 = sqrtPriceX96 * sqrtPriceX96
      const price = priceX192 >> Q96_SHIFT
      if (price === ZERO_BIGINT) return amount1
      
      // Calculate result maintaining precision with BigInt operations
      // Shift left first to maintain precision before division
      const result = (amount1BigInt << Q96_SHIFT) / price
      
      // Convert back to decimal string with proper precision
      return (Number(result) / (10 ** DECIMALS)).toString()
    } catch (error) {
      console.error('Error calculating amount0:', error)
      return ''
    }
  }

  const parseSlot0Data = (data: any): Slot0Result => ({
    sqrtPriceX96: data.sqrtPriceX96,
    tick: data.tick,
    observationIndex: data.observationIndex,
    observationCardinality: data.observationCardinality,
    observationCardinalityNext: data.observationCardinalityNext,
    feeProtocol: data.feeProtocol,
    unlocked: data.unlocked
  })

  return {
    slot0: slot0Data ? parseSlot0Data(slot0Data) : null,
    liquidity,
    fee,
    isLoading: slot0Loading || liquidityLoading || feeLoading,
    calculateAmount1ForAmount0,
    calculateAmount0ForAmount1
  }
}
