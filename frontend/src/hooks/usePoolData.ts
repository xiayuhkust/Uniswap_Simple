import { useContractRead } from 'wagmi'
import { parseAbi, type Address } from 'viem'
import { POOL_ABI } from '../constants/abis'

interface Slot0 {
  sqrtPriceX96: bigint
  tick: number
  observationIndex: number
  observationCardinality: number
  observationCardinalityNext: number
  feeProtocol: number
  unlocked: boolean
}

const POOL_INTERFACE = parseAbi([
  'function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)',
  'function liquidity() external view returns (uint128)',
  'function fee() external view returns (uint24)',
  'function token0() external view returns (address)',
  'function token1() external view returns (address)'
])

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
    if (!slot0Data || !amount0 || isNaN(Number(amount0))) return ''
    
    const slot0 = slot0Data as unknown as Slot0
    
    // Convert amount0 to BigInt with 18 decimals
    const amount0BigInt = BigInt(Math.floor(Number(amount0) * 1e18))
    
    // Calculate amount1 using the square root price
    // amount1 = amount0 * sqrtPrice^2 / 2^192
    const sqrtPriceSquared = slot0.sqrtPriceX96 * slot0.sqrtPriceX96
    const amount1BigInt = (amount0BigInt * BigInt(sqrtPriceSquared)) >> 192n
    
    // Convert back to decimal string
    return (Number(amount1BigInt) / 1e18).toString()
  }

  const calculateAmount0ForAmount1 = (amount1: string): string => {
    if (!slot0Data || !amount1 || isNaN(Number(amount1))) return ''
    
    const slot0 = slot0Data as unknown as Slot0
    
    // Convert amount1 to BigInt with 18 decimals
    const amount1BigInt = BigInt(Math.floor(Number(amount1) * 1e18))
    
    // Calculate amount0 using the square root price
    // amount0 = amount1 * 2^192 / sqrtPrice^2
    const sqrtPriceSquared = slot0.sqrtPriceX96 * slot0.sqrtPriceX96
    const amount0BigInt = (amount1BigInt << 192n) / BigInt(sqrtPriceSquared)
    
    // Convert back to decimal string
    return (Number(amount0BigInt) / 1e18).toString()
  }

  return {
    slot0: slot0Data as unknown as Slot0,
    liquidity,
    fee,
    isLoading: slot0Loading || liquidityLoading || feeLoading,
    calculateAmount1ForAmount0,
    calculateAmount0ForAmount1
  }
}
