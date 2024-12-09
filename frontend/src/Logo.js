import React, { useState, useEffect } from 'react';
import { Image, keyframes, Box, Collapse } from '@chakra-ui/react';

import logo1 from './images/logo-nofigures-transparent.png'; 
import logo2 from './images/logo-transparent.png';

const fade = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }  
`;

export const Logo = () => {

  const [showLogo2, setShowLogo2] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const eventDisappear = setTimeout(() => {
      setIsOpen(false);
    }, 20000);

    return () => {
      clearTimeout(eventDisappear);
    };
  }, []);

  useEffect(() => {
    const eventFadeIn = setTimeout(() => {
      setShowLogo2(true);
    }, 1500);
    return () => clearTimeout(eventFadeIn);
  }, []);

  return (

    <Collapse in={isOpen} transition={"height .2s ease"}>
      <Box 
        bgImage={logo1}
        bgSize="cover"
      >

        <Image
          position="relative" 
          top={0}
          left={0}
          animation={showLogo2 ? `4s ${fade} backwards` : 'none'} 
          src={logo2}
          opacity={showLogo2 ? 1 : 0} 
        />

      </Box>
    </Collapse>
  );
}
