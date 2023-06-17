import React from "react";
import { Button, Box, Text, Flex, Spacer } from "@chakra-ui/react";

const Popup = ({ handlePopup, popup }) => {
  const handlePopupClose = () => {
    handlePopup();
  };
  return (
    <Flex
      zIndex="1000"
      width="100vw"
      height="100vh"
      pos="fixed"
      top="0px"
      left="0px"
      display={popup ? "flex" : "none"}
    >
      <Flex
        direction="column"
        border=" 1px solid #ECECEC"
        width="500px"
        height="300px"
        bgColor="#fff"
        borderRadius="10px"
        pos="absolute"
        top="30%"
        left="35%"
      >
        <Box
          fontSize="18px"
          alignItems="flex-start"
          bgColor="#ECECEC"
          px="30px"
          py="10px"
        >
          Notification
        </Box>
        <Flex pt="80px" justifyContent="center">
          <Text fontSize="28px">Coming Soon</Text>
        </Flex>
        <Flex width="100%" pt="60px" px="30px" justifyContent="flex-end">
          <Button
            onClick={handlePopupClose}
            bgColor="#00153F"
            color="#fff"
            fontSize="18px"
          >
            Close
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Popup;
