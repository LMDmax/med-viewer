import React, { useState, useEffect } from "react";
import { FiRotateCw } from "react-icons/fi";
import ToolbarButton from "../ViewerToolbar/button";
import IconSize from "../ViewerToolbar/IconSize";
import { useFabricOverlayState } from "../../state/store";
import TooltipLabel from "../AdjustmentBar/ToolTipLabel";

const Rotate = ({ viewerId }) => {
  const { fabricOverlayState } = useFabricOverlayState();
  const { viewer } = fabricOverlayState?.viewerWindow[viewerId];

  const handleRotate = (e) => {
    try {
      if (viewer.viewport) {
        let currRotation = viewer.viewport.getRotation();
        currRotation += 90;
        viewer.viewport.setRotation(currRotation);
      }
    } catch (e) {
      console.error("Error handling rotate button click", e);
    }
  };

  return (
    <ToolbarButton
      icon={<FiRotateCw size={IconSize()} color="#151C25" />}
      label={<TooltipLabel heading="Rotate" paragraph="Rotate WSI Image" />}
      onClick={handleRotate}
    />
  );
};

export default Rotate;
