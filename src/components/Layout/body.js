import React from "react";
import PropTypes from "prop-types";
import { Flex } from "@chakra-ui/react";

const LayoutAppBody = ({ children }) => {
  return (
    <Flex flexGrow={1} direction="row" as="main" gap="2px">
      {children}
    </Flex>
  );
};

LayoutAppBody.propTypes = {
  children: PropTypes.node,
};

export default LayoutAppBody;
