import { Box, HStack, Text, Button, useDisclosure, Image } from '@chakra-ui/react'
import { NumberInput } from './NumberInput'
import type { Token } from '../types/token'
import { TokenSelectModal } from './TokenSelectModal'
import { CONTRACT_ADDRESSES } from '../constants/addresses'

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
              variant="outline"
              _hover={{ bg: 'uniswap.gray.100' }}
              px={4}
              height="40px"
              color="gray.700"
              borderColor="uniswap.gray.200"
              _active={{ bg: 'uniswap.gray.100' }}
            >
              {selectedToken ? (
                <HStack spacing={2}>
                  <Image 
                    src={selectedToken.logoURI || 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'} 
                    boxSize="24px" 
                    borderRadius="full"
                    fallbackSrc="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png"
                  />
                  <Text fontWeight="medium" color="gray.700">
                    {selectedToken.address.toLowerCase() === CONTRACT_ADDRESSES.WETH.toLowerCase() ? 'TURA' : selectedToken.symbol}
                  </Text>
                </HStack>
              ) : (
                <Text color="gray.700">Select Token</Text>
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
