import { Button, Alert, AlertIcon, VStack } from '@chakra-ui/react'
import { useAccount, useConnect, useDisconnect, useNetwork, useSwitchNetwork, useConfig } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const config = useConfig()
  const { connect, isLoading: isConnecting, error } = useConnect({
    connector: new InjectedConnector({
      chains: config.chains,
      options: {
        name: 'Tura DEX',
        shimDisconnect: true,
      },
    }),
  })
  const { disconnect } = useDisconnect()
  const { chain } = useNetwork()
  const { switchNetwork, isLoading: isSwitching } = useSwitchNetwork()

  if (isConnected && address) {
    if (error) {
      return (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error.message}
        </Alert>
      )
    }

    if (chain?.id !== 1337) {
      return (
        <VStack spacing={2}>
          <Alert status="warning" borderRadius="md">
            <AlertIcon />
            Please switch to Tura network
          </Alert>
          <Button
            onClick={() => switchNetwork?.(1337)}
            size="md"
            colorScheme="orange"
            isLoading={isSwitching}
          >
            Switch Network
          </Button>
        </VStack>
      )
    }

    return (
      <Button
        onClick={() => disconnect()}
        size="md"
        variant="outline"
      >
        {`${address.slice(0, 6)}...${address.slice(-4)}`}
      </Button>
    )
  }

  return (
    <Button
      onClick={() => connect()}
      size="md"
      colorScheme="blue"
      isLoading={isConnecting}
    >
      Connect Wallet
    </Button>
  )
}
