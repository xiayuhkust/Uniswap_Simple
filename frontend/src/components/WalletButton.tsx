
import { Button, useToast } from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import { injected } from '../lib/web3'

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
        // First try to add the Tura network if it's not already added
        const provider = window.ethereum
        if (provider) {
          try {
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x539',  // 1337 in hex
                chainName: 'Tura Network',
                nativeCurrency: {
                  name: 'TURA',
                  symbol: 'TURA',
                  decimals: 18
                },
                rpcUrls: ['https://rpc-beta1.turablockchain.com']
              }]
            })
          } catch (switchError: any) {
            console.error('Failed to add network:', switchError)
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
