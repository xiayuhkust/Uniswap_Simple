import { useState, useEffect, useCallback } from 'react'
import { VStack, Button, Box, Text, useToast } from '@chakra-ui/react'
import { useAccount, useContractWrite, usePrepareContractWrite, useContractRead, useWaitForTransaction } from 'wagmi'
import type { Address } from 'wagmi'
import { ethers } from 'ethers'

import { TokenSelect } from '../components/TokenSelect'
import { TickRangeInput } from '../components/TickRangeInput'

import { CONTRACT_ADDRESSES } from '../constants/addresses'
import { MIN_TICK, MAX_TICK } from '../constants/ticks'
import { useGetPool, useCreatePool, FEES, sortTokens, FACTORY_ABI, MANAGER_ABI } from '../utils/contracts'
import { isValidAmount } from '../utils/validation'
import { INPUT_ERRORS } from '../constants/errors'

import type { Token } from '../types/token'


export function CreatePoolPage() {
  const [token0, setToken0] = useState<Token>()
  const [token1, setToken1] = useState<Token>()
  const [token0Amount, setToken0Amount] = useState('')
  const [token1Amount, setToken1Amount] = useState('')
  const [fee, setFee] = useState<string>('')
  const [lowerTick, setLowerTick] = useState(MIN_TICK)
  const [upperTick, setUpperTick] = useState(MAX_TICK)
  // We need to track the pool address for adding liquidity
  const [isCreatingPool, setIsCreatingPool] = useState(false)
  const [isAddingLiquidity, setIsAddingLiquidity] = useState(false)
  const toast = useToast()
  const { isConnected } = useAccount()

  const feeValue = fee === '0.05%' ? FEES.LOWEST : fee === '0.3%' ? FEES.MEDIUM : FEES.MEDIUM
  const { data: existingPool } = useGetPool(
    token0?.address as Address,
    token1?.address as Address,
    feeValue
  )

  const { write: createPool, isSuccess: isCreatePoolSuccess, isError: isCreatePoolError, data: createPoolData } = useCreatePool({
    onSuccess: (data: { hash: string }) => {
      console.log('Pool creation transaction submitted:', data.hash);
      toast({
        title: "Transaction Submitted",
        description: `Pool creation transaction submitted. Waiting for confirmation...`,
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (error: Error) => {
      console.error('Pool creation error:', error);
    }
  })

  // Function to get pool address from factory using wagmi hooks
  const { data: poolAddressData } = useContractRead({
    address: CONTRACT_ADDRESSES.FACTORY,
    abi: FACTORY_ABI,
    functionName: 'getPool',
    args: token0?.address && token1?.address ? [
      token0.address as Address,
      token1.address as Address,
      feeValue
    ] : undefined,
    enabled: !!token0?.address && !!token1?.address
  });

  // Function to get pool address from factory
  const getPoolAddress = useCallback(async (token0Address: Address, token1Address: Address, fee: number): Promise<Address> => {
    try {
      console.log(`Getting pool address for tokens ${token0Address}, ${token1Address} with fee ${fee}`);
      
      // Use the poolAddressData if available, otherwise make a direct call
      if (poolAddressData && token0Address === token0?.address && token1Address === token1?.address && fee === feeValue) {
        console.log('Using cached pool address:', poolAddressData);
        return poolAddressData as Address;
      }
      
      // Fallback to direct contract call using JsonRpcProvider
      const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_TURA_RPC_URL);
      const factoryContract = new ethers.Contract(
        CONTRACT_ADDRESSES.FACTORY,
        FACTORY_ABI,
        provider
      );
      
      const poolAddress = await factoryContract.getPool(token0Address, token1Address, fee);
      console.log('Pool address from factory:', poolAddress);
      return poolAddress;
    } catch (error) {
      console.error('Error getting pool address:', error);
      throw error;
    }
  }, [poolAddressData, token0, token1, feeValue]);

  // Token0 approval
  const { config: approveToken0Config } = usePrepareContractWrite({
    address: token0?.address as Address,
    abi: ['function approve(address spender, uint256 amount) returns (bool)'],
    functionName: 'approve',
    args: [CONTRACT_ADDRESSES.MANAGER, ethers.constants.MaxUint256],
    enabled: !!token0?.address
  });
  
  const { 
    write: approveToken0, 
    data: approveToken0Data,
    isLoading: isApproveToken0Loading
  } = useContractWrite(approveToken0Config);
  
  const { isLoading: isApproveToken0Confirming } = useWaitForTransaction({
    hash: approveToken0Data?.hash,
    onSuccess: () => {
      console.log('Token0 approval confirmed');
      toast({
        title: "Token Approved",
        description: `${token0?.symbol} approved successfully`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (error) => {
      console.error('Token0 approval error:', error);
      toast({
        title: "Error",
        description: `Error approving ${token0?.symbol}: ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  });
  
  // Token1 approval
  const { config: approveToken1Config } = usePrepareContractWrite({
    address: token1?.address as Address,
    abi: ['function approve(address spender, uint256 amount) returns (bool)'],
    functionName: 'approve',
    args: [CONTRACT_ADDRESSES.MANAGER, ethers.constants.MaxUint256],
    enabled: !!token1?.address
  });
  
  const { 
    write: approveToken1, 
    data: approveToken1Data,
    isLoading: isApproveToken1Loading
  } = useContractWrite(approveToken1Config);
  
  const { isLoading: isApproveToken1Confirming } = useWaitForTransaction({
    hash: approveToken1Data?.hash,
    onSuccess: () => {
      console.log('Token1 approval confirmed');
      toast({
        title: "Token Approved",
        description: `${token1?.symbol} approved successfully`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (error) => {
      console.error('Token1 approval error:', error);
      toast({
        title: "Error",
        description: `Error approving ${token1?.symbol}: ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  });
  
  // Add liquidity
  const { config: addLiquidityConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESSES.MANAGER,
    abi: MANAGER_ABI,
    functionName: 'mint',
    args: [
      {
        tokenA: token0?.address,
        tokenB: token1?.address,
        fee: feeValue,
        lowerTick,
        upperTick,
        amount0Desired: token0Amount ? ethers.utils.parseUnits(token0Amount, 18) : 0,
        amount1Desired: token1Amount ? ethers.utils.parseUnits(token1Amount, 18) : 0,
        amount0Min: 0,
        amount1Min: 0
      }
    ],
    enabled: !!token0?.address && !!token1?.address && !!poolAddressData && 
             poolAddressData !== CONTRACT_ADDRESSES.ZERO && 
             isValidAmount(token0Amount) && isValidAmount(token1Amount)
  });
  
  const { 
    write: addLiquidity, 
    data: addLiquidityData,
    isLoading: isAddLiquidityLoading
  } = useContractWrite(addLiquidityConfig);
  
  const { isLoading: isAddLiquidityConfirming } = useWaitForTransaction({
    hash: addLiquidityData?.hash,
    onSuccess: (receipt) => {
      console.log('Liquidity addition confirmed:', receipt);
      toast({
        title: "Success",
        description: "Liquidity added successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setIsAddingLiquidity(false);
    },
    onError: (error) => {
      console.error('Liquidity addition error:', error);
      toast({
        title: "Error",
        description: `Error adding liquidity: ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsAddingLiquidity(false);
    }
  });
  
  // Function to add liquidity to the pool
  const addLiquidityToPool = useCallback(async (poolAddress: Address) => {
    try {
      setIsAddingLiquidity(true);
      console.log(`Adding liquidity to pool ${poolAddress}`);
      toast({
        title: "Adding Liquidity",
        description: "Preparing to add liquidity to the pool...",
        status: "loading",
        duration: 5000,
        isClosable: true,
      });
      
      // Approve tokens
      console.log(`Approving tokens: ${token0Amount} ${token0?.symbol}, ${token1Amount} ${token1?.symbol}`);
      toast({
        title: "Approving Tokens",
        description: `Approving ${token0Amount} ${token0?.symbol} and ${token1Amount} ${token1?.symbol}`,
        status: "loading",
        duration: 5000,
        isClosable: true,
      });
      
      // Approve token0
      if (approveToken0) {
        approveToken0();
      } else {
        throw new Error(`Cannot approve ${token0?.symbol}`);
      }
      
      // Wait for token0 approval to complete before approving token1
      // This is handled by the useWaitForTransaction hooks
      
      // Approve token1
      if (approveToken1) {
        approveToken1();
      } else {
        throw new Error(`Cannot approve ${token1?.symbol}`);
      }
      
      // Add liquidity
      console.log(`Adding liquidity: ${lowerTick}, ${upperTick}, ${token0Amount}, ${token1Amount}`);
      toast({
        title: "Adding Liquidity",
        description: `Adding ${token0Amount} ${token0?.symbol} and ${token1Amount} ${token1?.symbol} to the pool`,
        status: "loading",
        duration: 5000,
        isClosable: true,
      });
      
      // Add liquidity
      if (addLiquidity) {
        addLiquidity();
      } else {
        throw new Error('Cannot add liquidity');
      }
      
    } catch (error) {
      console.error('Error adding liquidity:', error);
      toast({
        title: "Error",
        description: `Error adding liquidity: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsAddingLiquidity(false);
    }
  }, [token0, token1, token0Amount, token1Amount, lowerTick, upperTick, toast, approveToken0, approveToken1, addLiquidity]);
  
  // Wait for pool creation transaction to be mined
  const { isLoading: isPoolCreationConfirming } = useWaitForTransaction({
    hash: createPoolData?.hash,
    onSuccess: async (receipt) => {
      console.log('Pool creation transaction mined:', receipt);
      
      try {
        // Transaction successful
        // Get the pool address from the transaction logs
        const [sortedToken0, sortedToken1] = sortTokens(
          token0?.address as Address,
          token1?.address as Address
        );
        
        // Get pool address from factory
        const poolAddress = await getPoolAddress(sortedToken0, sortedToken1, feeValue);
        console.log('Created pool address:', poolAddress);
        
        toast({
          title: "Pool Created",
          description: `Pool created successfully at ${poolAddress}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        
        // Now add liquidity to the pool
        addLiquidityToPool(poolAddress);
      } catch (error) {
        console.error('Error processing pool creation:', error);
        toast({
          title: "Error",
          description: `Error processing pool creation: ${error instanceof Error ? error.message : 'Unknown error'}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsCreatingPool(false);
      }
    },
    onError: (error) => {
      console.error('Error waiting for pool creation transaction:', error);
      toast({
        title: "Error",
        description: `Error waiting for transaction: ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsCreatingPool(false);
    }
  });
  
  // Handle pool creation errors
  useEffect(() => {
    if (isCreatePoolError) {
      setIsCreatingPool(false);
      toast({
        title: "Error",
        description: "Failed to create pool",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    
    if (isCreatePoolSuccess && createPoolData) {
      console.log('Waiting for pool creation transaction to be mined...');
      toast({
        title: "Creating Pool",
        description: "Waiting for transaction to be mined...",
        status: "loading",
        duration: 10000,
        isClosable: true,
      });
    }
  }, [isCreatePoolSuccess, isCreatePoolError, createPoolData, toast]);

  // Prepare pool creation transaction - using useCreatePool hook directly
  
  // Handle create pool button click
  const handleCreatePool = async () => {
    if (!isConnected) {
      toast({
        title: "Connection Error",
        description: "Please connect your wallet",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      setIsCreatingPool(true);
      
      if (!token0?.address || !token1?.address) {
        throw new Error('Invalid token addresses')
      }

      if (!fee) {
        throw new Error('Fee must be selected')
      }

      if (existingPool && existingPool !== CONTRACT_ADDRESSES.ZERO) {
        throw new Error('Pool already exists')
      }

      const [sortedToken0, sortedToken1] = sortTokens(
        token0.address as Address,
        token1.address as Address
      )
      
      console.log(`Creating pool for tokens ${sortedToken0}, ${sortedToken1} with fee ${feeValue}`);
      console.log(`Token amounts: ${token0Amount} ${token0.symbol}, ${token1Amount} ${token1.symbol}`);
      console.log(`Tick range: ${lowerTick} - ${upperTick}`);

      // Use the wagmi hook to create the pool
      if (createPool) {
        createPool({
          args: [sortedToken0, sortedToken1, feeValue],
        });
      } else {
        throw new Error('Failed to prepare pool creation transaction');
      }
    } catch (err) {
      setIsCreatingPool(false);
      let errorMessage = 'Unknown error occurred'
      if (err instanceof Error) {
        if (err.message.includes('TokensMustBeDifferent')) {
          errorMessage = 'Cannot create pool with same token'
        } else if (err.message.includes('ZeroAddressNotAllowed')) {
          errorMessage = 'Invalid token address'
        } else if (err.message.includes('UnsupportedFee')) {
          errorMessage = 'Invalid fee value'
        } else if (err.message.includes('PoolAlreadyExists')) {
          errorMessage = 'Pool already exists'
        } else {
          errorMessage = err.message
        }
      }
      toast({
        title: "Error creating pool",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleTickRangeChange = (lower: number, upper: number) => {
    setLowerTick(lower)
    setUpperTick(upper)
  }

  const handleToken0Select = (token: Token) => {
    if (token1 && token.address === token1.address) {
      toast({
        title: "Invalid token selection",
        description: "Cannot select the same token",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }
    setToken0(token)
  }

  const handleToken1Select = (token: Token) => {
    if (token0 && token.address === token0.address) {
      toast({
        title: "Invalid token selection",
        description: "Cannot select the same token",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }
    setToken1(token)
  }

  const validatePool = () => {
    if (!token0 || !token1) {
      return INPUT_ERRORS.NO_TOKENS
    }
    if (token0.address === token1.address) {
      return INPUT_ERRORS.SAME_TOKEN
    }
    if (!fee) {
      return INPUT_ERRORS.NO_FEE
    }
    if (lowerTick >= upperTick) {
      return INPUT_ERRORS.INVALID_RANGE
    }
    if (!token0Amount || !token1Amount) {
      return INPUT_ERRORS.EMPTY_AMOUNT
    }
    if (!isValidAmount(token0Amount) || !isValidAmount(token1Amount)) {
      return INPUT_ERRORS.INVALID_FORMAT
    }
    return null
  }

  return (
    <VStack spacing={4} maxW="container.sm" mx="auto" py={8}>
      <Box width="100%" p={4} borderRadius="16px" borderWidth="1px" borderColor="uniswap.gray.200">
        <VStack spacing={4}>
          <Text fontSize="xl" fontWeight="bold" color="black">Create New Pool</Text>
          <TokenSelect
            value={token0Amount}
            onChange={setToken0Amount}
            label="Token 1"
            selectedToken={token0}
            onTokenSelect={handleToken0Select}
          />
          <TokenSelect
            value={token1Amount}
            onChange={setToken1Amount}
            label="Token 2"
            selectedToken={token1}
            onTokenSelect={handleToken1Select}
          />
          <TickRangeInput onRangeChange={handleTickRangeChange} />
          <Box width="100%">
            <Text mb={2} color="black">Fee Tier</Text>
            <VStack spacing={2}>
              {['0.05%', '0.3%'].map((feeOption) => (
                <Button
                  key={feeOption}
                  width="100%"
                  variant={fee === feeOption ? 'uniswap' : 'outline'}
                  color={fee === feeOption ? 'white' : 'gray.700'}
                  onClick={() => setFee(feeOption)}
                  _hover={fee === feeOption ? { opacity: 0.8 } : { bg: 'uniswap.gray.100' }}
                >
                  {feeOption}
                </Button>
              ))}
            </VStack>
          </Box>
          <Button
            width="100%"
            variant="uniswap"
            isDisabled={!token0 || !token1 || !fee || !token0Amount || !token1Amount || 
              !isValidAmount(token0Amount) || !isValidAmount(token1Amount) || 
              lowerTick >= upperTick || isCreatingPool || isAddingLiquidity ||
              isPoolCreationConfirming || isApproveToken0Loading || isApproveToken1Loading ||
              isApproveToken0Confirming || isApproveToken1Confirming || 
              isAddLiquidityLoading || isAddLiquidityConfirming}
            isLoading={isCreatingPool || isAddingLiquidity || 
                      isPoolCreationConfirming || isApproveToken0Loading || isApproveToken1Loading ||
                      isApproveToken0Confirming || isApproveToken1Confirming || 
                      isAddLiquidityLoading || isAddLiquidityConfirming}
            loadingText={
              isPoolCreationConfirming ? "Creating Pool" : 
              isApproveToken0Loading || isApproveToken0Confirming ? `Approving ${token0?.symbol}` :
              isApproveToken1Loading || isApproveToken1Confirming ? `Approving ${token1?.symbol}` :
              isAddLiquidityLoading || isAddLiquidityConfirming ? "Adding Liquidity" :
              isCreatingPool ? "Creating Pool" : 
              isAddingLiquidity ? "Adding Liquidity" : ""
            }
            onClick={() => {
              const error = validatePool()
              if (error) {
                toast({
                  title: "Invalid pool configuration",
                  description: error,
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                })
                return
              }
              handleCreatePool()
            }}
            _hover={{ opacity: 0.8 }}
          >
            {isPoolCreationConfirming ? "Creating Pool" : 
             isApproveToken0Loading || isApproveToken0Confirming ? `Approving ${token0?.symbol}` :
             isApproveToken1Loading || isApproveToken1Confirming ? `Approving ${token1?.symbol}` :
             isAddLiquidityLoading || isAddLiquidityConfirming ? "Adding Liquidity" :
             isCreatingPool ? "Creating Pool" : 
             isAddingLiquidity ? "Adding Liquidity" : "Create Pool"}
          </Button>
        </VStack>
      </Box>
    </VStack>
  )
}
