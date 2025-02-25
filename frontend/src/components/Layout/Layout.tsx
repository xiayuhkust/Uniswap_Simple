import { Box, Container, Flex, Link as ChakraLink, Spacer } from '@chakra-ui/react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { WalletConnect } from '../WalletConnect'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  return (
    <Box minH="100vh" bg="white">
      <Box bg="white" borderBottom="1px" borderColor="uniswap.gray.200" py={4}>
        <Container maxW="container.xl">
          <Flex align="center">
            <Flex gap={4}>
              <ChakraLink
                as={RouterLink}
                to="/"
                fontWeight="medium"
                px={4}
                py={2}
                borderRadius="16px"
                color="black"
                bg={isActive('/') ? 'uniswap.gray.100' : 'transparent'}
                _hover={{ bg: 'uniswap.gray.100' }}
              >
                Swap
              </ChakraLink>
              <ChakraLink
                as={RouterLink}
                to="/pool"
                fontWeight="medium"
                px={4}
                py={2}
                borderRadius="16px"
                color="black"
                bg={isActive('/pool') ? 'uniswap.gray.100' : 'transparent'}
                _hover={{ bg: 'uniswap.gray.100' }}
              >
                Pool
              </ChakraLink>
            </Flex>
            <Spacer />
            <WalletConnect />
          </Flex>
        </Container>
      </Box>
      {children}
    </Box>
  )
}
