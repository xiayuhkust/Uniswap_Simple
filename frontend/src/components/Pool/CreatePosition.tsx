import React, { FC, useState } from 'react';
import { VStack, Button, Text, Box } from '@chakra-ui/react';
import { TokenSelect } from '../TokenSelect';
import { Token } from '../../types/token';

export const CreatePosition: FC = () => {
  const [token0, setToken0] = useState<Token | undefined>();
  const [token1, setToken1] = useState<Token | undefined>();

  return (
    <VStack spacing={4} p={4} borderRadius="xl" borderWidth="1px">
      <Text fontSize="xl" fontWeight="bold">Create New Position</Text>
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
      <Button 
        colorScheme="blue" 
        width="100%"
        isDisabled={!token0 || !token1}
      >
        Preview
      </Button>
    </VStack>
  );
};
