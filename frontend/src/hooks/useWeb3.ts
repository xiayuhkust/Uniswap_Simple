import { useToast } from '@chakra-ui/toast'
import { useCallback, useEffect } from 'react'
import { Web3Provider, ExternalProvider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'

declare global {
  interface Window {
    ethereum?: ExternalProvider;
  }
}

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
  if (!provider?.request) {
    console.error('No crypto wallet found')
    return false
  }

  try {
    // Check current network first
    const currentChainId = await provider.request({ method: 'eth_chainId' })
    
    // If already on Tura network, return success
    if (currentChainId === TURA_NETWORK.chainId) {
      return true
    }

    // Add delay before network operations
    await new Promise(resolve => setTimeout(resolve, 500))

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: TURA_NETWORK.chainId }],
      })
      return true
    } catch (switchError: any) {
      // Only try to add network if it doesn't exist
      if (switchError.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [TURA_NETWORK],
          })
          return true
        } catch (addError) {
          console.error('Failed to add network:', addError)
          return false
        }
      }
      console.error('Failed to switch network:', switchError)
      return false
    }
  } catch (error) {
    console.error('Failed to setup network:', error)
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
      if (!window.ethereum?.request) {
        toast({
          title: 'Wallet Required',
          description: 'Please install a Web3 wallet to connect.',
          status: 'warning',
          duration: null,
          isClosable: true,
        })
        return
      }

      // Setup network before activation
      const networkReady = await setupNetwork()
      if (!networkReady) {
        throw new Error('Failed to setup network')
      }

      // Add delay before activation
      await new Promise(resolve => setTimeout(resolve, 500))

      await activate(injected)
      localStorage.setItem('shouldConnectWallet', 'true')
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
