import { VStack, Button, Box, Text } from '@chakra-ui/react'
import { TokenSelect } from '../components/TokenSelect'
import { useState } from 'react'
import { type Token } from '../types/token'

export function CreatePoolPage() {
  const [token0, setToken0] = useState<Token>()
  const [token1, setToken1] = useState<Token>()
  const [fee, setFee] = useState<string>('')

  return (
    <VStack spacing={4} maxW="container.sm" mx="auto" py={8}>
      <Box width="100%" p={4} borderRadius="xl" borderWidth="1px">
        <VStack spacing={4}>
          <Text fontSize="xl" fontWeight="bold">Create New Pool</Text>
          <TokenSelect
            value=""
            onChange={() => {}}
            label="Token 1"
            selectedToken={token0}
            onTokenSelect={setToken0}
          />
          <TokenSelect
            value=""
            onChange={() => {}}
            label="Token 2"
            selectedToken={token1}
            onTokenSelect={setToken1}
          />
          <Box width="100%">
            <Text mb={2}>Fee Tier</Text>
            <VStack spacing={2}>
              {['0.05%', '0.3%', '1%'].map((feeOption) => (
                <Button
                  key={feeOption}
                  width="100%"
                  variant={fee === feeOption ? 'solid' : 'outline'}
                  onClick={() => setFee(feeOption)}
                >
                  {feeOption}
                </Button>
              ))}
            </VStack>
          </Box>
          <Button
            width="100%"
            colorScheme="blue"
            isDisabled={!token0 || !token1 || !fee}
          >
            Create Pool
          </Button>
        </VStack>
      </Box>
    </VStack>
  )
}
