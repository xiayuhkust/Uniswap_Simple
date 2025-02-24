import { VStack, Button, Box } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { PoolList } from '../components/Pool/PoolList'

export function PoolPage() {
  const navigate = useNavigate()

  return (
    <VStack spacing={4} width="100%">
      <Button 
        colorScheme="blue" 
        width="100%" 
        maxW="container.sm"
        onClick={() => navigate('/pool/create')}
      >
        Create New Pool
      </Button>
      <Box width="100%" maxW="container.xl">
        <PoolList />
      </Box>
    </VStack>
  )
}
