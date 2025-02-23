import { useMemo } from 'react'
import { Contract } from '@ethersproject/contracts'
import { useWeb3React } from '@web3-react/core'
import { CONTRACT_ADDRESSES } from '../constants/addresses'
import { TOKEN_ABI, POSITION_MANAGER_ABI, FACTORY_ABI, POOL_ABI } from '../constants/abis'

export function useContract(address: string, abi: any) {
  const { library, account } = useWeb3React()
  
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

export function useTokenContract(address: string) {
  return useContract(address, TOKEN_ABI)
}

export function usePositionManagerContract() {
  return useContract(CONTRACT_ADDRESSES.POSITION_MANAGER, POSITION_MANAGER_ABI)
}

export function useFactoryContract() {
  return useContract(CONTRACT_ADDRESSES.FACTORY, FACTORY_ABI)
}

export function usePoolContract(address: string) {
  return useContract(address, POOL_ABI)
}
