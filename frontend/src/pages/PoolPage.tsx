import React, { FC } from 'react';
import { VStack } from '@chakra-ui/react';
import { PoolList } from '../components/Pool/PoolList/index';

export const PoolPage: FC = () => {
  return (
    <VStack spacing={4} width="100%">
      <PoolList />
    </VStack>
  );
};
