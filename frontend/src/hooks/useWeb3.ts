import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

export function useWeb3() {
  const { address, isConnected } = useAccount()
  const { connect, isLoading: isConnecting } = useConnect({
    connector: new InjectedConnector()
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
