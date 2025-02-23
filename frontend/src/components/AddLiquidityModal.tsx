
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Button,
  Text,
  useDisclosure
} from '@chakra-ui/react'
import { TokenSelect } from './TokenSelect'
import { useTokenList } from '../hooks/useTokenList'
import { useState } from 'react'

interface AddLiquidityModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddLiquidityModal({ isOpen, onClose }: AddLiquidityModalProps) {
  const tokens = useTokenList()
  const [token0Index, setToken0Index] = useState(0)
  const [token1Index, setToken1Index] = useState(1)

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg="gray.900" color="white">
        <ModalHeader>Add Liquidity</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <Text color="whiteAlpha.700">Select Token Pair</Text>
            <TokenSelect 
              token={tokens[token0Index]} 
              onSelect={() => setToken0Index((prev) => (prev + 1) % tokens.length)}
              disabled={false}
            />
            <TokenSelect 
              token={tokens[token1Index]} 
              onSelect={() => setToken1Index((prev) => (prev + 1) % tokens.length)}
              disabled={false}
            />
            <Button
              w="full"
              size="lg"
              colorScheme="blue"
              isDisabled={!tokens.length}
            >
              Add Liquidity
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
