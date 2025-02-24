import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
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

const { publicClient } = configureChains(
  [turaChain],
  [publicProvider()]
)

const config = createConfig({
  autoConnect: true,
  connectors: [
    new InjectedConnector({
      chains: [turaChain],
      options: {
        name: 'Tura DEX',
        shimDisconnect: true,
      },
    }),
  ],
  publicClient,
})

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      {children}
    </WagmiConfig>
  )
}
