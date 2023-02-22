import React from "react";
import { Flex } from "@chakra-ui/react";

const ScrollBar = ({ children }) => {
  return (
    <Flex
      w="100%"
      flexDir="column"
      overflowY="auto"
      overflowX="hidden"
      css={{
        "&::-webkit-scrollbar": {
          width: "4px",
        },
        "&::-webkit-scrollbar-track": {
          width: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#C4C4C4",
        },
      }}
    >
      {children}
    </Flex>
  );
};

export default ScrollBar;
