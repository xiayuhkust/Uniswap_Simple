import { useState } from 'react'
import { VStack, Box, Text, Button } from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import { PositionsList } from '../components/PositionsList'
import { AddLiquidityModal } from '../components/AddLiquidityModal'

export function LiquidityPage() {
  const { active } = useWeb3React()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  return (
    <Box maxW="2xl" mx="auto" mt={8}>
      <VStack spacing={6} align="stretch">
        <Box p={6} bg="whiteAlpha.100" borderRadius="xl">
          <VStack spacing={4} align="stretch">
            <Text fontSize="2xl" fontWeight="bold" color="gray.100">
              Your Liquidity Positions
            </Text>
            <Text color="gray.300">
              {active ? 'Your active liquidity positions will appear here.' : 'Connect your wallet to view your positions.'}
            </Text>
            <Button
              colorScheme="blue"
              size="lg"
              onClick={() => setIsAddModalOpen(true)}
              isDisabled={!active}
            >
              Add Liquidity
            </Button>
          </VStack>
        </Box>
        <PositionsList />
      </VStack>
      <AddLiquidityModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </Box>
  )
}
