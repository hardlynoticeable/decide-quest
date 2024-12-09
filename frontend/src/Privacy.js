import React, { useEffect, useState } from 'react';
import { Text, Box, Link, Collapse } from '@chakra-ui/react';


export const Privacy = () => {

    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
      const timeoutId = setTimeout(() => {
        setIsOpen(false);
      }, 20000);
  
      return () => {
        clearTimeout(timeoutId);
      };
    }, []);

  return (
    <Box>
      <Collapse in={isOpen} transition={"height .2s ease"}>
        <Text fontSize={{ base: '0.8rem', md: '1.1rem' }} px={{ base: 0, md: '200px' }} >
          <Text>
              Application created by <Link href="mailto:stephenakins@gmail.com">Stephen Akins</Link> with the help of OpenAI.
          </Text> 
        </Text>
      </Collapse>
    </Box>
  );
}