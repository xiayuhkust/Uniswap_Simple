import { useContractWrite, useContractRead, useAccount, Address, erc20ABI } from 'wagmi'
import { useState, useCallback } from 'react'
import { ethers } from 'ethers'
import IUniswapV3Pool from '../abi/IUniswapV3Pool.json'
import IUniswapV3Manager from '../abi/IUniswapV3Manager.json'
import { validateTicks } from '../constants/ticks'
import { CONTRACT_ADDRESSES } from '../constants/addresses'
import { TOKEN_DECIMALS } from '../constants/tokens'
import { INPUT_ERRORS } from '../constants/errors'

// ERC20 ABI for balance checking and allowance
const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    outputs: [{ name: '', type: 'uint256' }]
  }
]

// Using CONTRACT_ADDRESSES.WETH directly

interface AddLiquidityHookReturn {
  checkAndApproveTokens: (amount0: string, amount1: string) => Promise<boolean>
  addLiquidityPosition: (tickLower: number, tickUpper: number, amount0Desired: string, amount1Desired: string) => Promise<{ hash: string }>
  isApproving: boolean
  token0?: Address
  token1?: Address
}

const POOL_ABI = IUniswapV3Pool.abi
const MANAGER_ABI = IUniswapV3Manager.abi

interface AddLiquidityError extends Error {
  code?: string;
  reason?: string;
  data?: any;
}

