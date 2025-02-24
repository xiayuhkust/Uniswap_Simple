import { Contract } from '@ethersproject/contracts'
import { useWeb3React } from '@web3-react/core'
import { useMemo } from 'react'
import type { Web3Provider } from '@ethersproject/providers'

export function useContract(address: string, abi: string[]): Contract | null {
  const { library, account } = useWeb3React<Web3Provider>()

  return useMemo(() => {
    if (!address || !abi || !library) return null
    try {
      return new Contract(address, abi, library.getSigner(account))
    } catch (error) {
      console.error('Failed to create contract instance:', error)
      return null
    }
  }, [address, abi, library, account])
}
