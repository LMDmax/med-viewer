import React, { memo, useEffect, useState } from "react";

import { Flex, Text, useMediaQuery, Box } from "@chakra-ui/react";
import axios from "axios";
import { GoChevronLeft } from "react-icons/go";
import { useNavigate } from "react-router-dom";

import { useFabricOverlayState } from "../../state/store";
import { getFileBucketFolder, getScaleFactor } from "../../utility";
import Cancel from "../Cancel/Cancel";
import ChangeSlide from "../Case/changeSlide";
import Move from "../Move/move";
import SlideNavigatorIcon from "../Navigator/slideNavigatorIcon";
import ActionTools from "../Toolbar/ActionTools";
import ScreenTools from "../Toolbar/ScreenTools";
import "../../styles/viewer.css";
import ToolbarButton from "../ViewerToolbar/button";
import IconSize from "../ViewerToolbar/IconSize";
import TooltipLabel from "./ToolTipLabel";

function AdjustmentBar({
  userInfo,
  caseInfo,
  slides,
  slide,
  refreshHil,
  setTumorArea,
  setStromaArea,
  setToolSelected,
  setTilScore,
  setLymphocyteCount,
  hitTil,
  report,
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
  handleAnnotationBar,
  saveReport,
  saveSynopticReport,
  pathStroma,
  handleTILFeedBar,
  mediaUpload,
  hideLymphocyte,
  setChatHover,
  lessonId,
  slideInfo,
  handleFeedBar,
  socketRef,
  socketIsConnected,
  handleReport,
  showReport,
  setShowReport,
  clinicalStudy,
  imageFilter,
  modelName,
  questions,
  setBinaryMask,
  setOriginalPixels,
  hideModification,
  setNavigatorCounter,
  newSliderInputs,
  setImageFilter,
  app,
  setModelname,
  setShowRightPanel,
  gleasonScoring,
  normalizeDefault,
  setSlideId,
  responseHandler,
  bottomZoomValue,
  questionnaireResponse,
  zoomValue,
  synopticType,
  setSynopticType,
  getSynopticReport,
  handleChatFeedbar,
  handleChatFeedBarClose,
  updateSynopticReport,
  chatHover,
  isXmlAnnotations,
  Environment,
}) {
  const [ifWidthLessthan1920] = useMediaQuery("(max-width:1920px)");
  const { fabricOverlayState } = useFabricOverlayState();
  const { viewerWindow, isAnnotationLoading } = fabricOverlayState;
  const { tile } = viewerWindow[currentViewer];
  const [mongoId, setMongoId] = useState("");

  const navigate = useNavigate();

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
        mongoId={mongoId}
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
        hitTil={hitTil}
        setNewHilData={setNewHilData}
        viewerIds={viewerIds}
        isMultiview={isMultiview}
        bottomZoomValue={bottomZoomValue}
        setIsMultiview={setIsMultiview}
        isNavigatorActive={isNavigatorActive}
        setIsNavigatorActive={setIsNavigatorActive}
        setTotalCells={setTotalCells}
        isXmlAnnotations={isXmlAnnotations}
      />
      {/* <ActionTools setToolSelected={setToolSelected} viewerId={currentViewer} /> */}
      <ScreenTools
        viewerId={currentViewer}
        report={report}
        application={application}
        handleAnnotationBar={handleAnnotationBar}
        caseInfo={caseInfo}
        slide={slide}
        setToolSelected={setToolSelected}
        setChatHover={setChatHover}
        toolSelected={toolSelected}
        saveReport={saveReport}
        imageFilter={imageFilter}
        setLoadUI={setLoadUI}
        saveSynopticReport={saveSynopticReport}
        mediaUpload={mediaUpload}
        setOriginalPixels={setOriginalPixels}
        slideInfo={slideInfo}
        chatHover={chatHover}
        chatFeedBar={chatFeedBar}
        handleFeedBar={handleFeedBar}
        Environment={Environment}
        normalizeDefault={normalizeDefault}
        socketRef={socketRef}
        base64URL={base64URL}
        navigatorCounter={navigatorCounter}
        handleChatFeedbar={handleChatFeedbar}
        handleChatFeedBarClose={handleChatFeedBarClose}
        handleReport={handleReport}
        handleTILFeedBar={handleTILFeedBar}
        showReport={showReport}
        setShowReport={setShowReport}
        userInfo={userInfo}
        clinicalStudy={clinicalStudy}
        questions={questions}
        app={app}
        setSlideId={setSlideId}
        responseHandler={responseHandler}
        questionnaireResponse={questionnaireResponse}
        synopticType={synopticType}
        setSynopticType={setSynopticType}
        getSynopticReport={getSynopticReport}
        updateSynopticReport={updateSynopticReport}
      />
    </Flex>
  );
}

export default memo(AdjustmentBar);
