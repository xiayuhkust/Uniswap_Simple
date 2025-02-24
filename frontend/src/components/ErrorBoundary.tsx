import { Component, ReactNode } from 'react'
import { Box, Text } from '@chakra-ui/react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box p={4} bg="red.100" color="red.900" borderRadius="md">
          <Text>Something went wrong.</Text>
        </Box>
      )
    }

    return this.props.children
  }
}
