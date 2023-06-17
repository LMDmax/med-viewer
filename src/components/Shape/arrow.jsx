import React from "react";
import { BsArrowUpRight } from "react-icons/bs";
import TypeButton from "../typeButton";
import { useFabricOverlayState } from "../../state/store";
import { updateTool } from "../../state/actions/fabricOverlayActions";

const Arrow = () => {
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { activeTool } = fabricOverlayState;
  const isActive = activeTool === "Arrow";

  const handleClick = () => {
    setFabricOverlayState(updateTool({ tool: isActive ? "" : "Arrow" }));
  };

  return (
    <TypeButton
      pl="0px"
      icon={<BsArrowUpRight size={22} />}
      backgroundColor={isActive ? "#E4E5E8" : ""}
      borderRadius="0px"
      label="Line"
      onClick={handleClick}
    />
  );
};

export default Arrow;