export function useAddLiquidity(poolAddress: Address): AddLiquidityHookReturn {
  const [isApproving, setIsApproving] = useState(false)

  const { data: token0Data } = useContractRead({
    address: poolAddress,
    abi: POOL_ABI,
    functionName: 'token0',
    enabled: !!poolAddress && poolAddress !== CONTRACT_ADDRESSES.ZERO,
  })
  const token0 = token0Data ? (typeof token0Data === 'string' ? token0Data.toLowerCase() as Address : undefined) : undefined

  const { data: token1Data } = useContractRead({
    address: poolAddress,
    abi: POOL_ABI,
    functionName: 'token1',
    enabled: !!poolAddress && poolAddress !== CONTRACT_ADDRESSES.ZERO,
  })
  const token1 = token1Data ? (typeof token1Data === 'string' ? token1Data.toLowerCase() as Address : undefined) : undefined

  const { address: userAddress } = useAccount()

  const { data: token0AllowanceData } = useContractRead({
    address: token0,
    abi: erc20ABI,
    functionName: 'allowance',
    args: userAddress && token0 ? [userAddress, CONTRACT_ADDRESSES.MANAGER] : undefined,
    enabled: !!token0 && !!userAddress,
  })
  const token0Allowance = token0AllowanceData ? BigInt(token0AllowanceData.toString()) : undefined

  const { data: token1AllowanceData } = useContractRead({
    address: token1,
    abi: erc20ABI,
    functionName: 'allowance',
    args: userAddress && token1 ? [userAddress, CONTRACT_ADDRESSES.MANAGER] : undefined,
    enabled: !!token1 && !!userAddress,
  })
  const token1Allowance = token1AllowanceData ? BigInt(token1AllowanceData.toString()) : undefined

  const { writeAsync: approveToken0 } = useContractWrite({
    address: token0,
    abi: [
      {
        name: 'approve',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'spender', type: 'address' },
          { name: 'amount', type: 'uint256' }
        ],
        outputs: [{ name: '', type: 'bool' }]
      }
    ],
    functionName: 'approve'
  })

  const { writeAsync: approveToken1 } = useContractWrite({
    address: token1,
    abi: [
      {
        name: 'approve',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'spender', type: 'address' },
          { name: 'amount', type: 'uint256' }
        ],
        outputs: [{ name: '', type: 'bool' }]
      }
    ],
    functionName: 'approve'
  })

  const { writeAsync: addLiquidity } = useContractWrite({
    address: CONTRACT_ADDRESSES.MANAGER,
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
    
    setIsApproving(true)
    try {
      const amount0BigInt = ethers.utils.parseUnits(amount0, TOKEN_DECIMALS).toBigInt()
      const amount1BigInt = ethers.utils.parseUnits(amount1, TOKEN_DECIMALS).toBigInt()

      // Log initial token balances
      console.log('Checking token balances before approval:')
      const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_TURA_RPC_URL)
      
      // Get token contracts
      const token0Contract = new ethers.Contract(token0, ERC20_ABI, provider)
      const token1Contract = new ethers.Contract(token1, ERC20_ABI, provider)
      
      // Get initial balances
      const initialBalance0 = await token0Contract.balanceOf(userAddress)
      const initialBalance1 = await token1Contract.balanceOf(userAddress)
      
      console.log(`Initial ${token0} balance: ${ethers.utils.formatUnits(initialBalance0, TOKEN_DECIMALS)}`)
      console.log(`Initial ${token1} balance: ${ethers.utils.formatUnits(initialBalance1, TOKEN_DECIMALS)}`)

      // Check and log allowances
      console.log(`Token0 allowance: ${token0Allowance ? ethers.utils.formatUnits(token0Allowance, TOKEN_DECIMALS) : '0'}`)
      console.log(`Token1 allowance: ${token1Allowance ? ethers.utils.formatUnits(token1Allowance, TOKEN_DECIMALS) : '0'}`)
      
      // Process approvals sequentially, following the official implementation
      // First approve token0 if needed
      if (!token0Allowance || token0Allowance < amount0BigInt) {
        console.log(`Approving ${token0} for ${ethers.utils.formatUnits(amount0BigInt, TOKEN_DECIMALS)} tokens`)
        const tx0 = await approveToken0({
          args: [CONTRACT_ADDRESSES.MANAGER, ethers.constants.MaxUint256]
        })
        console.log(`Token0 approval transaction submitted: ${tx0.hash}`)
        
        // Wait for transaction to be confirmed
        console.log('Waiting for token0 approval transaction to be confirmed...')
        // For wagmi v1, we need to use the provider to wait for the transaction
        const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_TURA_RPC_URL)
        const receipt0 = await provider.waitForTransaction(tx0.hash)
        console.log('Token0 approval transaction confirmed:', receipt0.transactionHash)
      } else {
        console.log(`Token0 already has sufficient allowance: ${ethers.utils.formatUnits(token0Allowance, TOKEN_DECIMALS)}`)
      }
      
      // Then approve token1 if needed
      if (!token1Allowance || token1Allowance < amount1BigInt) {
        console.log(`Approving ${token1} for ${ethers.utils.formatUnits(amount1BigInt, TOKEN_DECIMALS)} tokens`)
        const tx1 = await approveToken1({
          args: [CONTRACT_ADDRESSES.MANAGER, ethers.constants.MaxUint256]
        })
        console.log(`Token1 approval transaction submitted: ${tx1.hash}`)
        
        // Wait for transaction to be confirmed
        console.log('Waiting for token1 approval transaction to be confirmed...')
        // For wagmi v1, we need to use the provider to wait for the transaction
        const provider1 = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_TURA_RPC_URL)
        const receipt1 = await provider1.waitForTransaction(tx1.hash)
        console.log('Token1 approval transaction confirmed:', receipt1.transactionHash)
      } else {
        console.log(`Token1 already has sufficient allowance: ${ethers.utils.formatUnits(token1Allowance, TOKEN_DECIMALS)}`)
      }
      
      // Get updated allowances after approvals
      const token0Contract2 = new ethers.Contract(token0, erc20ABI, provider)
      const token1Contract2 = new ethers.Contract(token1, erc20ABI, provider)
      
      const updatedAllowance0 = await token0Contract2.allowance(userAddress, CONTRACT_ADDRESSES.MANAGER)
      const updatedAllowance1 = await token1Contract2.allowance(userAddress, CONTRACT_ADDRESSES.MANAGER)
      
      console.log(`Updated token0 allowance: ${ethers.utils.formatUnits(updatedAllowance0, TOKEN_DECIMALS)}`)
      console.log(`Updated token1 allowance: ${ethers.utils.formatUnits(updatedAllowance1, TOKEN_DECIMALS)}`)

      return true
    } catch (error) {
      const err = error as AddLiquidityError
      console.error('Error approving tokens:', error)
      
      if (err.code === 'INSUFFICIENT_FUNDS') {
        throw new Error('Insufficient funds for token approval')
      } else if (err.reason?.includes('ERC20: transfer amount exceeds balance')) {
        throw new Error('Insufficient token balance')
      } else if (err.reason?.includes('ERC20: transfer amount exceeds allowance')) {
        throw new Error('Insufficient token allowance')
      } else if (err.reason?.includes('execution reverted')) {
        throw new Error(`Transaction reverted: ${err.reason}`)
      } else if (err.message?.includes('user rejected transaction')) {
        throw new Error('Transaction rejected by user')
      } else {
        throw new Error(INPUT_ERRORS.APPROVAL_FAILED)
      }
    } finally {
      setIsApproving(false)
    }
  }, [token0, token1, token0Allowance, token1Allowance, approveToken0, approveToken1, userAddress, setIsApproving])

  const { data: poolFeeData } = useContractRead({
    address: poolAddress,
    abi: POOL_ABI,
    functionName: 'fee',
    enabled: !!poolAddress && poolAddress !== CONTRACT_ADDRESSES.ZERO
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
    if (!userAddress) throw new Error('Wallet not connected')
    
    // Declare these variables at a higher scope so they're available throughout the function
    let amount0BigInt: bigint = 0n;
    let amount1BigInt: bigint = 0n;
    
    try {
      amount0BigInt = ethers.utils.parseUnits(amount0Desired, 18).toBigInt()
      amount1BigInt = ethers.utils.parseUnits(amount1Desired, 18).toBigInt()

      // Log token balances before mint
      console.log('Checking token balances before mint:')
      const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_TURA_RPC_URL)
      
      // Get token contracts
      const token0Contract = new ethers.Contract(token0, ERC20_ABI, provider)
      const token1Contract = new ethers.Contract(token1, ERC20_ABI, provider)
      
      // Get balances before mint
      const balanceBefore0 = await token0Contract.balanceOf(userAddress)
      const balanceBefore1 = await token1Contract.balanceOf(userAddress)
      
      console.log(`Balance before mint for ${token0}: ${ethers.utils.formatUnits(balanceBefore0, TOKEN_DECIMALS)}`)
      console.log(`Balance before mint for ${token1}: ${ethers.utils.formatUnits(balanceBefore1, TOKEN_DECIMALS)}`)
      
      // Verify token allowances before mint
      const token0Contract2 = new ethers.Contract(token0, erc20ABI, provider)
      const token1Contract2 = new ethers.Contract(token1, erc20ABI, provider)
      
      const currentAllowance0 = await token0Contract2.allowance(userAddress, CONTRACT_ADDRESSES.MANAGER)
      const currentAllowance1 = await token1Contract2.allowance(userAddress, CONTRACT_ADDRESSES.MANAGER)
      
      console.log(`Current token0 allowance: ${ethers.utils.formatUnits(currentAllowance0, TOKEN_DECIMALS)}`)
      console.log(`Current token1 allowance: ${ethers.utils.formatUnits(currentAllowance1, TOKEN_DECIMALS)}`)
      
      // Check if allowances are sufficient
      if (currentAllowance0.lt(amount0BigInt)) {
        throw new Error(`Insufficient token0 allowance: ${ethers.utils.formatUnits(currentAllowance0, TOKEN_DECIMALS)} < ${ethers.utils.formatUnits(amount0BigInt, TOKEN_DECIMALS)}`)
      }
      
      if (currentAllowance1.lt(amount1BigInt)) {
        throw new Error(`Insufficient token1 allowance: ${ethers.utils.formatUnits(currentAllowance1, TOKEN_DECIMALS)} < ${ethers.utils.formatUnits(amount1BigInt, TOKEN_DECIMALS)}`)
      }

      // Create MintParams according to IUniswapV3Manager interface
      if (!token0 || !token1) throw new Error('Tokens not loaded')
      
      // Log contract addresses for debugging
      console.log('Contract addresses:', {
        manager: CONTRACT_ADDRESSES.MANAGER,
        factory: CONTRACT_ADDRESSES.FACTORY,
        pool: poolAddress,
        token0: token0,
        token1: token1
      })
      
      // Format the parameters as a struct object to match the expected contract ABI
      const mintParams = {
        tokenA: token0,
        tokenB: token1,
        fee: Number(poolFee),
        lowerTick: tickLower,
        upperTick: tickUpper,
        amount0Desired: amount0BigInt,
        amount1Desired: amount1BigInt,
        amount0Min: 0n,
        amount1Min: 0n
      }

      console.log('Adding liquidity with params:', JSON.stringify({
        tokenA: mintParams.tokenA,
        tokenB: mintParams.tokenB,
        fee: mintParams.fee,
        lowerTick: mintParams.lowerTick,
        upperTick: mintParams.upperTick,
        amount0Desired: mintParams.amount0Desired.toString(),
        amount1Desired: mintParams.amount1Desired.toString(),
        amount0Min: mintParams.amount0Min.toString(),
        amount1Min: mintParams.amount1Min.toString()
      }))

      // Implement retry mechanism with exponential backoff
      let attempt = 0;
      const maxAttempts = 3;
      let lastError;
      
      while (attempt < maxAttempts) {
        try {
          console.log(`Mint attempt ${attempt + 1} of ${maxAttempts}`);
          
          const tx = await addLiquidity({
            args: [mintParams],
          });
          
          console.log('Liquidity addition transaction submitted:', tx.hash);
          
          // Wait for transaction to be confirmed
          console.log('Waiting for liquidity addition transaction to be confirmed...');
          const mintProvider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_TURA_RPC_URL);
          const mintReceipt = await mintProvider.waitForTransaction(tx.hash);
          console.log('Liquidity addition transaction confirmed:', mintReceipt.transactionHash);
          console.log('Transaction receipt:', {
            status: mintReceipt.status,
            blockNumber: mintReceipt.blockNumber,
            gasUsed: mintReceipt.gasUsed.toString(),
            logs: mintReceipt.logs.map(log => ({
              address: log.address,
              topics: log.topics,
              data: log.data
            }))
          });
          
          // Log token balances after mint
          console.log('Checking token balances after mint:')
          
          // Get balances after mint
          const balanceAfter0 = await token0Contract.balanceOf(userAddress)
          const balanceAfter1 = await token1Contract.balanceOf(userAddress)
          
          console.log(`Balance after mint for ${token0}: ${ethers.utils.formatUnits(balanceAfter0, TOKEN_DECIMALS)}`)
          console.log(`Balance after mint for ${token1}: ${ethers.utils.formatUnits(balanceAfter1, TOKEN_DECIMALS)}`)
          
          // Calculate and log the difference
          const diff0 = balanceBefore0.sub(balanceAfter0)
          const diff1 = balanceBefore1.sub(balanceAfter1)
          
          console.log(`Tokens deducted for ${token0}: ${ethers.utils.formatUnits(diff0, TOKEN_DECIMALS)}`)
          console.log(`Tokens deducted for ${token1}: ${ethers.utils.formatUnits(diff1, TOKEN_DECIMALS)}`)
          
          // If we get here, the transaction was successful
          return tx;
        } catch (error) {
          lastError = error;
          console.error(`Mint attempt ${attempt + 1} failed:`, error);
          
          // Exponential backoff
          const backoffTime = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
          console.log(`Retrying in ${backoffTime / 1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
          
          attempt++;
        }
      }
      
      // If we get here, all attempts failed
      throw lastError;
      
      // Note: The code below is unreachable after throwing lastError
      // It should be moved inside the try block of the while loop before returning tx
      // This is a logical error in the code structure
    } catch (error) {
      const err = error as AddLiquidityError
      console.error('Error adding liquidity:', error)
      
      // Log detailed error information
      console.error('Error details:', {
        code: err.code,
        reason: err.reason,
        message: err.message,
        data: err.data,
        stack: err.stack
      })
      
      // Log mint parameters for debugging
      console.error('Mint parameters:', JSON.stringify({
        tokenA: token0,
        tokenB: token1,
        fee: Number(poolFee),
        lowerTick: tickLower,
        upperTick: tickUpper,
        amount0Desired: amount0BigInt ? amount0BigInt.toString() : '0',
        amount1Desired: amount1BigInt ? amount1BigInt.toString() : '0',
        amount0Min: '0',
        amount1Min: '0'
      }))
      
      if (err.code === '0x10074548') {
        throw new Error('Invalid tick range: Must be between MIN_TICK (-887220) and MAX_TICK (887220)')
      } else if (err.code === 'INSUFFICIENT_FUNDS') {
        throw new Error('Insufficient funds to add liquidity')
      } else if (err.reason?.includes('amount exceeds balance')) {
        throw new Error('Token amount exceeds balance')
      } else if (err.reason?.includes('Price slippage check')) {
        throw new Error('Price slippage too high')
      } else if (err.reason?.includes('L')) {
        throw new Error('Liquidity amount must be greater than 0')
      } else if (err.reason?.includes('execution reverted')) {
        throw new Error(`Transaction reverted: ${err.reason}`)
      } else if (err.message?.includes('user rejected transaction')) {
        throw new Error('Transaction rejected by user')
      } else {
        console.error('Error details:', err)
        throw new Error('Failed to add liquidity: ' + (err.reason || err.message))
      }
    }
  }, [poolAddress, addLiquidity, token0, token1, poolFee, userAddress])

  return {
    checkAndApproveTokens,
    addLiquidityPosition,
    isApproving,
    token0,
    token1
  } as const
}
