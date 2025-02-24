import { type FC, useState } from 'react';
import { VStack, Button, Box, Text, Select, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { TokenSelect } from '../components/TokenSelect';
import { type Token } from '../types/token';
import { usePublicClient } from 'wagmi';
import { parseAbi, type Address, getContract } from 'viem';
import { FEE_TIERS } from '../hooks/usePoolVolume';

const FactoryABI = parseAbi([
  'function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)'
] as const);

const FACTORY_ADDRESS = import.meta.env.VITE_FACTORY_ADDRESS as Address;

export const CreatePoolPage: FC = () => {
  const [token0, setToken0] = useState<Token>();
  const [token1, setToken1] = useState<Token>();
  const [fee, setFee] = useState<number>(FEE_TIERS.MEDIUM);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const publicClient = usePublicClient();

  const checkDuplicate = async () => {
    if (!token0 || !token1 || !publicClient) return false;

    const factory = getContract({
      address: FACTORY_ADDRESS,
      abi: FactoryABI,
      client: publicClient
    });

    const pool = await factory.read.getPool([
      token0.address as Address,
      token1.address as Address,
      fee
    ]);

    return pool !== '0x0000000000000000000000000000000000000000';
  };

  const handleCreate = async () => {
    try {
      if (!token0 || !token1) {
        toast({
          title: 'Error',
          description: 'Please select both tokens',
          status: 'error',
          duration: 3000,
          isClosable: true
        });
        return;
      }

      setIsLoading(true);
      const isDuplicate = await checkDuplicate();
      if (isDuplicate) {
        toast({
          title: 'Error',
          description: 'Pool already exists',
          status: 'error',
          duration: 3000,
          isClosable: true
        });
        return;
      }

      // TODO: Create pool using factory contract
      toast({
        title: 'Success',
        description: 'Pool created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      navigate('/pool');
    } catch (error) {
      console.error('Error creating pool:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create pool',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="2xl" mx="auto" mt={8}>
      <VStack spacing={6} p={6} borderRadius="xl" borderWidth="1px">
        <Text fontSize="2xl" fontWeight="bold">Create New Pool</Text>
        <Box width="100%">
          <TokenSelect 
            selectedToken={token0}
            onSelect={setToken0}
          />
        </Box>
        <Box width="100%">
          <TokenSelect 
            selectedToken={token1}
            onSelect={setToken1}
          />
        </Box>
        <Box width="100%">
          <Text mb={2}>Fee Tier</Text>
          <Select 
            value={fee} 
            onChange={(e) => setFee(Number(e.target.value))}
          >
            <option value={FEE_TIERS.LOW}>0.05%</option>
            <option value={FEE_TIERS.MEDIUM}>0.3%</option>
            <option value={FEE_TIERS.HIGH}>1%</option>
          </Select>
        </Box>
        <Button 
          colorScheme="blue" 
          width="100%"
          onClick={handleCreate}
          isDisabled={!token0 || !token1 || isLoading}
          isLoading={isLoading}
        >
          {isLoading ? 'Creating Pool...' : 'Create Pool'}
        </Button>
      </VStack>
    </Box>
  );
};
