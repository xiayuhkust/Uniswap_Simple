import { Token } from '../../types/token'
import { WTURA_ADDRESS, TT1_ADDRESS, TT2_ADDRESS } from '../../utils/contracts'

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
