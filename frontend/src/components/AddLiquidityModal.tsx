
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
import { useState } from 'react'

interface AddLiquidityModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddLiquidityModal({ isOpen, onClose }: AddLiquidityModalProps) {
  const tokens = useTokenList()
  const [token0Index, setToken0Index] = useState(0)
  const [token1Index, setToken1Index] = useState(1)

  const handleToken0Select = () => {
    if (!tokens.length) return
    const nextIndex = (token0Index + 1) % tokens.length
    if (nextIndex === token1Index) {
      setToken0Index((nextIndex + 1) % tokens.length)
    } else {
      setToken0Index(nextIndex)
    }
  }

  const handleToken1Select = () => {
    if (!tokens.length) return
    const nextIndex = (token1Index + 1) % tokens.length
    if (nextIndex === token0Index) {
      setToken1Index((nextIndex + 1) % tokens.length)
    } else {
      setToken1Index(nextIndex)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg="gray.900" color="gray.100">
        <ModalHeader>Add Liquidity</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <Text color="gray.300">Select Token Pair</Text>
            <TokenSelect 
              token={tokens[token0Index]} 
              onSelect={handleToken0Select}
              disabled={!tokens.length}
            />
            <TokenSelect 
              token={tokens[token1Index]} 
              onSelect={handleToken1Select}
              disabled={!tokens.length}
            />
            <Button
              w="full"
              size="lg"
              colorScheme="blue"
              isDisabled={!tokens.length || token0Index === token1Index}
            >
              Add Liquidity
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
