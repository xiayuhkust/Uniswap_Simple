import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { VStack, Box, Text, Button, useToast, Spinner } from '@chakra-ui/react'
import { usePoolList } from '../hooks/usePoolList'
import { usePoolData } from '../hooks/usePoolData'
import { useRemoveLiquidity } from '../hooks/useRemoveLiquidity'
import { useAccount } from 'wagmi'
import { type Address } from 'viem'
import { validateTicks, MIN_TICK, MAX_TICK } from '../constants/ticks'
import { ZERO_BIGINT, calculatePrice, formatPrice } from '../utils/bigint'

export function RemoveLiquidityPage() {
  const { poolAddress } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { isConnected } = useAccount()
  const { pools, isLoading: poolsLoading } = usePoolList()
  
  // Validate pool address format
  const isValidAddress = poolAddress?.match(/^0x[a-fA-F0-9]{40}$/)
  const validatedPoolAddress = isValidAddress ? poolAddress as Address : undefined
  
  const { removeLiquidityPosition } = useRemoveLiquidity(validatedPoolAddress || '0x0000000000000000000000000000000000000000' as Address)
  // These variables will be used in future implementation of position management
  const [lowerTick] = useState(MIN_TICK)
  const [upperTick] = useState(MAX_TICK)
  const [liquidity] = useState<bigint>(0n)
  const [isRemoving, setIsRemoving] = useState(false)
  
  // Find pool data from poolList
  const pool = pools.find((p: { address: string }) => p.address === validatedPoolAddress)

  const { slot0, isLoading: poolDataLoading } = usePoolData(validatedPoolAddress || '0x0000000000000000000000000000000000000000' as Address)

  if (!isValidAddress) {
    return (
      <Box maxW="2xl" mx="auto" mt={8} p={6} bg="white" borderRadius="xl" borderWidth="1px">
        <VStack spacing={4}>
          <Text fontSize="xl" color="red.500">Invalid pool address format</Text>
          <Button onClick={() => navigate('/pool')} variant="outline">Back to Pools</Button>
        </VStack>
      </Box>
    )
  }

  if (poolsLoading || poolDataLoading) {
    return (
      <Box maxW="2xl" mx="auto" mt={8} p={6} bg="white" borderRadius="xl" borderWidth="1px">
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading pool data...</Text>
        </VStack>
      </Box>
    )
  }

  if (!pool) {
    return (
      <Box maxW="2xl" mx="auto" mt={8} p={6} bg="white" borderRadius="xl" borderWidth="1px">
        <VStack spacing={4}>
          <Text fontSize="xl">Pool not found</Text>
          <Button onClick={() => navigate('/pool')} variant="outline">Back to Pools</Button>
        </VStack>
      </Box>
    )
  }

  return (
    <Box maxW="2xl" mx="auto" mt={8}>
      <VStack spacing={6} align="stretch">
        <Box p={6} bg="white" borderRadius="xl" borderWidth="1px" borderColor="gray.200">
          <VStack spacing={4} align="stretch">
            <Text fontSize="2xl" fontWeight="bold" color="black">
              Remove Liquidity
            </Text>
            <Text color="gray.600">
              {`${pool.token0Symbol}/${pool.token1Symbol} Pool - ${(Number(pool.fee || 0) / 10000).toFixed(2)}% Fee`}
            </Text>

            <Text mt={2} fontSize="sm" color="gray.500">
              Current Price: {slot0 && slot0.sqrtPriceX96 !== ZERO_BIGINT
                ? formatPrice(calculatePrice(BigInt(slot0.sqrtPriceX96)))
                : '0.000000'} {pool.token1Symbol} per {pool.token0Symbol}
            </Text>

            <Button
              size="lg"
              variant="uniswap"
              isDisabled={!isConnected || isRemoving || poolDataLoading}
              isLoading={isRemoving}
              onClick={async () => {
                if (!isConnected) {
                  toast({
                    title: "Connection Required",
                    description: "Please connect your wallet to remove liquidity",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  })
                  return
                }

                if (!validateTicks(lowerTick, upperTick)) {
                  toast({
                    title: "Invalid Price Range",
                    description: `Tick range must be between ${MIN_TICK} and ${MAX_TICK}, and lower tick (${lowerTick}) must be less than upper tick (${upperTick})`,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  })
                  return
                }

                setIsRemoving(true)
                try {
                  const tx = await removeLiquidityPosition(
                    lowerTick,
                    upperTick,
                    liquidity
                  )

                  if (!tx) throw new Error('Transaction failed')

                  toast({
                    title: "Success",
                    description: "Liquidity removed successfully",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                  })
                  // Navigate back to pool list after success
                  navigate('/pool')
                } catch (error) {
                  const err = error as Error
                  toast({
                    title: "Failed to Remove Liquidity",
                    description: err.message || "Failed to remove liquidity",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  })
                  console.error('Error removing liquidity:', error)
                } finally {
                  setIsRemoving(false)
                }
              }}
            >
              {!isConnected ? 'Connect Wallet' : 
               isRemoving ? 'Processing...' : 
               'Remove Liquidity'}
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/pool')}
              _hover={{ bg: 'gray.100' }}
            >
              Back to Pools
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  )
}
