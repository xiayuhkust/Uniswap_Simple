import { Button } from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { CHAIN_CONFIG, NETWORK_CONFIG } from '../../config/chain'
import React from 'react'

const injected = new InjectedConnector({
  supportedChainIds: [NETWORK_CONFIG.chainId],
})

export function SimpleWalletConnect() {
  const { activate, active, account, deactivate } = useWeb3React()
  const [isConnecting, setIsConnecting] = React.useState(false)

  const connect = async () => {
    setIsConnecting(true)
    try {
      const { ethereum } = window as any
      if (!ethereum) {
        alert('Please install MetaMask to connect your wallet')
        return
      }

      await activate(injected)

      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: CHAIN_CONFIG.chainId }],
        })
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [CHAIN_CONFIG],
          })
        } else {
          throw switchError
        }
      }
    } catch (error: any) {
      alert(error.message || 'Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <Button
      onClick={active ? deactivate : connect}
      colorScheme="blue"
      isLoading={isConnecting}
      loadingText="Connecting..."
      data-testid="wallet-button"
      data-devinid="connect-wallet"
    >
      {active ? `Connected: ${account?.slice(0, 6)}...${account?.slice(-4)}` : 'Connect Wallet'}
    </Button>
  )
}
