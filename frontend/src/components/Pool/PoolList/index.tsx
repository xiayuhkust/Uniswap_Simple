import { 
  VStack,
  Box,
  Text,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  HStack,
  Button,
  useToast,
  Badge
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { usePoolListWebSocket } from '../../../hooks/usePoolListWebSocket'
import { formatUnits } from 'viem'
import { useMemo, useEffect } from 'react'
import { Pool } from '../../../types/pool'

function formatFeeAmount(fee: number): string {
  return `${(fee / 10000).toFixed(2)}%`
}

function formatTokenAmount(amount: string | bigint): string {
  const bigintAmount = typeof amount === 'string' ? BigInt(amount) : amount;
  return Number(formatUnits(bigintAmount, 18)).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })
}

export function PoolList() {
  const navigate = useNavigate()
  const { pools, loading, error, isConnected, refetch } = usePoolListWebSocket()
  const toast = useToast()

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error loading pools',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  const sortedPools = useMemo(() => 
    [...(pools || [])].sort((a, b) => {
      // Handle potential undefined or null values
      const volumeA = a.volume24h ? BigInt(a.volume24h) : BigInt(0);
      const volumeB = b.volume24h ? BigInt(b.volume24h) : BigInt(0);
      return Number(volumeB - volumeA);
    })
  , [pools])

  if (loading) {
    return (
      <VStack spacing={4} width="100%">
        <Spinner />
      </VStack>
    )
  }

  if (!pools || pools.length === 0) {
    return (
      <VStack spacing={4} width="100%" p={8}>
        <Text color="gray.500">No pools found</Text>
        <Button
          colorScheme="blue"
          onClick={() => navigate('/pool/create')}
        >
          Create First Pool
        </Button>
      </VStack>
    )
  }

  return (
    <Box p={6} borderRadius="xl" borderWidth="1px" width="100%">
      <VStack spacing={4} align="start" width="100%">
        <HStack justifyContent="space-between" width="100%">
          <Heading size="md">All Pools</Heading>
          <HStack>
            <Badge colorScheme={isConnected ? "green" : "red"}>
              {isConnected ? "Live Updates" : "Updates Paused"}
            </Badge>
            <Button
              size="sm"
              onClick={() => refetch()}
              isLoading={loading}
            >
              Refresh
            </Button>
            <Button
              colorScheme="blue"
              size="sm"
              onClick={() => navigate('/pool/create')}
            >
              Create Pool
            </Button>
          </HStack>
        </HStack>
        <Box overflowX="auto" width="100%">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Pool</Th>
                <Th>Fee</Th>
                <Th>Liquidity</Th>
                <Th>Volume (24h)</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {sortedPools.map((pool: Pool) => (
                <Tr key={pool.address}>
                  <Td>
                    <HStack spacing={1}>
                      <Text>{pool.token0Symbol}</Text>
                      <Text color="gray.500">/</Text>
                      <Text>{pool.token1Symbol}</Text>
                    </HStack>
                  </Td>
                  <Td>{formatFeeAmount(pool.fee)}</Td>
                  <Td>{pool.liquidity ? formatTokenAmount(pool.liquidity) : 'No liquidity'}</Td>
                  <Td>{pool.volume24h ? formatTokenAmount(pool.volume24h) : '0'} TURA</Td>
                  <Td>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => navigate(`/pool/${pool.address}/add`)}
                    >
                      Add Liquidity
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Box>
  )
}
