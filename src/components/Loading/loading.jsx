import React from "react";
import { Flex, Spinner } from "@chakra-ui/react";

const Loading = ({
  speed = "0.65s",
  thickness = "4px",
  size = "xl",
  color = "#3965C5",
  ...restProps
}) => {
  return (
    <Flex justify="center" align="center" h="100vh" {...restProps}>
      <Spinner color={color} size={size} thickness={thickness} speed={speed} />
    </Flex>
  );
};

export default Loading;
