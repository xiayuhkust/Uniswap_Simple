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
  useToast
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { usePoolList } from '../../../hooks/usePoolList'
import { formatUnits } from 'viem'
import { useMemo } from 'react'

function formatFeeAmount(fee: number): string {
  return `${(fee / 10000).toFixed(2)}%`
}

function formatTokenAmount(amount: bigint): string {
  return Number(formatUnits(amount, 18)).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })
}

export function PoolList() {
  const navigate = useNavigate()
  const { pools, isLoading, error, refetch } = usePoolList()
  const toast = useToast()

  // Show error toast if there's an error
  useMemo(() => {
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
    [...(pools || [])].sort((a, b) => Number(b.volume7d - a.volume7d))
  , [pools])

  if (isLoading) {
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
            <Button
              size="sm"
              onClick={() => refetch()}
              isLoading={isLoading}
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
              {sortedPools.map((pool) => (
                <Tr key={pool.address}>
                  <Td>
                    <HStack spacing={1}>
                      <Text>{pool.token0Symbol}</Text>
                      <Text color="gray.500">/</Text>
                      <Text>{pool.token1Symbol}</Text>
                    </HStack>
                  </Td>
                  <Td>{formatFeeAmount(pool.fee)}</Td>
                  <Td>{formatTokenAmount(pool.liquidity)}</Td>
                  <Td>{formatTokenAmount(pool.volume7d)} TURA</Td>
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
