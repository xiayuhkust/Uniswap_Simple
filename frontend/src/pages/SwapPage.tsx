import { VStack, Button, Box, Icon } from '@chakra-ui/react'
import { ArrowDownIcon } from '@chakra-ui/icons'
import { TokenSelect } from '../components/TokenSelect'
import { WrapUnwrap } from '../components/WrapUnwrap'
import { useTokenList } from '../hooks/useTokenList'

export function SwapPage() {
  const tokens = useTokenList()

  return (
    <Box maxW="2xl" mx="auto" mt={8}>
      <VStack spacing={4} p={6} bg="brand.surface" borderRadius="xl">
        <TokenSelect 
          token={tokens[0]} 
          onSelect={() => {}} 
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
          token={tokens[1]} 
          onSelect={() => {}} 
        />
        <Button
          w="full"
          size="lg"
          colorScheme="blue"
          isDisabled={true}
        >
          Swap
        </Button>
      </VStack>
      <Box mt={4}>
        <WrapUnwrap />
      </Box>
    </Box>
  )
}
