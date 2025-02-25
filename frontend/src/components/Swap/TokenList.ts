import { Token } from '../../types/token'
import { CONTRACT_ADDRESSES } from '../../constants/addresses'

const { WETH: WTURA_ADDRESS, TEST_TOKEN_1: TT1_ADDRESS, TEST_TOKEN_2: TT2_ADDRESS } = CONTRACT_ADDRESSES

export const TEST_TOKENS: Token[] = [
  {
    address: WTURA_ADDRESS,
    symbol: 'TURA',  // Display WTURA as TURA
    name: 'Wrapped TURA',
    decimals: 18,
    logoURI: ''
  },
  {
    address: TT1_ADDRESS,
    symbol: 'TT1',
    name: 'Test Token 1',
    decimals: 18,
    logoURI: ''
  },
  {
    address: TT2_ADDRESS,
    symbol: 'TT2',
    name: 'Test Token 2',
    decimals: 18,
    logoURI: ''
  }
]
