import { ChakraProvider } from '@chakra-ui/react'
import { Web3ReactProvider } from '@web3-react/core'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { getLibrary } from './lib/web3'
import { ErrorBoundary } from './components/ErrorBoundary'
import { WalletButton } from './components/WalletButton'
import { SwapPage } from './pages/SwapPage'
import { LiquidityPage } from './pages/LiquidityPage'
import { PoolsPage } from './pages/PoolsPage'
import { theme } from './theme'
import { NavigationBar } from './components/Layout/NavigationBar'

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <BrowserRouter>
          <ErrorBoundary>
            <div className="App min-h-screen bg-gray-900">
              <nav className="w-full bg-gray-800 text-white p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold">Tura DEX</h1>
                  <NavigationBar />
                </div>
                <WalletButton />
              </nav>
              <main className="container mx-auto p-4">
                <Routes>
                  <Route path="/" element={<SwapPage />} />
                  <Route path="/liquidity" element={<LiquidityPage />} />
                  <Route path="/pools" element={<PoolsPage />} />
                </Routes>
              </main>
            </div>
          </ErrorBoundary>
        </BrowserRouter>
      </Web3ReactProvider>
    </ChakraProvider>
  )
}

export default App;
