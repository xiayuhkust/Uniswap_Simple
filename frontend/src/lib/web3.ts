import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'

export const TURA_CHAIN_ID = 1337
export const NETWORK_NAME = 'Tura Network'
export const RPC_URL = 'https://rpc-beta1.turablockchain.com'

export const TURA_NETWORK = {
  chainId: `0x${TURA_CHAIN_ID.toString(16)}`,
  chainName: NETWORK_NAME,
  nativeCurrency: {
    name: 'TURA',
    symbol: 'TURA',
    decimals: 18,
  },
  rpcUrls: [RPC_URL],
}

export const injected = new InjectedConnector({
  supportedChainIds: [TURA_CHAIN_ID]
})

export function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}
