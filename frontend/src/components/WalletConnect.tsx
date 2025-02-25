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
        name: 'Injected',
        shimDisconnect: true
      }
    })
  })
  const { disconnect } = useDisconnect()
  const { chain } = useNetwork()
  const { switchNetwork, isLoading: isSwitching } = useSwitchNetwork()

  if (error) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        {error.message}
      </Alert>
    )
  }

  if (isConnected && address) {
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
            variant="uniswap"
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
        variant="uniswap"
        _hover={{ opacity: 0.8 }}
      >
        {`${address.slice(0, 6)}...${address.slice(-4)}`}
      </Button>
    )
  }

  return (
    <Button
      onClick={() => connect()}
      size="md"
      variant="uniswap"
      isLoading={isConnecting}
    >
      Connect Wallet
    </Button>
  )
}
