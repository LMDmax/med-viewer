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
      w="300px"
      h="4px"
      borderRadius="20px"
      // border="1px solid black" // Add black border
      overflow="hidden" // Hide overflowing progress
      zIndex="9999"
      // bg="#D9D9D9"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box w="100%" h="100%" background="#D9D9D9" position="relative">
        <Box
          position="absolute"
          top="0"
          left="0"
          bottom="0"
          width={progressWidth}
          background="#1B75BC"
          transition="width 0.5s ease-out" // Add transition for width
        />
      </Box>
      <Box
        position="absolute"
        top="0"
        left="0"
        bottom="30px"
        w="100%"
        // h="100vh"
        zIndex="-1"
        backdropFilter="blur(1px)"
        backgroundColor="rgba(255, 255, 255, 0.15)"
        // boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.37)"
        borderRadius="10px"
        border="1px solid rgba(255, 255, 255, 0.18)"
      ></Box>
    </Box>
  );
};

export default ProgressBar;
