import React from "react";
import PropTypes from "prop-types";
import { Flex, useMediaQuery } from "@chakra-ui/react";
import SidebarTools from "../Sidebar/tools";

const LayoutAppSidebar = (props) => {
  const [ifBiggerScreen] = useMediaQuery("(min-width:2560px)");
  const [ifMiddleScreen] = useMediaQuery("(min-width:1560px)");

  return (
    <Flex
      as="section"
      color="BLACK"
      w={ifBiggerScreen ? "12%" : ifMiddleScreen ? "15.5%" : "275px"}
      direction="column"
      alignItems="left"
      boxShadow="base"
      zIndex="2"
      backgroundColor="#FCFCFC"
      overflowX="hidden"
    >
      <SidebarTools {...props} />
    </Flex>
  );
};

LayoutAppSidebar.propTypes = {
  children: PropTypes.node,
};

export default LayoutAppSidebar;
