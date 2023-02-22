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
    }, 100); // Updated interval time here
    return () => clearInterval(intervalId);
  }, []);

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
      >
        <Box
          w={`${progress}%`}
          h="100%"
          backgroundColor="#3b5d7c"
          transition="width 0.3s ease"
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
        backgroundColor="rgba(255, 255, 255, 0.4)"
        _before={{
          content: '""',
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          filter: "blur(4px)",
          zIndex: "-1",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
        }}
      ></Box>
    </Box>
  );
};

export default ProgressBar;
