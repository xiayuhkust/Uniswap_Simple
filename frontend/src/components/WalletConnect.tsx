import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { FC, useCallback, useEffect } from 'react';
import { Button, Text, VStack, Box, Heading, useToast, StackProps } from '@chakra-ui/react';

interface WalletConnectProps extends StackProps {}

export const WalletConnect: FC<WalletConnectProps> = (props) => {
  const toast = useToast();
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  // Save wallet info to localStorage and handle session
  useEffect(() => {
    if (isConnected && address) {
      localStorage.setItem('walletAddress', address);
      localStorage.setItem('lastConnected', new Date().toISOString());
    } else {
      localStorage.removeItem('walletAddress');
      localStorage.removeItem('lastConnected');
    }
  }, [isConnected, address]);

  // Check for existing connection
  useEffect(() => {
    const savedAddress = localStorage.getItem('walletAddress');
    const lastConnected = localStorage.getItem('lastConnected');
    
    if (savedAddress && lastConnected) {
      const sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
      const lastConnectedTime = new Date(lastConnected).getTime();
      const now = new Date().getTime();
      
      if (now - lastConnectedTime > sessionTimeout) {
        localStorage.removeItem('walletAddress');
        localStorage.removeItem('lastConnected');
        disconnect();
      }
    }
  }, [disconnect]);

  const handleConnect = useCallback(async () => {
    try {
      if (!window.ethereum) {
        toast({
          title: 'MetaMask Not Found',
          description: 'Please install MetaMask to connect your wallet',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      await connect({ connector: injected() });
    } catch (err) {
      toast({
        title: 'Connection Error',
        description: err instanceof Error ? err.message : 'Failed to connect wallet',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [connect, toast]);

  if (isConnected && address) {
    return (
      <Box p={6} borderWidth="1px" borderRadius="lg" width="100%" {...props}>
        <VStack spacing={4} align="stretch">
          <Heading size="md">Wallet Connected</Heading>
          <Text>Address: {address.slice(0, 6)}...{address.slice(-4)}</Text>
          <Button 
            onClick={() => disconnect()} 
            colorScheme="blue"
            variant="outline"
            width="100%"
          >
            Disconnect
          </Button>
        </VStack>
      </Box>
    );
  }

  return (
    <Box p={6} borderWidth="1px" borderRadius="lg" width="100%" {...props}>
      <VStack spacing={4} align="stretch">
        <Heading size="md">Connect Your Wallet</Heading>
        <Button
          onClick={handleConnect}
          isLoading={isPending}
          loadingText="Connecting..."
          colorScheme="blue"
          width="100%"
        >
          Connect Wallet
        </Button>
      </VStack>
    </Box>
  );
}
