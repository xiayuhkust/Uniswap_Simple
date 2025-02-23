
import { Button, useToast } from '@chakra-ui/react'
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { useEffect } from 'react'
import { tura } from '../providers/chains'

export function WalletButton() {
  const { address, isConnected, chainId } = useAccount()
  const { connect, isPending: isConnectPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain, isPending: isSwitchPending } = useSwitchChain()
  const toast = useToast()

  const isPending = isConnectPending || isSwitchPending

  // Auto-connect if previously connected
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

  // Persist wallet connection state
  useEffect(() => {
    if (isConnected && address) {
      localStorage.setItem('lastConnectedAddress', address)
    } else if (!isConnected) {
      localStorage.removeItem('lastConnectedAddress')
    }
  }, [isConnected, address])

  const handleClick = async () => {
    console.log('Attempting wallet connection...')
    if (isConnected) {
      try {
        console.log('Disconnecting wallet...')
        disconnect()
        localStorage.removeItem('shouldConnectWallet')
      } catch (error: any) {
        console.error('Failed to disconnect:', error)
      }
    } else {
      try {
        console.log('Checking for provider...')
        const provider = window.ethereum
        if (!provider) {
          console.log('No provider found, showing MetaMask required message')
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
            console.log('Switching to Tura network...')
            await switchChain({ chainId: tura.id })
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

        console.log('Attempting to connect with injected provider...')
        await connect({ connector: injected() })
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

  const displayAddress = address ? 
    `${address.slice(0, 6)}...${address.slice(-4)}` : 
    'Connect Wallet'

  return (
    <Button
      onClick={handleClick}
      colorScheme={isConnected ? 'gray' : 'blue'}
      variant="solid"
      size="md"
      paddingX={6}
      isLoading={isPending}
      data-testid="wallet-button"
      data-devinid="connect-wallet"
    >
      {displayAddress}
    </Button>
  )
}
