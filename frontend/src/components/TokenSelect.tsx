import { Box, HStack, Text, Button, useColorModeValue, VStack, Image, useDisclosure } from '@chakra-ui/react'
import { NumberInput } from './NumberInput'
import type { Token } from '../types/token'
import { TokenSelectModal } from './TokenSelectModal'
import { WTURA_ADDRESS } from '../components/Swap/TokenList'

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
  const { isOpen, onOpen, onClose } = useDisclosure()
  const buttonBgColor = useColorModeValue('gray.100', 'whiteAlpha.200')
  const buttonHoverBgColor = useColorModeValue('gray.200', 'whiteAlpha.300')

  return (
    <>
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
              onClick={onOpen}
              isDisabled={isDisabled}
              display="flex"
              alignItems="center"
              bg={buttonBgColor}
              _hover={{ bg: buttonHoverBgColor }}
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
      <TokenSelectModal
        isOpen={isOpen}
        onClose={onClose}
        onSelect={onTokenSelect!}
        selectedToken={selectedToken}
      />
    </>
  )
}
