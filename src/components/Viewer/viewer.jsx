import React, { useEffect, useRef, useState } from "react";
import { Box } from "@chakra-ui/react";
import OpenSeadragon from "openseadragon";
import PropTypes from "prop-types";
import { isBrowser } from "react-device-detect";
import { updateOverlay } from "../../state/actions/fabricOverlayActions";
import { useFabricOverlayState } from "../../state/store";
import ViewerControls from "./controls";

const osdOptions = {
  maxZoomLevel: 6.0,
  constrainDuringPan: !!isBrowser,
  debugMode: false,
  gestureSettingsMouse: {
    clickToZoom: false,
    flickEnabled: true,
    pinchToZoom: true,
    scrollToZoom: true,
  },
  gestureSettingsTouch: {
    clickToZoom: false,
    flickEnabled: true,
    pinchToZoom: true,
    scrollToZoom: true,
  },
  showNavigator: true,
  showNavigationControl: false,
  navigatorPosition: "BOTTOM_LEFT",
  navigatorHeight: "126px",
  navigatorWidth: "247px",
  navigatorAutoFade: true,
  navigatorAutoResize: false,
  navigatorOpacity: 0.8,
  navigatorBorderColor: "gray",
  navigatorDisplayRegionColor: "red",
  springStiffness: isBrowser ? 20 : 10,
  viewportMargin: {
    left: 100,
    top: 100,
    right: 100,
    bottom: 100,
  },
  visibilityRatio: isBrowser ? 1 : 0.5,
  zoomPerClick: 1.5,
  crossOriginPolicy: "null",
  timeout: 60000,
};

function Viewer({
  viewerId,
  tile,
  runAiModel,
  userInfo,
  enableAI,
  navigatorCounter,
  bottomZoomValue,
  zoomValue,
  setZoomValue,
  viewerIds,
  slide,
  setBottomZoomValue,
  application,
  setLoadUI,
  caseInfo,
  setToolSelected,
  client2,
  setModelname,
  mentionUsers,
  addUsersToCase,
  Environment,
  accessToken,
  setIsXmlAnnotations,
  handleAnnotationClick,
}) {
  const { setFabricOverlayState } = useFabricOverlayState();
  const [viewer, setViewer] = useState(null);
  const boxRef = useRef();

console.log(tile);
  const InitOpenseadragon = () => {
    if (!boxRef.current) return; // Check if the element exists before creating the viewer
    viewer && viewer.destroy();
    setViewer(
      OpenSeadragon({
        ...osdOptions,
        tileSources: tile,
        id: `viewer${viewerId}`,
      })
    );
  };

  useEffect(() => {
    InitOpenseadragon();
    return () => {
        viewer && viewer.destroy();
    };
  }, []);
  

  return (
    <Box
      ref={boxRef}
      id={`viewer${viewerId}`}
      position="relative"
      w="100%"
      h="100%"
    >
      {/* {isBrowser && (
        <ViewerControls
          viewerId={viewerId}
          slide={slide}
          navigatorCounter={navigatorCounter}
          setBottomZoomValue={setBottomZoomValue}
        />
      )} */}
      {/* <Button onClick={selection}>Select</Button> */}
    </Box>
  );
}

Viewer.propTypes = {
  tile: PropTypes.string,
  viewerId: PropTypes.string,
};

export default Viewer;
