import { createContext, useState, ReactNode, useEffect } from 'react';

interface MetaMaskContextType {
  status: 'not_connected' | 'connected' | 'not_installed' | 'initializing';
  account: string | null;
  chain: string | null;
  isReady: boolean;
  connect: () => Promise<void>;
}

export const MetaMaskContext = createContext<MetaMaskContextType>({
  status: 'initializing',
  account: null,
  chain: null,
  isReady: false,
  connect: async () => {},
});

export const MetaMaskProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<'not_connected' | 'connected' | 'not_installed' | 'initializing'>('initializing');
  const [account, setAccount] = useState<string | null>(null);
  const [chain, setChain] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeProvider = async () => {
      // Wait for provider to be ready
      if (typeof window.ethereum === 'undefined') {
        const checkInterval = setInterval(() => {
          if (typeof window.ethereum !== 'undefined') {
            clearInterval(checkInterval);
            setIsReady(true);
            checkMetaMask();
          }
        }, 1000);
        
        // Cleanup after 10 seconds if provider not found
        setTimeout(() => {
          clearInterval(checkInterval);
          setStatus('not_installed');
        }, 10000);
        
        return;
      }
      
      setIsReady(true);
      checkMetaMask();
    };
    
    const checkMetaMask = async () => {
      // Check if already connected
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts?.[0]) {
          setAccount(accounts[0]);
          setStatus('connected');
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          setChain(chainId);
        } else {
          setStatus('not_connected');
        }
      } catch (error) {
        console.error('Error checking MetaMask connection:', error);
        setStatus('not_connected');
      }
    };
    
    initializeProvider();

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

  const connect = useCallback(async () => {
    if (!isReady) {
      console.error('MetaMask provider not ready');
      return;
    }

    if (typeof window.ethereum === 'undefined') {
      setStatus('not_installed');
      return;
    }

    try {
      setStatus('initializing');
      
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts?.[0]) {
        throw new Error('No accounts returned');
      }
      
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      setAccount(accounts[0]);
      setChain(chainId);
      setStatus('connected');
      
      // Handle Tura network switch after successful connection
      if (chainId !== '0x539') {
        await switchToTuraNetwork();
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      setStatus('not_connected');
    }
  }, [isReady]);

  return (
    <MetaMaskContext.Provider value={{ status, account, chain, isReady, connect }}>
      {children}
    </MetaMaskContext.Provider>
  );
};
