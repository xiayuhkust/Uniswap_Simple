import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Contract } from '@ethersproject/contracts'
import { FACTORY_ADDRESS, FACTORY_ABI, POOL_ABI, TOKEN_PAIRS, FEE_TIERS } from '../constants/pools'

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
        const poolPromises = TOKEN_PAIRS.map(async (pair) => {
          const poolAddress = await factory.getPool(
            pair.token0,
            pair.token1,
            FEE_TIERS.MEDIUM
          )

          if (poolAddress === '0x0000000000000000000000000000000000000000') {
            console.log(`No pool found for ${pair.token0Symbol}/${pair.token1Symbol}`)
            return null
          }

          const pool = new Contract(poolAddress, POOL_ABI, library)
          const [token0, token1, fee] = await Promise.all([
            pool.token0(),
            pool.token1(),
            pool.fee()
          ])

          // For demo purposes, using a random number for volume
          const volume7d = BigInt(Math.floor(Math.random() * 1000000))

          return {
            address: poolAddress,
            token0,
            token1,
            token0Symbol: pair.token0Symbol,
            token1Symbol: pair.token1Symbol,
            fee,
            volume7d
          }
        })

        const poolList = (await Promise.all(poolPromises)).filter((pool): pool is Pool => pool !== null)

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
