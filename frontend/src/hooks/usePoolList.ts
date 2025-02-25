import { useState, useEffect } from 'react';
import { usePublicClient } from 'wagmi';
import { type Address } from 'viem';
import { FEE_TIERS } from './usePoolVolume';
import { FACTORY_ABI } from '../utils/contracts';
import { CONTRACT_ADDRESSES } from '../constants/addresses';
import { stringToBigInt, ZERO_BIGINT } from '../utils/bigint';

type HexString = `0x${string}`;

export interface Pool {
  address: Address;
  token0Symbol: string;
  token1Symbol: string;
  fee: number;
  volume7d: bigint;
  liquidity: bigint;
  currentPrice: number | null;
}

interface TokenPair {
  tokens: [HexString, HexString];
  symbols: [string, string];
}

export const usePoolList = () => {
  const [pools, setPools] = useState<Pool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const publicClient = usePublicClient();

  useEffect(() => {
    const factoryAddress = CONTRACT_ADDRESSES.FACTORY as HexString;
    const TT1 = CONTRACT_ADDRESSES.TEST_TOKEN_1 as HexString;
    const TT2 = CONTRACT_ADDRESSES.TEST_TOKEN_2 as HexString;
    const WTURA = CONTRACT_ADDRESSES.WETH as HexString;

    const fetchPools = async () => {
      if (!publicClient) return;
      
      try {
        setIsLoading(true);
        const pairs: TokenPair[] = [
          { tokens: [TT1, TT2], symbols: ['TT1', 'TT2'] },
          { tokens: [TT1, WTURA], symbols: ['TT1', 'WTURA'] },
          { tokens: [TT2, WTURA], symbols: ['TT2', 'WTURA'] }
        ];

        const poolPromises = pairs.map(async (pair) => {
          const factory = {
            address: factoryAddress,
            abi: FACTORY_ABI,
          };

          const poolAddress = await publicClient.readContract({
            ...factory,
            functionName: 'getPool',
            args: [pair.tokens[0], pair.tokens[1], FEE_TIERS.MEDIUM]
          });

          if (poolAddress === '0x0000000000000000000000000000000000000000') {
            return null;
          }

          // Return test data for the first pool
          return {
            address: poolAddress as Address,
            token0Symbol: pair.symbols[0],
            token1Symbol: pair.symbols[1],
            fee: FEE_TIERS.MEDIUM,
            volume7d: stringToBigInt('1'),
            liquidity: pair.symbols[0] === 'TT1' && pair.symbols[1] === 'TT2' 
              ? stringToBigInt('1')  // Test pool with liquidity
              : ZERO_BIGINT,
            currentPrice: null  // Let usePoolData handle price calculation
          };
        });

        const poolResults = await Promise.all(poolPromises);
        const validPools = poolResults.filter((pool): pool is NonNullable<typeof pool> => pool !== null);
        setPools(validPools);
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
