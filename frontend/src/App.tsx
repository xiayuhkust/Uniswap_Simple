import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Web3Provider } from './providers/Web3Provider'
import { ErrorBoundary } from './components/ErrorBoundary'
import { SwapPage } from './pages/SwapPage'
import { PoolPage } from './pages/PoolPage'
import { theme } from './theme'
import { Layout } from './components/Layout/Layout'

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Web3Provider>
        <BrowserRouter>
          <ErrorBoundary>
            <Layout>
              <Routes>
                <Route path="/" element={<SwapPage />} />
                <Route path="/pool" element={<PoolPage />} />
              </Routes>
            </Layout>
          </ErrorBoundary>
        </BrowserRouter>
      </Web3Provider>
    </ChakraProvider>
  )
}

export default App;
