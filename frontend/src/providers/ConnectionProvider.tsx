import { PropsWithChildren } from 'react';
import { createConfig, WagmiConfig, configureChains } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { publicProvider } from 'wagmi/providers/public';

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
    default: { http: [] },
    public: { http: [] }
  }
};

const { chains, publicClient } = configureChains(
  [turaChain],
  [publicProvider()]
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
