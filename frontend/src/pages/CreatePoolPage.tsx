import { VStack, Button, Box, Text, useToast } from '@chakra-ui/react'
import { TokenSelect } from '../components/TokenSelect'
import { useState } from 'react'
import { type Token } from '../types/token'

export function CreatePoolPage() {
  const [token0, setToken0] = useState<Token>()
  const [token1, setToken1] = useState<Token>()
  const [fee, setFee] = useState<string>('')
  const toast = useToast()

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
    return null
  }

  return (
    <VStack spacing={4} maxW="container.sm" mx="auto" py={8}>
      <Box width="100%" p={4} borderRadius="16px" borderWidth="1px" borderColor="uniswap.gray.200">
        <VStack spacing={4}>
          <Text fontSize="xl" fontWeight="bold" color="black">Create New Pool</Text>
          <TokenSelect
            value=""
            onChange={() => {}}
            label="Token 1"
            selectedToken={token0}
            onTokenSelect={handleToken0Select}
          />
          <TokenSelect
            value=""
            onChange={() => {}}
            label="Token 2"
            selectedToken={token1}
            onTokenSelect={handleToken1Select}
          />
          <Box width="100%">
            <Text mb={2} color="black">Fee Tier</Text>
            <VStack spacing={2}>
              {['0.05%', '0.3%', '1%'].map((feeOption) => (
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
            isDisabled={!token0 || !token1 || !fee}
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
              // Pool creation logic will be handled later
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
