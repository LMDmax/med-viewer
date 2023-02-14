import React from "react";
import { Button } from "@chakra-ui/react";

const HeaderButton = ({ label }) => {
  return (
    <Button
      variant="unstyled"
      color="#000"
      fontFamily="roboto"
      fontSize="sm"
      fontWeight="100"
    >
      {label}
    </Button>
  );
};

export default HeaderButton;
