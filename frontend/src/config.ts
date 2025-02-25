import { CONTRACT_ADDRESSES } from './constants/addresses'

export const config = {
  chainId: 1337,
  rpcUrl: 'https://rpc-beta1.turablockchain.com',
  FACTORY: CONTRACT_ADDRESSES.FACTORY,
  MANAGER: CONTRACT_ADDRESSES.MANAGER,
  WETH: CONTRACT_ADDRESSES.WETH,
  tokens: {
    [CONTRACT_ADDRESSES.WETH]: { symbol: 'Tura' },
    [CONTRACT_ADDRESSES.TEST_TOKEN_1]: { symbol: 'TT1' },
    [CONTRACT_ADDRESSES.TEST_TOKEN_2]: { symbol: 'TT2' }
  }
}
