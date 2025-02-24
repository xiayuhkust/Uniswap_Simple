export interface Web3ProviderState {
  chainId: number | undefined
  account: string | undefined
  active: boolean
  error: Error | undefined
}

export interface Web3ContextType extends Web3ProviderState {
  connect: () => Promise<void>
  disconnect: () => void
}
