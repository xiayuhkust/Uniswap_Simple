import { createContext, useState, ReactNode, useEffect } from 'react';

interface MetaMaskContextType {
  status: 'not_connected' | 'connected' | 'not_installed';
  account: string | null;
  chain: string | null;
  connect: () => Promise<void>;
}

export const MetaMaskContext = createContext<MetaMaskContextType>({
  status: 'not_connected',
  account: null,
  chain: null,
  connect: async () => {},
});

export const MetaMaskProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<'not_connected' | 'connected' | 'not_installed'>('not_connected');
  const [account, setAccount] = useState<string | null>(null);
  const [chain, setChain] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        setAccount(accounts[0] || null);
        setStatus(accounts[0] ? 'connected' : 'not_connected');
      };

      const handleChainChanged = (chainId: string) => {
        setChain(chainId);
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);

  const connect = async () => {
    if (typeof window.ethereum === 'undefined') {
      setStatus('not_installed');
      return;
    }

    try {
      const [accounts, chainId] = await Promise.all([
        window.ethereum.request({ method: 'eth_requestAccounts' }),
        window.ethereum.request({ method: 'eth_chainId' }),
      ]);
      setAccount(accounts[0]);
      setChain(chainId);
      setStatus('connected');
    } catch (error) {
      console.error(error);
      setStatus('not_connected');
    }
  };

  return (
    <MetaMaskContext.Provider value={{ status, account, chain, connect }}>
      {children}
    </MetaMaskContext.Provider>
  );
};
