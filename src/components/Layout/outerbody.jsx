import React from "react";
import PropTypes from "prop-types";
import { Flex } from "@chakra-ui/react";

const LayoutOuterBody = ({ children }) => {
  return (
    <Flex flexGrow={1} as="main" direction="column" overflowY="hidden">
      {children}
    </Flex>
  );
};

LayoutOuterBody.propTypes = {
  children: PropTypes.node,
};

export default LayoutOuterBody;
