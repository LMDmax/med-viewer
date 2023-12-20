import React, { memo, useEffect, useState } from "react";

import {
  Flex,
  Text,
  useMediaQuery,
  Box,
  HStack,
  Divider,
} from "@chakra-ui/react";
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
import HITLControls from "../HITLControls/HITLControls";

function AdjustmentBar({
  userInfo,
  caseInfo,
  slides,
  slide,
  refreshHil,
  setToolSelected,
  setTilScore,
  hitTil,
  report,
  setLoadUI,
  setNewHilData,
  application,
  base64URL,
  viewerIds,
  enableAI,
  chatFeedBar,
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
  handleTILFeedBar,
  mediaUpload,
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
  setNavigatorCounter,
  newSliderInputs,
  setImageFilter,
  app,
  setTumorArea,
  setStromaArea,
  setLymphocyteCount,
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
  setGleasonScoringData,
  selectedPattern,
  newToolSettings,
  setNewToolSettings,
  setSelectedPattern,
  SetBenignColor,
  setPattern5Color,
  setPattern4Color,
  setPattern3Color,
  pattern3Color,
  pattern4Color,
  pattern5Color,
  benignColor,
  setTumorColor,
  tumorColor,
  setStromaColor,
  stromaColor,
  setLymphocyteColor,
  lymphocyteColor,
  setUndoRedoCounter,
  undoRedoCounter,
  gleasonScoringData,
  setMaskAnnotationData,
  addLocalRegion,
  setAddLocalRegion,
  setIsLocalRegion,
  isLocalRegion,
  setLymphocyteArea,
}) {
  const [ifWidthLessthan1920] = useMediaQuery("(max-width:1920px)");
  const { fabricOverlayState } = useFabricOverlayState();
  const { viewerWindow, isAnnotationLoading } = fabricOverlayState;
  const [showGleason, setShowGleason] = useState(false);
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
      boxShadow="0px 0px 1px 0.1px"
      px="30px"
      bg="white"
      fontFamily="fira sans"
      fontSize={ifWidthLessthan1920 ? "14px" : "16px"}
      fontWeight="500"
      zIndex={2}
    >
      <HStack w="25%" h="100%" spacing="20px">
        <Cancel />
        <Divider borderColor="#EEEEEE" orientation="vertical" />
        <HITLControls
          setUndoRedoCounter={setUndoRedoCounter}
          undoRedoCounter={undoRedoCounter}
          gleasonScoringData={gleasonScoringData}
          showGleason={showGleason}
        />
        <Divider borderColor="#EEEEEE" orientation="vertical" />
      </HStack>
      <Move
        application={application}
        userInfo={userInfo}
        sidebar={sidebar}
        navigatorCounter={navigatorCounter}
        setModelname={setModelname}
        setBinaryMask={setBinaryMask}
        toolSelected={toolSelected}
        lessonId={lessonId}
        newSliderInputs={newSliderInputs}
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
        setGleasonScoringData={setGleasonScoringData}
        selectedPattern={selectedPattern}
        setNewToolSettings={setNewToolSettings}
        newToolSettings={newToolSettings}
        setSelectedPattern={setSelectedPattern}
        SetBenignColor={SetBenignColor}
        setPattern5Color={setPattern5Color}
        setPattern4Color={setPattern4Color}
        setPattern3Color={setPattern3Color}
        pattern3Color={pattern3Color}
        pattern4Color={pattern4Color}
        pattern5Color={pattern5Color}
        benignColor={benignColor}
        setTumorColor={setTumorColor}
        tumorColor={tumorColor}
        setStromaColor={setStromaColor}
        stromaColor={stromaColor}
        setLymphocyteColor={setLymphocyteColor}
        lymphocyteColor={lymphocyteColor}
        undoRedoCounter={undoRedoCounter}
        gleasonScoringData={gleasonScoringData}
        setUndoRedoCounter={setUndoRedoCounter}
        setShowGleason={setShowGleason}
        showGleason={showGleason}
        setMaskAnnotationData={setMaskAnnotationData}
        addLocalRegion={addLocalRegion}
        setAddLocalRegion={setAddLocalRegion}
        setIsLocalRegion={setIsLocalRegion}
        isLocalRegion={isLocalRegion}
        setLymphocyteArea={setLymphocyteArea}
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
