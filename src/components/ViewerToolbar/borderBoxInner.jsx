import React from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";

const ToolbarBorderBoxInner = ({ ...restProps }) => {
  const bg = useColorModeValue("white", "gray.700");

  return (
    <Box
      as="button"
      borderRadius={25}
      borderWidth="2px"
      _focus={{
        // outline: `lightgray auto 1px`,
        outline: `none`,
      }}
      {...restProps}
    />
  );
};

export default ToolbarBorderBoxInner;
