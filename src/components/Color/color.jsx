import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Box, HStack, Text } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import DrawWidthPicker from "../Draw/widthPicker";
import ColorOptionsPanel from "./optionsPanel";
import "../../styles/viewer.css";
import { useFabricOverlayState } from "../../state/store";

const Color = ({ viewerId, colorsButtonHandler }) => {
  const { fabricOverlayState } = useFabricOverlayState();
  const { activeTool, viewerWindow } = fabricOverlayState;

  const [myState, setState] = useState({
    isObjectSelected: false,
    isActiveTool: false,
  });
  const myStateRef = useRef(myState);
  const setMyState = (data) => {
    myStateRef.current = { ...myState, ...data };
    setState((state) => ({ ...state, ...data }));
  };
  const [closeButton, setCloseButton] = useState(true);
  const handleCloseButtonClick = () => {
    setCloseButton(false);
    colorsButtonHandler(false);
  };

  useEffect(() => {
    setMyState({
      isActiveTool: Boolean(activeTool && activeTool !== "POINTER"),
    });
  }, [activeTool]);

  /**
   * Handle mouse events
   */
  useEffect(() => {
    if (!viewerWindow) return;

    const handleSelectionCleared = (e) => {
      setMyState({
        ...myStateRef.current,
        isObjectSelected: false,
      });
    };
    const handleSelectionCreated = (e) => {
      setMyState({
        ...myStateRef.current,
        isObjectSelected: true,
      });
    };
    const handleSelectionUpdated = (e) => {};

    for (const k in viewerWindow) {
      const overlay = viewerWindow[k].fabricOverlay;
      if (!overlay) continue;
      const canvas = overlay.fabricCanvas();
      canvas.on("selection:created", handleSelectionCreated);
      canvas.on("selection:cleared", handleSelectionCleared);
      canvas.on("selection:updated", handleSelectionUpdated);
    }
    return () => {
      for (const k in viewerWindow) {
        const overlay = viewerWindow[k].fabricOverlay;
        if (!overlay) continue;
        const canvas = overlay.fabricCanvas();
        canvas.off("selection:created", handleSelectionCreated);
        canvas.off("selection:cleared", handleSelectionCleared);
        canvas.off("selection:updated", handleSelectionUpdated);
      }
    };
  }, [viewerWindow]);

  return (
    <Box
      width="100%"
      height="6em"
      borderRight="0.5px solid black"
      boxSizing="border-box"
      borderRadius="3px"
    >
      <CloseIcon
        color="black"
        transform="scale(0.5)"
        cursor="pointer"
        onClick={handleCloseButtonClick}
        marginInline="calc(100% - 18px)"
        marginTop="-8px"
      />
      <HStack
        spacing={0}
        align="center"
        color="black"
        className="color_toolbar_box"
      >
        <Box width="100%" marginTop="-2.5em">
          <Text paddingLeft="2em">Color</Text>
          <Box px={10} my={4}>
            <ColorOptionsPanel
              isActiveTool={isActiveTool}
              isObjectSelected={isObjectSelected}
            />
          </Box>
        </Box>
        <Box width="10em" height="6em">
          <Text marginLeft="1em" marginTop="-1.2em" color="#000">
            Width
          </Text>
          <DrawWidthPicker align="center" />
        </Box>
      </HStack>
    </Box>
  );
};

export default Color;
