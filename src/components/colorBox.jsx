import React from "react";
import { Button, Box } from "@chakra-ui/react";

const ColorBox = (restProps) => {
  return <Box as="button" w={4} h={4} borderRadius="4px" {...restProps} />;
};

export default ColorBox;
