import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Contract } from '@ethersproject/contracts'
import { FACTORY_ADDRESS, FACTORY_ABI, POOL_ABI } from '../constants/pools'

interface Pool {
  address: string
  token0: string
  token1: string
  token0Symbol: string
  token1Symbol: string
  fee: number
  volume7d: bigint
}

export function usePoolList() {
  const { library } = useWeb3React()
  const [pools, setPools] = useState<Pool[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPools = async () => {
      if (!library) {
        setIsLoading(false)
        return
      }

      try {
        const factory = new Contract(FACTORY_ADDRESS, FACTORY_ABI, library)
        const TT1 = '0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9'
        const TT2 = '0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122'
        const FEE_TIER = 3000 // 0.3%
        
        const poolAddress = await factory.getPool(TT1, TT2, FEE_TIER)
        
        if (poolAddress === '0x0000000000000000000000000000000000000000') {
          console.log('No pool found for TT1/TT2')
          return []
        }

        const pool = new Contract(poolAddress, POOL_ABI, library)
        const [token0, token1, fee] = await Promise.all([
          pool.token0(),
          pool.token1(),
          pool.fee()
        ])

        // For demo purposes, using a random number for volume
        const volume7d = BigInt(Math.floor(Math.random() * 1000000))

        const poolList = [{
          address: poolAddress,
          token0,
          token1,
          token0Symbol: 'TT1',
          token1Symbol: 'TT2',
          fee,
          volume7d
        }]

        setPools(poolList)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        setError(errorMessage)
        console.error('Error fetching pools:', errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPools()
  }, [library])

  return { pools, isLoading, error } as const
}
