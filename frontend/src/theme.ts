import { extendTheme, ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

export const theme = extendTheme({
  config,
  styles: {
    global: {
      body: {
        bg: 'gray.900',
        color: 'white'
      }
    }
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
      },
      defaultProps: {
        colorScheme: 'blue',
      },
    },
  },
})
