import { useState, useEffect } from 'react';
import { usePublicClient } from 'wagmi';
import { parseAbi, type Address } from 'viem';
import { FEE_TIERS } from './usePoolVolume';

const FACTORY_ABI = parseAbi([
  "event PoolCreated(address token0, address token1, uint24 fee, int24 tickSpacing, address pool)",
  "function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)"
]);

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
    const factoryAddress = '0xdf5F4d3239391716A4F5928d57E2AaDd3f644C70' as HexString;
    const TT1 = '0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9' as HexString;
    const TT2 = '0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122' as HexString;
    const WTURA = '0xF0e8a104Cc6ecC7bBa4Dc89473d1C64593eA69be' as HexString;

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

          return {
            address: poolAddress as Address,
            token0Symbol: pair.symbols[0],
            token1Symbol: pair.symbols[1],
            fee: FEE_TIERS.MEDIUM,
            volume7d: 0n,
            liquidity: 0n,
            currentPrice: null
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
