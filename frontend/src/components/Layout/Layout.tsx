import { Box, Container, Flex, Link as ChakraLink, Spacer, useColorModeValue } from '@chakra-ui/react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import { WalletConnect } from '../WalletConnect'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const activeBg = useColorModeValue('blue.50', 'blue.900')
  const hoverBg = useColorModeValue('gray.100', 'gray.700')

  const isActive = (path: string) => location.pathname === path

  return (
    <Box minH="100vh" bg="gray.50">
      <Box bg="white" borderBottom="1px" borderColor="gray.200" py={4}>
        <Container maxW="container.xl">
          <Flex align="center">
            <Flex gap={4}>
              <ChakraLink
                as={RouterLink}
                to="/"
                fontWeight="medium"
                px={4}
                py={2}
                borderRadius="md"
                bg={isActive('/') ? activeBg : 'transparent'}
                _hover={{ bg: hoverBg }}
              >
                Swap
              </ChakraLink>
              <ChakraLink
                as={RouterLink}
                to="/pool"
                fontWeight="medium"
                px={4}
                py={2}
                borderRadius="md"
                bg={isActive('/pool') ? activeBg : 'transparent'}
                _hover={{ bg: hoverBg }}
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
