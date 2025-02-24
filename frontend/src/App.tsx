import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { WagmiConfig, createConfig, configureChains, createStorage } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { SwapPage } from './pages/SwapPage'
import { PoolPage } from './pages/PoolPage'
import { CreatePoolPage } from './pages/CreatePoolPage'
import { Layout } from './components/Layout/Layout'
import { theme } from './theme'

const turaChain = {
  id: 1337,
  name: 'Tura',
  network: 'tura',
  nativeCurrency: {
    decimals: 18,
    name: 'Tura',
    symbol: 'TURA',
  },
  rpcUrls: {
    public: { http: ['https://rpc-beta1.turablockchain.com'] },
    default: { http: ['https://rpc-beta1.turablockchain.com'] },
  }
} as const

const { chains, publicClient } = configureChains(
  [turaChain],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: 'https://rpc-beta1.turablockchain.com',
      }),
    }),
  ]
)

const storage = createStorage({ storage: window.localStorage })

const config = createConfig({
  autoConnect: false, // Disable auto-connect to force new signature
  connectors: [
    new InjectedConnector({
      chains,
      options: {
        name: 'Tura DEX',
        shimDisconnect: true,
      },
    }),
  ],
  publicClient,
  storage,
})

function App() {
  return (
    <WagmiConfig config={config}>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<SwapPage />} />
              <Route path="/pool" element={<PoolPage />} />
              <Route path="/pool/create" element={<CreatePoolPage />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ChakraProvider>
    </WagmiConfig>
  )
}

export default App
