export const tura = {
  id: 1337,
  name: 'Tura',
  network: 'tura',
  nativeCurrency: {
    decimals: 18,
    name: 'TURA',
    symbol: 'TURA',
  },
  rpcUrls: {
    default: { http: ['https://rpc-beta1.turablockchain.com'] },
    public: { http: ['https://rpc-beta1.turablockchain.com'] },
  }
} as const
