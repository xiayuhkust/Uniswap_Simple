import { useState } from 'react'
import { VStack, IconButton, Text, Button, useToast } from '@chakra-ui/react'
import { TokenSelect } from '../TokenSelect'
import { type Token } from '../../types/token'
import { useAccount, useConnect } from 'wagmi'
import { injected } from 'wagmi/connectors'

export function SwapInterface() {
  const { isConnected: active } = useAccount()
  const { connect: connectWallet } = useConnect({
    connector: injected()
  })
  const [inputAmount, setInputAmount] = useState<string>('')
  const [outputAmount, setOutputAmount] = useState<string>('')
  const [inputToken, setInputToken] = useState<Token | undefined>(undefined)
  const [outputToken, setOutputToken] = useState<Token | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const handleSwap = async () => {
    try {
      if (!active) {
        throw new Error('Please connect your wallet first')
      }

      if (!inputToken || !outputToken) {
        throw new Error('Please select tokens')
      }

      if (!inputAmount || !outputAmount) {
        throw new Error('Please enter amounts')
      }

      setIsLoading(true)
      // TODO: Implement swap logic
      
      toast({
        title: 'Success',
        description: 'Swap completed successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to swap',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VStack spacing={4} width="100%">
      <TokenSelect
        value={inputAmount}
        onChange={(value: string) => setInputAmount(value)}
        label="You Pay"
        selectedToken={inputToken}
        onTokenSelect={setInputToken}
        isDisabled={!active}
      />
      
      <IconButton
        aria-label="Switch tokens"
        icon={<Text>↓</Text>}
        variant="ghost"
        onClick={() => {
          const tempToken = inputToken
          setInputToken(outputToken)
          setOutputToken(tempToken)
          const tempAmount = inputAmount
          setInputAmount(outputAmount)
          setOutputAmount(tempAmount)
        }}
        isDisabled={!active}
      />
      
      <TokenSelect
        value={outputAmount}
        onChange={setOutputAmount}
        label="You Receive"
        selectedToken={outputToken}
        onTokenSelect={setOutputToken}
        isDisabled={!active}
      />

      {!active ? (
        <Button 
          onClick={() => connectWallet()} 
          width="100%" 
          colorScheme="blue"
        >
          Connect Wallet
        </Button>
      ) : (
        <Button
          width="100%"
          colorScheme="blue"
          isLoading={isLoading}
          isDisabled={!inputAmount || !outputAmount || !inputToken || !outputToken}
          onClick={handleSwap}
        >
          Swap
        </Button>
      )}
    </VStack>
  )
}
