import { useContractWrite, useContractRead, Address, erc20ABI } from 'wagmi'
import { useState, useCallback } from 'react'
import { parseUnits } from 'viem'
import IUniswapV3Pool from '../abi/IUniswapV3Pool.json'
import IUniswapV3Manager from '../abi/IUniswapV3Manager.json'
import { validateTicks } from '../constants/ticks'
import { MANAGER_ADDRESS } from '../utils/contracts'

interface MintParams {
  tokenA: Address
  tokenB: Address
  fee: number
  lowerTick: number
  upperTick: number
  amount0Desired: bigint
  amount1Desired: bigint
  amount0Min: bigint
  amount1Min: bigint
  deadline: bigint
}

interface AddLiquidityHookReturn {
  checkAndApproveTokens: (amount0: string, amount1: string) => Promise<boolean>
  addLiquidityPosition: (tickLower: number, tickUpper: number, amount0Desired: string, amount1Desired: string) => Promise<any>
  isApproving: boolean
  token0?: Address
  token1?: Address
}

const POOL_ABI = IUniswapV3Pool.abi
const MANAGER_ABI = IUniswapV3Manager.abi

interface AddLiquidityError extends Error {
  code?: string;
  reason?: string;
}

export function useAddLiquidity(poolAddress: Address): AddLiquidityHookReturn {
  const [isApproving, setIsApproving] = useState(false)

  const { data: token0Data } = useContractRead({
    address: poolAddress,
    abi: POOL_ABI,
    functionName: 'token0',
    enabled: !!poolAddress,
  })
  const token0 = token0Data as Address | undefined

  const { data: token1Data } = useContractRead({
    address: poolAddress,
    abi: POOL_ABI,
    functionName: 'token1',
    enabled: !!poolAddress,
  })
  const token1 = token1Data as Address | undefined

  const { data: token0AllowanceData } = useContractRead({
    address: token0 as Address,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [poolAddress, MANAGER_ADDRESS],
    enabled: !!token0 && !!poolAddress,
  })
  const token0Allowance = token0AllowanceData as bigint | undefined

  const { data: token1AllowanceData } = useContractRead({
    address: token1 as Address,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [poolAddress, MANAGER_ADDRESS],
    enabled: !!token1 && !!poolAddress,
  })
  const token1Allowance = token1AllowanceData as bigint | undefined

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
    functionName: 'mint'
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
  }, [token0, token1, token0Allowance, token1Allowance, approveToken0, approveToken1, setIsApproving])

  const { data: poolFeeData } = useContractRead({
    address: poolAddress,
    abi: POOL_ABI,
    functionName: 'fee',
    enabled: !!poolAddress
  })
  const poolFee = poolFeeData as number | undefined

  const addLiquidityPosition = useCallback(async (
    tickLower: number,
    tickUpper: number,
    amount0Desired: string,
    amount1Desired: string
  ) => {
    if (!poolAddress) throw new Error('Pool address not provided')
    if (!token0 || !token1) throw new Error('Tokens not loaded')
    if (!validateTicks(tickLower, tickUpper)) throw new Error('Invalid tick range')
    if (!poolFee) throw new Error('Could not get pool fee')
    
    try {
      const amount0BigInt = parseUnits(amount0Desired, 18)
      const amount1BigInt = parseUnits(amount1Desired, 18)

      // Create MintParams according to IUniswapV3Manager interface
      // Add 20 minutes deadline
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 1200)

      const mintParams: MintParams = {
        tokenA: token0 as Address,
        tokenB: token1 as Address,
        fee: Number(poolFee),
        lowerTick: tickLower,
        upperTick: tickUpper,
        amount0Desired: amount0BigInt,
        amount1Desired: amount1BigInt,
        amount0Min: 0n,
        amount1Min: 0n,
        deadline
      }

      const tx = await addLiquidity({
        args: [mintParams],
      })

      return tx
    } catch (error) {
      const err = error as AddLiquidityError
      console.error('Error adding liquidity:', error)
      
      if (err.code === 'INSUFFICIENT_FUNDS') {
        throw new Error('Insufficient funds to add liquidity')
      } else if (err.reason?.includes('amount exceeds balance')) {
        throw new Error('Token amount exceeds balance')
      } else if (err.reason?.includes('Invalid tick range')) {
        throw new Error('Invalid tick range provided')
      } else if (err.reason?.includes('Price slippage check')) {
        throw new Error('Price slippage too high')
      } else if (err.reason?.includes('L')) {
        throw new Error('Liquidity amount must be greater than 0')
      } else {
        throw new Error('Failed to add liquidity: ' + (err.reason || err.message))
      }
    }
  }, [poolAddress, addLiquidity, token0, token1, poolFee, validateTicks])

  return {
    checkAndApproveTokens,
    addLiquidityPosition,
    isApproving,
    token0,
    token1
  } as const
}
