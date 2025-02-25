import { Address, zeroAddress } from 'viem'

export const CONTRACT_ADDRESSES = {
  WETH: '0xc8F7d7989a409472945b00177396f4e9b8601DF3' as Address,
  FACTORY: '0xdf5F4d3239391716A4F5928d57E2AaDd3f644C70' as Address,
  MANAGER: '0xeA55332dDe678746aCC684D323e357Df05B6F767' as Address,
  TEST_TOKEN_1: '0x3F26F01Fa9A5506c9109B5Ad15343363909fc0b9' as Address,
  TEST_TOKEN_2: '0x8FDCE0D41f0A99B5f9FbcFAfd481ffcA61d01122' as Address,
  ZERO: zeroAddress
} as const

// Export type for type-safe access
export type ContractAddressKey = keyof typeof CONTRACT_ADDRESSES
export type ContractAddress = typeof CONTRACT_ADDRESSES[ContractAddressKey]
