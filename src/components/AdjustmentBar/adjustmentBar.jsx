import React, { memo, useEffect, useState } from "react";

import { Flex, Text, useMediaQuery } from "@chakra-ui/react";
import axios from "axios";
import { GiHamburgerMenu } from "react-icons/gi";

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

function AdjustmentBar({
  userInfo,
  caseInfo,
  slides,
  slide,
  refreshHil,
  setTumorArea,
  setStromaArea,
  setTilScore,
  setLymphocyteCount,
  hitTil,
  report,
  setLoadUI,
  setNewHilData,
  application,
  viewerIds,
  enableAI,
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
  slideInfo,
  handleFeedBar,
  handleReport,
  showReport,
  setShowReport,
  clinicalStudy,
  questions,
  hideModification,
  app,
  setSlideId,
  responseHandler,
  questionnaireResponse,
  synopticType,
  setSynopticType,
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
  
  const handleSidebar = () => {
    showSidebar();
  };
  return (
    <Flex
      className="adjustmentbar"
      alignItems="center"
      height={ifWidthLessthan1920 ? "46px" : "5.185vh"}
      bgColor="#F8F8F5"
      fontFamily="fira sans"
      fontSize={ifWidthLessthan1920 ? "14px" : "16px"}
      fontWeight="500"
      zIndex={2}
    >
      <Flex alignItems="center" ml="18px" mr="20px" minW="150px">
        {application === "hospital" ? (
          <ToolbarButton
            onClick={handleSidebar}
            backgroundColor={sidebar ? "#E4E5E8" : ""}
            outline={sidebar ? "0.5px solid rgba(0, 21, 63, 1)" : ""}
            icon={<GiHamburgerMenu size={IconSize()} color="#151C25" />}
            label={<TooltipLabel heading="Case Info" />}
          />
        ) : null}
        <Text
          color="#151C25"
          ml="12px"
          fontSize="14px"
          fontFamily="inter"
          fontWeight={600}
        >
          {caseInfo?.caseName || caseInfo?.name}
        </Text>
      </Flex>

      <Flex
        borderLeft="2px solid #E4E5E8"
        borderRight="2px solid #E4E5E8"
        px="18px"
        align="center"
      >
        {Object.keys(viewerWindow).length === 1 && (
          <ChangeSlide
            caseInfo={caseInfo}
            slides={slides}
            viewerId={currentViewer}
            slideUrl={tile}
            setIsMultiview={setIsMultiview}
            setIsNavigatorActive={setIsNavigatorActive}
            isAnnotationLoading={isAnnotationLoading}
            isNavigatorActive={isNavigatorActive}
          />
        )}
        {/* <ToolbarButton
          icon={<SlideNavigatorIcon isNavigatorActive={isNavigatorActive} />}
          label={
            <TooltipLabel
              heading="Slide Navigation"
              paragraph="Navigate any slide in this case"
            />
          }
          ml="8px"
          pl={0}
          pt={0}
          isDisabled={isAnnotationLoading}
          isActive={isNavigatorActive}
          onClick={() => {
            setIsMultiview(false);
            setIsNavigatorActive((state) => !state);
          }}
        /> */}
      </Flex>
      <Move
        application={application}
        userInfo={userInfo}
        sidebar={sidebar}
        hideTumor={hideTumor}
        hideStroma={hideStroma}
        hideLymphocyte={hideLymphocyte}
        slide={slide}
        mongoId={mongoId}
        refreshHil={refreshHil}
        hideModification={hideModification}
        handleTILFeedBar={handleTILFeedBar}
        annotations={annotations}
        enableAI={enableAI}
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
        setIsMultiview={setIsMultiview}
        isNavigatorActive={isNavigatorActive}
        setIsNavigatorActive={setIsNavigatorActive}
        setTotalCells={setTotalCells}
        isXmlAnnotations={isXmlAnnotations}
      />
      <ActionTools viewerId={currentViewer} />
      <ScreenTools
        viewerId={currentViewer}
        report={report}
        application={application}
        handleAnnotationBar={handleAnnotationBar}
        caseInfo={caseInfo}
        slide={slide}
        setChatHover={setChatHover}
        saveReport={saveReport}
        saveSynopticReport={saveSynopticReport}
        mediaUpload={mediaUpload}
        slideInfo={slideInfo}
        chatHover={chatHover}
        handleFeedBar={handleFeedBar}
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
