import React, { useState, useEffect } from "react";
import ToolbarButton from "../ViewerToolbar/button";
import { FiRotateCw } from "react-icons/fi";
import IconSize from "../ViewerToolbar/IconSize";
import { useFabricOverlayState } from "../../state/store";

const Rotate = ({ viewerId }) => {
  const { fabricOverlayState } = useFabricOverlayState();
  const { viewer } = fabricOverlayState?.viewerWindow[viewerId];

  const handleRotate = (e) => {
    try {
      if (viewer.viewport) {
        var currRotation = viewer.viewport.getRotation();
        currRotation = currRotation + 90;
        viewer.viewport.setRotation(currRotation);
      }
    } catch (e) {
      console.error("Error handling rotate button click", e);
    }
  };

  return (
    <ToolbarButton
      icon={<FiRotateCw size={IconSize()} color="#151C25" />}
      label="Rotate"
      onClick={handleRotate}
    />
  );
};

export default Rotate;
