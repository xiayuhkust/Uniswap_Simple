import { useAccount, useContractWrite, useContractRead } from 'wagmi';
import { Token } from '../types/token';
import { erc20ABI } from 'wagmi';

export function useTokenApproval(token?: Token, spender?: string) {
  const { address } = useAccount();

  const { data: allowance, isLoading: isLoadingAllowance } = useContractRead({
    address: token?.address as `0x${string}`,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [address as `0x${string}`, spender as `0x${string}`],
    enabled: !!token && !!spender && !!address,
    watch: true,
  });

  const { write: approve, isLoading: isApproving } = useContractWrite({
    address: token?.address as `0x${string}`,
    abi: erc20ABI,
    functionName: 'approve',
  });

  return {
    allowance,
    approve,
    isLoading: isLoadingAllowance || isApproving
  };
}
