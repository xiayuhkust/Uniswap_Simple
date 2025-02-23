
import { Button, useToast } from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import { injected } from '../hooks/useWeb3'

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
