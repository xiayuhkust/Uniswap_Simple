import { useContractWrite, useContractRead, Address } from 'wagmi'
import IUniswapV3Factory from '../abi/IUniswapV3Factory.json'
import IUniswapV3Manager from '../abi/IUniswapV3Manager.json'
import { CONTRACT_ADDRESSES } from '../constants/addresses'

// Contract ABIs
export const FACTORY_ABI = IUniswapV3Factory.abi
export const MANAGER_ABI = IUniswapV3Manager.abi

export const FEES = {
  LOWEST: 500,   // 0.05%
  MEDIUM: 3000,  // 0.3%
} as const

export function sortTokens(tokenA: Address, tokenB: Address): [Address, Address] {
  return tokenA.toLowerCase() < tokenB.toLowerCase() 
    ? [tokenA, tokenB] 
    : [tokenB, tokenA]
}

export function useGetPool(tokenA: Address, tokenB: Address, fee: number) {
  return useContractRead({
    address: CONTRACT_ADDRESSES.FACTORY,
    abi: FACTORY_ABI,
    functionName: 'getPool',
    args: [tokenA, tokenB, fee],
    enabled: !!tokenA && !!tokenB && fee > 0,
  })
}

export function useCreatePool(options?: any) {
  return useContractWrite({
    ...options,
    address: CONTRACT_ADDRESSES.FACTORY,
    abi: FACTORY_ABI,
    functionName: 'createPool',
  })
}

export function useManagerContract() {
  return {
    address: CONTRACT_ADDRESSES.MANAGER,
    abi: MANAGER_ABI,
  }
}
