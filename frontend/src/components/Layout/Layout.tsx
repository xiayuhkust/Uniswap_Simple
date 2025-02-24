import { Container, Flex, HStack, Link as ChakraLink, Box, useColorModeValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { WalletButton } from '../WalletButton';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Box 
        bg={useColorModeValue('white', 'gray.800')} 
        py={4} 
        borderBottom="1px"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
      >
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <HStack spacing={4}>
              <ChakraLink 
                as={Link} 
                to="/" 
                color={useColorModeValue('gray.800', 'white')}
                fontWeight="medium"
                _hover={{ color: 'blue.500' }}
              >
                Swap
              </ChakraLink>
              <ChakraLink 
                as={Link} 
                to="/pool" 
                color={useColorModeValue('gray.800', 'white')}
                fontWeight="medium"
                _hover={{ color: 'blue.500' }}
              >
                Pool
              </ChakraLink>
            </HStack>
            <Box>
              <WalletButton />
            </Box>
          </Flex>
        </Container>
      </Box>
      <Container maxW="container.xl" py={8}>
        {children}
      </Container>
    </Box>
  );
};
