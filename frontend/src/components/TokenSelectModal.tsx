import { 
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Image,
  Button
} from '@chakra-ui/react'
import type { Token } from '../types/token'
import { TEST_TOKENS } from './Swap/TokenList'
import { CONTRACT_ADDRESSES } from '../constants/addresses'

interface TokenSelectModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (token: Token) => void
  selectedToken?: Token
}

export function TokenSelectModal({
  isOpen,
  onClose,
  onSelect,
  selectedToken
}: TokenSelectModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="white">
        <ModalHeader color="black">Select Token</ModalHeader>
        <ModalCloseButton color="black" />
        <ModalBody pb={6}>
          <VStack spacing={2} align="stretch">
            {TEST_TOKENS.map((token) => (
              <Button
                key={token.address}
                onClick={() => {
                  onSelect(token)
                  onClose()
                }}
                variant="ghost"
                height="auto"
                py={2}
                justifyContent="flex-start"
                bg={selectedToken && selectedToken.address.toLowerCase() === token.address.toLowerCase() ? 'uniswap.gray.100' : 'transparent'}
                _hover={{ bg: 'uniswap.gray.100' }}
                color="black"
              >
                <HStack spacing={3}>
                  <Image
                    src={token.logoURI || 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'}
                    boxSize="24px"
                    borderRadius="full"
                    fallbackSrc="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png"
                  />
                  <VStack spacing={0} align="flex-start">
                    <Text fontWeight="medium" color="gray.700">
                      {token.address.toLowerCase() === CONTRACT_ADDRESSES.WETH.toLowerCase() ? 'TURA' : token.symbol}
                    </Text>
                    <Text fontSize="sm" color="gray.700">
                      {token.name}
                    </Text>
                  </VStack>
                </HStack>
              </Button>
            ))}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
