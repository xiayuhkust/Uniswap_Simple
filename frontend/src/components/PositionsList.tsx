
import { VStack, Box, Text, Spinner } from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import { usePositions } from '../hooks/usePositions'
import type { Position } from '../types/position'
import { type FC } from 'react'

export const PositionsList: FC = () => {
  type PositionWithSymbols = Position & {
    token0Symbol: string
    token1Symbol: string
  }
  const { active } = useWeb3React()
  const { positions = [], isLoading = false } = usePositions() as { positions: PositionWithSymbols[], isLoading: boolean } ?? {}

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
      {positions?.map((position) => (
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
