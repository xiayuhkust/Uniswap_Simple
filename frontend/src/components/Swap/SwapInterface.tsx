import { useState } from 'react'
import { Box, VStack, Button, IconButton, useToast } from '@chakra-ui/react'
import { ArrowDownIcon } from '@chakra-ui/icons'
import { useAccount, useConnect } from 'wagmi'
import { TokenSelect } from '../TokenSelect'
import { type Token } from '../../types/token'
import { stringToBigInt } from '../../utils/bigint'
import { isValidAmount } from '../../utils/validation'

export function SwapInterface() {
  const { isConnected } = useAccount()
  const { connect } = useConnect()
  const [inputAmount, setInputAmount] = useState('')
  const [outputAmount, setOutputAmount] = useState('')
  const [inputToken, setInputToken] = useState<Token>()
  const [outputToken, setOutputToken] = useState<Token>()
  const toast = useToast()

  const validateAmounts = (input: string, output: string): string | null => {
    if (!input || !output) return "Please enter amounts"
    if (!isValidAmount(input) || !isValidAmount(output)) return "Invalid amount format"
    try {
      const inputBigInt = stringToBigInt(input)
      const outputBigInt = stringToBigInt(output)
      if (inputBigInt <= 0n || outputBigInt <= 0n) {
        return "Amount must be greater than 0"
      }
      return null
    } catch {
      return "Invalid amount format"
    }
  }

  const handleSwap = async () => {
    try {
      if (!isConnected) {
        throw new Error('Please connect your wallet first')
      }

      if (!inputToken || !outputToken) {
        throw new Error('Please select tokens')
      }

      const error = validateAmounts(inputAmount, outputAmount)
      if (error) {
        throw new Error(error)
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
      borderRadius="16px" 
      bg="white" 
      boxShadow="xl"
      border="1px"
      borderColor="uniswap.gray.200"
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
          color="uniswap.gray.500"
          _hover={{ bg: 'uniswap.gray.100' }}
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
            onClick={() => connect()} 
            width="100%" 
            size="lg"
            variant="uniswap"
          >
            Connect Wallet
          </Button>
        ) : (
          <Button
            width="100%"
            size="lg"
            variant="uniswap"
            isDisabled={!inputToken || !outputToken || validateAmounts(inputAmount, outputAmount) !== null}
            onClick={handleSwap}
          >
            Swap
          </Button>
        )}
      </VStack>
    </Box>
  )
}
