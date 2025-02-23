
import { Button, useToast } from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import { injected, TURA_NETWORK } from '../lib/web3'
import { useEffect } from 'react'

export function WalletButton() {
  const { active, account, activate, deactivate } = useWeb3React()
  const toast = useToast()

  const switchToTuraNetwork = async (provider: any) => {
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: TURA_NETWORK.chainId }],
      })
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [TURA_NETWORK],
          })
        } catch (addError: any) {
          console.error('Failed to add network:', addError)
          throw new Error('Failed to add Tura network')
        }
      } else {
        console.error('Failed to switch network:', switchError)
        throw new Error('Failed to switch to Tura network')
      }
    }
  }

  // Auto-connect if previously connected
  // Auto-connect if previously connected
  useEffect(() => {
    const shouldConnect = localStorage.getItem('shouldConnectWallet')
    if (shouldConnect === 'true' && !active) {
      activate(injected).catch((error) => {
        console.error('Failed to auto-connect:', error)
        localStorage.removeItem('shouldConnectWallet')
      })
    }
  }, [active, activate])

  // Persist wallet connection state
  useEffect(() => {
    if (active && account) {
      localStorage.setItem('lastConnectedAddress', account)
    } else if (!active) {
      localStorage.removeItem('lastConnectedAddress')
    }
  }, [active, account])

  // Persist wallet connection state
  useEffect(() => {
    if (active && account) {
      localStorage.setItem('lastConnectedAddress', account)
    } else if (!active) {
      localStorage.removeItem('lastConnectedAddress')
    }
  }, [active, account])

  const handleClick = async () => {
    if (active) {
      try {
        deactivate()
        localStorage.removeItem('shouldConnectWallet')
      } catch (error: any) {
        console.error('Failed to disconnect:', error)
      }
    } else {
      try {
        const provider = window.ethereum
        if (!provider) {
          toast({
            title: 'MetaMask Required',
            description: 'Please install MetaMask to connect.',
            status: 'warning',
            duration: 5000,
            isClosable: true,
          })
          return
        }

        // Check current chain ID
        const chainId = await provider.request({ method: 'eth_chainId' })
        if (chainId !== TURA_NETWORK.chainId) {
          try {
            await switchToTuraNetwork(provider)
          } catch (error: any) {
            console.error('Failed to switch network:', error)
            toast({
              title: 'Network Error',
              description: error.message,
              status: 'error',
              duration: 5000,
              isClosable: true,
            })
            return
          }
        }

        await activate(injected)
        localStorage.setItem('shouldConnectWallet', 'true')
      } catch (error: any) {
        console.error('Failed to connect:', error)
        toast({
          title: 'Connection Failed',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    }
  }

  const displayAddress = account ? 
    `${account.slice(0, 6)}...${account.slice(-4)}` : 
    'Connect Wallet'

  return (
    <Button
      onClick={handleClick}
      colorScheme={active ? 'gray' : 'blue'}
      variant="solid"
      size="md"
      paddingX={6}
      data-testid="wallet-button"
      data-devinid="connect-wallet"
    >
      {displayAddress}
    </Button>
  )
}
