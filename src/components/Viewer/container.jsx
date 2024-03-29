import React, { useEffect } from "react";

import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

import { useFabricOverlayState } from "../../state/store";
import Viewer from "./viewer";

const ViewerContainer = ({
  viewerId,
  slideName,
  userInfo,
  enableAI,
  slide,
  setBottomZoomValue,
  zoomValue,
  runAiModel,
  setModelname,
  setZoomValue,
  bottomZoomValue,
	onLoadAnnotations,
  setNewSliderInputs,
	onSaveAnnotation,
	onDeleteAnnotation,
	onUpdateAnnotation,
	setLoadUI,
	onVhutAnalysis,
  setToolSelected,
	onGetVhutAnalysis,
	onMessageListener,
	application,
	client2,
  isXmlAnnotations,
	mentionUsers,
	caseInfo,
  navigatorCounter,
	addUsersToCase,
	Environment,
  viewerIds,
	accessToken,
  binaryMask,
	setIsXmlAnnotations,
  handleAnnotationClick,
  isLocalRegion
}) => {
  const location = useLocation();

  const { fabricOverlayState } = useFabricOverlayState();
  const { viewerWindow } = fabricOverlayState;
  const { fabricOverlay, userCanvases, tile } = viewerWindow[viewerId];

  // console.log(location);

  const newCanvasTitle =
    location.state && location.state.canvasTitle
      ? location.state.canvasTitle
      : "";

  useEffect(() => {
    if (!fabricOverlay) return;
    const canvas = fabricOverlay.fabricCanvas();
    canvas.hoverCursor = "move";
    canvas.fireRightClick = true;
    canvas.stopContextMenu = true;
  }, [fabricOverlay]);

  /**
   * Handle changes to selected LOC work.
   * User selected a Saved Annotation from their list, so update the Fabric canvas
   */
  useEffect(() => {
    if (!fabricOverlay || !location.state) return;
    fabricOverlay
      .fabricCanvas()
      .loadFromJSON(userCanvases[location.state.canvasTitle].fabricCanvas);
  }, [newCanvasTitle]);

  // Handle no match
  if (!tile) {
    return (
      <Box w="100%" p={8}>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle mr={2}>Image loading error!</AlertTitle>
          <AlertDescription>No image with that id exists.</AlertDescription>
        </Alert>
      </Box>
    );
  }

  // Success
  // return <Viewer tile={tileSource} />;

  return (
    <Viewer
      application={application}
      viewerId={viewerId}
      tile={tile}
      enableAI={enableAI}
      slide={slide}
      viewerIds={viewerIds}
      bottomZoomValue={bottomZoomValue}
      setZoomValue={setZoomValue}
      zoomValue={zoomValue}
      setModelname={setModelname}
      binaryMask={binaryMask}
			userInfo={userInfo}
			client2={client2}
      setBottomZoomValue={setBottomZoomValue}
      runAiModel={runAiModel}
      setNewSliderInputs={setNewSliderInputs}
			setLoadUI={setLoadUI}
      navigatorCounter={navigatorCounter}
      setToolSelected={setToolSelected}
			mentionUsers={mentionUsers}
			caseInfo={caseInfo}
			addUsersToCase={addUsersToCase}
			Environment={Environment}
      isXmlAnnotations={isXmlAnnotations}
			accessToken={accessToken}
			setIsXmlAnnotations={setIsXmlAnnotations}
      handleAnnotationClick={handleAnnotationClick}
      isLocalRegion={isLocalRegion}
		/>
	);
}


export default ViewerContainer;
