import React from "react";
import { Menu, MenuList, Button } from "@chakra-ui/react";
import { MenuAltButton, MenuAltItem } from "../altButton";

const Algorithm = () => {
  return (
    <Menu>
      <MenuAltButton as={Button} color="white" label="Select Algorithm" />
      <MenuList
        mt={-2}
        p={0}
        py={2}
        backgroundColor="#EAEAEA"
        fontSize="sm"
        zIndex="2"
        minW={0}
        color="#3965C6"
      >
        <MenuAltItem label="Basic Palette" />
      </MenuList>
    </Menu>
  );
};

export default Algorithm;
