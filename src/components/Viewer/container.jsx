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
	mentionUsers,
	caseInfo,
	addUsersToCase,
	Environment,
	accessToken,
	setIsXmlAnnotations,
	handleAnnotationClick,
}) => {
  const location = useLocation();

  const { fabricOverlayState } = useFabricOverlayState();
  const { viewerWindow } = fabricOverlayState;
  const { fabricOverlay, userCanvases, tile } = viewerWindow[viewerId];

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
      bottomZoomValue={bottomZoomValue}
      setZoomValue={setZoomValue}
      zoomValue={zoomValue}
      setModelname={setModelname}
			userInfo={userInfo}
			client2={client2}
      setBottomZoomValue={setBottomZoomValue}
      runAiModel={runAiModel}
			setLoadUI={setLoadUI}
      setToolSelected={setToolSelected}
			mentionUsers={mentionUsers}
			caseInfo={caseInfo}
			addUsersToCase={addUsersToCase}
			Environment={Environment}
			accessToken={accessToken}
			setIsXmlAnnotations={setIsXmlAnnotations}
			handleAnnotationClick={handleAnnotationClick}
		/>
	);
}


export default ViewerContainer;
