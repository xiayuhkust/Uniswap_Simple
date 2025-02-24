import { VStack, Box, Heading, Button } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { TokenSelect } from '../components/TokenSelect'
import { useState } from 'react'
import { type Token } from '../types/token'
import { FEE_TIERS } from '../constants/pools'

export function CreatePoolPage() {
  const navigate = useNavigate()
  const [token0, setToken0] = useState<Token>()
  const [token1, setToken1] = useState<Token>()
  const [selectedFee, setSelectedFee] = useState<number>()

  return (
    <Box maxW="container.sm" mx="auto" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">Create New Pool</Heading>
        
        <Box p={6} borderRadius="xl" borderWidth="1px">
          <VStack spacing={4}>
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

            <VStack spacing={2} align="stretch" width="100%">
              <Heading size="sm">Fee Tier</Heading>
              <Button
                variant={selectedFee === FEE_TIERS.LOW ? 'solid' : 'outline'}
                onClick={() => setSelectedFee(FEE_TIERS.LOW)}
              >
                0.05%
              </Button>
              <Button
                variant={selectedFee === FEE_TIERS.MEDIUM ? 'solid' : 'outline'}
                onClick={() => setSelectedFee(FEE_TIERS.MEDIUM)}
              >
                0.3%
              </Button>
              <Button
                variant={selectedFee === FEE_TIERS.HIGH ? 'solid' : 'outline'}
                onClick={() => setSelectedFee(FEE_TIERS.HIGH)}
              >
                1%
              </Button>
            </VStack>

            <Button
              colorScheme="blue"
              width="100%"
              isDisabled={!token0 || !token1 || !selectedFee}
              onClick={() => {}}
            >
              Create Pool
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  )
}
