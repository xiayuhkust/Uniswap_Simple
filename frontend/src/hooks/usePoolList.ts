import { useState, useEffect } from 'react';
import { type Address } from 'viem';
import { useWebSocket } from './useWebSocket';
import { Pool as BackendPool } from '../types/pool';
import { formatUnits } from 'viem';

// Define API URL from environment variables
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// Define the Pool interface for frontend use
export interface Pool {
  address: Address;
  token0Symbol: string;
  token1Symbol: string;
  fee: number;
  volume7d: bigint;
  liquidity: bigint;
  currentPrice: number | null;
}

// Convert backend pool to frontend pool format
const convertBackendPool = (backendPool: BackendPool): Pool => {
  return {
    address: backendPool.address as Address,
    token0Symbol: backendPool.token0Symbol,
    token1Symbol: backendPool.token1Symbol,
    fee: backendPool.fee,
    volume7d: backendPool.volume24h ? BigInt(backendPool.volume24h) : BigInt(0),
    liquidity: backendPool.liquidity ? BigInt(backendPool.liquidity) : BigInt(0),
    currentPrice: backendPool.sqrtPriceX96 ? parseFloat(formatUnits(BigInt(backendPool.sqrtPriceX96), 18)) : null
  };
};

export const usePoolList = () => {
  const [pools, setPools] = useState<Pool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { isConnected, subscribe } = useWebSocket();

  // Fetch pools from API
  const fetchPools = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/pools`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch pools');
      }
      
      const data: BackendPool[] = await response.json();
      const convertedPools = data.map(convertBackendPool);
      setPools(convertedPools);
      setError(null);
    } catch (err) {
      console.error('Error fetching pools:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPools();
  }, []);

  // Subscribe to WebSocket events
  useEffect(() => {
    if (!isConnected) return;

    // Subscribe to pool updates
    const unsubscribeUpdated = subscribe<BackendPool>('pool:updated', (data: BackendPool) => {
      setPools((prevPools) => {
        const index = prevPools.findIndex((p) => p.address === data.address as Address);
        if (index === -1) return prevPools;
        
        const newPools = [...prevPools];
        newPools[index] = convertBackendPool(data);
        return newPools;
      });
    });

    // Subscribe to new pools
    const unsubscribeCreated = subscribe<BackendPool>('pool:created', (data: BackendPool) => {
      setPools((prevPools) => {
        if (prevPools.some((p) => p.address === data.address as Address)) return prevPools;
        return [...prevPools, convertBackendPool(data)];
      });
    });

    // Get initial cache data
    const unsubscribeCache = subscribe<BackendPool[]>('cache:pools', (data: BackendPool[]) => {
      const convertedPools = data.map(convertBackendPool);
      setPools(convertedPools);
    });

    return () => {
      unsubscribeUpdated();
      unsubscribeCreated();
      unsubscribeCache();
    };
  }, [isConnected, subscribe]);

  // Expose refetch function for manual refresh
  const refetch = () => {
    fetchPools();
  };

  return { pools, isLoading, error, refetch };
};
