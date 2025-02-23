import { ChakraProvider } from '@chakra-ui/react'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { ethers } from 'ethers'
import { ErrorBoundary } from './components/ErrorBoundary'
import { WalletButton } from './components/WalletButton'
import { theme } from './theme'

function getLibrary(provider: any): Web3Provider {
  const library = new ethers.providers.Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <ErrorBoundary>
          <div className="App min-h-screen bg-gray-900">
            <nav className="w-full bg-gray-800 text-white p-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold">Tura DEX</h1>
              <WalletButton />
            </nav>
            <main className="container mx-auto p-4">
              {/* Components will be added here */}
            </main>
          </div>
        </ErrorBoundary>
      </Web3ReactProvider>
    </ChakraProvider>
  )
}

export default App;
