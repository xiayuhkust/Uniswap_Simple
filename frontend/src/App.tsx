import { ChakraProvider, Container, VStack, extendTheme, ThemeConfig, Heading } from '@chakra-ui/react';
import { ConnectionProvider } from './providers/ConnectionProvider';
import { WalletConnect } from './components/WalletConnect';
import { FC } from 'react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

const App: FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <ConnectionProvider>
        <Container maxW="container.md" py={8}>
          <VStack spacing={8} align="stretch">
            <Heading textAlign="center" size="xl">Tura DEX</Heading>
            <WalletConnect />
          </VStack>
        </Container>
      </ConnectionProvider>
    </ChakraProvider>
  );
}

export default App;
