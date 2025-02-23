
import { Button, useToast } from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import { injected, TURA_NETWORK } from '../lib/web3'

export function WalletButton() {
  const { active, account, activate, deactivate } = useWeb3React()
  const toast = useToast()

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

        // First try to switch to the Tura network
        try {
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: TURA_NETWORK.chainId }],
          })
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await provider.request({
                method: 'wallet_addEthereumChain',
                params: [TURA_NETWORK],
              })
            } catch (addError: any) {
              console.error('Failed to add network:', addError)
              toast({
                title: 'Network Error',
                description: 'Failed to add Tura network to MetaMask.',
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
              description: 'Failed to switch to Tura network.',
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
