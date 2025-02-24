import { Box, HStack, Text, Button, useDisclosure, Image } from '@chakra-ui/react'
import { NumberInput } from './NumberInput'
import type { Token } from '../types/token'
import { TokenSelectModal } from './TokenSelectModal'
import { WTURA_ADDRESS } from './Swap/TokenList'

export interface TokenSelectProps {
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

  return (
    <>
      <Box width="100%">
        {label && <Text fontSize="sm" color="black" mb={2}>{label}</Text>}
        <Box p={4} borderRadius="16px" borderWidth="1px" borderColor="uniswap.gray.200">
          <HStack spacing={4}>
            <Box flex={1}>
              <NumberInput
                value={value}
                onChange={onChange}
                placeholder="0.0"
                isDisabled={isDisabled}
                color="black"
              />
            </Box>
            <Button
              onClick={onOpen}
              isDisabled={isDisabled}
              variant="ghost"
              _hover={{ bg: 'uniswap.gray.100' }}
              px={4}
              height="40px"
              color="black"
            >
              {selectedToken ? (
                <HStack spacing={2}>
                  <Image 
                    src={selectedToken.logoURI || 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'} 
                    boxSize="24px" 
                    borderRadius="full"
                    fallbackSrc="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png"
                  />
                  <Text fontWeight="medium" color="gray.100">
                    {selectedToken.address === WTURA_ADDRESS ? 'TURA' : selectedToken.symbol}
                  </Text>
                </HStack>
              ) : (
                <Text color="gray.100">Select Token</Text>
              )}
            </Button>
          </HStack>
        </Box>
      </Box>
      <TokenSelectModal
        isOpen={isOpen}
        onClose={onClose}
        onSelect={onTokenSelect!}
        selectedToken={selectedToken}
      />
    </>
  )
}
