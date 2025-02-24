
import { VStack, Box, Text, Spinner } from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import { usePositions } from '../hooks/usePositions'
import type { Position } from '../types/position.js'

export function PositionsList() {
  const { active } = useWeb3React()
  const { positions = [], isLoading = false } = usePositions() ?? {}

  if (!active) return null

  if (isLoading) {
    return (
      <Box p={6} bg="whiteAlpha.100" borderRadius="xl">
        <VStack>
          <Spinner />
          <Text color="gray.400">Loading positions...</Text>
        </VStack>
      </Box>
    )
  }

  if (!positions?.length) {
    return (
      <Box p={6} bg="whiteAlpha.100" borderRadius="xl">
        <Text color="gray.400">No active positions found.</Text>
      </Box>
    )
  }

  return (
    <VStack spacing={4} align="stretch">
      {positions?.map((position: Position) => (
        <Box 
          key={position.tokenId}
          p={6}
          bg="whiteAlpha.100"
          borderRadius="xl"
        >
          <Text color="gray.100" fontSize="lg" fontWeight="bold">
            {position.token0Symbol}/{position.token1Symbol}
          </Text>
          <Text color="gray.400">
            Fee tier: {position.fee / 10000}%
          </Text>
        </Box>
      ))}
    </VStack>
  )
}
