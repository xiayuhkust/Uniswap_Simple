import { Box, HStack, Image, Text, Button, useColorModeValue } from '@chakra-ui/react'
import type { Token } from '../types/token'

interface TokenSelectProps {
  token: Token
  onSelect?: () => void
  disabled?: boolean
}

export function TokenSelect({ token, onSelect, disabled }: TokenSelectProps) {
  const bgColor = useColorModeValue('gray.100', 'whiteAlpha.200')
  const hoverBgColor = useColorModeValue('gray.200', 'whiteAlpha.300')

  return (
    <Button
      as={Box}
      onClick={onSelect}
      disabled={disabled}
      w="full"
      p={4}
      bg={bgColor}
      _hover={{ bg: hoverBgColor }}
      borderRadius="xl"
      display="block"
      textAlign="left"
    >
      <HStack spacing={3}>
        <Image 
          src={token.logoURI} 
          boxSize="24px" 
          borderRadius="full"
          fallbackSrc="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png"
        />
        <Box flex={1} overflow="hidden">
          <Text 
            fontSize="md" 
            fontWeight="medium"
            isTruncated
          >
            {token.symbol === 'WTURA' ? 'Tura' : token.symbol}
          </Text>
          <Text 
            fontSize="sm" 
            color="gray.500"
            isTruncated
          >
            {token.name}
          </Text>
        </Box>
      </HStack>
    </Button>
  )
}
