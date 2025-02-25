import { useEffect, useState } from 'react';
import { useWebSocket } from './useWebSocket';
import { Pool } from '../types/pool';

/**
 * Custom hook for real-time pool list updates
 * @param initialPools Initial pool list
 * @returns Updated pool list
 */
export const usePoolListWebSocket = (initialPools: Pool[] = []) => {
  const [pools, setPools] = useState<Pool[]>(initialPools);
  const { isConnected, subscribe } = useWebSocket();

  useEffect(() => {
    // Update initial pools when provided
    if (initialPools.length > 0) {
      setPools(initialPools);
    }
  }, [initialPools]);

  useEffect(() => {
    if (!isConnected) return;

    // Subscribe to pool creation events
    const unsubscribeCreated = subscribe<Pool>('pool:created', (newPool) => {
      setPools((currentPools) => {
        // Check if pool already exists
        const exists = currentPools.some((pool) => pool.address === newPool.address);
        if (exists) return currentPools;
        
        // Add new pool to the list
        return [newPool, ...currentPools];
      });
    });

    // Subscribe to pool update events
    const unsubscribeUpdated = subscribe<Pool>('pool:updated', (updatedPool) => {
      setPools((currentPools) => {
        return currentPools.map((pool) => {
          if (pool.address === updatedPool.address) {
            return updatedPool;
          }
          return pool;
        });
      });
    });

    // Subscribe to cached pools
    const unsubscribeCached = subscribe<Pool[]>('cache:pools', (cachedPools) => {
      if (cachedPools.length > 0 && pools.length === 0) {
        setPools(cachedPools);
      }
    });

    // Clean up subscriptions
    return () => {
      unsubscribeCreated();
      unsubscribeUpdated();
      unsubscribeCached();
    };
  }, [isConnected, subscribe, pools.length]);

  return pools;
};
