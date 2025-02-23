
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Button,
  Text
} from '@chakra-ui/react'
import { TokenSelect } from './TokenSelect'
import { useTokenList } from '../hooks/useTokenList'

interface AddLiquidityModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddLiquidityModal({ isOpen, onClose }: AddLiquidityModalProps) {
  const tokens = useTokenList()

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
              onSelect={() => {}} 
            />
            <TokenSelect 
              token={tokens[1]} 
              onSelect={() => {}} 
            />
            <Button
              w="full"
              size="lg"
              colorScheme="blue"
              isDisabled={true}
            >
              Add Liquidity
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
