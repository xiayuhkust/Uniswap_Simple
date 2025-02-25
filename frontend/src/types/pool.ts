export interface Token {
  id: string;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  chainId: number;
  logoURI?: string;
}

export interface Pool {
  id: string;
  address: string;
  token0: Token;
  token1: Token;
  fee: number;
  feePercent?: number;
  tickSpacing: number;
  sqrtPriceX96: string;
  liquidity: string;
  tick: number;
  volume24h: string;
  volumeWeek: string;
  volumeTotal: string;
  feesTotal: string;
  txCount: number;
  createdAtBlock: number;
  initialized: boolean;
  createdAt: string;
  updatedAt: string;
}
