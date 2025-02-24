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
        color: 'gray.100'
      }
    }
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        color: 'gray.100',
      },
      defaultProps: {
        colorScheme: 'blue',
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: 'blue.500',
      },
      variants: {
        outline: {
          field: {
            color: 'gray.100',
            _placeholder: {
              color: 'gray.400',
            },
          },
        },
      },
    },
  },
})
