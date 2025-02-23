import { useToast } from '@chakra-ui/react'
import { useCallback, useEffect } from 'react'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'

// Network configuration
const CHAIN_ID = 1337 // Tura Network
const TURA_NETWORK = {
  chainId: `0x${CHAIN_ID.toString(16)}`,
  chainName: 'Tura Blockchain',
  nativeCurrency: {
    name: 'TURA',
    symbol: 'TURA',
    decimals: 18,
  },
  rpcUrls: ['https://rpc-beta1.turablockchain.com'],
}

// Configure Web3React connector
export const injected = new InjectedConnector({
  supportedChainIds: [CHAIN_ID]
})

async function setupNetwork() {
  const provider = window.ethereum
  if (!provider) {
    console.error('No crypto wallet found')
    return false
  }

  // Add delay to ensure provider is ready
  await new Promise(resolve => setTimeout(resolve, 500))

  // Check if provider is initialized
  try {
    const isInitialized = await provider.request({ method: 'eth_chainId' })
    if (!isInitialized) {
      console.error('Provider not initialized')
      return false
    }
  } catch (error) {
    console.error('Failed to check provider initialization:', error)
    return false
  }

  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: TURA_NETWORK.chainId }],
    })
    
    // Add delay after network switch
    await new Promise(resolve => setTimeout(resolve, 500))
    return true
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [TURA_NETWORK],
        })
        // Add delay after adding network
        await new Promise(resolve => setTimeout(resolve, 500))
        return true
      } catch (addError) {
        console.error('Failed to add network:', addError)
        return false
      }
    }
    console.error('Failed to switch network:', switchError)
    return false
  }
}

export function useWeb3() {
  const { account, activate, deactivate, active, library } = useWeb3React<Web3Provider>()
  const toast = useToast()

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem('shouldConnectWallet') === 'true') {
        try {
          await activate(injected)
          await setupNetwork()
        } catch (error) {
          console.error('Failed to connect on page load:', error)
        }
      }
    }
    connectWalletOnPageLoad()
  }, [activate])

  const connect = useCallback(async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        toast({
          title: 'MetaMask Required',
          description: 'Please install MetaMask to connect.',
          status: 'warning',
          duration: null,
          isClosable: true,
        })
        return
      }

      await activate(injected)
      localStorage.setItem('shouldConnectWallet', 'true')
      await setupNetwork()
    } catch (error: any) {
      console.error('Connection error:', error)
      toast({
        title: 'Connection Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }, [activate, toast])

  const disconnect = useCallback(async () => {
    try {
      deactivate()
      localStorage.removeItem('shouldConnectWallet')
    } catch (error: any) {
      console.error('Disconnect error:', error)
      toast({
        title: 'Failed to Disconnect',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }, [deactivate, toast])

  return { active, account, library, connect, disconnect }
}
