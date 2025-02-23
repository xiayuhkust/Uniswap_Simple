import { ChakraProvider } from '@chakra-ui/react'
import { Web3ReactProvider } from '@web3-react/core'
import { SimpleWalletConnect } from './SimpleWalletConnect'
import { getLibrary } from '../../lib/web3'

export function TestApp() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ChakraProvider>
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold text-black mb-4">Wallet Connect Test</h1>
          <SimpleWalletConnect />
        </div>
      </ChakraProvider>
    </Web3ReactProvider>
  )
}
