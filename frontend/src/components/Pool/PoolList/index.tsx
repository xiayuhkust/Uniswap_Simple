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
  Button
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { usePoolList } from '../../../hooks/usePoolList';
import { useMemo } from 'react';
import { formatFeeAmount, formatTokenAmount, getTokenSymbol } from '../../../utils/format';

export function PoolList() {
  const navigate = useNavigate();
  const { pools, isLoading } = usePoolList();

  const sortedPools = useMemo(() => 
    [...pools].sort((a, b) => Number(b.volume7d - a.volume7d))
  , [pools]);

  if (isLoading) {
    return (
      <VStack spacing={4} width="100%">
        <Spinner />
      </VStack>
    );
  }

  if (pools.length === 0) {
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
    );
  }

  return (
    <Box p={6} borderRadius="xl" borderWidth="1px" width="100%">
      <VStack spacing={4} align="start" width="100%">
        <Heading size="md">All Pools</Heading>
        <Box overflowX="auto" width="100%">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Pool</Th>
                <Th>Fee</Th>
                <Th isNumeric>7d Volume</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {sortedPools.map((pool) => (
                <Tr key={pool.address}>
                  <Td>
                    <HStack spacing={1}>
                      <Text>{getTokenSymbol(pool.token0)}</Text>
                      <Text color="gray.500">/</Text>
                      <Text>{getTokenSymbol(pool.token1)}</Text>
                    </HStack>
                  </Td>
                  <Td>{formatFeeAmount(pool.fee)}</Td>
                  <Td isNumeric>{formatTokenAmount(pool.volume7d)} TURA</Td>
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
        </Box>
      </VStack>
    </Box>
  );
}
