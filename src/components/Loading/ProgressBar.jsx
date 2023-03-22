import React, { useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";

const ProgressBar = () => {
  document.body.style.overflow = "hidden"; // prevent scrolling
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let intervalId;
    intervalId = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        if (newProgress >= 100) {
          clearInterval(intervalId);
          return 100;
        }
        return newProgress;
      });
    }, 50); // Updated interval time here
    return () => clearInterval(intervalId);
  }, []);

  const progressWidth = `${Math.round(progress / 10) * 10}%`; // Round progress to nearest multiple of 10

  return (
    <Box
      w="100vw"
      h="100vh"
      position="fixed"
      top="0"
      left="0"
      zIndex="9999"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        position="relative"
        w="80%"
        h="25px"
        border="1px solid black"
        borderRadius="sm"
        overflow="hidden"
        transition="width 0.3s ease"
      >
        <Box
          w={progressWidth}
          h="100%"
          backgroundColor="#3b5d7c"
        >
          <Text color="white" fontWeight="bold" textAlign="center">
            {progress}%
          </Text>
        </Box>
      </Box>
      <Box
        position="absolute"
        top="0"
        left="0"
        w="100%"
        h="100%"
        zIndex="-1"
        backdropFilter="blur(4px)"
        opacity="0.6"
        backgroundColor="rgba(255, 255, 255)"
        >
      </Box>
    </Box>
  );
};

export default ProgressBar;
