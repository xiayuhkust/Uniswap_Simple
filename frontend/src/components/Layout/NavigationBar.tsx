import { HStack, Link as ChakraLink } from '@chakra-ui/react'
import { Link, useLocation } from 'react-router-dom'

export function NavigationBar() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <HStack spacing={6} ml={6}>
      <ChakraLink
        as={Link}
        to="/"
        color={isActive('/') ? 'blue.400' : 'whiteAlpha.900'}
        fontWeight={isActive('/') ? 'bold' : 'normal'}
        _hover={{ color: 'blue.400' }}
      >
        Swap
      </ChakraLink>
      <ChakraLink
        as={Link}
        to="/liquidity"
        color={isActive('/liquidity') ? 'blue.400' : 'whiteAlpha.900'}
        fontWeight={isActive('/liquidity') ? 'bold' : 'normal'}
        _hover={{ color: 'blue.400' }}
      >
        Liquidity
      </ChakraLink>
    </HStack>
  )
}
