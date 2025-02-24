import { type FC } from 'react';
import { VStack, Button, Box, Text, Heading, Table, Thead, Tbody, Tr, Th, Td, Spinner } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { usePoolList } from '../../hooks/usePoolList';
import { formatUnits } from 'viem';

export const PoolList: FC = () => {
  const navigate = useNavigate();
  const { pools, isLoading } = usePoolList();

  return (
    <VStack spacing={4} width="100%">
      <Button 
        colorScheme="blue" 
        width="100%" 
        onClick={() => navigate('/pool/create')}
      >
        Create New Pool
      </Button>
      <Box p={6} borderRadius="xl" borderWidth="1px" width="100%">
        <VStack spacing={4} align="start" width="100%">
          <Heading size="md">All Pools</Heading>
          {isLoading ? (
            <Spinner />
          ) : pools.length === 0 ? (
            <Text color="gray.400">No pools found</Text>
          ) : (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Pool</Th>
                  <Th>Fee</Th>
                  <Th>7d Volume</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {pools.map((pool) => (
                  <Tr key={pool.address}>
                    <Td>{`${pool.token0Symbol} / ${pool.token1Symbol}`}</Td>
                    <Td>{(Number(pool.fee) / 10000).toFixed(2)}%</Td>
                    <Td>{formatUnits(pool.volume7d, 18)}</Td>
                    <Td>
                      <Button
                        size="sm"
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
