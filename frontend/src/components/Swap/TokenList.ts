import { Token } from '../../types/token'
import { CONTRACT_ADDRESSES } from '../../constants/addresses'

export const TEST_TOKENS: Token[] = [
  {
    address: CONTRACT_ADDRESSES.WETH,
    symbol: 'TURA',  // Display WTURA as TURA
    name: 'Wrapped TURA',
    decimals: 18,
    logoURI: ''
  },
  {
    address: CONTRACT_ADDRESSES.TEST_TOKEN_1,
    symbol: 'TT1',
    name: 'Test Token 1',
    decimals: 18,
    logoURI: ''
  },
  {
    address: CONTRACT_ADDRESSES.TEST_TOKEN_2,
    symbol: 'TT2',
    name: 'Test Token 2',
    decimals: 18,
    logoURI: ''
  }
]
