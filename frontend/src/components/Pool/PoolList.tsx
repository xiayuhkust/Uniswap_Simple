import React, { FC } from 'react';
import { VStack, Button, Box, Text, Heading } from '@chakra-ui/react';

export const PoolList: FC = () => {
  return (
    <VStack spacing={4} width="100%">
      <Button 
        colorScheme="blue" 
        width="100%" 
        onClick={() => console.log('Create new position')}
      >
        Create Position
      </Button>
      <Box p={6} borderRadius="xl" borderWidth="1px" width="100%">
        <VStack spacing={4} align="start">
          <Heading size="md">Your Positions</Heading>
          <Text color="gray.500">
            Your active liquidity positions will appear here
          </Text>
        </VStack>
      </Box>
    </VStack>
  );
};
