import { Box, Container } from '@chakra-ui/react'
import { SwapInterface } from '../components/Swap/SwapInterface'

export function SwapPage() {
  return (
    <Container maxW="container.xl" py={8}>
      <Box maxW="md" mx="auto">
        <SwapInterface />
      </Box>
    </Container>
  )
}
