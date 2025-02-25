export interface Token {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  chainId: number;
  logoURI?: string;
}

export interface Pool {
  address: string;
  token0Address: string;
  token1Address: string;
  token0Symbol: string;
  token1Symbol: string;
  fee: number;
  tickSpacing: number;
  sqrtPriceX96?: string;
  liquidity?: string;
  tick?: number;
  volume24h?: string;
  volumeWeek?: string;
  volumeMonth?: string;
  tvl?: string;
  initialized?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
