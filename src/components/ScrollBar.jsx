import React from "react";
import { Flex } from "@chakra-ui/react";

const ScrollBar = ({ children }) => {
  return (
    <Flex
      flexDir="column"
      overflowY="scroll"
      overflowX="hidden"
      minH="0px"
      css={{
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          width: "6px",
          borderRadius: "5px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#cdcdcd",
          borderRadius: "5px",
        },
      }}
    >
      {children}
    </Flex>
  );
};

export default ScrollBar;
