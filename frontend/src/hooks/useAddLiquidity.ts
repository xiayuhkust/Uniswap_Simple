import { useContractWrite, useContractRead, useAccount, Address, erc20ABI } from 'wagmi'
import { useState, useCallback } from 'react'
import { parseUnits } from 'viem'
import IUniswapV3Pool from '../abi/IUniswapV3Pool.json'
import IUniswapV3Manager from '../abi/IUniswapV3Manager.json'
import { validateTicks } from '../constants/ticks'
import { MANAGER_ADDRESS } from '../utils/contracts'
import { WTURA_ADDRESS, TOKEN_DECIMALS } from '../constants/tokens'
import { INPUT_ERRORS } from '../constants/errors'

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
  const token0 = token0Data ? (typeof token0Data === 'string' ? token0Data.toLowerCase() as Address : undefined) : undefined

  const { data: token1Data } = useContractRead({
    address: poolAddress,
    abi: POOL_ABI,
    functionName: 'token1',
    enabled: !!poolAddress,
  })
  const token1 = token1Data ? (typeof token1Data === 'string' ? token1Data.toLowerCase() as Address : undefined) : undefined

  const { address: userAddress } = useAccount()

  const { data: token0AllowanceData } = useContractRead({
    address: token0,
    abi: erc20ABI,
    functionName: 'allowance',
    args: userAddress && token0 ? [userAddress, MANAGER_ADDRESS] : undefined,
    enabled: !!token0 && !!userAddress,
  })
  const token0Allowance = token0AllowanceData ? BigInt(token0AllowanceData.toString()) : undefined

  const { data: token1AllowanceData } = useContractRead({
    address: token1,
    abi: erc20ABI,
    functionName: 'allowance',
    args: userAddress && token1 ? [userAddress, MANAGER_ADDRESS] : undefined,
    enabled: !!token1 && !!userAddress,
  })
  const token1Allowance = token1AllowanceData ? BigInt(token1AllowanceData.toString()) : undefined

  const { writeAsync: approveToken0 } = useContractWrite({
    address: token0,
    abi: erc20ABI,
    functionName: 'approve'
  })

  const { writeAsync: approveToken1 } = useContractWrite({
    address: token1,
    abi: erc20ABI,
    functionName: 'approve'
  })

  const { writeAsync: addLiquidity } = useContractWrite({
    address: MANAGER_ADDRESS,
    abi: MANAGER_ABI,
    functionName: 'mint'
  })

  const checkAndApproveTokens = useCallback(async (amount0: string, amount1: string) => {
    if (!token0 || !token1) {
      throw new Error(INPUT_ERRORS.NO_TOKENS)
    }
    if (!userAddress) {
      throw new Error(INPUT_ERRORS.WALLET_NOT_CONNECTED)
    }
    if (token0 === WTURA_ADDRESS || token1 === WTURA_ADDRESS) {
      throw new Error(INPUT_ERRORS.WRAP_TURA)
    }
    
    setIsApproving(true)
    try {
      const amount0BigInt = parseUnits(amount0, TOKEN_DECIMALS)
      const amount1BigInt = parseUnits(amount1, TOKEN_DECIMALS)

      if (!token0Allowance || token0Allowance < amount0BigInt) {
        await approveToken0({
          args: [MANAGER_ADDRESS, (2n ** 256n) - 1n],
        })
      }

      if (!token1Allowance || token1Allowance < amount1BigInt) {
        await approveToken1({
          args: [MANAGER_ADDRESS, (2n ** 256n) - 1n],
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
        throw new Error(INPUT_ERRORS.APPROVAL_FAILED)
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
  const poolFee = poolFeeData ? Number(poolFeeData) : undefined

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
      const deadline = BigInt(Math.trunc(Date.now() / 1000) + 1200)

      if (!token0 || !token1) throw new Error('Tokens not loaded')
      
      const mintParams: MintParams = {
        tokenA: token0,
        tokenB: token1,
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
