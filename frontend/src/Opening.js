import React from 'react';
import { Text, Box, Collapse, Heading } from '@chakra-ui/react';

export const Opening = () => {
    return (
        <Box>
            <Collapse in={true} transition={{ enter: { duration: 1.5 }, exit: { duration: 1.5 } }}>
                <Heading 
                    color="global.text" 
                    fontFamily="heading" 
                    as="h3"  
                    fontSize={{ base: '1.1rem', md: '1.5rem', lg: '2rem' }}
                >
                    The Online Choose-Your-Own-Adventure&nbsp;Book written by&nbsp;Generative&nbsp;AI
                </Heading>
                <Text as="i" color="gray.200">
                    A New Adventure Every Time!
                </Text>
            </Collapse>
        </Box>
    );
}