import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'
import { CONTRACT_ADDRESSES } from '../constants/addresses'
import { POSITION_MANAGER_ABI, TOKEN_ABI } from '../constants/abis'

interface Position {
  tokenId: string
  token0: string
  token1: string
  token0Symbol: string
  token1Symbol: string
  fee: number
  liquidity: string
}

export function usePositions() {
  const { library, account } = useWeb3React()
  const [positions, setPositions] = useState<Position[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPositions() {
      if (!library || !account) {
        setPositions([])
        setIsLoading(false)
        return
      }

      try {
        const positionManager = new ethers.Contract(
          CONTRACT_ADDRESSES.POSITION_MANAGER,
          POSITION_MANAGER_ABI,
          library
        )

        // For now, return empty array since we need to implement position fetching
        setPositions([])
      } catch (error) {
        console.error('Error fetching positions:', error)
        setPositions([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPositions()
  }, [library, account])

  return { positions, isLoading }
}
