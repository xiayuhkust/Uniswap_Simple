import { PropsWithChildren } from 'react';
import { createConfig, WagmiConfig, configureChains } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

// Define Tura network
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
    default: { http: [import.meta.env.VITE_TURA_RPC_URL] },
    public: { http: [import.meta.env.VITE_TURA_RPC_URL] }
  }
};

const { chains, publicClient } = configureChains(
  [turaChain],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: import.meta.env.VITE_TURA_RPC_URL,
      }),
    }),
  ]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  connectors: [
    new InjectedConnector({
      chains,
      options: {
        name: 'MetaMask',
        shimDisconnect: true,
      },
    }),
  ],
});

const queryClient = new QueryClient();

export function ConnectionProvider({ children }: PropsWithChildren) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiConfig>
  );
}
