import { useContractWrite, Address } from 'wagmi'
import { useCallback } from 'react'
import IUniswapV3Manager from '../abi/IUniswapV3Manager.json'
import { MANAGER_ADDRESS } from '../utils/contracts'

interface RemoveLiquidityParams {
  tokenA: Address
  tokenB: Address
  fee: number
  lowerTick: number
  upperTick: number
  liquidity: bigint
  amount0Min: bigint
  amount1Min: bigint
  deadline: bigint
}

export function useRemoveLiquidity(poolAddress: Address) {
  const { writeAsync: removeLiquidity } = useContractWrite({
    address: MANAGER_ADDRESS,
    abi: IUniswapV3Manager.abi,
    functionName: 'burn'
  })

  const removeLiquidityPosition = useCallback(async (
    tickLower: number,
    tickUpper: number,
    liquidity: bigint
  ) => {
    if (!poolAddress) throw new Error('Pool address not provided')
    
    try {
      // Add 20 minutes deadline
      const deadline = BigInt(Math.trunc(Date.now() / 1000) + 1200)

      const burnParams: RemoveLiquidityParams = {
        tokenA: '0x0000000000000000000000000000000000000000' as Address, // Will be filled by contract
        tokenB: '0x0000000000000000000000000000000000000000' as Address, // Will be filled by contract
        fee: 0, // Will be filled by contract
        lowerTick: tickLower,
        upperTick: tickUpper,
        liquidity: liquidity,
        amount0Min: 0n,
        amount1Min: 0n,
        deadline
      }

      const tx = await removeLiquidity({
        args: [burnParams],
      })

      return tx
    } catch (error) {
      console.error('Error removing liquidity:', error)
      throw new Error('Failed to remove liquidity: ' + (error as Error).message)
    }
  }, [poolAddress, removeLiquidity])

  return {
    removeLiquidityPosition
  }
}
