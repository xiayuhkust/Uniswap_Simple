import { extendTheme, ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

export const theme = extendTheme({
  config,
  colors: {
    uniswap: {
      pink: 'rgb(250, 43, 161)',
      gray: {
        100: 'rgb(245, 246, 252)',
        200: 'rgb(210, 217, 238)',
        500: 'rgb(119, 128, 160)'
      }
    }
  },
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
        uniswap: {
          bg: 'uniswap.pink',
          color: 'white',
          _hover: { 
            opacity: 0.8,
            bg: 'uniswap.pink', // Ensure background color stays during hover
            color: 'white' // Ensure text color stays during hover
          },
          borderRadius: '16px',
          padding: '16px 24px',
          fontWeight: 600
        }
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: 'uniswap.pink',
      },
      variants: {
        outline: {
          field: {
            color: 'black',
            borderColor: 'uniswap.gray.200',
            _placeholder: {
              color: 'gray.700',
            },
            _hover: {
              borderColor: 'uniswap.gray.500',
            },
            _focus: {
              borderColor: 'uniswap.pink',
            },
          },
        },
      },
    },
    Table: {
      variants: {
        simple: {
          th: {
            borderColor: 'uniswap.gray.200',
            fontSize: 'sm'
          },
          td: {
            borderColor: 'uniswap.gray.200'
          }
        }
      }
    }
  },
})
