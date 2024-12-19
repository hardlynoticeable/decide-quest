import theme from './theme'
import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  Grid,
  Fade,
} from '@chakra-ui/react';
import { Logo } from './Logo';
import { Story } from './Story';
import { Privacy } from './Privacy';
import { Opening } from './Opening';
import { pageview } from './gtag';

function App() {
  const [showBranding, setShowBranding] = useState(true);
  
  const handleFirstClick = () => {
    setShowBranding(false);
  };
  
  useEffect(() => {
    // Track the initial page load
    pageview(window.location.pathname);
  }, []);
  
  return (
    <ChakraProvider theme={theme}>
      <Box bg="brand.bg" color="gray.100" textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <VStack spacing={8}>
            <Fade in={showBranding} unmountOnExit={true}>
              <VStack spacing={8}>
                <Logo h="40vmin" pointerEvents="none" />
                <Opening />
              </VStack>
            </Fade>
            <Story onFirstClick={handleFirstClick} />
            <Privacy />
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

console.log('theme:');
console.log(theme);

export default App;
