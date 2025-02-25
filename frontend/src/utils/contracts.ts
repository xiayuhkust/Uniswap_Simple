import { useContractWrite, useContractRead, Address } from 'wagmi'
import IUniswapV3Factory from '../abi/IUniswapV3Factory.json'

export const FACTORY_ADDRESS = '0xdf5F4d3239391716A4F5928d57E2AaDd3f644C70'

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
    address: FACTORY_ADDRESS,
    abi: IUniswapV3Factory.abi,
    functionName: 'getPool',
    args: [tokenA, tokenB, fee],
    enabled: !!tokenA && !!tokenB && fee > 0,
  })
}

export function useCreatePool() {
  return useContractWrite({
    address: FACTORY_ADDRESS,
    abi: IUniswapV3Factory.abi,
    functionName: 'createPool',
  })
}
