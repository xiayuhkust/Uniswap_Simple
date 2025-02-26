import { useState, useEffect, useCallback } from 'react'
import { VStack, Button, Box, Text, useToast } from '@chakra-ui/react'
import { useAccount, useContractRead, useWaitForTransaction } from 'wagmi'
import type { Address } from 'wagmi'
import { ethers } from 'ethers'

import { TokenSelect } from '../components/TokenSelect'
import { TickRangeInput } from '../components/TickRangeInput'

import { CONTRACT_ADDRESSES } from '../constants/addresses'
import { MIN_TICK, MAX_TICK, validateTicks } from '../constants/ticks'
import { useGetPool, useCreatePool, FEES, sortTokens, FACTORY_ABI } from '../utils/contracts'
import { isValidAmount } from '../utils/validation'
import { INPUT_ERRORS } from '../constants/errors'
import { useAddLiquidity } from '../hooks/useAddLiquidity'

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
  
  // Use the useAddLiquidity hook for token approvals and liquidity addition
  const {
    checkAndApproveTokens,
    addLiquidityPosition,
    isApproving
  } = useAddLiquidity(poolAddressData as Address);

  // Function to get pool address from factory
  const getPoolAddress = useCallback(async (token0Address: Address, token1Address: Address, fee: number): Promise<Address> => {
    try {
      console.log(`Getting pool address for tokens ${token0Address}, ${token1Address} with fee ${fee}`);
      
      // Always make a direct contract call to get the latest pool address
      // This ensures we get the correct address after pool creation
      const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_TURA_RPC_URL);
      const factoryContract = new ethers.Contract(
        CONTRACT_ADDRESSES.FACTORY,
        FACTORY_ABI,
        provider
      );
      
      // Add a small delay to ensure the blockchain has time to update
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const poolAddress = await factoryContract.getPool(token0Address, token1Address, fee);
      console.log('Pool address from factory:', poolAddress);
      
      if (poolAddress === CONTRACT_ADDRESSES.ZERO) {
        console.warn('Factory returned zero address for pool. This may indicate the pool was not created successfully.');
      }
      
      return poolAddress;
    } catch (error) {
      console.error('Error getting pool address:', error);
      throw error;
    }
  }, []);

  // We'll use the useAddLiquidity hook for token approvals and liquidity addition
  // This hook handles all the token approval and liquidity addition logic
  
  // Track liquidity addition transaction status
  const [addLiquidityTxHash, setAddLiquidityTxHash] = useState<`0x${string}` | undefined>();
  
  // Wait for liquidity addition transaction to be mined
  const { isLoading: isAddLiquidityConfirming } = useWaitForTransaction({
    hash: addLiquidityTxHash,
    onSuccess: (receipt: any) => {
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
    onError: (error: Error) => {
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
  const handleAddLiquidity = useCallback(async () => {
    if (!token0 || !token1) {
      toast({
        title: "Error",
        description: "Please select both tokens",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!token0Amount || !token1Amount) {
      toast({
        title: "Error",
        description: "Please enter token amounts",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!validateTicks(lowerTick, upperTick)) {
      toast({
        title: "Error",
        description: "Invalid tick range",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsAddingLiquidity(true);

    try {
      console.log(`Adding liquidity to pool ${poolAddressData}`);
      
      // Step 1: Check and approve tokens
      toast({
        title: "Approving Tokens",
        description: `Approving ${token0Amount} ${token0?.symbol} and ${token1Amount} ${token1?.symbol}`,
        status: "loading",
        duration: 5000,
        isClosable: true,
      });

      await checkAndApproveTokens(token0Amount, token1Amount);

      // Step 2: Add liquidity
      toast({
        title: "Adding Liquidity",
        description: `Adding ${token0Amount} ${token0?.symbol} and ${token1Amount} ${token1?.symbol} to the pool`,
        status: "loading",
        duration: 5000,
        isClosable: true,
      });

      const tx = await addLiquidityPosition(lowerTick, upperTick, token0Amount, token1Amount);
      
      console.log('Liquidity addition transaction:', tx);
      
      // Set the transaction hash for the useWaitForTransaction hook
      setAddLiquidityTxHash(tx.hash as `0x${string}`);
      
      toast({
        title: "Success",
        description: "Liquidity addition transaction submitted",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      // Wait for transaction confirmation is handled by useWaitForTransaction
    } catch (error) {
      console.error('Error adding liquidity:', error);
      toast({
        title: "Error",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsAddingLiquidity(false);
    }
  }, [token0, token1, token0Amount, token1Amount, lowerTick, upperTick, poolAddressData, toast, checkAndApproveTokens, addLiquidityPosition]);
  
  // Wait for pool creation transaction to be mined
  const { isLoading: isPoolCreationConfirming } = useWaitForTransaction({
    hash: createPoolData?.hash,
    onSuccess: async (receipt: any) => {
      console.log('Pool creation transaction mined:', receipt);
      
      try {
        // Add a delay to ensure the blockchain state is updated
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Get the pool address from the factory
        const [sortedToken0, sortedToken1] = sortTokens(
          token0?.address as Address,
          token1?.address as Address
        );
        
        console.log(`Getting pool address for sorted tokens: ${sortedToken0}, ${sortedToken1}, fee: ${feeValue}`);
        
        // Make multiple attempts to get the pool address
        let poolAddress: Address | null = null;
        let attempts = 0;
        const maxAttempts = 3;
        
        while (attempts < maxAttempts) {
          attempts++;
          try {
            poolAddress = await getPoolAddress(sortedToken0, sortedToken1, feeValue);
            console.log(`Attempt ${attempts}: Pool address: ${poolAddress}`);
            
            if (poolAddress && poolAddress !== CONTRACT_ADDRESSES.ZERO) {
              break;
            } else {
              // Wait before trying again
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          } catch (err) {
            console.error(`Attempt ${attempts} failed:`, err);
            if (attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          }
        }
        
        if (poolAddress && poolAddress !== CONTRACT_ADDRESSES.ZERO) {
          // Update the pool address data
          // This will trigger the useAddLiquidity hook to update with the new pool address
          
          toast({
            title: "Pool Created",
            description: `Pool created successfully at ${poolAddress}`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          
          // Don't automatically add liquidity, let the user do it manually
          setIsCreatingPool(false);
        } else {
          throw new Error('Failed to get pool address after creation');
        }
      } catch (error) {
        console.error('Error getting pool address:', error);
        toast({
          title: "Error",
          description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setIsCreatingPool(false);
      }
    },
    onError: (error: Error) => {
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
    // Reset pool address data when tokens change
    if (poolAddressData && poolAddressData !== CONTRACT_ADDRESSES.ZERO) {
      console.log('Resetting pool address data due to token change')
    }
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
    // Reset pool address data when tokens change
    if (poolAddressData && poolAddressData !== CONTRACT_ADDRESSES.ZERO) {
      console.log('Resetting pool address data due to token change')
    }
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
          
          {/* Show error message if trying to use the same token */}
          {token0 && token1 && token0.address === token1.address && (
            <Box width="100%" p={3} borderWidth="1px" borderRadius="md" bg="red.50">
              <Text color="red.500" fontWeight="medium">Cannot create pool with the same token</Text>
            </Box>
          )}
          
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
          
          {/* Status indicators */}
          {(isCreatingPool || isPoolCreationConfirming || isApproving || 
            (isAddingLiquidity && !isApproving) || isAddLiquidityConfirming) && (
            <Box width="100%" p={3} borderWidth="1px" borderRadius="md" bg="gray.50">
              <VStack align="start" spacing={2}>
                {isCreatingPool && (
                  <>
                    <Text fontWeight="bold" color="blue.600">Creating Pool...</Text>
                    <Text fontSize="sm">Please confirm the transaction in your wallet</Text>
                  </>
                )}
                
                {isCreatePoolError && (
                  <>
                    <Text fontWeight="bold" color="red.500">Pool Creation Failed</Text>
                    <Text fontSize="sm">There was an error creating the pool. Please try again.</Text>
                  </>
                )}
                
                {isPoolCreationConfirming && (
                  <>
                    <Text fontWeight="bold" color="blue.600">Confirming Pool Creation...</Text>
                    <Text fontSize="sm">Waiting for transaction confirmation</Text>
                  </>
                )}
                
                {isApproving && (
                  <>
                    <Text fontWeight="bold" color="blue.600">Approving Tokens...</Text>
                    <Text fontSize="sm">Please confirm the approval transactions in your wallet</Text>
                  </>
                )}
                
                {isAddingLiquidity && !isApproving && (
                  <>
                    <Text fontWeight="bold" color="blue.600">Adding Liquidity...</Text>
                    <Text fontSize="sm">Please confirm the transaction in your wallet</Text>
                  </>
                )}
                
                {isAddLiquidityConfirming && (
                  <>
                    <Text fontWeight="bold" color="blue.600">Confirming Liquidity Addition...</Text>
                    <Text fontSize="sm">Waiting for transaction confirmation</Text>
                  </>
                )}
              </VStack>
            </Box>
          )}
          
          {/* Pool creation button */}
          {(!poolAddressData || poolAddressData === CONTRACT_ADDRESSES.ZERO) && (
            <Button
              width="100%"
              variant="uniswap"
              isDisabled={!token0 || !token1 || !fee || isCreatingPool || isPoolCreationConfirming}
              isLoading={isCreatingPool || isPoolCreationConfirming}
              loadingText={isPoolCreationConfirming ? "Confirming Pool Creation" : "Creating Pool"}
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
              Create Pool
            </Button>
          )}
          
          {/* Add liquidity button - only show after pool is created */}
          {poolAddressData && poolAddressData !== CONTRACT_ADDRESSES.ZERO && (
            <Button
              width="100%"
              variant="uniswap"
              isDisabled={!token0 || !token1 || !token0Amount || !token1Amount || 
                !isValidAmount(token0Amount) || !isValidAmount(token1Amount) || 
                lowerTick >= upperTick || isAddingLiquidity || isApproving || 
                isAddLiquidityConfirming}
              isLoading={isAddingLiquidity || isApproving || isAddLiquidityConfirming}
              loadingText={
                isApproving ? "Approving Tokens" :
                isAddLiquidityConfirming ? "Confirming Liquidity Addition" :
                "Adding Liquidity"
              }
              onClick={handleAddLiquidity}
              _hover={{ opacity: 0.8 }}
            >
              Add Liquidity
            </Button>
          )}
        </VStack>
      </Box>
    </VStack>
  )
}
