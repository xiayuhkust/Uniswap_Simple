// Type declarations for modules without TypeScript definitions

declare module 'react' {
  import React from 'react';
  export = React;
  
  // These exports are needed for direct imports
  export const useState: typeof React.useState;
  export const useEffect: typeof React.useEffect;
  export const useCallback: typeof React.useCallback;
  export const useMemo: typeof React.useMemo;
  export const useRef: typeof React.useRef;
}

declare module 'react-router-dom' {
  // Define specific exports that are used in the codebase
  export interface RouteProps {
    path?: string;
    exact?: boolean;
    component?: React.ComponentType<any>;
  }
  
  export function useParams<T extends Record<string, string | undefined>>(): T;
  export function useNavigate(): (to: string) => void;
  export function useLocation(): { pathname: string; search: string; hash: string; state: any };
  export function BrowserRouter(props: { children: React.ReactNode }): JSX.Element;
  export function Routes(props: { children: React.ReactNode }): JSX.Element;
  export function Route(props: RouteProps & { element: React.ReactNode }): JSX.Element;
}

declare module '@chakra-ui/react' {
  import * as React from 'react';
  
  // Define specific components and hooks used in the codebase
  export const ChakraProvider: React.FC<any>;
  export const VStack: React.FC<any>;
  export const HStack: React.FC<any>;
  export const Box: React.FC<any>;
  export const Text: React.FC<any>;
  export const Button: React.FC<any>;
  export const Spinner: React.FC<any>;
  export const Input: React.FC<any>;
  export const FormControl: React.FC<any>;
  export const FormLabel: React.FC<any>;
  export const FormErrorMessage: React.FC<any>;
  export const Select: React.FC<any>;
  export const Flex: React.FC<any>;
  export const Heading: React.FC<any>;
  export const Divider: React.FC<any>;
  export const Stack: React.FC<any>;
  export const Container: React.FC<any>;
  export const Link: React.FC<any>;
  export const Image: React.FC<any>;
  export const Badge: React.FC<any>;
  export const Alert: React.FC<any>;
  export const AlertIcon: React.FC<any>;
  export const AlertTitle: React.FC<any>;
  export const AlertDescription: React.FC<any>;
  
  export function useToast(): {
    (props: any): void;
    close: (id: string) => void;
    closeAll: () => void;
    isActive: (id: string) => boolean;
  };
  
  export function useDisclosure(): {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onToggle: () => void;
  };
}

declare module 'wagmi' {
  // Define specific exports used in the codebase
  export interface Account {
    address: string;
    isConnected: boolean;
  }
  
  export function useAccount(): Account;
  export function useContractWrite(config: any): { writeAsync: (params: any) => Promise<any> };
  export function useContractRead(config: any): { data: any; isLoading: boolean };
  export function createConfig(config: any): any;
  export function configureChains(chains: any[], providers: any[]): { chains: any[]; publicClient: any };
  export function createStorage(options: { storage: Storage }): any;
  export function WagmiConfig(props: { config: any; children: React.ReactNode }): JSX.Element;
  export type Address = `0x${string}`;
}

declare module 'wagmi/connectors/injected' {
  export class InjectedConnector {
    constructor(config: any);
  }
}

declare module 'wagmi/providers/jsonRpc' {
  export function jsonRpcProvider(config: any): any;
}

declare module 'viem' {
  export type Address = `0x${string}`;
  export function parseUnits(value: string, decimals: number): bigint;
  export function formatUnits(value: bigint, decimals: number): string;
}
