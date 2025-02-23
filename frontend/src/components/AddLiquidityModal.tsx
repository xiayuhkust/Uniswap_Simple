
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
  const [selectedTokens, setSelectedTokens] = useState<[number, number]>([-1, -1])

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
              token={tokens[0]} 
              onSelect={(index) => setSelectedTokens(prev => [index, prev[1]])}
              disabled={false}
            />
            <TokenSelect 
              token={tokens[1]} 
              onSelect={(index) => setSelectedTokens(prev => [prev[0], index])}
              disabled={false}
            />
            <Button
              w="full"
              size="lg"
              colorScheme="blue"
              isDisabled={selectedTokens[0] === -1 || selectedTokens[1] === -1}
            >
              Add Liquidity
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
