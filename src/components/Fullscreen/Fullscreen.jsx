import React, { useState } from "react";
import { RiFullscreenFill } from "react-icons/ri";
import ToolbarButton from "../ViewerToolbar/button";
import IconSize from "../ViewerToolbar/IconSize";
import { useFabricOverlayState } from "../../state/store";

const Fullscreen = ({ viewerId }) => {
  const { fabricOverlayState } = useFabricOverlayState();
  const { viewer } = fabricOverlayState?.viewerWindow[viewerId];
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullScreen = () => {
    if (!isFullscreen) {
      // viewer.setControlsEnabled(true);
      setIsFullscreen(true);
      document.body.requestFullscreen();
    } else {
      setIsFullscreen(false);
      document.exitFullscreen();
    }
  };
  window.addEventListener('popstate', () => {
    if (isFullscreen) {
      setIsFullscreen(false);
      document.exitFullscreen();
    }
  });
  return (
    <ToolbarButton
      icon={<RiFullscreenFill size={IconSize()} color="#151C25" />}
      backgroundColor="#D9D9D9"
      _hover={{ bgColor: "#ECECEC" }}
      _active={{
        outline: "none",
      }}
      mr="0px"
      label="Full screen"
      onClick={handleFullScreen}
      zIndex={500}
    />
  );
};

export default Fullscreen;
