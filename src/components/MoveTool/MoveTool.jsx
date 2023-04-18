import React from "react";
import {
  Flex,
  IconButton,
  useMediaQuery,
  Tooltip,
  Text,
  Image,
  Box,
} from "@chakra-ui/react";
import ToolbarButton from "../ViewerToolbar/button";
import { BsCursorFill, BsCursor } from "react-icons/bs";
import IconSize from "../ViewerToolbar/IconSize";

const MoveTool = ({ isActive, handleClick }) => {
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  return (
    <Box
      bg={isActive ? " rgba(157,195,226,0.4)" : ""}
      w="60px"
      // border="2px solid red"
      h="100%"
      py="5px"
      onClick={handleClick}
    >
      <IconButton
        width={ifScreenlessthan1536px ? "100%" : "100%"}
        height={ifScreenlessthan1536px ? "50%" : "70%"}
        _hover={{ bgColor: "transparent" }}
        icon={
          <BsCursor
            style={{ fontSize: "1.5em", transform: "scaleX(-1)" }}
            color="black"
          />
        }
        _active={{
          bgColor: "transparent",
          outline: "none",
        }}
        // outline={TilHover ? " 0.5px solid rgba(0, 21, 63, 1)" : ""}
        // _focus={{
        // }}
        backgroundColor="transparent"
        // mr="7px"
        // border="1px solid red"
        borderRadius={0}
      />
      <Text align="center">Select</Text>
    </Box>
  );
};

export default MoveTool;
