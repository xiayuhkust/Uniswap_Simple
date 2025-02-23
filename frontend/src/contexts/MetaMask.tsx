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
    const checkMetaMask = async () => {
      if (typeof window.ethereum === 'undefined') {
        setStatus('not_installed');
        return;
      }
      
      // Check if already connected
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts?.[0]) {
          setAccount(accounts[0]);
          setStatus('connected');
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          setChain(chainId);
        }
      } catch (error) {
        console.error('Error checking MetaMask connection:', error);
      }
    };
    
    checkMetaMask();

    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        setAccount(accounts[0] || null);
        setStatus(accounts[0] ? 'connected' : 'not_connected');
      };

      const handleChainChanged = async (chainId: string) => {
        setChain(chainId);
        // Refresh accounts when chain changes
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        handleAccountsChanged(accounts);
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const connect = async () => {
    if (typeof window.ethereum === 'undefined') {
      setStatus('not_installed');
      return;
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      // Check if we're on Tura network
      if (chainId !== '0x539') { // 1337 in hex
        try {
          // Switch to Tura network
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x539' }],
          });
        } catch (switchError: any) {
          // Add Tura network if it doesn't exist
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x539',
                chainName: 'Tura Blockchain',
                rpcUrls: ['https://rpc-beta1.turablockchain.com'],
                nativeCurrency: { name: 'TURA', symbol: 'TURA', decimals: 18 },
              }],
            });
          } else {
            throw switchError;
          }
        }
      }
      
      setAccount(accounts[0]);
      setChain(chainId);
      setStatus('connected');
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      setStatus('not_connected');
    }
  };

  return (
    <MetaMaskContext.Provider value={{ status, account, chain, connect }}>
      {children}
    </MetaMaskContext.Provider>
  );
};
