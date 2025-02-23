import { useState, useEffect } from 'react'
import { TOKEN_METADATA } from '../constants/tokenList'
import type { Token } from '../types/token'

export function useTokenList() {
  const [tokens, setTokens] = useState<Token[]>([])

  useEffect(() => {
    const tokenList = Object.values(TOKEN_METADATA).map(token => ({
      ...token,
      balance: '0.0'
    }))
    setTokens(tokenList)
  }, [])

  return tokens
}
