import { Button, useToast } from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import React, { useEffect, useState } from 'react'
import { injected, TURA_NETWORK } from '../../lib/web3'

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: (params: any) => void) => void
      removeListener: (event: string, callback: (params: any) => void) => void
    }
  }
}

export function SimpleWalletConnect() {
  const { activate, active, account, deactivate } = useWeb3React()
  const [isConnecting, setIsConnecting] = useState(false)
  const toast = useToast()

  useEffect(() => {
    const shouldConnect = localStorage.getItem('shouldConnectWallet')
    if (shouldConnect === 'true' && !active) {
      activate(injected).catch((error) => {
        console.error('Failed to auto-connect:', error)
        localStorage.removeItem('shouldConnectWallet')
      })
    }
  }, [active, activate])

  useEffect(() => {
    if (active && account) {
      localStorage.setItem('lastConnectedAddress', account)
    } else if (!active) {
      localStorage.removeItem('lastConnectedAddress')
    }
  }, [active, account])

  const connect = async () => {
    setIsConnecting(true)
    try {
      const { ethereum } = window
      if (!ethereum) {
        toast({
          title: 'MetaMask Required',
          description: 'Please install MetaMask to connect.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        })
        return
      }

      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: TURA_NETWORK.chainId }],
        })
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [TURA_NETWORK],
            })
          } catch (addError) {
            console.error('Failed to add network:', addError)
            toast({
              title: 'Network Error',
              description: 'Failed to add Tura network',
              status: 'error',
              duration: 5000,
              isClosable: true,
            })
            return
          }
        } else {
          console.error('Failed to switch network:', switchError)
          toast({
            title: 'Network Error',
            description: 'Failed to switch to Tura network',
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
        description: error.message || 'Failed to connect wallet',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleClick = async () => {
    if (active) {
      try {
        deactivate()
        localStorage.removeItem('shouldConnectWallet')
      } catch (error: any) {
        console.error('Failed to disconnect:', error)
      }
    } else {
      await connect()
    }
  }

  return (
    <Button
      onClick={handleClick}
      colorScheme={active ? 'gray' : 'blue'}
      isLoading={isConnecting}
      loadingText="Connecting..."
      data-testid="wallet-button"
      data-devinid="connect-wallet"
    >
      {active ? `Connected: ${account?.slice(0, 6)}...${account?.slice(-4)}` : 'Connect Wallet'}
    </Button>
  )
}
