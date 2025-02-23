import { createContext, useState, ReactNode, useEffect, useCallback } from 'react';

interface MetaMaskContextType {
  status: 'not_connected' | 'connected' | 'not_installed' | 'initializing';
  account: string | null;
  chain: string | null;
  isReady: boolean;
  connect: () => Promise<void>;
}

const MetaMaskContext = createContext<MetaMaskContextType>({
  status: 'initializing',
  account: null,
  chain: null,
  isReady: false,
  connect: async () => {},
});

const MetaMaskProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<'not_connected' | 'connected' | 'not_installed' | 'initializing'>('initializing');
  const [account, setAccount] = useState<string | null>(null);
  const [chain, setChain] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let checkInterval: NodeJS.Timeout | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    const checkMetaMask = async () => {
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

    const initializeProvider = () => {
      // Check if MetaMask is installed
      const checkMetaMaskInstalled = () => {
        const hasEthereum = typeof window.ethereum !== 'undefined';
        const isMetaMask = window.ethereum?.isMetaMask;
        console.log('MetaMask Check:', { hasEthereum, isMetaMask });
        return hasEthereum && isMetaMask;
      };

      // Initial check
      const isInstalled = checkMetaMaskInstalled();
      console.log('Initial MetaMask check:', isInstalled);

      if (isInstalled) {
        console.log('MetaMask found immediately');
        setIsReady(true);
        checkMetaMask();
        return;
      }

      console.log('Waiting for MetaMask...');
      // Wait for provider to be injected
      checkInterval = setInterval(() => {
        const found = checkMetaMaskInstalled();
        if (found) {
          console.log('MetaMask found after waiting');
          clearInterval(checkInterval!);
          if (timeoutId) clearTimeout(timeoutId);
          setIsReady(true);
          checkMetaMask();
        }
      }, 500);

      // Timeout after 5 seconds
      timeoutId = setTimeout(() => {
        console.log('MetaMask not found after timeout');
        if (checkInterval) clearInterval(checkInterval);
        setStatus('not_installed');
      }, 5000);
    };

    // Start initialization
    initializeProvider();

    // Cleanup
    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (timeoutId) clearTimeout(timeoutId);
    };

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

  const switchToTuraNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x539' }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x539',
              chainName: 'Tura Blockchain',
              rpcUrls: ['https://rpc-beta1.turablockchain.com'],
              nativeCurrency: { name: 'TURA', symbol: 'TURA', decimals: 18 },
            }],
          });
        } catch (addError) {
          console.error('Error adding Tura network:', addError);
          throw addError;
        }
      } else {
        console.error('Error switching to Tura network:', switchError);
        throw switchError;
      }
    }
  };

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

export { MetaMaskContext, MetaMaskProvider };
