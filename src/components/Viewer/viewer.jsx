import React, { useEffect, useRef, useState } from "react";
import { fabric, initFabricJSOverlay } from "openseadragon-fabricjs-overlay";
import OpenSeadragon from "openseadragon";
import { isBrowser } from "react-device-detect";
import { Box } from "@chakra-ui/react";
import PropTypes from "prop-types";
import ViewerControls from "./controls";
import { useFabricOverlayState } from "../../state/store";
import { updateOverlay } from "../../state/actions/fabricOverlayActions";
import "../../utility/fabricUtility";

const osdOptions = {
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
  navigatorPosition: "BOTTOM_RIGHT",
  navigatorHeight: "130px",
  navigatorWidth: "220px",
  navigatorAutoFade: false,
  navigatorAutoResize: false,
  springStiffness: isBrowser ? 20 : 10,
  viewportMargin: {
    left: 100,
    top: 100,
    right: 100,
    bottom: 100,
  },
  visibilityRatio: isBrowser ? 1 : 0.5,
  zoomPerClick: 1.5,
  crossOriginPolicy: "Anonymous",
  timeout: 60000,
};

const Viewer = ({
  viewerId,
  tile,
  userInfo,
  enableAI,
  slide,
  application,
  caseInfo,
  client2,
  mentionUsers,
  addUsersToCase,
}) => {
  const { setFabricOverlayState } = useFabricOverlayState();
  const [viewer, setViewer] = useState(null);
  const boxRef = useRef();

  // Customize Fabric selection handles
  fabric.Object.prototype.set({
    borderColor: "#22a2f8",
    borderScaleFactor: 2, // selection stroke width
    cornerColor: "white",
    cornerSize: 10,
    transparentCorners: false,
    hasControls: true,
    evented: true,
  });

  useEffect(() => {
    // Initialize OpenSeadragon instance and set to viewer
    if (viewer) viewer.destroy();

    setViewer(
      OpenSeadragon({
        ...osdOptions,
        tileSources: tile,
        id: `viewer${viewerId}`,
      })
    );
    initFabricJSOverlay(OpenSeadragon, fabric);
    return () => {
      if (viewer) viewer.destroy();
    };
  }, []);

  // Show the results.
  useEffect(() => {
    if (!viewer) return;

    // Create the fabric.js overlay, and set it on a sharable context
    // viewer.open(tile.source);

    setFabricOverlayState(
      updateOverlay({
        id: viewerId,
        fabricOverlay: viewer.fabricjsOverlay({ scale: 1 }),
        viewer,
      })
    );

    return () => {
      setFabricOverlayState(
        updateOverlay({
          id: viewerId,
          fabricOverlay: null,
          viewer: null,
        })
      );
    };
  }, [viewer]);
  return (
    <Box
      ref={boxRef}
      id={`viewer${viewerId}`}
      position="relative"
      w="100%"
      h="100%"
    >
      {isBrowser && (
        <ViewerControls
          application={application}
          viewerId={viewerId}
          userInfo={userInfo}
          enableAI={enableAI}
          slide={slide}
          client2={client2}
          mentionUsers={mentionUsers}
          caseInfo={caseInfo}
          addUsersToCase={addUsersToCase}
        />
      )}
      {/* <Button onClick={selection}>Select</Button> */}
    </Box>
  );
};

Viewer.propTypes = {
  tile: PropTypes.string,
  viewerId: PropTypes.string,
};

export default Viewer;
