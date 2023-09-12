import React, { memo, useEffect, useState } from "react";

import { Flex, Text, useMediaQuery, Box } from "@chakra-ui/react";

import Cancel from "../Cancel/Cancel";
import Move from "../Move/move";
import ScreenTools from "../Toolbar/ScreenTools";
import "../../styles/viewer.css";
function AdjustmentBar({
  userInfo,
  caseInfo,
  slide,
  refreshHil,
  setTumorArea,
  setStromaArea,
  setToolSelected,
  setTilScore,
  setLymphocyteCount,
  setLoadUI,
  setNewHilData,
  application,
  base64URL,
  viewerIds,
  enableAI,
  chatFeedBar,
  hideStroma,
  hideTumor,
  enableFilters,
  currentViewer,
  setGleasonScoring,
  annotations,
  sidebar,
  isNavigatorActive,
  setIsNavigatorActive,
  isMultiview,
  navigatorCounter,
  toolSelected,
  setIsMultiview,
  setTotalCells,
  AdjustmentTool,
  setAdjustmentTool,
  pathStroma,
  handleTILFeedBar,
  hideLymphocyte,
  setChatHover,
  lessonId,
  socketRef,
  socketIsConnected,
  modelName,
  setBinaryMask,
  setOriginalPixels,
  hideModification,
  setNavigatorCounter,
  newSliderInputs,
  setImageFilter,
  setModelname,
  setShowRightPanel,
  gleasonScoring,
  bottomZoomValue,
  zoomValue,
  handleChatFeedbar,
  handleChatFeedBarClose,
  isXmlAnnotations,
  Environment,
  onGetTumorGleasonAnalysis,
  getTumorGleasonResult,
  onGetTILAnalysis,
  onGetHILAnalysis,
  getTILSubscriptionData,
  onDeleteAnnotationFromDB,
  onCreateAnnotation,
  getVhutSubscriptionData,
  onVhutViewportAnalysisMutation,
  onModifyAnnotation,
}) {
  const [ifWidthLessthan1920] = useMediaQuery("(max-width:1920px)");

  useEffect(() => {
    localStorage.setItem("page", "viewer");
  }, []);
  return (
    <Flex
      className="adjustmentbar"
      alignItems="center"
      w="100%"
      justifyContent="space-between"
      height={ifWidthLessthan1920 ? "7vh" : "8vh"}
      // border="2px solid red"
      boxShadow="0px 0px 1px 0.1px"
      px="30px"
      bg="white"
      // py="5px"
      fontFamily="fira sans"
      fontSize={ifWidthLessthan1920 ? "14px" : "16px"}
      fontWeight="500"
      zIndex={2}
    >
      <Box w="25%" h="100%">
        <Cancel />
      </Box>
      <Move
        application={application}
        userInfo={userInfo}
        sidebar={sidebar}
        navigatorCounter={navigatorCounter}
        hideTumor={hideTumor}
        hideStroma={hideStroma}
        setModelname={setModelname}
        setBinaryMask={setBinaryMask}
        toolSelected={toolSelected}
        lessonId={lessonId}
        newSliderInputs={newSliderInputs}
        hideLymphocyte={hideLymphocyte}
        Environment={Environment}
        slide={slide}
        gleasonScoring={gleasonScoring}
        AdjustmentTool={AdjustmentTool}
        setAdjustmentTool={setAdjustmentTool}
        setNavigatorCounter={setNavigatorCounter}
        modelName={modelName}
        refreshHil={refreshHil}
        setGleasonScoring={setGleasonScoring}
        hideModification={hideModification}
        handleTILFeedBar={handleTILFeedBar}
        zoomValue={zoomValue}
        annotations={annotations}
        setShowRightPanel={setShowRightPanel}
        caseInfo={caseInfo}
        enableAI={enableAI}
        setToolSelected={setToolSelected}
        socketIsConnected={socketIsConnected}
        setLoadUI={setLoadUI}
        enableFilters={enableFilters}
        pathStroma={pathStroma}
        setTumorArea={setTumorArea}
        setImageFilter={setImageFilter}
        setStromaArea={setStromaArea}
        setTilScore={setTilScore}
        setLymphocyteCount={setLymphocyteCount}
        viewerId={currentViewer}
        setNewHilData={setNewHilData}
        viewerIds={viewerIds}
        isMultiview={isMultiview}
        bottomZoomValue={bottomZoomValue}
        setIsMultiview={setIsMultiview}
        isNavigatorActive={isNavigatorActive}
        setIsNavigatorActive={setIsNavigatorActive}
        setTotalCells={setTotalCells}
        isXmlAnnotations={isXmlAnnotations}
        onGetTumorGleasonAnalysis={onGetTumorGleasonAnalysis}
        getTumorGleasonResult={getTumorGleasonResult}
        onGetTILAnalysis={onGetTILAnalysis}
        onGetHILAnalysis={onGetHILAnalysis}
        getTILSubscriptionData={getTILSubscriptionData}
        onDeleteAnnotationFromDB={onDeleteAnnotationFromDB}
        onCreateAnnotation={onCreateAnnotation}
        getVhutSubscriptionData={getVhutSubscriptionData}
        onVhutViewportAnalysisMutation={onVhutViewportAnalysisMutation}
        onModifyAnnotation={onModifyAnnotation}
      />
      {/* <ActionTools setToolSelected={setToolSelected} viewerId={currentViewer} /> */}
      <ScreenTools
        viewerId={currentViewer}
        application={application}
        setToolSelected={setToolSelected}
        setChatHover={setChatHover}
        setLoadUI={setLoadUI}
        setOriginalPixels={setOriginalPixels}
        chatFeedBar={chatFeedBar}
        socketRef={socketRef}
        base64URL={base64URL}
        navigatorCounter={navigatorCounter}
        handleChatFeedbar={handleChatFeedbar}
        handleChatFeedBarClose={handleChatFeedBarClose}
      />
    </Flex>
  );
}

export default memo(AdjustmentBar);
