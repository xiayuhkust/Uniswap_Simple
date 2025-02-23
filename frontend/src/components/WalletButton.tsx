
import { Button, useToast } from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import { injected, TURA_NETWORK } from '../lib/web3'
import { useEffect } from 'react'

export function WalletButton() {
  const { active, account, connect, disconnect } = useWeb3()

  const handleClick = async () => {
    if (active) {
      await disconnect()
    } else {
      await connect()
    }
  }

  const displayAddress = account ? 
    `${account.slice(0, 6)}...${account.slice(-4)}` : 
    'Connect Wallet'

  return (
    <Button
      onClick={handleClick}
      colorScheme={active ? 'gray' : 'blue'}
      variant="solid"
      size="md"
      paddingX={6}
      data-testid="wallet-button"
      data-devinid="connect-wallet"
    >
      {displayAddress}
    </Button>
  )
}
