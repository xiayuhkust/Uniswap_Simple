import { Button } from '@chakra-ui/react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect, isLoading } = useConnect({
    connector: new InjectedConnector()
  })
  const { disconnect } = useDisconnect()

  if (isConnected && address) {
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
      isLoading={isLoading}
    >
      Connect Wallet
    </Button>
  )
}
