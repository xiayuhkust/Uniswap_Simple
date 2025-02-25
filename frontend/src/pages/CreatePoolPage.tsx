import { VStack, Button, Box, Text, useToast } from '@chakra-ui/react'
import { TokenSelect } from '../components/TokenSelect'
import { useState, useEffect } from 'react'
import { type Token } from '../types/token'
import { TickRangeInput } from '../components/TickRangeInput'
import { useAccount } from 'wagmi'
import type { Address } from 'wagmi'
import { useGetPool, useCreatePool, FEES, sortTokens } from '../utils/contracts'

const DECIMALS = 18


export function CreatePoolPage() {
  const [token0, setToken0] = useState<Token>()
  const [token1, setToken1] = useState<Token>()
  const [token0Amount, setToken0Amount] = useState('')
  const [token1Amount, setToken1Amount] = useState('')
  const [fee, setFee] = useState<string>('')
  const [lowerTick, setLowerTick] = useState(-887220)
  const [upperTick, setUpperTick] = useState(887220)
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

      if (existingPool && existingPool !== '0x0000000000000000000000000000000000000000') {
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
      return "Please select both tokens"
    }
    if (token0.address === token1.address) {
      return "Cannot create pool with same token"
    }
    if (!fee) {
      return "Please select a fee tier"
    }
    if (lowerTick >= upperTick) {
      return "Invalid price range"
    }
    try {
      if (!token0Amount || !token1Amount) {
        return "Please enter amounts for both tokens"
      }
      // Convert to BigInt using string operations to avoid floating point precision issues
      const amount0Scaled = token0Amount.includes('.') 
        ? token0Amount.padEnd(token0Amount.indexOf('.') + DECIMALS + 1, '0').replace('.', '')
        : token0Amount + '0'.repeat(DECIMALS)
      const amount1Scaled = token1Amount.includes('.')
        ? token1Amount.padEnd(token1Amount.indexOf('.') + DECIMALS + 1, '0').replace('.', '')
        : token1Amount + '0'.repeat(DECIMALS)
      
      const amount0BigInt = BigInt(amount0Scaled)
      const amount1BigInt = BigInt(amount1Scaled)
      
      if (amount0BigInt <= 0n || amount1BigInt <= 0n) {
        return "Amount must be greater than 0"
      }
    } catch {
      return "Invalid amount format"
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
            label="token1"
            selectedToken={token0}
            onTokenSelect={handleToken0Select}
          />
          <TokenSelect
            value={token1Amount}
            onChange={setToken1Amount}
            label="token2"
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
              (() => {
                try {
                  if (!token0Amount || !token1Amount) return true
                  const amount0Scaled = token0Amount.includes('.') 
                    ? token0Amount.padEnd(token0Amount.indexOf('.') + DECIMALS + 1, '0').replace('.', '')
                    : token0Amount + '0'.repeat(DECIMALS)
                  const amount1Scaled = token1Amount.includes('.')
                    ? token1Amount.padEnd(token1Amount.indexOf('.') + DECIMALS + 1, '0').replace('.', '')
                    : token1Amount + '0'.repeat(DECIMALS)
                  
                  const amount0BigInt = BigInt(amount0Scaled)
                  const amount1BigInt = BigInt(amount1Scaled)
                  return amount0BigInt <= 0n || amount1BigInt <= 0n
                } catch {
                  return true
                }
              })() || 
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
