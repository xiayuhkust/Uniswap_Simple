import { useContractRead } from 'wagmi'
import { parseAbi, type Address } from 'viem'


interface Slot0Result {
  sqrtPriceX96: bigint
  tick: number
  observationIndex: number
  observationCardinality: number
  observationCardinalityNext: number
  feeProtocol: number
  unlocked: boolean
}

interface Slot0Data extends Array<any> {
  [0]: bigint  // sqrtPriceX96
  [1]: number  // tick
  [2]: number  // observationIndex
  [3]: number  // observationCardinality
  [4]: number  // observationCardinalityNext
  [5]: number  // feeProtocol
  [6]: boolean // unlocked
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
    if (!amount0 || isNaN(Number(amount0))) return ''
    
    const slot0 = slot0Data ? parseSlot0Data(slot0Data as Slot0Data) : null
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
    
    const slot0 = slot0Data ? parseSlot0Data(slot0Data as Slot0Data) : null
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

  const parseSlot0Data = (data: Slot0Data): Slot0Result => ({
    sqrtPriceX96: data[0],
    tick: data[1],
    observationIndex: data[2],
    observationCardinality: data[3],
    observationCardinalityNext: data[4],
    feeProtocol: data[5],
    unlocked: data[6]
  })

  return {
    slot0: slot0Data ? parseSlot0Data(slot0Data as Slot0Data) : null,
    liquidity,
    fee,
    isLoading: slot0Loading || liquidityLoading || feeLoading,
    calculateAmount1ForAmount0,
    calculateAmount0ForAmount1
  }
}
