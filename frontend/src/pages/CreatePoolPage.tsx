import { useState, useEffect } from 'react'
import { VStack, Button, Box, Text, useToast } from '@chakra-ui/react'
import { useAccount } from 'wagmi'
import type { Address } from 'wagmi'

import { TokenSelect } from '../components/TokenSelect'
import { TickRangeInput } from '../components/TickRangeInput'

import { CONTRACT_ADDRESSES } from '../constants/addresses'
import { MIN_TICK, MAX_TICK } from '../constants/ticks'
import { useGetPool, useCreatePool, FEES, sortTokens } from '../utils/contracts'
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
  const toast = useToast()
  const { isConnected } = useAccount()

  const feeValue = fee === '0.05%' ? FEES.LOWEST : fee === '0.3%' ? FEES.MEDIUM : FEES.MEDIUM
  const { data: existingPool } = useGetPool(
    token0?.address as Address,
    token1?.address as Address,
    feeValue
  )

  const { write: createPool, isSuccess, isError } = useCreatePool()

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Success",
        description: "Pool created successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      })
    }
    if (isError) {
      toast({
        title: "Error",
        description: "Failed to create pool",
        status: "error",
        duration: 5000,
        isClosable: true,
      })
    }
  }, [isSuccess, isError, toast])

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

      createPool?.({
        args: [sortedToken0, sortedToken1, feeValue],
      })
    } catch (err) {
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
              lowerTick >= upperTick}
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
        </VStack>
      </Box>
    </VStack>
  )
}
