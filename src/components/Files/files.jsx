import React, { useState } from "react";
import { Select, Box, Table, Tr, Tbody, Button, Flex } from "@chakra-ui/react";
import HeaderButton from "../headerButton";

const Files = ({ dropDownToggle, dropDownVar }) => {
  return (
    <Button
      pos="fixed"
      zIndex={1}
      variant="unstyled"
      color="#000"
      fontSize="sm"
      top={0}
      fontWeight="100"
      left="155px"
      onClick={() => dropDownToggle(!dropDownVar)}
    >
      Files
    </Button>
  );
};

export default Files;
