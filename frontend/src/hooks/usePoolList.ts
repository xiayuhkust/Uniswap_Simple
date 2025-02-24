import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Contract } from '@ethersproject/contracts'
import { FACTORY_ADDRESS, FACTORY_ABI, POOL_ABI } from '../constants/pools'

interface Pool {
  address: string
  token0: string
  token1: string
  fee: number
  volume7d: bigint
}

export function usePoolList() {
  const { library } = useWeb3React()
  const [pools, setPools] = useState<Pool[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPools = async () => {
      if (!library) {
        setIsLoading(false)
        return
      }

      try {
        const factory = new Contract(FACTORY_ADDRESS, FACTORY_ABI, library)
        
        // First check if factory contract exists
        const code = await library.getCode(FACTORY_ADDRESS)
        if (code === '0x') {
          console.warn('Factory contract not deployed at', FACTORY_ADDRESS)
          setIsLoading(false)
          return
        }

        const filter = factory.filters.PoolCreated()
        const events = await factory.queryFilter(filter)

        const poolPromises = events.map(async (event) => {
          if (!event.args) {
            console.warn('Event args undefined for event:', event)
            return null
          }

          try {
            const pool = new Contract(event.args.pool, POOL_ABI, library)
            const [token0, token1, fee] = await Promise.all([
              pool.token0(),
              pool.token1(),
              pool.fee()
            ])

            // For demo purposes, using a random number for volume
            const volume7d = BigInt(Math.floor(Math.random() * 1000000))

            return {
              address: event.args.pool,
              token0,
              token1,
              fee,
              volume7d
            }
          } catch (error) {
            console.warn('Error fetching pool data:', error)
            return null
          }
        })

        const poolList = (await Promise.all(poolPromises)).filter((pool): pool is Pool => pool !== null)
        setPools(poolList)
      } catch (error) {
        console.error('Error fetching pools:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPools()
  }, [library])

  return { pools, isLoading }
}
