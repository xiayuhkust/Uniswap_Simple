import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { VStack, Box, Text, Button, useToast, HStack } from '@chakra-ui/react'
import { NumberInput } from '../components/NumberInput'
import { TickRangeInput } from '../components/TickRangeInput'
import { usePoolList } from '../hooks/usePoolList'
import { usePoolData } from '../hooks/usePoolData'
import { useAddLiquidity } from '../hooks/useAddLiquidity'
import { useAccount } from 'wagmi'
import { type Address } from 'viem'
import { LiquidityMath } from '../utils/liquidityMath'

export function AddLiquidityPage() {
  const { poolAddress } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { isConnected } = useAccount()
  const { pools, isLoading } = usePoolList()
  const [amount0, setAmount0] = useState('')
  const [amount1, setAmount1] = useState('')
  const { checkAndApproveTokens, isApproving } = useAddLiquidity(poolAddress as Address)
  const [lowerTick, setLowerTick] = useState(-887220)
  const [upperTick, setUpperTick] = useState(887220)
  const [isAmount0Active, setIsAmount0Active] = useState(true)
  
  const { slot0, liquidity, fee, isLoading: poolDataLoading, calculateAmount1ForAmount0, calculateAmount0ForAmount1 } = usePoolData(poolAddress as Address)

  // Find pool data from poolList
  const pool = pools.find(p => p.address === (poolAddress as Address))

  const handleTickRangeChange = (lower: number, upper: number) => {
    setLowerTick(lower)
    setUpperTick(upper)
    
    // Recalculate amounts based on new tick range
    if (isAmount0Active && amount0) {
      setAmount1(calculateAmount1ForAmount0(amount0))
    } else if (!isAmount0Active && amount1) {
      setAmount0(calculateAmount0ForAmount1(amount1))
    }
  }

  if (isLoading || poolDataLoading) {
    return (
      <Box maxW="2xl" mx="auto" mt={8}>
        <Text>Loading pool data...</Text>
      </Box>
    )
  }

  if (!pool) {
    return (
      <Box maxW="2xl" mx="auto" mt={8}>
        <Text>Pool not found</Text>
        <Button onClick={() => navigate('/pool')}>Back to Pools</Button>
      </Box>
    )
  }

  return (
    <Box maxW="2xl" mx="auto" mt={8}>
      <VStack spacing={6} align="stretch">
        <Box p={6} bg="white" borderRadius="xl" borderWidth="1px" borderColor="gray.200">
          <VStack spacing={4} align="stretch">
            <Text fontSize="2xl" fontWeight="bold" color="black">
              Add Liquidity
            </Text>
            <Text color="gray.600">
              {`${pool.token0Symbol}/${pool.token1Symbol} Pool - ${(Number(pool.fee) / 10000).toFixed(2)}% Fee`}
            </Text>

            <Box>
              <Text mb={2} color="gray.600">Amount {pool.token0Symbol}</Text>
              <NumberInput
                value={amount0}
                onChange={(value) => {
                  setAmount0(value)
                  setAmount1(calculateAmount1ForAmount0(value))
                  setIsAmount0Active(true)
                }}
                placeholder="0.0"
                size="lg"
              />
            </Box>

            <Box>
              <Text mb={2} color="gray.600">Amount {pool.token1Symbol}</Text>
              <NumberInput
                value={amount1}
                onChange={(value) => {
                  setAmount1(value)
                  setAmount0(calculateAmount0ForAmount1(value))
                  setIsAmount0Active(false)
                }}
                placeholder="0.0"
                size="lg"
              />
            </Box>

            <HStack spacing={4} width="100%">
              <Button
                size="sm"
                variant={lowerTick === -887220 && upperTick === 887220 ? "uniswap" : "outline"}
                onClick={() => {
                  setLowerTick(-887220)
                  setUpperTick(887220)
                }}
              >
                Full Range
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setLowerTick(-443610)
                  setUpperTick(443610)
                }}
              >
                Concentrated
              </Button>
            </HStack>

            <Box>
              <Text mb={2} color="gray.600">Price Range</Text>
              <TickRangeInput onRangeChange={handleTickRangeChange} />
              <Text mt={2} fontSize="sm" color="gray.500">
                Current Price: {slot0 ? (Number(slot0.sqrtPriceX96 * slot0.sqrtPriceX96) / 2n**192n).toFixed(6) : '-'} {pool.token1Symbol} per {pool.token0Symbol}
              </Text>
            </Box>

            <Button
              size="lg"
              variant="uniswap"
              isDisabled={!isConnected || !amount0 || !amount1 || lowerTick >= upperTick || poolDataLoading || isApproving}
              onClick={() => {
                if (!isConnected) {
                  toast({
                    title: "Connection Required",
                    description: "Please connect your wallet to add liquidity",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  })
                  return
                }

                if (!amount0 || !amount1) {
                  toast({
                    title: "Invalid Amounts",
                    description: "Please enter valid amounts for both tokens",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  })
                  return
                }

                if (lowerTick >= upperTick) {
                  toast({
                    title: "Invalid Price Range",
                    description: "Lower tick must be less than upper tick",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  })
                  return
                }

                const success = await checkAndApproveTokens(amount0, amount1)
                if (!success) {
                  toast({
                    title: "Approval Failed",
                    description: "Failed to approve tokens",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  })
                  return
                }

                // Will implement actual liquidity addition in next step
                toast({
                  title: "Tokens Approved",
                  description: "Ready to add liquidity in next step",
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                })
              }}
            >
              {isConnected ? 'Add Liquidity' : 'Connect Wallet'}
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  )
}
