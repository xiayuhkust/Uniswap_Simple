import { Token } from '../../types/token'

export const WTURA_ADDRESS = '0xF0e8a104Cc6ecC7bBa4Dc89473d1C64593eA69be'

export const TEST_TOKENS: Token[] = [
  {
    address: WTURA_ADDRESS,
    symbol: 'TURA',  // Display WTURA as TURA
    name: 'Wrapped TURA',
    decimals: 18,
    logoURI: ''
  },
  {
    address: '0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9',
    symbol: 'TT1',
    name: 'Test Token 1',
    decimals: 18,
    logoURI: ''
  },
  {
    address: '0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122',
    symbol: 'TT2',
    name: 'Test Token 2',
    decimals: 18,
    logoURI: ''
  }
]
