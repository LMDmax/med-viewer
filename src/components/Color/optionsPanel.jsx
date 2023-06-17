import React from "react";
import PropTypes from "prop-types";
import { Flex, SimpleGrid } from "@chakra-ui/react";
import { brandColors } from "../../styles/brandPalette";
import ColorBox from "../colorBox";
import { useFabricOverlayState } from "../../state/store";
import { updateColor } from "../../state/actions/fabricOverlayActions";

const ColorOptionsPanel = ({ isActiveTool, isObjectSelected }) => {
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { color } = fabricOverlayState;
  const isVisible = isObjectSelected || isActiveTool;

  return (
    <Flex h="42px" direction="column" mt="10px">
      <Flex h="5px" bgColor="rgba(236, 236, 236, 1)" />
      <SimpleGrid
        columns={7}
        spacingY={1}
        bgColor="rgba(248, 248, 245, 1)"
        p="10px"
      >
        {brandColors.map((brandColor) => (
          <ColorBox
            key={brandColor.label}
            border={
              color.label === brandColor.label ? "1px solid black" : "none"
            }
            backgroundColor={brandColor.hex}
            mr="20px"
            p="3px"
            borderRadius="0px"
            onClick={() => setFabricOverlayState(updateColor(brandColor))}
          />
        ))}
      </SimpleGrid>
    </Flex>
  );
};

export default ColorOptionsPanel;
