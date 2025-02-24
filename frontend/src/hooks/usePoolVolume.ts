import { useState, useEffect } from 'react';
import { Contract, BigNumber } from 'ethers';
import { usePublicClient } from 'wagmi';
import PoolABI from '../abi/Pool.json';

interface SwapEvent {
  args: {
    amount0: BigNumber;
    amount1: BigNumber;
    sender: string;
    recipient: string;
  };
}

export const FEE_TIERS = {
  LOW: 500,    // 0.05%
  MEDIUM: 3000, // 0.3%
  HIGH: 10000   // 1%
} as const;

export const usePoolVolume = (poolAddress: string) => {
  const [volume, setVolume] = useState<BigNumber>(BigNumber.from(0));
  const [isLoading, setIsLoading] = useState(true);
  const provider = usePublicClient();

  useEffect(() => {
    if (!poolAddress) {
      setIsLoading(false);
      return;
    }

    const startTime = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60; // 7 days ago
    const pool = new Contract(poolAddress, PoolABI, provider);

    const fetchVolume = async () => {
      try {
        setIsLoading(true);
        const events = await pool.queryFilter('Swap', startTime, 'latest') as SwapEvent[];
        const totalVolume = events.reduce((acc, event) => {
          const amount0 = BigNumber.from(event.args.amount0);
          const amount1 = BigNumber.from(event.args.amount1);
          // Take absolute values since amounts can be negative for sells
          return acc
            .add(amount0.abs())
            .add(amount1.abs());
        }, BigNumber.from(0));
        setVolume(totalVolume);
      } catch (error) {
        console.error('Error fetching pool volume:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVolume();

    // Subscribe to new swap events
    const handleSwap = (_: string, __: string, amount0: BigNumber, amount1: BigNumber) => {
      setVolume(prev => prev
        .add(BigNumber.from(amount0).abs())
        .add(BigNumber.from(amount1).abs())
      );
    };

    pool.on('Swap', handleSwap);

    return () => {
      pool.off('Swap', handleSwap);
    };
  }, [poolAddress, provider]);

  return { volume, isLoading };
};
