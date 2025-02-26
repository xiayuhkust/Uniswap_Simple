import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import { Pool } from '../types/pool';
import { useToast } from '@chakra-ui/react';

// Define the backend URL with TypeScript support for import.meta
declare interface ImportMeta {
  env: {
    VITE_BACKEND_URL?: string;
  };
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export function usePoolListWebSocket() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const toast = useToast();
  
  // Connect to WebSocket
  const { isConnected, subscribe } = useWebSocket();
  
  // Handle WebSocket connection errors
  useEffect(() => {
    if (!isConnected && !loading) {
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to the server. Real-time updates are disabled.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [isConnected, loading, toast]);
  
  // Subscribe to WebSocket events
  useEffect(() => {
    if (!isConnected) return;
    
    // Subscribe to pool updates
    const unsubscribeUpdated = subscribe<Pool>('pool:updated', (data: Pool) => {
      setPools((prevPools: Pool[]) => {
        const index = prevPools.findIndex((p: Pool) => p.address === data.address);
        if (index === -1) return prevPools;
        
        const newPools = [...prevPools];
        newPools[index] = { ...newPools[index], ...data };
        return newPools;
      });
    });
    
    // Subscribe to new pools
    const unsubscribeCreated = subscribe<Pool>('pool:created', (data: Pool) => {
      setPools((prevPools: Pool[]) => {
        if (prevPools.some((p: Pool) => p.address === data.address)) return prevPools;
        return [...prevPools, data];
      });
    });
    
    // Subscribe to pool cache updates
    const unsubscribeCache = subscribe<Pool[]>('cache:pools', (data: Pool[]) => {
      setPools(data);
    });
    
    return () => {
      unsubscribeUpdated();
      unsubscribeCreated();
      unsubscribeCache();
    };
  }, [isConnected, subscribe]);
  
  // Fetch pools from API
  const fetchPools = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/pools`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch pools: ${response.statusText}`);
      }
      
      const data: Pool[] = await response.json();
      setPools(data);
      setError(null);
    } catch (err: unknown) {
      console.error('Error fetching pools:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      toast({
        title: 'Error',
        description: 'Failed to fetch pools. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);
  
  // Initial fetch
  useEffect(() => {
    fetchPools();
  }, [fetchPools]);
  
  return { pools, loading, error, isConnected, refetch: fetchPools };
}
