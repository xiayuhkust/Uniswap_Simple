import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import io, { Socket } from 'socket.io-client';

// Define the backend URL with TypeScript support for import.meta
declare interface ImportMeta {
  env: {
    VITE_BACKEND_URL?: string;
  };
}

// Define the backend URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// Define event types
export type WebSocketEvent = 
  | 'pool:created'
  | 'pool:updated'
  | 'pool:detail:updated'
  | 'token:created'
  | 'token:updated'
  | 'tokenList:updated'
  | 'cache:pools'
  | 'cache:tokens';

/**
 * Custom hook for WebSocket connection
 * @returns WebSocket connection and status
 */
export const useWebSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Create socket connection
    const socketInstance = io(BACKEND_URL);

    // Set up event handlers
    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    });

    socketInstance.on('connect_error', (error: Error) => {
      console.error('WebSocket connection error:', error);
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to the server. Real-time updates are disabled.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    });

    // Save socket instance
    setSocket(socketInstance);

    // Clean up on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [toast]);

  /**
   * Subscribe to a WebSocket event
   * @param event Event to subscribe to
   * @param callback Callback function
   */
  const subscribe = <T,>(event: WebSocketEvent, callback: (data: T) => void) => {
    if (!socket) return () => {};

    socket.on(event, callback);
    return () => {
      socket.off(event, callback);
    };
  };

  /**
   * Subscribe to pool updates
   * @param poolAddress Pool address
   */
  const subscribeToPool = (poolAddress: string) => {
    if (!socket) return;
    socket.emit('subscribe:pool', poolAddress);
  };

  /**
   * Unsubscribe from pool updates
   * @param poolAddress Pool address
   */
  const unsubscribeFromPool = (poolAddress: string) => {
    if (!socket) return;
    socket.emit('unsubscribe:pool', poolAddress);
  };

  return {
    socket,
    isConnected,
    subscribe,
    subscribeToPool,
    unsubscribeFromPool,
  };
};
