import { useContractWrite, useContractRead, Address } from 'wagmi'
import IUniswapV3Factory from '../abi/IUniswapV3Factory.json'
import IUniswapV3Manager from '../abi/IUniswapV3Manager.json'

// Contract addresses from deployment_records.md
export const FACTORY_ADDRESS = '0xdf5F4d3239391716A4F5928d57E2AaDd3f644C70' as Address
export const MANAGER_ADDRESS = '0xeA55332dDe678746aCC684D323e357Df05B6F767' as Address
export const WTURA_ADDRESS = '0xc8F7d7989a409472945b00177396f4e9b8601DF3' as Address

// Test token addresses
export const TT1_ADDRESS = '0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9' as Address
export const TT2_ADDRESS = '0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122' as Address

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
    address: FACTORY_ADDRESS as Address,
    abi: FACTORY_ABI,
    functionName: 'getPool',
    args: [tokenA, tokenB, fee],
    enabled: !!tokenA && !!tokenB && fee > 0,
  })
}

export function useCreatePool() {
  return useContractWrite({
    address: FACTORY_ADDRESS as Address,
    abi: FACTORY_ABI,
    functionName: 'createPool',
  })
}

export function useManagerContract() {
  return {
    address: MANAGER_ADDRESS as Address,
    abi: MANAGER_ABI,
  }
}
