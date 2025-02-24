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
      variants: {
        solid: {
          color: 'gray.100',
          _hover: {
            color: 'gray.100',
          },
        },
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
            borderColor: 'whiteAlpha.300',
            _placeholder: {
              color: 'gray.400',
            },
            _hover: {
              borderColor: 'whiteAlpha.400',
            },
            _focus: {
              borderColor: 'blue.500',
            },
          },
        },
      },
    },
  },
})
