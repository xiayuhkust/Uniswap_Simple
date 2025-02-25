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
    const fetchPools = async () => {
      if (!publicClient) return;
      
      try {
        setIsLoading(true);
        const pairs: TokenPair[] = [
          { tokens: [CONTRACT_ADDRESSES.TEST_TOKEN_1 as HexString, CONTRACT_ADDRESSES.TEST_TOKEN_2 as HexString], symbols: ['TT1', 'TT2'] },
          { tokens: [CONTRACT_ADDRESSES.TEST_TOKEN_1 as HexString, CONTRACT_ADDRESSES.WETH as HexString], symbols: ['TT1', 'WTURA'] },
          { tokens: [CONTRACT_ADDRESSES.TEST_TOKEN_2 as HexString, CONTRACT_ADDRESSES.WETH as HexString], symbols: ['TT2', 'WTURA'] }
        ];

        const poolPromises = pairs.map(async (pair) => {
          const factory = {
            address: CONTRACT_ADDRESSES.FACTORY as HexString,
            abi: FACTORY_ABI,
          };

          const poolAddress = await publicClient.readContract({
            ...factory,
            functionName: 'getPool',
            args: [pair.tokens[0], pair.tokens[1], FEE_TIERS.MEDIUM]
          });

          if (poolAddress === CONTRACT_ADDRESSES.ZERO) {
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
