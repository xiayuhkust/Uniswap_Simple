import { Box, HStack, Text, Button, useColorModeValue, VStack } from '@chakra-ui/react'
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
            onClick={() => onTokenSelect?.({
              address: '0x...',
              symbol: 'TOKEN',
              decimals: 18,
              name: 'Token',
              logoURI: ''
            })}
            isDisabled={isDisabled}
          >
            {selectedToken ? selectedToken.symbol : 'Select Token'}
          </Button>
        </HStack>
      </Box>
    </VStack>
  )
}
