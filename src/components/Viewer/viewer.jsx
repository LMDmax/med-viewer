import React, { useEffect, useRef, useState } from "react";

import { Box } from "@chakra-ui/react";
import OpenSeadragon from "openseadragon";
import { fabric, initFabricJSOverlay } from "openseadragon-fabricjs-overlay";
import PropTypes from "prop-types";
import { isBrowser } from "react-device-detect";

import { updateOverlay } from "../../state/actions/fabricOverlayActions";
import { useFabricOverlayState } from "../../state/store";
import ViewerControls from "./controls";
import "../../utility/fabricUtility";

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
         tileSources: [
           {
            tileSource:  tile,
           }
        
        ],
  
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

    // console.log("123213",viewerId);

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
      // border="5px solid green"
    >
      {isBrowser && (
        <ViewerControls
          application={application}
          viewerId={viewerId}
          userInfo={userInfo}
          enableAI={enableAI}
          slide={slide}
          bottomZoomValue={bottomZoomValue}
          runAiModel={runAiModel}
          setLoadUI={setLoadUI}
          client2={client2}
          navigatorCounter={navigatorCounter}
          setModelname={setModelname}
          setZoomValue={setZoomValue}
          zoomValue={zoomValue}
          viewerIds={viewerIds}
          setBottomZoomValue={setBottomZoomValue}
          setToolSelected={setToolSelected}
          mentionUsers={mentionUsers}
          caseInfo={caseInfo}
          addUsersToCase={addUsersToCase}
          Environment={Environment}
          accessToken={accessToken}
          setIsXmlAnnotations={setIsXmlAnnotations}
          handleAnnotationClick={handleAnnotationClick}
        />
      )}
      {/* <Button onClick={selection}>Select</Button> */}
    </Box>
  );
}

Viewer.propTypes = {
  tile: PropTypes.string,
  viewerId: PropTypes.string,
};

export default Viewer;