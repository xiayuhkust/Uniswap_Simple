import { ChakraProvider, Container, VStack, Heading, extendTheme, ThemeConfig } from '@chakra-ui/react';
import { ConnectionProvider } from './providers/ConnectionProvider';
import { WalletConnect } from './components/WalletConnect';
import { TokenSelect } from './components/TokenSelect';
import { FC } from 'react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

// Theme configuration

const App: FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <ConnectionProvider>
        <Container maxW="container.md" py={8}>
          <VStack spacing={4} width="100%">
            <Heading textAlign="center" size="xl">Tura DEX</Heading>
            <WalletConnect />
            <TokenSelect
              onSelect={(token) => console.log('Selected token:', token)}
            />
          </VStack>
        </Container>
      </ConnectionProvider>
    </ChakraProvider>
  );
}

export default App;
