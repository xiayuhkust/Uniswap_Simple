import { Address } from 'viem'

export interface Token {
  address: Address
  symbol: string
  name: string
  decimals: number
  logoURI: string
}
