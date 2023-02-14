import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { RiNavigationFill } from "react-icons/ri";
import ToolbarButton from "./button";
import IconSize from "./IconSize";
import { useFabricOverlayState } from "../../state/store";

const ToolbarPointerControl = ({ viewerId }) => {
  const { fabricOverlayState } = useFabricOverlayState();
  const { viewerWindow, activeTool } = fabricOverlayState;
  const { fabricOverlay } = viewerWindow[viewerId];
  const [isActiveObject, setIsActiveObject] = useState();

  useEffect(() => {
    if (!fabricOverlay) return;

    const handleSelectionCleared = (e) => {
      setIsActiveObject(false);
    };
    const handleSelectionCreated = (e) => {
      setIsActiveObject(true);
    };
    const canvas = fabricOverlay.fabricCanvas();
    canvas.on("selection:created", handleSelectionCreated);
    canvas.on("selection:cleared", handleSelectionCleared);
  }, [fabricOverlay]);
  // const dispatch = useDispatch();
  // const isActive = activeTool === "POINTER";

  // const handleToolbarClick = () => {
  //   dispatch(updateTool({ tool: "POINTER" }));
  //   fabricOverlay.fabricCanvas().discardActiveObject();
  //   fabricOverlay.fabricCanvas().defaultCursor = "default";
  //   fabricOverlay.fabricCanvas().hoverCursor = "move";
  // };

  return (
    <ToolbarButton
      // onClick={handleToolbarClick}
      icon={<RiNavigationFill size={IconSize()} color="#151C25" />}
      // isActive={isActive}
      backgroundColor={isActiveObject ? "#E4E5E8" : ""}
      outline={isActiveObject ? "0.5px solid rgba(0, 21, 63, 1)" : ""}
      label="Select"
      _active={{ border: "none", bgColor: "none" }}
      _hover={{ bgColor: "none" }}
    />
  );
};

export default ToolbarPointerControl;
