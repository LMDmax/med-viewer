import React from "react";
import { RiFullscreenFill } from "react-icons/ri";
import ToolbarButton from "../ViewerToolbar/button";
import IconSize from "../ViewerToolbar/IconSize";
import { useFabricOverlayState } from "../../state/store";

const Fullscreen = ({ viewerId }) => {
  const { fabricOverlayState } = useFabricOverlayState();
  const { viewer } = fabricOverlayState?.viewerWindow[viewerId];

  const handleFullScreen = () => {
    if (viewer.isFullPage() && !viewer.isFullScreen()) {
      // Is fullPage but not fullScreen
      viewer.setFullPage(false);
    } else {
      viewer.setFullScreen(!viewer.isFullPage());
    }
  };
  return (
    <ToolbarButton
      icon={<RiFullscreenFill size={IconSize()} color="#151C25" />}
      backgroundColor="#E4E5E8"
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
