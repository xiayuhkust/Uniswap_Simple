import { PropsWithChildren, useEffect } from 'react';
import { createConfig, WagmiConfig, useAccount } from 'wagmi';
import { defineChain, http, type Chain } from 'viem';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { injected } from 'wagmi/connectors';
import { useToast } from '@chakra-ui/react';

// Define Tura network
const turaChain: Chain = defineChain({
  id: 1337,
  name: 'Tura',
  network: 'tura',
  nativeCurrency: {
    decimals: 18,
    name: 'Tura',
    symbol: 'TURA',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-beta1.turablockchain.com'],
    },
    public: {
      http: ['https://rpc-beta1.turablockchain.com'],
    },
  }
});

// Remove unused transport variable

const config = createConfig({
  chains: [turaChain],
  transports: {
    [turaChain.id]: http(turaChain.rpcUrls.default.http[0])
  },
  connectors: [injected()]
});

const queryClient = new QueryClient();

function NetworkChecker() {
  const { chain } = useAccount();
  const toast = useToast();

  useEffect(() => {
    if (chain && chain.id !== Number(import.meta.env.VITE_TURA_CHAIN_ID)) {
      toast({
        title: 'Wrong Network',
        description: 'Please switch to Tura Network',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [chain, toast]);

  return null;
}

export function ConnectionProvider({ children }: PropsWithChildren) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <NetworkChecker />
        {children}
      </QueryClientProvider>
    </WagmiConfig>
  );
}
