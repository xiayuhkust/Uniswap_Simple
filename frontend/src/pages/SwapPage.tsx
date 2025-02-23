import { VStack, Button, Box, Icon } from '@chakra-ui/react'
import { ArrowDownIcon } from '@chakra-ui/icons'
import { TokenSelect } from '../components/TokenSelect'
import { WrapUnwrap } from '../components/WrapUnwrap'
import { useTokenList } from '../hooks/useTokenList'
import { useWeb3React } from '@web3-react/core'
import { useState } from 'react'

export function SwapPage() {
  const tokens = useTokenList()
  const { active } = useWeb3React()
  const [token0Index, setToken0Index] = useState(0)
  const [token1Index, setToken1Index] = useState(1)

  return (
    <Box maxW="2xl" mx="auto" mt={8}>
      <VStack spacing={4} p={6} bg="brand.surface" borderRadius="xl">
        <TokenSelect 
          token={tokens[token0Index]} 
          onSelect={(index) => setToken0Index(index)} 
        />
        <Box py={2}>
          <Icon 
            as={ArrowDownIcon} 
            w={6} 
            h={6} 
            color="brand.primary" 
          />
        </Box>
        <TokenSelect 
          token={tokens[token1Index]} 
          onSelect={(index) => setToken1Index(index)} 
        />
        <Button
          w="full"
          size="lg"
          colorScheme="blue"
          isDisabled={!active || tokens.length < 2}
        >
          {active ? 'Swap' : 'Connect Wallet to Swap'}
        </Button>
      </VStack>
      <Box mt={4}>
        <WrapUnwrap />
      </Box>
    </Box>
  )
}
