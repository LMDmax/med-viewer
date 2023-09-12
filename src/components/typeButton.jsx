import React from "react";
import { IconButton } from "@chakra-ui/react";

const TypeButton = (restProps) => {
  return (
    <IconButton
      size="xs"
      variant="unstyled"
      pl="6px"
      p="10px"
      borderRadius="8px"
      _focus={{
        border: "none",
      }}
      {...restProps}
    />
  );
};

export default TypeButton;
