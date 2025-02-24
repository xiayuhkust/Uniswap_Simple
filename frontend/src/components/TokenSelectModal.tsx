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
  Button,
  useColorModeValue
} from '@chakra-ui/react'
import type { Token } from '../types/token'

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
  const bgColor = useColorModeValue('gray.50', 'gray.700')
  const hoverBgColor = useColorModeValue('gray.100', 'gray.600')

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Token</ModalHeader>
        <ModalCloseButton />
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
                bg={token.address === selectedToken?.address ? bgColor : 'transparent'}
                _hover={{ bg: hoverBgColor }}
              >
                <HStack spacing={3}>
                  <Image
                    src={token.logoURI || 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'}
                    boxSize="24px"
                    borderRadius="full"
                    fallbackSrc="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png"
                  />
                  <VStack spacing={0} align="flex-start">
                    <Text fontWeight="medium">
                      {token.address === WTURA_ADDRESS ? 'TURA' : token.symbol}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
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
