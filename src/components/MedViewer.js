import React, { useState, useEffect, useReducer } from "react";
import fabricOverlayReducer from "./state/reducers/fabricOverlayReducer";
import { brandColors } from "./styles/brandPalette";
import { addViewerWindow } from "./state/actions/fabricOverlayActions";
import _ from "lodash";
import { StoreProvider } from "./state/store";
import LayoutApp from "./components/Layout/app";

const Medviewer = ({ viewerIds, slideData, ...props }) => {
  const [isReady, setIsReady] = useState(false);
  const [fabricOverlayState, setFabricOverlayState] = useReducer(
    fabricOverlayReducer,
    {
      activeTool: "Move",
      color: brandColors[0],
      viewerWindow: {},
      username: "",
      roomName: "",
      sync: false,
      isAnnotationLoading: false,
      isViewportAnalysing: false,
    }
  );
  useEffect(() => {
    if (
      !fabricOverlayState?.viewerWindow ||
      _.keys(fabricOverlayState?.viewerWindow).length !== 0
    )
      return;
    const viewerWindows = [];
    viewerWindows.push({
      id: slideData?.id,
      tile: slideData?.slide?.data.dzi_path,
      slideId: slideData?._id,
      originalFileUrl: slideData?.originalFileUrl,
    });
    // console.log(viewerWindows);
    setFabricOverlayState(addViewerWindow(viewerWindows));
    setIsReady(true);
  }, [fabricOverlayState, slideData]);

  return (
    <StoreProvider value={{ fabricOverlayState, setFabricOverlayState }}>
      <LayoutApp viewerIds={viewerIds} {...props} />
    </StoreProvider>
  );
};

export default Medviewer;




