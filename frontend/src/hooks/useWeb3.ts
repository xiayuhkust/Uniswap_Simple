import { useAccount, useConnect, useDisconnect, useConfig } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

export function useWeb3() {
  const { address, isConnected } = useAccount()
  const config = useConfig()
  const { connect, isLoading: isConnecting } = useConnect({
    connector: new InjectedConnector({
      chains: config.chains,
      options: {
        name: 'Tura DEX',
        shimDisconnect: true,
      },
    })
  })
  const { disconnect } = useDisconnect()

  return {
    connect: () => connect(),
    disconnect,
    account: address,
    isConnected,
    isConnecting
  }
}
