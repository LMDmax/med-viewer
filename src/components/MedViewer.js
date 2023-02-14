import React, { useState, useEffect, useReducer } from "react";
import _ from "lodash";
import axios from "axios";
import LayoutApp from "./Layout/app";
import Loading from "./Loading/loading";
import { StoreProvider } from "../state/store";
import { addViewerWindow } from "../state/actions/fabricOverlayActions";
import fabricOverlayReducer from "../state/reducers/fabricOverlayReducer";
import { brandColors } from "../styles/brandPalette";
import { getFileBucketFolder } from "../utility/utility";

const MedViewer = ({ viewerIds, ...props }) => {
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
    viewerIds.forEach((slide) => {
      viewerWindows.push({
        id: slide._id,
        tile: slide.awsImageBucketUrl,
        slideName: slide.accessionId,
        slideId: slide._id,
        originalFileUrl: slide.originalFileUrl,
      });
    });
    setFabricOverlayState(addViewerWindow(viewerWindows));
    const key = getFileBucketFolder(viewerIds[0].originalFileUrl);
    axios.post("https://development-morphometry-api.prr.ai/vhut/download", {
      key,
      bucket_name: "med-ai-image-processor",
    });
    setIsReady(true);
  }, [fabricOverlayState, viewerIds]);

  // useEffect(() => {
  //   return () => {
  //     setFabricOverlayState(resetFabricOverlay());
  //   };
  // }, []);

  return isReady && _.keys(fabricOverlayState?.viewerWindow).length > 0 ? (
    <React.StrictMode>
      <StoreProvider value={{ fabricOverlayState, setFabricOverlayState }}>
        <LayoutApp viewerIds={viewerIds} {...props} />
      </StoreProvider>
    </React.StrictMode>
  ) : (
    <Loading />
  );
};

export default MedViewer;
