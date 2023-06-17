import React from "react";
import PropTypes from "prop-types";
import { Button } from "@chakra-ui/react";

const ModalButton = ({ children, ...restProps }) => {
  return (
    <Button
      size="md"
      variant="solid"
      color="#fff"
      fontFamily="Whitney,Helvetica Neue,Helvetica,Arial,sans-serif"
      textTransform="capitalize"
      fontSize="md"
      lineHeight="20px"
      _focus={{ border: "none" }}
      {...restProps}
    >
      {children}
    </Button>
  );
};

ModalButton.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ModalButton;
