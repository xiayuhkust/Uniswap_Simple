import { ChakraProvider, Container } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { WagmiConfig, createConfig, http } from 'wagmi'
import { Chain } from 'viem'
import { SwapPage } from './pages/SwapPage'
import { PoolPage } from './pages/PoolPage'
import { CreatePoolPage } from './pages/CreatePoolPage'
import { Layout } from './components/Layout/Layout'
import { theme } from './theme'

const turaChain: Chain = {
  id: 1337,
  name: 'Tura',
  network: 'tura',
  nativeCurrency: {
    decimals: 18,
    name: 'Tura',
    symbol: 'TURA',
  },
  rpcUrls: {
    default: { http: ['https://rpc-beta1.turablockchain.com'] },
    public: { http: ['https://rpc-beta1.turablockchain.com'] },
  }
}

const config = createConfig({
  chains: [turaChain],
  transports: {
    [turaChain.id]: http()
  }
})

function App() {
  return (
    <WagmiConfig config={config}>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <Layout>
            <Container maxW="container.xl" py={8}>
              <Routes>
                <Route path="/" element={<SwapPage />} />
                <Route path="/pool" element={<PoolPage />} />
                <Route path="/pool/create" element={<CreatePoolPage />} />
              </Routes>
            </Container>
          </Layout>
        </BrowserRouter>
      </ChakraProvider>
    </WagmiConfig>
  )
}

export default App;
