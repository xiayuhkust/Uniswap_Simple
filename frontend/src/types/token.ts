export interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI: string
  balance?: string
  price?: string
  priceChange24h?: string
}
