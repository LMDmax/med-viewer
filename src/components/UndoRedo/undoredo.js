import React, { useState, useEffect } from "react";
import { IconButton, Flex } from "@chakra-ui/react";
import { RiArrowGoBackFill, RiArrowGoForwardLine } from "react-icons/ri";
import { useParams } from "react-router-dom";
import "fabric-history/src/index";
import ToolbarButton from "../ViewerToolbar/button";
import IconSize from "../ViewerToolbar/IconSize";
import { useFabricOverlayState } from "../../state/store";
import TooltipLabel from "../AdjustmentBar/ToolTipLabel";

const UndoRedo = ({ viewerId }) => {
  const { fabricOverlayState } = useFabricOverlayState();
  const { fabricOverlay, slideId } = fabricOverlayState?.viewerWindow[viewerId];
  const [canvas, setCanvas] = useState();
  const params = useParams();

  useEffect(() => {
    if (!fabricOverlay) return;
    const canvasLocal = fabricOverlay.fabricCanvas();
    setCanvas(canvasLocal);
    canvasLocal.clearHistory();
  }, [fabricOverlay, slideId]);

  useEffect(() => {
    if (!params || !canvas) return;
    fabricOverlay.fabricCanvas().clearHistory();
    fabricOverlay.fabricCanvas().clear();
  }, [params.id]);

  const handleUndo = () => {
    fabricOverlay.fabricCanvas().undo();
  };

  const handleRedo = () => {
    fabricOverlay.fabricCanvas().redo();
  };

  return (
    <Flex ml="18px">
      <ToolbarButton
        icon={<RiArrowGoBackFill size={IconSize()} color="#151C25" />}
        onClick={handleUndo}
        label={<TooltipLabel heading="Undo" />}
        mr="8px"
      />
      <ToolbarButton
        icon={<RiArrowGoForwardLine size={IconSize()} color="#151C25" />}
        onClick={handleRedo}
        label={<TooltipLabel heading="Redo" />}
        mr="8px"
      />
    </Flex>
  );
};

export default UndoRedo;
