import { Box, HStack, Text, Button, useColorModeValue, VStack, Image } from '@chakra-ui/react'
import { NumberInput } from './NumberInput'
import type { Token } from '../types/token'

interface TokenSelectProps {
  value: string
  onChange: (value: string) => void
  label?: string
  selectedToken?: Token
  onTokenSelect?: (token: Token) => void
  isDisabled?: boolean
}

const WTURA_ADDRESS = '0xF0e8a104Cc6ecC7bBa4Dc89473d1C64593eA69be'
const TEST_TOKENS: Token[] = [
  {
    address: WTURA_ADDRESS,
    symbol: 'WTURA',
    name: 'Wrapped TURA',
    decimals: 18,
    logoURI: ''
  },
  {
    address: '0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9',
    symbol: 'TT1',
    name: 'Test Token 1',
    decimals: 18,
    logoURI: ''
  },
  {
    address: '0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122',
    symbol: 'TT2',
    name: 'Test Token 2',
    decimals: 18,
    logoURI: ''
  }
]

export function TokenSelect({ 
  value,
  onChange,
  label,
  selectedToken,
  onTokenSelect,
  isDisabled 
}: TokenSelectProps) {
  const bgColor = useColorModeValue('gray.100', 'whiteAlpha.200')
  const hoverBgColor = useColorModeValue('gray.200', 'whiteAlpha.300')

  return (
    <VStack spacing={2} width="100%" align="start">
      {label && <Text fontSize="sm" color="gray.500">{label}</Text>}
      <Box width="100%" p={4} borderRadius="xl" borderWidth="1px">
        <HStack spacing={4}>
          <NumberInput
            value={value}
            onChange={onChange}
            placeholder="0.0"
            isDisabled={isDisabled}
          />
          <Button
            onClick={() => {
              const token = TEST_TOKENS[0]
              onTokenSelect?.(token)
            }}
            isDisabled={isDisabled}
            display="flex"
            alignItems="center"
          >
            {selectedToken ? (
              <HStack spacing={2}>
                <Image 
                  src={selectedToken.logoURI || 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'} 
                  boxSize="24px" 
                  borderRadius="full"
                  fallbackSrc="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png"
                />
                <Text>
                  {selectedToken.address === WTURA_ADDRESS ? 'TURA' : selectedToken.symbol}
                </Text>
              </HStack>
            ) : (
              'Select Token'
            )}
          </Button>
        </HStack>
      </Box>
    </VStack>
  )
}
