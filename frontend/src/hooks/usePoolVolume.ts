import { useState, useEffect } from 'react';
import { usePublicClient } from 'wagmi';
import { parseAbi, type Address } from 'viem';
import { getContract } from 'viem';

const PoolABI = parseAbi([
  'event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)'
]);

export const FEE_TIERS = {
  LOW: 500,    // 0.05%
  MEDIUM: 3000, // 0.3%
  HIGH: 10000   // 1%
} as const;

export const usePoolVolume = (poolAddress: Address) => {
  const [volume, setVolume] = useState<bigint>(0n);
  const [isLoading, setIsLoading] = useState(true);
  const publicClient = usePublicClient();

  useEffect(() => {
    if (!poolAddress) {
      setIsLoading(false);
      return;
    }

    const startTime = BigInt(Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60); // 7 days ago
    if (!publicClient) return;

    getContract({
      address: poolAddress,
      abi: PoolABI,
      client: publicClient
    });

    const fetchVolume = async () => {
      try {
        setIsLoading(true);
        const logs = await publicClient.getLogs({
          address: poolAddress as `0x${string}`,
          event: PoolABI[0],
          fromBlock: startTime,
          toBlock: 'latest'
        });
        
        const totalVolume = logs.reduce((acc, log) => {
          const amount0 = BigInt(log.args.amount0 || 0);
          const amount1 = BigInt(log.args.amount1 || 0);
          // Take absolute values since amounts can be negative for sells
          return acc + 
            (amount0 >= 0n ? amount0 : -amount0) +
            (amount1 >= 0n ? amount1 : -amount1);
        }, 0n);
        setVolume(totalVolume);
      } catch (error) {
        console.error('Error fetching pool volume:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVolume();

    // Watch for new swap events
    const unwatch = publicClient.watchEvent({
      address: poolAddress as `0x${string}`,
      event: PoolABI[0],
      onLogs: logs => {
        logs.forEach(log => {
          const amount0 = BigInt(log.args.amount0 || 0);
          const amount1 = BigInt(log.args.amount1 || 0);
          setVolume(prev => prev + 
            (amount0 >= 0n ? amount0 : -amount0) +
            (amount1 >= 0n ? amount1 : -amount1)
          );
        });
      }
    });

    return () => {
      unwatch();
    };
  }, [poolAddress, publicClient]);

  return { volume, isLoading };
};
