import React from "react";
import PropTypes from "prop-types";
import { Button, MenuButton, MenuItem } from "@chakra-ui/react";
import { TriangleDownIcon } from "@chakra-ui/icons";

const MenuAltButton = ({ label, restProps }) => {
  return (
    <MenuButton
      textAlign="left"
      as={Button}
      width="20em"
      size="sm"
      my={0.5}
      rightIcon={<TriangleDownIcon ml="20px" boxSize={2} />}
      variant="solid"
      backgroundColor="rgba(255,255,255, 0.2)"
      border="solid 0.1px rgba(255,255,255, 0.2)"
      _hover={{
        background: "rgba(255,255,255, 0.2)",
      }}
      _active={{
        background: "rgba(255,255,255, 0.2)",
        color: "#fff",
      }}
      color="#fff"
      fontFamily="sans-serif"
      textTransform="capitalize"
      fontSize="xs"
      lineHeight="20px"
      {...restProps}
    >
      {label}
    </MenuButton>
  );
};

const AltButton = ({ children, ...restProps }) => {
  return (
    <Button
      size="md"
      px="2"
      py="5"
      variant="solid"
      backgroundColor="rgba(255,255,255, 0.2)"
      border="solid 0.1px rgba(255,255,255, 0.2)"
      _hover={{
        background: "rgba(255,255,255, 0.2)",
        color: "#fff",
      }}
      color="#fff"
      fontFamily="sans-serif"
      textTransform="capitalize"
      fontSize="xs"
      lineHeight="20px"
      {...restProps}
    >
      {children}
    </Button>
  );
};

const MenuAltItem = ({ label, ...restProps }) => {
  return (
    <MenuItem
      _hover={{ backgroundColor: "#EAEAEA" }}
      _focus={{ backgroundColor: "#EAEAEA" }}
      label={label}
      {...restProps}
    >
      {label}
    </MenuItem>
  );
};

MenuAltButton.propTypes = {
  children: PropTypes.node.isRequired,
};

export { MenuAltItem, MenuAltButton };

export default AltButton;
