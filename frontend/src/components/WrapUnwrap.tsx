import { useState, useEffect } from 'react'
import {
  VStack,
  HStack,
  Button,
  Text,
  Input,
  useToast,
  Box,
  Divider
} from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { CONTRACT_ADDRESSES } from '../constants/addresses'
import { TOKEN_ABI } from '../constants/abis'

export function WrapUnwrap() {
  const wethAddress = CONTRACT_ADDRESSES.WETH
  const [amount, setAmount] = useState('')
  const [isWrapping, setIsWrapping] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { active, library, account } = useWeb3React()
  const toast = useToast()

  const handleAction = async () => {
    if (!amount || !active || !library || !account) return
    
    setIsLoading(true)
    try {
      const weth = new ethers.Contract(
        CONTRACT_ADDRESSES.WETH,
        [
          'function deposit() public payable',
          'function withdraw(uint256) public',
          'function balanceOf(address) external view returns (uint256)'
        ],
        library.getSigner()
      )
      
      if (isWrapping) {
        await weth.deposit({
          value: ethers.utils.parseEther(amount)
        })
      } else {
        await weth.withdraw(
          ethers.utils.parseEther(amount)
        )
      }
      
      toast({
        title: `${isWrapping ? 'Wrap' : 'Unwrap'} Successful`,
        description: `${amount} ${isWrapping ? 'Tura → WTURA' : 'WTURA → Tura'}
To see WTURA in MetaMask:
1. Click "Import Tokens"
2. Enter address: ${wethAddress}
3. Click "Add Custom Token"
4. Wait a few seconds for balance to update`,
        status: 'success',
        duration: 15000,
        isClosable: true,
      })
      setAmount('')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box w="full" bg="whiteAlpha.100" p={6} borderRadius="xl">
      <VStack spacing={4}>
        <HStack w="full" justify="space-between">
          <Text fontSize="xl" fontWeight="bold" color="white">
            {isWrapping ? 'Wrap Tura' : 'Unwrap WTURA'}
          </Text>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsWrapping(!isWrapping)}
            colorScheme="blue"
          >
            {isWrapping ? 'Switch to Unwrap' : 'Switch to Wrap'}
          </Button>
        </HStack>
        
        <Divider borderColor="whiteAlpha.200" />
        
        <VStack w="full" spacing={2}>
          <Text color="whiteAlpha.700" fontSize="sm" alignSelf="start">
            Amount
          </Text>
          <Input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            type="number"
            min="0"
            bg="whiteAlpha.100"
            border="none"
            _focus={{ ring: 1, ringColor: 'blue.500' }}
            _hover={{ bg: 'whiteAlpha.200' }}
            fontSize="lg"
          />
        </VStack>
        
        <Button
          w="full"
          size="lg"
          isLoading={isLoading}
          onClick={handleAction}
          isDisabled={!active || !amount}
          colorScheme="blue"
        >
          {isWrapping ? 'Wrap' : 'Unwrap'}
        </Button>
      </VStack>
    </Box>
  )
}
