import { extendTheme } from '@chakra-ui/react'


const theme = extendTheme({
  fonts: {
      heading: '"Avenir Next", sans-serif',
      body: '"Open Sans", sans-serif',
  },
  colors: {
      brand: {
          bg: '#134b5f',
          text: '#fff',
          card: '#0A99FF',
      },
      'chakra-body-text': '#0f0',
      'chakra-placeholder-color': '#f00',
  },
  sizes: {
      xl: {
          h: '56px',
          fontSize: 'lg',
          px: '32px',
          bg: '#9747FF'
      },
  }
})

console.log("exporting theme.js")
export default theme


