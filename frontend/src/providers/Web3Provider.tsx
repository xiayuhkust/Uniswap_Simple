import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

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

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [turaChain],
  [publicProvider()]
)

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
})

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      {children}
    </WagmiConfig>
  )
}
