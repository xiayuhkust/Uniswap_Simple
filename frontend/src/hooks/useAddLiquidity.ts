import { useContractWrite, useContractRead, Address, erc20ABI } from 'wagmi'
import { POOL_ABI } from '../constants/abis'
import { useState, useCallback } from 'react'
import { parseUnits } from 'viem'

const MANAGER_ABI = [
  'function mint(address pool, int24 tickLower, int24 tickUpper, uint128 amount0Desired, uint128 amount1Desired, uint256 deadline) external returns (uint256 amount0, uint256 amount1, uint256 liquidity)',
]

interface AddLiquidityError extends Error {
  code?: string;
  reason?: string;
}

const MANAGER_ADDRESS = '0x0F6eF7a8d06f1Bb4f5a5B22f0dC5B8A4B5Aa68A6'

export function useAddLiquidity(poolAddress: Address) {
  const [isApproving, setIsApproving] = useState(false)

  const { data: token0 } = useContractRead({
    address: poolAddress,
    abi: POOL_ABI,
    functionName: 'token0',
    enabled: !!poolAddress,
  })

  const { data: token1 } = useContractRead({
    address: poolAddress,
    abi: POOL_ABI,
    functionName: 'token1',
    enabled: !!poolAddress,
  })

  const { data: token0Allowance } = useContractRead({
    address: token0 as Address,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [poolAddress, MANAGER_ADDRESS],
    enabled: !!token0 && !!poolAddress,
  })

  const { data: token1Allowance } = useContractRead({
    address: token1 as Address,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [poolAddress, MANAGER_ADDRESS],
    enabled: !!token1 && !!poolAddress,
  })

  const { writeAsync: approveToken0 } = useContractWrite({
    address: token0 as Address,
    abi: erc20ABI,
    functionName: 'approve',
  })

  const { writeAsync: approveToken1 } = useContractWrite({
    address: token1 as Address,
    abi: erc20ABI,
    functionName: 'approve',
  })

  const { writeAsync: addLiquidity } = useContractWrite({
    address: MANAGER_ADDRESS,
    abi: MANAGER_ABI,
    functionName: 'mint',
  })

  const checkAndApproveTokens = useCallback(async (amount0: string, amount1: string) => {
    if (!token0 || !token1) return false
    
    setIsApproving(true)
    try {
      const amount0BigInt = parseUnits(amount0, 18)
      const amount1BigInt = parseUnits(amount1, 18)

      if (!token0Allowance || token0Allowance < amount0BigInt) {
        await approveToken0({
          args: [MANAGER_ADDRESS, BigInt(2) ** BigInt(256) - BigInt(1)],
        })
      }

      if (!token1Allowance || token1Allowance < amount1BigInt) {
        await approveToken1({
          args: [MANAGER_ADDRESS, BigInt(2) ** BigInt(256) - BigInt(1)],
        })
      }

      return true
    } catch (error) {
      const err = error as AddLiquidityError
      if (err.code === 'INSUFFICIENT_FUNDS') {
        throw new Error('Insufficient funds for token approval')
      } else if (err.reason?.includes('ERC20: transfer amount exceeds balance')) {
        throw new Error('Insufficient token balance')
      } else if (err.reason?.includes('ERC20: transfer amount exceeds allowance')) {
        throw new Error('Insufficient token allowance')
      } else {
        console.error('Error approving tokens:', error)
        throw new Error('Failed to approve tokens')
      }
    } finally {
      setIsApproving(false)
    }
  }

  const { writeAsync: addLiquidity } = useContractWrite({
    address: MANAGER_ADDRESS,
    abi: MANAGER_ABI,
    functionName: 'mint',
  })

  const addLiquidityPosition = useCallback(async (
    tickLower: number,
    tickUpper: number,
    amount0Desired: string,
    amount1Desired: string
  ) => {
    if (!poolAddress) throw new Error('Pool address not provided')
    
    try {
      const amount0BigInt = parseUnits(amount0Desired, 18)
      const amount1BigInt = parseUnits(amount1Desired, 18)
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20) // 20 minutes from now

      const tx = await addLiquidity({
        args: [
          poolAddress,
          tickLower,
          tickUpper,
          amount0BigInt,
          amount1BigInt,
          deadline
        ],
      })

      return tx
    } catch (error) {
      const err = error as AddLiquidityError
      if (err.code === 'INSUFFICIENT_FUNDS') {
        throw new Error('Insufficient funds to add liquidity')
      } else if (err.reason?.includes('amount exceeds balance')) {
        throw new Error('Token amount exceeds balance')
      } else {
        console.error('Error adding liquidity:', error)
        throw new Error('Failed to add liquidity')
      }
    }
  }, [poolAddress, addLiquidity])

  return {
    checkAndApproveTokens,
    addLiquidityPosition,
    isApproving,
    token0,
    token1
  }
}
