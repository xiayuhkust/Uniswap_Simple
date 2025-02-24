import { useAccount, useContractRead } from 'wagmi';
import { Token } from '../types/token';
import { erc20ABI } from 'wagmi';

export function useTokenBalance(token?: Token) {
  const { address } = useAccount();

  const { data: balance, isLoading } = useContractRead({
    address: token?.address as `0x${string}`,
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
    enabled: !!address && !!token,
    watch: true,
  });

  return {
    balance,
    isLoading
  };
}
