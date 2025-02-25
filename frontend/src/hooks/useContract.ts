import { Contract } from '@ethersproject/contracts'
import { useWeb3React } from '@web3-react/core'
import { useMemo } from 'react'
import type { Web3Provider } from '@ethersproject/providers'

import type { ContractInterface } from '@ethersproject/contracts'

export function useContract(address: string, abi: ContractInterface): Contract | null {
  const { library, account } = useWeb3React<Web3Provider>()

  return useMemo(() => {
    if (!address || !abi || !library) return null
    try {
      const signer = account ? library.getSigner(account) : library
      return new Contract(address, abi, signer)
    } catch (error) {
      console.error('Failed to create contract instance:', error)
      return null
    }
  }, [address, abi, library, account])
}
