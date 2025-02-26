import { Address } from 'viem'

export interface Token {
  address: Address
  symbol: string
  name: string
  decimals: number
  logoURI: string
  price?: string
  priceChange24h?: string
  balance?: string
}
