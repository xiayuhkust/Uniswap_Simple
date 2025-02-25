import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { INPUT_ERRORS } from '../constants/errors'
import { VStack, Box, Text, Button, useToast, HStack, Spinner } from '@chakra-ui/react'
import { NumberInput } from '../components/NumberInput'
import { TickRangeInput } from '../components/TickRangeInput'
import { usePoolList } from '../hooks/usePoolList'
import { usePoolData } from '../hooks/usePoolData'
import { useAddLiquidity } from '../hooks/useAddLiquidity'
import { useAccount } from 'wagmi'
import { type Address } from 'viem'
import { validateTicks, MIN_TICK, MAX_TICK } from '../constants/ticks'
import { ZERO_BIGINT, stringToBigInt, bigIntToString, calculatePrice, formatPrice } from '../utils/bigint'
import { isValidAmount } from '../utils/validation'


export function AddLiquidityPage() {
  const { poolAddress } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { isConnected } = useAccount()
  const { pools, isLoading: poolsLoading } = usePoolList()
  const [amount0, setAmount0] = useState('')
  const [amount1, setAmount1] = useState('')
  
  // Validate pool address format
  const isValidAddress = poolAddress?.match(/^0x[a-fA-F0-9]{40}$/)
  const validatedPoolAddress = isValidAddress ? poolAddress as Address : undefined
  
  const { checkAndApproveTokens, addLiquidityPosition, isApproving } = useAddLiquidity(validatedPoolAddress || '0x0000000000000000000000000000000000000000' as Address)
  const [lowerTick, setLowerTick] = useState(MIN_TICK)
  const [upperTick, setUpperTick] = useState(MAX_TICK)
  const [isAmount0Active, setIsAmount0Active] = useState(true)
  
  // Find pool data from poolList
  const pool = pools.find(p => p.address === validatedPoolAddress)

  // Use test price for TT1/TT2 pool
  const testPrice = pool?.token0Symbol === 'TT1' && pool?.token1Symbol === 'TT2' ? 1.5 : null

  const { slot0, isLoading: poolDataLoading, calculateAmount1ForAmount0, calculateAmount0ForAmount1 } = usePoolData(validatedPoolAddress || '0x0000000000000000000000000000000000000000' as Address)

  const [isCalculating, setIsCalculating] = useState(false)
  const [calculationError, setCalculationError] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  const validateAmounts = (amount0: string, amount1: string): string | null => {
    if (!amount0 || !amount1) return INPUT_ERRORS.EMPTY_AMOUNT
    if (!isValidAmount(amount0) || !isValidAmount(amount1)) return INPUT_ERRORS.INVALID_FORMAT
    return null
  }

  const handleTickRangeChange = async (lower: number, upper: number) => {
    if (!validateTicks(lower, upper)) {
      setCalculationError("Invalid tick range")
      toast({
        title: "Invalid Range",
        description: `Tick range must be between ${MIN_TICK} and ${MAX_TICK}, and lower must be less than upper`,
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setLowerTick(lower)
    setUpperTick(upper)
    
    setIsCalculating(true)
    setCalculationError(null)
    
    try {
      // Recalculate amounts based on new tick range
      if (isAmount0Active && amount0) {
        const amount1 = calculateAmount1ForAmount0(amount0)
        if (!amount1) throw new Error("Failed to calculate amount1")
        setAmount1(amount1)
      } else if (!isAmount0Active && amount1) {
        const amount0 = calculateAmount0ForAmount1(amount1)
        if (!amount0) throw new Error("Failed to calculate amount0")
        setAmount0(amount0)
      }
    } catch (error) {
      const err = error as Error
      setCalculationError(err.message || "Failed to calculate amounts")
      toast({
        title: "Calculation Error",
        description: err.message || "Failed to calculate amounts",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsCalculating(false)
    }
  }

  if (!isValidAddress) {
    return (
      <Box maxW="2xl" mx="auto" mt={8} p={6} bg="white" borderRadius="xl" borderWidth="1px">
        <VStack spacing={4}>
          <Text fontSize="xl" color="red.500">Invalid pool address format</Text>
          <Button onClick={() => navigate('/pool')} variant="outline">Back to Pools</Button>
        </VStack>
      </Box>
    )
  }

  if (poolsLoading || poolDataLoading) {
    return (
      <Box maxW="2xl" mx="auto" mt={8} p={6} bg="white" borderRadius="xl" borderWidth="1px">
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading pool data...</Text>
        </VStack>
      </Box>
    )
  }

  if (!pool) {
    return (
      <Box maxW="2xl" mx="auto" mt={8} p={6} bg="white" borderRadius="xl" borderWidth="1px">
        <VStack spacing={4}>
          <Text fontSize="xl">Pool not found</Text>
          <Button onClick={() => navigate('/pool')} variant="outline">Back to Pools</Button>
        </VStack>
      </Box>
    )
  }

  return (
    <Box maxW="2xl" mx="auto" mt={8}>
      <VStack spacing={6} align="stretch">
        <Box p={6} bg="white" borderRadius="xl" borderWidth="1px" borderColor="gray.200">
          <VStack spacing={4} align="stretch">
            <Text fontSize="2xl" fontWeight="bold" color="black">
              Add Liquidity
            </Text>
            <Text color="gray.600">
              {`${pool.token0Symbol}/${pool.token1Symbol} Pool - ${(Number(stringToBigInt(pool.fee?.toString() || '0')) / 10000).toFixed(2)}% Fee`}
            </Text>

            {!pool.liquidity || stringToBigInt(pool.liquidity?.toString() || '0') === ZERO_BIGINT ? (
              <Box p={4} bg="yellow.50" borderRadius="md">
                <Text color="yellow.800">
                  This pool has no liquidity. You will be the first liquidity provider.
                  Initial prices will be set based on your token amounts.
                </Text>
              </Box>
            ) : null}

            <Box>
              <Text mb={2} color="gray.600">Amount {pool.token0Symbol}</Text>
              <NumberInput
                value={amount0}
                onChange={(value) => {
                  setAmount0(value)
                  setIsCalculating(true)
                  try {
                    let amount1
                    if (testPrice) {
                      // Use simple price calculation for test pool
                      const valueBigInt = stringToBigInt(value)
                      const scaledPrice = BigInt(Math.floor(testPrice * 1e6))
                      const result = (valueBigInt * scaledPrice) / BigInt(1e6)
                      amount1 = bigIntToString(result)
                    } else {
                      amount1 = calculateAmount1ForAmount0(value)
                    }
                    setAmount1(amount1)
                    setCalculationError(null)
                    const error = validateAmounts(value, amount1)
                    setValidationError(error)
                  } catch (error) {
                    const err = error as Error
                    setCalculationError(err.message || "Failed to calculate amount1")
                  } finally {
                    setIsCalculating(false)
                  }
                  setIsAmount0Active(true)
                }}
                placeholder="0.0"
                size="lg"
                isDisabled={isCalculating}
                isInvalid={!!calculationError}
              />
              {calculationError && (
                <Text fontSize="sm" color="red.500" mt={1}>
                  {calculationError}
                </Text>
              )}
            </Box>

            <Box>
              <Text mb={2} color="gray.600">Amount {pool.token1Symbol}</Text>
              <NumberInput
                value={amount1}
                onChange={(value) => {
                  setAmount1(value)
                  setIsCalculating(true)
                  try {
                    let amount0
                    if (testPrice) {
                      // Use simple price calculation for test pool
                      const valueBigInt = stringToBigInt(value)
                      const scaledPrice = BigInt(Math.floor(testPrice * 1e6))
                      const result = (valueBigInt * BigInt(1e6)) / scaledPrice
                      amount0 = bigIntToString(result)
                    } else {
                      amount0 = calculateAmount0ForAmount1(value)
                    }
                    setAmount0(amount0)
                    setCalculationError(null)
                    const error = validateAmounts(amount0, value)
                    setValidationError(error)
                  } catch (error) {
                    const err = error as Error
                    setCalculationError(err.message || "Failed to calculate amount0")
                  } finally {
                    setIsCalculating(false)
                  }
                  setIsAmount0Active(false)
                }}
                placeholder="0.0"
                size="lg"
                isDisabled={isCalculating}
                isInvalid={!!calculationError}
              />
              {calculationError && (
                <Text fontSize="sm" color="red.500" mt={1}>
                  {calculationError}
                </Text>
              )}
            </Box>

            <HStack spacing={4} width="100%">
              <Button
                size="sm"
                variant={lowerTick === MIN_TICK && upperTick === MAX_TICK ? "uniswap" : "outline"}
                onClick={() => {
                  setLowerTick(MIN_TICK)
                  setUpperTick(MAX_TICK)
                }}
              >
                Full Range
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setLowerTick(Math.floor(MIN_TICK / 2))
                  setUpperTick(Math.floor(MAX_TICK / 2))
                }}
              >
                Concentrated
              </Button>
            </HStack>

            <Box>
              <Text mb={2} color="gray.600">Price Range</Text>
              <TickRangeInput onRangeChange={handleTickRangeChange} />
              <Text mt={2} fontSize="sm" color="gray.500">
                Current Price: {slot0 
                  ? slot0.sqrtPriceX96 === ZERO_BIGINT 
                    ? '0.000000'
                    : formatPrice(calculatePrice(slot0.sqrtPriceX96))
                  : '-'} {pool.token1Symbol} per {pool.token0Symbol}
              </Text>
            </Box>

            {validationError && (
                <Text fontSize="sm" color="red.500" mt={2} mb={2}>
                  {validationError}
                </Text>
              )}

              <Button
              size="lg"
              variant="uniswap"
              isDisabled={!isConnected || !amount0 || !amount1 || !validateTicks(lowerTick, upperTick) || poolDataLoading || isApproving || !!validationError}
              onClick={async () => {
                const error = validateAmounts(amount0, amount1)
                if (error) {
                  setValidationError(error)
                  return
                }
                setValidationError(null)

                if (!isConnected) {
                  toast({
                    title: "Connection Required",
                    description: "Please connect your wallet to add liquidity",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  })
                  return
                }

                if (!amount0 || !amount1) {
                  toast({
                    title: "Invalid Amounts",
                    description: "Please enter valid amounts for both tokens",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  })
                  return
                }

                if (!validateTicks(lowerTick, upperTick)) {
                  toast({
                    title: "Invalid Price Range",
                    description: `Tick range must be between ${MIN_TICK} and ${MAX_TICK}, and lower tick (${lowerTick}) must be less than upper tick (${upperTick})`,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  })
                  return
                }

                try {
                  await checkAndApproveTokens(amount0, amount1)
                  toast({
                    title: "Tokens Approved",
                    description: "Ready to add liquidity in next step",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                  })
                } catch (error) {
                  const err = error as Error
                  toast({
                    title: "Approval Failed",
                    description: err.message || "Failed to approve tokens",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  })
                  return
                }

                try {
                  const tx = await addLiquidityPosition(
                    lowerTick,
                    upperTick,
                    amount0,
                    amount1
                  )

                  if (!tx) throw new Error('Transaction failed')

                  toast({
                    title: "Success",
                    description: "Liquidity added successfully",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                  })
                  // Navigate back to pool list after success
                  navigate('/pool')
                } catch (error) {
                  const err = error as Error
                  toast({
                    title: "Failed to Add Liquidity",
                    description: err.message || "Failed to add liquidity",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  })
                  console.error('Error adding liquidity:', error)
                }
              }}
            >
              {!isConnected ? 'Connect Wallet' : 
               isApproving ? 'Processing...' : 
               'Add Liquidity'}
            </Button>

            <Button
              size="lg"
              variant="outline"
              isDisabled={true}
              _hover={{ bg: 'gray.100' }}
            >
              Withdraw Liquidity (Coming Soon)
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  )
}
