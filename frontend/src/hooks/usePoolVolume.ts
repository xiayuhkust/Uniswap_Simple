import { useState, useEffect } from 'react';
import { usePublicClient } from 'wagmi';
import { type Address } from 'viem';
import { stringToBigInt } from '../utils/bigint';

const SWAP_EVENT = {
  type: 'event',
  name: 'Swap',
  inputs: [
    { indexed: true, name: 'sender', type: 'address' },
    { indexed: true, name: 'recipient', type: 'address' },
    { indexed: false, name: 'amount0', type: 'int256' },
    { indexed: false, name: 'amount1', type: 'int256' },
    { indexed: false, name: 'sqrtPriceX96', type: 'uint160' },
    { indexed: false, name: 'liquidity', type: 'uint128' },
    { indexed: false, name: 'tick', type: 'int24' }
  ]
} as const;

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

    const startTime = BigInt(Math.trunc(Date.now() / 1000) - 7 * 24 * 60 * 60); // 7 days ago
    if (!publicClient) return;

    const fetchVolume = async () => {
      try {
        setIsLoading(true);
        const logs = await publicClient.getLogs({
          address: poolAddress as `0x${string}`,
          event: SWAP_EVENT,
          fromBlock: startTime,
          toBlock: 'latest'
        });
        
        const totalVolume = logs.reduce((acc, log) => {
          const amount0 = stringToBigInt((log.args?.amount0 ?? 0).toString());
          const amount1 = stringToBigInt((log.args?.amount1 ?? 0).toString());
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
      event: SWAP_EVENT,
      onLogs: logs => {
        logs.forEach(log => {
          const amount0 = stringToBigInt((log.args?.amount0 ?? 0).toString());
          const amount1 = stringToBigInt((log.args?.amount1 ?? 0).toString());
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
