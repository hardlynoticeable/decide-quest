import React, { useState, useEffect } from 'react';
import { Image, keyframes, Text, Box, Flex, Link, Icon } from '@chakra-ui/react';
import { MoonIcon } from '@chakra-ui/icons';

import wizard from './images/wizard.png';
import wolf from './images/wolf.png';
import bowman from './images/bowman.png';
import dwarves from './images/dwarves.png';
import fairy from './images/fairy.png';
import flower from './images/flower.png';
import king from './images/king.png';
import mermaid from './images/mermaid.png';
import pixie from './images/pixie1.png';
import princess from './images/princess.png';
import queen from './images/queen.png';
import unicorn from './images/unicorn.png';
import witch from './images/witch.png';

// Add these animations at the top of the file
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const slideUp = keyframes`
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(-20px); opacity: 0; }
`;

const slideDown = keyframes`
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

// Add this constant before the Story component
const IMAGE_RULES = [
  { keywords: ['wolf', 'wolves'], image: wolf },
  { keywords: ['hero', 'bowman'], image: bowman },
  { keywords: ['dwarf', 'dwarves'], image: dwarves },
  { keywords: ['fairy', 'fairie', 'fairies'], image: fairy },
  { keywords: ['flower', 'garden'], image: flower },
  { keywords: ['king', 'emperor'], image: king },
  { keywords: ['mermaid', 'mermaids'], image: mermaid },
  { keywords: ['pixie', 'spell'], image: pixie },
  { keywords: ['princess'], image: princess },
  { keywords: ['queen', 'empress'], image: queen },
  { keywords: ['unicorn'], image: unicorn },
  { keywords: ['witch', 'hag', 'old woman'], image: witch },
];

// Add this helper function before the Story component
const getImageForDescription = (description) => {
  if (!description) return wizard;
  
  const lowercaseDesc = description.toLowerCase();
  const matchingRule = IMAGE_RULES.find(rule => 
    rule.keywords.some(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      return regex.test(lowercaseDesc);
    })
  );
  
  return matchingRule ? matchingRule.image : wizard;
};

export const Story = ({ onFirstClick }) => {
  let [loading, setLoading] = useState(true);
  let [story, setData] = useState(null);
  let [displayedStory, setDisplayedStory] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => { 
    loadStory().then(
      data => { 
        console.log('Loaded story data:', data); 
        setData(data);
      }
    ).catch(
      err => console.error("loadStory error:", err)
    ).finally(
      () => { 
        setLoading(false); 
      }
    );
  }, []); // Empty dependency array

  // Update displayedStory when story first loads
  useEffect(() => {
    if (story && !displayedStory) {
      setDisplayedStory(story);
    }
  }, [story, displayedStory]);

  if (loading) {
    return (
      <Box>
        <Text>Loading...</Text>
      </Box>
    );
  }

  if (story && typeof story.pageOptions === 'string') {
    try { 
      story.pageOptions = JSON.parse(story.pageOptions);
    } catch (error) {
      console.error('Error parsing pageOptions:', error); 
      story.pageOptions = {}; 
    }
  }

  return (
    <Flex
      px={{ base: 0, md: 4 }}
      maxWidth="container.lg"
      mx="auto"
      alignItems="flex-start"
    >
      <Box 
        flex="4" 
        minWidth="0" 
        textAlign="left" 
        pt={{ base: 0, md: 4 }} 
        pb={{ base: 0, md: 8 }} 
        lineHeight={1.8} 
        fontSize={{ base: '1rem', md: '1.4rem', lg: '2.5prem' }}
        animation={isTransitioning ? 
          `${isAnimatingOut ? slideUp : slideDown} 0.5s ease-in-out forwards` 
          : 'none'}
      >
        {(displayedStory == null || displayedStory.pageDescription == null) ? (
          <Flex>Creating your story...</Flex>
        ) : (displayedStory.pageDescription)}

        {displayedStory &&
          displayedStory.pageOptions && Object.keys(displayedStory.pageOptions).map(option => {
            const isSelected = selectedOption === option;
            return (
              <Box 
                key={option} 
                display="block" 
                mt={{ base: 2, md: 4 }}
                opacity={selectedOption && !isSelected ? 0.5 : 1}
                transition="opacity 0.3s"
              >
                <Icon 
                  as={MoonIcon} 
                  color="orange.300"
                  animation={isSelected ? `${spin} 2s linear infinite` : 'none'}
                />
                <Link
                  key={option}
                  onClick={() => handleOptionClick(
                    option, 
                    setData, 
                    setDisplayedStory,
                    setSelectedOption,
                    setIsTransitioning,
                    setIsAnimatingOut,
                    onFirstClick
                  )}
                  color="blue.200"
                  mt="8px"
                  pl="10px"
                  pointerEvents={selectedOption ? 'none' : 'auto'}
                >
                  {displayedStory.pageOptions[option] || 'Unknown option'}
                </Link>
              </Box>
            )
          })
        }

      </Box>

      <Box
        flex="1"
        display={{ base: 'none', md: 'block' }}
        pl={{ md: "30px", lg: "60px" }}
      >
        <Image
          src={getImageForDescription(displayedStory?.pageDescription)}
          width={"100%"}
          height={"auto"}
        />
      </Box>
    </Flex>
  );
}

async function loadStory() {
  const thread_id = sessionStorage.getItem('thread_id');
  const loadingStory = sessionStorage.getItem('loading_story');

  // First check if we already have a story loaded
  if (thread_id !== null) {
    return {
      thread_id: sessionStorage.getItem('thread_id'),
      run_id: sessionStorage.getItem('run_id'),
      pageDescription: sessionStorage.getItem('pageDescription'),
      pageOptions: JSON.parse(sessionStorage.getItem('pageOptions')),
      typeofPageOptions: sessionStorage.getItem('typeofPageOptions'),
    };
  }

  // If we're already loading, wait for the existing request
  if (loadingStory) {
    const waitForLoad = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      if (sessionStorage.getItem('thread_id')) {
        return loadStory();
      }
      return waitForLoad();
    };
    return waitForLoad();
  }

  // Start new story load
  sessionStorage.setItem('loading_story', 'true');
  try {
    const response = await fetch('http://localhost:1102/newadventure');
    const data = await response.json();

    if (data.status !== 'success') {
      throw new Error('Error fetching data');
    }

    // Store the data
    sessionStorage.setItem('thread_id', data.thread_id);
    sessionStorage.setItem('run_id', data.run_id);
    sessionStorage.setItem('pageDescription', data.pageDescription);
    sessionStorage.setItem('pageOptions', JSON.stringify(data.pageOptions));
    sessionStorage.setItem('typeofPageOptions', typeof data.pageOptions);
    
    sessionStorage.removeItem('loading_story');
    return data;
  } catch (err) {
    console.error('Error loading story:', err);
    sessionStorage.removeItem('loading_story');
    return { status: 'error' };
  }
}

async function handleOptionClick(
  option, 
  setData, 
  setDisplayedStory,
  setSelectedOption,
  setIsTransitioning,
  setIsAnimatingOut,
  onFirstClick
) {
  // Call onFirstClick if this is the first click
  if (onFirstClick) {
    onFirstClick();
  }
  
  // Set selected option (for spinning icon and faded options)
  setSelectedOption(option);
  
  // Load new content first (while current content is still visible)
  const newData = await nextPage(option, setData);
  
  // Now start the transition sequence
  setIsTransitioning(true);
  setIsAnimatingOut(true);
  
  // Wait for slide-up animation
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Update displayed content after slide-up
  setDisplayedStory(newData);
  
  setIsAnimatingOut(false);
  
  // Reset states after slide-down animation
  setTimeout(() => {
    setIsTransitioning(false);
    setSelectedOption(null);
  }, 500);
}

async function nextPage(option, setData) {
  const thread_id = sessionStorage.getItem('thread_id');
  const run_id = sessionStorage.getItem('run_id');
  const pageDescription = sessionStorage.getItem('pageDescription');
  const pageOptions = JSON.parse(sessionStorage.getItem('pageOptions'));

  const pageOptionsWithStringKeys = Object.fromEntries(
    Object.entries(pageOptions).map(([key, value]) => [String(key), value])
  );

  let url = `http://localhost:1102/page/${thread_id}/${run_id}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        option: option,
        optionLabel: pageOptionsWithStringKeys[option],
        pageDescription: pageDescription,
        pageOptions: pageOptionsWithStringKeys,
        thread_id: thread_id,
        run_id: run_id,
      })
    });

    const data = await response.json();

    // Handle thread expiration
    if (data.status === 'failed') {
      console.error('Request failed:', data.error);
      if (data.error === 'Thread expired') {
        sessionStorage.clear();
        return loadStory().then(setData);
      }
      // Show error message to user instead of starting new story
      setData(prevData => ({
        ...prevData,
        pageDescription: data.message || 'An error occurred',
        pageOptions: pageOptions // Restore previous options
      }));
      return;
    }

    // Update storage and state with new content
    sessionStorage.setItem('thread_id', data.thread_id);
    sessionStorage.setItem('run_id', data.run_id);
    sessionStorage.setItem('pageDescription', data.pageDescription);
    sessionStorage.setItem('pageOptions', JSON.stringify(data.pageOptions));
    sessionStorage.setItem('typeofPageOptions', typeof data.pageOptions);
    setData(data);
    
    return data;

  } catch (err) {
    console.error('Error:', err);
    // Restore previous state instead of starting new story
    setData(prevData => ({
      ...prevData,
      pageOptions: pageOptions
    }));
  }
}