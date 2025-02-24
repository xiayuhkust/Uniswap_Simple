import { useState } from 'react'
import { Box, VStack, Button, IconButton, useToast } from '@chakra-ui/react'
import { ArrowDownIcon } from '@chakra-ui/icons'
import { useAccount, useConnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { TokenSelect } from '../TokenSelect'
import { type Token } from '../../types/token'

export function SwapInterface() {
  const { isConnected } = useAccount()
  const { connect } = useConnect()
  const [inputAmount, setInputAmount] = useState('')
  const [outputAmount, setOutputAmount] = useState('')
  const [inputToken, setInputToken] = useState<Token>()
  const [outputToken, setOutputToken] = useState<Token>()
  const toast = useToast()

  const handleSwap = async () => {
    try {
      if (!isConnected) {
        throw new Error('Please connect your wallet first')
      }

      if (!inputToken || !outputToken) {
        throw new Error('Please select tokens')
      }

      if (!inputAmount || !outputAmount) {
        throw new Error('Please enter amounts')
      }

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
    }
  }

  return (
    <Box 
      p={6} 
      borderRadius="xl" 
      bg="white" 
      boxShadow="xl"
      border="1px"
      borderColor="gray.200"
    >
      <VStack spacing={4}>
        <TokenSelect
          value={inputAmount}
          onChange={setInputAmount}
          label="You Pay"
          selectedToken={inputToken}
          onTokenSelect={setInputToken}
          isDisabled={!isConnected}
        />
        
        <IconButton
          aria-label="Switch tokens"
          icon={<ArrowDownIcon />}
          variant="ghost"
          onClick={() => {
            const tempToken = inputToken
            setInputToken(outputToken)
            setOutputToken(tempToken)
            const tempAmount = inputAmount
            setInputAmount(outputAmount)
            setOutputAmount(tempAmount)
          }}
          isDisabled={!isConnected}
        />
        
        <TokenSelect
          value={outputAmount}
          onChange={setOutputAmount}
          label="You Receive"
          selectedToken={outputToken}
          onTokenSelect={setOutputToken}
          isDisabled={!isConnected}
        />

        {!isConnected ? (
          <Button 
            onClick={() => connect({ connector: new InjectedConnector() })} 
            width="100%" 
            size="lg"
            colorScheme="blue"
          >
            Connect Wallet
          </Button>
        ) : (
          <Button
            width="100%"
            size="lg"
            colorScheme="blue"
            isDisabled={!inputAmount || !outputAmount || !inputToken || !outputToken}
            onClick={handleSwap}
          >
            Swap
          </Button>
        )}
      </VStack>
    </Box>
  )
}
