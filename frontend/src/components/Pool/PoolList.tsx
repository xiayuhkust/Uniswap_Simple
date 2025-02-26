import { type FC, useEffect } from 'react';
import { VStack, Button, Box, Text, Heading, Table, Thead, Tbody, Tr, Th, Td, Spinner, Badge, HStack, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { usePoolListWebSocket } from '../../hooks/usePoolListWebSocket';
import { formatUnits } from 'viem';
import { Pool } from '../../types/pool';

// Helper function to format token amounts
function formatTokenAmount(amount: string | bigint): string {
  const bigintAmount = typeof amount === 'string' ? BigInt(amount) : amount;
  return Number(formatUnits(bigintAmount, 18)).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

export const PoolList: FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { pools, loading, error, isConnected, refetch } = usePoolListWebSocket();
  
  // Display error toast if there's an error
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load pools',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  return (
    <VStack spacing={6} width="100%">
      <Button 
        variant="uniswap"
        width="100%" 
        onClick={() => navigate('/pool/create')}
      >
        Create New Pool
      </Button>
      <Box p={6} borderRadius="16px" borderWidth="1px" borderColor="uniswap.gray.200" width="100%">
        <VStack spacing={4} align="start" width="100%">
          <HStack justifyContent="space-between" width="100%">
            <Heading size="md" color="black">All Pools</Heading>
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
            </HStack>
          </HStack>
          {loading ? (
            <Spinner color="uniswap.pink" />
          ) : pools.length === 0 ? (
            <Text color="uniswap.gray.500">No pools found</Text>
          ) : (
            <Table variant="simple">
              <Thead bg="uniswap.gray.100">
                <Tr>
                  <Th color="uniswap.gray.500">Pool</Th>
                  <Th color="uniswap.gray.500">Fee</Th>
                  <Th color="uniswap.gray.500">Total Liquidity</Th>
                  <Th color="uniswap.gray.500">Current Price</Th>
                  <Th color="uniswap.gray.500">24h Volume</Th>
                  <Th color="uniswap.gray.500">Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {pools.map((pool: Pool) => (
                  <Tr key={pool.address} _hover={{ bg: 'uniswap.gray.100' }}>
                    <Td color="black">{`${pool.token0Symbol} / ${pool.token1Symbol}`}</Td>
                    <Td color="black">{(Number(pool.fee) / 10000).toFixed(2)}%</Td>
                    <Td color="black">
                      {pool.liquidity !== undefined && pool.liquidity !== '0'
                        ? formatTokenAmount(pool.liquidity)
                        : 'No liquidity'}
                    </Td>
                    <Td color="black">
                      {pool.tick !== undefined
                        ? `${pool.token1Symbol}/${pool.token0Symbol}`
                        : '-'}
                    </Td>
                    <Td color="black">
                      {pool.volume24h ? formatTokenAmount(pool.volume24h) : '0'}
                    </Td>
                    <Td>
                      <Button
                        size="sm"
                        variant="uniswap"
                        onClick={() => navigate(`/pool/${pool.address}/add`)}
                      >
                        Add Liquidity
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </VStack>
      </Box>
    </VStack>
  );
};
