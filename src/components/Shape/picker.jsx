import React from "react";
import PropTypes from "prop-types";
import { Box, Divider, IconButton, Text, HStack } from "@chakra-ui/react";
import { BsCircle, BsSquare } from "react-icons/bs";
import { useWindowHeight } from "@react-hook/window-size";
import { isMobile, isTablet } from "react-device-detect";
import TypeButton from "../typeButton";
import { useFabricOverlayState } from "../../state/store";

export const shapes = [
  { name: "rect", icon: <BsSquare /> },
  { name: "circle", icon: <BsCircle /> },
];

const ShapePicker = ({ activeShape, activeTool, handleShapeSelect }) => {
  const { fabricOverlayState } = useFabricOverlayState();
  const { color } = fabricOverlayState;
  const windowHeight = useWindowHeight();
  let btnSize = "lg";

  if (windowHeight <= 645) {
    btnSize = "md";
  }
  if (isMobile && !isTablet) {
    btnSize = "md";
  }

  return (
    <HStack>
      {shapes.map((shape) => (
        <TypeButton
          key={shape.name}
          icon={shape.icon}
          backgroundColor={activeTool === shape.name ? "#8fa8e1" : "#dddddd"}
          color={activeTool === shape.name ? "black" : "#3963c3"}
          onClick={() => handleShapeSelect(shape)}
        />
      ))}
    </HStack>
  );
};

ShapePicker.propTypes = {
  handleShapeSelect: PropTypes.func,
};

export default ShapePicker;
