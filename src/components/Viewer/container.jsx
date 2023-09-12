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
  setLoadUI,
  setToolSelected,
  onMessageListener,
  application,
  client2,
  isXmlAnnotations,
  onMentionUsers,
  caseInfo,
  navigatorCounter,
  onAddUsersToCase,
  Environment,
  viewerIds,
  accessToken,
  binaryMask,
  setIsXmlAnnotations,
  handleAnnotationClick,
  getAnnotationFromDB,
  getVhutSubscriptionData,
  getXMLAnnotationFromDB,
  getAnnotationSubscriptionData,
  getFilterDataFromDB,
  onUpdateVhutAnalysis,
  getVhutAnalysisData,
  onModifyAnnotation,
  onDeleteAnnotationFromDB,
  onSendMessage,
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
      onMentionUsers={onMentionUsers}
      caseInfo={caseInfo}
      onAddUsersToCase={onAddUsersToCase}
      Environment={Environment}
      isXmlAnnotations={isXmlAnnotations}
      accessToken={accessToken}
      setIsXmlAnnotations={setIsXmlAnnotations}
      handleAnnotationClick={handleAnnotationClick}
      getAnnotationFromDB={getAnnotationFromDB}
      getVhutSubscriptionData={getVhutSubscriptionData}
      getXMLAnnotationFromDB={getXMLAnnotationFromDB}
      getAnnotationSubscriptionData={getAnnotationSubscriptionData}
      getFilterDataFromDB={getFilterDataFromDB}
      onUpdateVhutAnalysis={onUpdateVhutAnalysis}
      getVhutAnalysisData={getVhutAnalysisData}
      onModifyAnnotation={onModifyAnnotation}
      onDeleteAnnotationFromDB={onDeleteAnnotationFromDB}
      onSendMessage={onSendMessage}
    />
  );
};

export default ViewerContainer;
