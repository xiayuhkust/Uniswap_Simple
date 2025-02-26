import { CONTRACT_ADDRESSES } from './addresses'
import type { Token } from '../types/token'

export const TOKEN_METADATA: Record<string, Token> = {
  [CONTRACT_ADDRESSES.WETH]: {
    address: CONTRACT_ADDRESSES.WETH,
    symbol: 'WTURA',
    name: 'Wrapped Tura',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
    price: '1.00',
    priceChange24h: '0.0'
  },
  [CONTRACT_ADDRESSES.TEST_TOKEN_1]: {
    address: CONTRACT_ADDRESSES.TEST_TOKEN_1,
    symbol: 'TT1',
    name: 'Test Token 1',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
    price: '1.00',
    priceChange24h: '0.0'
  },
  [CONTRACT_ADDRESSES.TEST_TOKEN_2]: {
    address: CONTRACT_ADDRESSES.TEST_TOKEN_2,
    symbol: 'TT2',
    name: 'Test Token 2',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    price: '1.00',
    priceChange24h: '0.0'
  },
  [CONTRACT_ADDRESSES.TEST_TOKEN_3]: {
    address: CONTRACT_ADDRESSES.TEST_TOKEN_3,
    symbol: 'TT3',
    name: 'Test Token 3',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
    price: '1.00',
    priceChange24h: '0.0'
  },
  [CONTRACT_ADDRESSES.TEST_TOKEN_4]: {
    address: CONTRACT_ADDRESSES.TEST_TOKEN_4,
    symbol: 'TT4',
    name: 'Test Token 4',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png',
    price: '1.00',
    priceChange24h: '0.0'
  },
  [CONTRACT_ADDRESSES.TEST_TOKEN_5]: {
    address: CONTRACT_ADDRESSES.TEST_TOKEN_5,
    symbol: 'TT5',
    name: 'Test Token 5',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9/logo.png',
    price: '1.00',
    priceChange24h: '0.0'
  },
  [CONTRACT_ADDRESSES.TEST_TOKEN_6]: {
    address: CONTRACT_ADDRESSES.TEST_TOKEN_6,
    symbol: 'TT6',
    name: 'Test Token 6',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0D8775F648430679A709E98d2b0Cb6250d2887EF/logo.png',
    price: '1.00',
    priceChange24h: '0.0'
  },
  [CONTRACT_ADDRESSES.TEST_TOKEN_7]: {
    address: CONTRACT_ADDRESSES.TEST_TOKEN_7,
    symbol: 'TT7',
    name: 'Test Token 7',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png',
    price: '1.00',
    priceChange24h: '0.0'
  },
  [CONTRACT_ADDRESSES.TEST_TOKEN_8]: {
    address: CONTRACT_ADDRESSES.TEST_TOKEN_8,
    symbol: 'TT8',
    name: 'Test Token 8',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2/logo.png',
    price: '1.00',
    priceChange24h: '0.0'
  }
}
