import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from 'ethers'
import { SimpleWalletConnect } from './SimpleWalletConnect'

function getLibrary(provider: any) {
  return new ethers.providers.Web3Provider(provider)
}

export function TestApp() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ChakraProvider>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <SimpleWalletConnect />
        </div>
      </ChakraProvider>
    </Web3ReactProvider>
  )
}
