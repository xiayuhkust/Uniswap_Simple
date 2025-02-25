import { type FC } from 'react';
import { VStack, Button, Box, Text, Heading, Table, Thead, Tbody, Tr, Th, Td, Spinner } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { usePoolList } from '../../hooks/usePoolList';
import { formatUnits } from 'viem';

export const PoolList: FC = () => {
  const navigate = useNavigate();
  const { pools, isLoading } = usePoolList();

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
          <Heading size="md" color="black">All Pools</Heading>
          {isLoading ? (
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
                  <Th color="uniswap.gray.500">7d Volume</Th>
                  <Th color="uniswap.gray.500">Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {pools.map((pool) => (
                  <Tr key={pool.address} _hover={{ bg: 'uniswap.gray.100' }}>
                    <Td color="black">{`${pool.token0Symbol} / ${pool.token1Symbol}`}</Td>
                    <Td color="black">{(Number(pool.fee) / 10000).toFixed(2)}%</Td>
                    <Td color="black">{pool.liquidity ? formatUnits(pool.liquidity, 18) : '0'}</Td>
                    <Td color="black">{pool.currentPrice ? `${pool.currentPrice.toFixed(6)} ${pool.token1Symbol}/${pool.token0Symbol}` : '-'}</Td>
                    <Td color="black">{pool.volume7d ? formatUnits(pool.volume7d, 18) : '0'}</Td>
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
