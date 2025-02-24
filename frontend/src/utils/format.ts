import { TEST_TOKENS } from '../components/Swap/TokenList';

export function formatFeeAmount(fee: number): string {
  return `${(fee / 10000).toFixed(2)}%`;
}

export function formatTokenAmount(amount: bigint): string {
  return Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

export function getTokenSymbol(address: string): string {
  const token = TEST_TOKENS.find(t => t.address.toLowerCase() === address.toLowerCase());
  return token?.symbol || `${address.slice(0, 6)}...${address.slice(-4)}`;
}
