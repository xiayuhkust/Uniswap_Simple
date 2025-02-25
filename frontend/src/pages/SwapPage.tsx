import { VStack, Box } from '@chakra-ui/react'
import { SwapInterface } from '../components/Swap/SwapInterface'

export function SwapPage() {
  return (
    <Box maxW="container.xl" mx="auto">
      <VStack spacing={4} maxW="container.sm" mx="auto" py={8}>
        <SwapInterface />
      </VStack>
    </Box>
  )
}
