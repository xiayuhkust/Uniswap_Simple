import { Button, useToast } from '@chakra-ui/react'
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { useEffect, useState } from 'react'
import { tura } from '../../providers/chains'

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: Array<unknown> }) => Promise<unknown>;
      on: <T>(event: string, handler: (param: T) => void) => void;
      removeListener: <T>(event: string, handler: (param: T) => void) => void;
    };
  }
}

export function SimpleWalletConnect() {
  const { address, isConnected, chainId } = useAccount()
  const { connect, isPending: isConnectPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain, isPending: isSwitchPending } = useSwitchChain()
  const [isConnecting, setIsConnecting] = useState(false)
  const toast = useToast()

  useEffect(() => {
    const shouldConnect = localStorage.getItem('shouldConnectWallet')
    if (shouldConnect === 'true' && !isConnected) {
      const connectWallet = async () => {
        try {
          await connect({ connector: injected() })
        } catch (error) {
          console.error('Failed to auto-connect:', error)
          localStorage.removeItem('shouldConnectWallet')
        }
      }
      connectWallet()
    }
  }, [isConnected, connect])

  useEffect(() => {
    if (isConnected && address) {
      localStorage.setItem('lastConnectedAddress', address)
    } else if (!isConnected) {
      localStorage.removeItem('lastConnectedAddress')
    }
  }, [isConnected, address])

  const handleConnect = async () => {
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

      // Check if we need to switch networks
      if (chainId !== tura.id) {
        try {
          await switchChain({ chainId: tura.id })
        } catch (error: any) {
          console.error('Failed to switch network:', error)
          toast({
            title: 'Network Error',
            description: error.message || 'Failed to switch to Tura network',
            status: 'error',
            duration: 5000,
            isClosable: true,
          })
          return
        }
      }

      await connect({ connector: injected() })
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
    if (isConnected) {
      try {
        disconnect()
        localStorage.removeItem('shouldConnectWallet')
      } catch (error: any) {
        console.error('Failed to disconnect:', error)
      }
    } else {
      await handleConnect()
    }
  }

  const isPending = isConnectPending || isSwitchPending || isConnecting

  return (
    <Button
      onClick={handleClick}
      colorScheme={isConnected ? 'gray' : 'blue'}
      isLoading={isPending}
      loadingText="Connecting..."
      data-testid="wallet-button"
      data-devinid="connect-wallet"
    >
      {isConnected ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect Wallet'}
    </Button>
  )
}
