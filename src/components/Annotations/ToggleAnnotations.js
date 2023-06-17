import React, { useState, useEffect } from "react";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import useCanvasHelpers from "../../hooks/use-fabric-helpers";
import ToolbarButton from "../ViewerToolbar/button";
import TooltipLabel from "../AdjustmentBar/ToolTipLabel";

const ToggleAnnotations = ({ viewerId }) => {
  const { toggleAnnotationVisibility } = useCanvasHelpers(viewerId);
  const [visible, setVisible] = useState(true);

  const handleToggle = () => {
    toggleAnnotationVisibility(!visible);
    setVisible((state) => !state);
  };

  return (
    <ToolbarButton
      icon={
        visible ? (
          <BsToggleOn size={20} color="#3B5D7C" />
        ) : (
          <BsToggleOff size={20} color="#3B5D7C" />
        )
      }
      onClick={handleToggle}
      label={
        <TooltipLabel
          heading={visible ? "Hide Annotations" : "Show Annotations"}
        />
      }
      _active={{ background: "none" }}
      pl="6px"
      mx="8px"
    />
  );
};

export default ToggleAnnotations;
