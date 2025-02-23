
import { Button } from '@chakra-ui/react'
import { useWeb3 } from '../hooks/useWeb3'

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
