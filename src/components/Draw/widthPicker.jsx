import React from "react";
import PropTypes from "prop-types";
import { HStack } from "@chakra-ui/react";
import ToolbarBorderBoxInner from "../ViewerToolbar/borderBoxInner";
import { widths } from "./width";
import { useFabricOverlayState } from "../../state/store";

const DrawWidthPicker = ({ width, setWidth }) => {
  const { fabricOverlayState } = useFabricOverlayState();
  const { color } = fabricOverlayState;

  return (
    <HStack spacing={2} ml="30px" px={1} py={2} my={3}>
      {widths.map((widthObj) => {
        const imgSrc = require(`../../assets/images/pen-weight-icons/${color.label}${widthObj.size}.png`);
        return (
          <ToolbarBorderBoxInner
            key={widthObj.size}
            w={widthObj.boxSize}
            h={widthObj.boxSize}
            bgImage={`url(${imgSrc.default})`}
            borderColor={
              width && widthObj.size === width.size ? "white" : "#A3A3A3"
            }
            bgSize="cover"
            display="block"
            onClick={() => setWidth(widthObj)}
          />
        );
      })}
    </HStack>
  );
};

export default DrawWidthPicker;
