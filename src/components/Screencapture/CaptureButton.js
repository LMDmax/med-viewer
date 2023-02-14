import React, { Component } from "react";
import { BiScreenshot } from "react-icons/bi";
import { Button, useMediaQuery } from "@chakra-ui/react";

const Navbar = ({ capture }) => {
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1660px)");

  return (
    <Button
      background="#F8F8F5"
      onClick={capture}
      // pos="absolute"
      // right={ifScreenlessthan1536px ? "210px" : "235px"}
      // top={ifScreenlessthan1536px ? "3.5px" : "8px"}
      borderRadius={0}
      title="crop and run morphometry"
    >
      <BiScreenshot />
    </Button>
  );
};

export default Navbar;
