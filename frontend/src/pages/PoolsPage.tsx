import React from 'react'
import { VStack, Box, Text, Button } from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import { useNavigate } from 'react-router-dom'
import { usePositions } from '../hooks/usePositions'

export function PoolsPage() {
  const { active } = useWeb3React()
  const { positions, isLoading } = usePositions()
  const navigate = useNavigate()

  return (
    <Box maxW="2xl" mx="auto" mt={8}>
      <VStack spacing={6} align="stretch">
        <Box p={6} bg="whiteAlpha.100" borderRadius="xl">
          <VStack spacing={4} align="stretch">
            <Text fontSize="2xl" fontWeight="bold" color="white">
              Pools Overview
            </Text>
            <Text color="whiteAlpha.700">
              {active 
                ? isLoading 
                  ? 'Loading pools...' 
                  : positions?.length 
                    ? 'Your active pool positions' 
                    : 'No active pool positions'
                : 'Connect your wallet to view pools'}
            </Text>
            <Button
              colorScheme="blue"
              size="lg"
              onClick={() => navigate('/liquidity')}
              isDisabled={!active}
            >
              Create Pool
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  )
}
