import React, { memo, useEffect, useState } from "react";
import {useNavigate} from "react-router-dom"
import { Flex, Text, useMediaQuery, Box } from "@chakra-ui/react";
import axios from "axios";
import { GoChevronLeft } from "react-icons/go";
import { useFabricOverlayState } from "../../state/store";
import { getFileBucketFolder, getScaleFactor } from "../../utility";
import ChangeSlide from "../Case/changeSlide";
import Move from "../Move/move";
import SlideNavigatorIcon from "../Navigator/slideNavigatorIcon";
import ActionTools from "../Toolbar/ActionTools";
import ScreenTools from "../Toolbar/ScreenTools";
import "../../styles/viewer.css";
import ToolbarButton from "../ViewerToolbar/button";
import IconSize from "../ViewerToolbar/IconSize";
import TooltipLabel from "./ToolTipLabel";
import Cancel from "../Cancel/Cancel";

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
  annotations,
  showSidebar,
  sidebar,
  isNavigatorActive,
  setIsNavigatorActive,
  isMultiview,
  navigatorCounter,
  toolSelected,
  setIsMultiview,
  setTotalCells,
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
  modelName,
  questions,
  hideModification,
  setNavigatorCounter,
  app,
  setModelname,
  setSlideId,
  responseHandler,
  bottomZoomValue,
  questionnaireResponse,
  zoomValue,
  synopticType,
  setSynopticType,
  setImageFilter,
  imageFilter,
  setShowRightPanel,
  getSynopticReport,
  handleChatFeedbar,
  handleChatFeedBarClose,
  updateSynopticReport,
  chatHover,
  isXmlAnnotations,
}) {
  const [ifWidthLessthan1920] = useMediaQuery("(max-width:1920px)");
  const { fabricOverlayState } = useFabricOverlayState();
  const { viewerWindow, isAnnotationLoading } = fabricOverlayState;
  const { tile } = viewerWindow[currentViewer];
  const [mongoId, setMongoId] = useState("");

  const navigate = useNavigate();

  const handleSidebar = () => {
    // showSidebar();
    navigate("/dashboard/cases");
  };

  useEffect(()=>{
    localStorage.setItem("page","viewer");
  },[])
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
      {/* <Flex
        borderRight="2px solid #E4E5E8"
        alignItems="center" ml="18px" mr="22px" pr="20px" minW="150px">
        {application === "hospital" ? (
          <ToolbarButton
            onClick={handleSidebar}
            backgroundColor={sidebar ? "#E4E5E8" : ""}
            outline={sidebar ? "0.5px solid rgba(0, 21, 63, 1)" : ""}
            icon={<GoChevronLeft size={IconSize()} color="#151C25" />}
            label={<TooltipLabel heading="Back" />}
          />
        ) : null}
        <Text
          color="#151C25"
          ml="12px"
          fontSize="14px"
          fontFamily="inter"
          fontWeight={600}
        >
         Case No-{caseInfo?.caseName || caseInfo?.name}
        </Text>
      </Flex> */}
      <Box w="25%"   h="100%" >
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
        toolSelected={toolSelected}
        lessonId={lessonId}
        hideLymphocyte={hideLymphocyte}
        slide={slide}
        setNavigatorCounter={setNavigatorCounter}
        mongoId={mongoId}
        modelName={modelName}
        setImageFilter={setImageFilter}
        refreshHil={refreshHil}
        hideModification={hideModification}
        handleTILFeedBar={handleTILFeedBar}
        zoomValue={zoomValue}
        annotations={annotations}
        setShowRightPanel={setShowRightPanel}
        imageFilter={imageFilter}
        caseInfo={caseInfo}
        enableAI={enableAI}
        setToolSelected={setToolSelected}
        socketIsConnected={socketIsConnected}
        setLoadUI={setLoadUI}
        enableFilters={enableFilters}
        pathStroma={pathStroma}
        setTumorArea={setTumorArea}
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
        saveSynopticReport={saveSynopticReport}
        mediaUpload={mediaUpload}
        slideInfo={slideInfo}
        chatHover={chatHover}
        chatFeedBar={chatFeedBar}
        handleFeedBar={handleFeedBar}
        socketRef={socketRef}
        base64URL={base64URL}
        imageFilter={imageFilter}
        setShowRightPanel={setShowRightPanel}
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
