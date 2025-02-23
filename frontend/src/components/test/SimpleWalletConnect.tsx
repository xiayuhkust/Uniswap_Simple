import React from 'react'
import { Button } from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { CHAIN_CONFIG } from '../../config/chain'

const injected = new InjectedConnector({
  supportedChainIds: [1337],
})

export function SimpleWalletConnect() {
  const { activate, active, account, deactivate } = useWeb3React()

  const connect = async () => {
    try {
      await activate(injected)
      const { ethereum } = window as any
      if (ethereum) {
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
          }
        }
      }
    } catch (error) {
      console.error('Failed to connect:', error)
    }
  }

  return (
    <Button
      onClick={active ? deactivate : connect}
      colorScheme="blue"
    >
      {active ? `Connected: ${account?.slice(0, 6)}...${account?.slice(-4)}` : 'Connect Wallet'}
    </Button>
  )
}
