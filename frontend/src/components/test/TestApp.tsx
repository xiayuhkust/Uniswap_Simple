import { ChakraProvider } from '@chakra-ui/react'
import { SimpleWalletConnect } from './SimpleWalletConnect'
import { Web3Provider } from '../../providers/Web3Provider'

export function TestApp() {
  return (
    <Web3Provider>
      <ChakraProvider>
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Wallet Connect Test</h1>
            <SimpleWalletConnect />
          </div>
        </div>
      </ChakraProvider>
    </Web3Provider>
  )
}
