import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Web3Provider } from './providers/Web3Provider'
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
      <Web3Provider>
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
      </Web3Provider>
    </ChakraProvider>
  )
}

export default App;
