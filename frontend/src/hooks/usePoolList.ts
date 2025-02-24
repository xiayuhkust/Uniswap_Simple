import { useState, useEffect } from 'react';
import { usePublicClient } from 'wagmi';
import { parseAbi, type Address, type Log } from 'viem';
import { getContract } from 'viem';
import { usePoolVolume } from './usePoolVolume';

const FACTORY_ADDRESS = import.meta.env.VITE_FACTORY_ADDRESS as Address;

interface Pool {
  address: Address;
  token0: Address;
  token1: Address;
  fee: number;
  volume7d: bigint;
}

interface PoolCreatedLog extends Log {
  args: {
    token0: Address;
    token1: Address;
    fee: number;
    pool: Address;
  };
}

const FactoryABI = parseAbi([
  'function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)',
  'event PoolCreated(address indexed token0, address indexed token1, uint24 indexed fee, int24 tickSpacing, address pool)'
]);

interface Pool {
  address: Address;
  token0: Address;
  token1: Address;
  fee: number;
  volume7d: bigint;
}

export const usePoolList = () => {
  const [pools, setPools] = useState<Pool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const publicClient = usePublicClient();

  useEffect(() => {
    const fetchPools = async () => {
      try {
        setIsLoading(true);
        if (!publicClient) return;

        getContract({
          address: FACTORY_ADDRESS,
          abi: FactoryABI,
          client: publicClient
        });

        // Get all PoolCreated events
        const logs = await publicClient.getLogs({
          address: FACTORY_ADDRESS,
          event: FactoryABI[1],
          fromBlock: 0n,
          toBlock: 'latest'
        }) as PoolCreatedLog[];

        // Create Pool objects with volume
        const poolsWithVolume = await Promise.all(
          logs.map(async (log) => {
            const { token0, token1, fee, pool: address } = log.args;
            const { volume } = usePoolVolume(address);
            
            return {
              address,
              token0,
              token1,
              fee,
              volume7d: volume
            } as Pool;
          })
        );

        // Sort by 7-day volume
        const sortedPools = poolsWithVolume.sort((a, b) => 
          b.volume7d > a.volume7d ? 1 : -1
        );

        setPools(sortedPools);
      } catch (error) {
        console.error('Error fetching pools:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPools();
  }, [publicClient]);

  return { pools, isLoading };
};
