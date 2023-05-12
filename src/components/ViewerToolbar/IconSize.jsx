import React from "react";
import { useMediaQuery } from "@chakra-ui/react";

const IconSize = () => {
  const [ifScreenlessthan1660] = useMediaQuery("(max-width:1660px)");
  const size = ifScreenlessthan1660 ? "16px" : "18px";

  return size;
};
export default IconSize;
