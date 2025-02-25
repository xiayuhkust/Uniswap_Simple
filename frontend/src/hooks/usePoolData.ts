import { useContractRead } from 'wagmi'
import { type Address } from 'viem'
import IUniswapV3Pool from '../abi/IUniswapV3Pool.json'

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
    if (!amount0 || isNaN(Number(amount0))) return ''
    
    const slot0 = slot0Data ? parseSlot0Data(slot0Data) : null
    if (!slot0) return ''
    
    // For empty pools, use 1:1 ratio
    if (slot0.sqrtPriceX96 === 0n) {
      return amount0
    }
    
    // Calculate price from sqrtPriceX96 using Q64.96 format
    const sqrtPriceX96 = slot0.sqrtPriceX96
    if (sqrtPriceX96 === 0n) return amount0
    const price = Number(sqrtPriceX96 * sqrtPriceX96) / (2 ** 192)
    return (Number(amount0) * price).toString()
  }

  const calculateAmount0ForAmount1 = (amount1: string): string => {
    if (!amount1 || isNaN(Number(amount1))) return ''
    
    const slot0 = slot0Data ? parseSlot0Data(slot0Data) : null
    if (!slot0) return ''
    
    // For empty pools, use 1:1 ratio
    if (slot0.sqrtPriceX96 === 0n) {
      return amount1
    }
    
    // Calculate price from sqrtPriceX96 using Q64.96 format
    const sqrtPriceX96 = slot0.sqrtPriceX96
    const price = Number(sqrtPriceX96 * sqrtPriceX96) / (2 ** 192)
    return (Number(amount1) / price).toString()
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
