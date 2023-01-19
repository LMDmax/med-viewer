import React, { memo } from "react";
import { Flex, Text, useMediaQuery } from "@chakra-ui/react";
import { GiHamburgerMenu } from "react-icons/gi";
import Move from "../Move/move";
import ActionTools from "../Toolbar/ActionTools";
import ScreenTools from "../Toolbar/ScreenTools";
import "../../styles/viewer.css";
import ToolbarButton from "../ViewerToolbar/button";
import IconSize from "../ViewerToolbar/IconSize";
import SlideNavigatorIcon from "../Navigator/slideNavigatorIcon";
import ChangeSlide from "../Case/changeSlide";
import { useFabricOverlayState } from "../../state/store";
import TooltipLabel from "./ToolTipLabel";
import Environment from "../../../../environment";
import { useEffect } from "react";
import axios from "axios";
import { getFileBucketFolder, getScaleFactor } from "../../utility";
import { useState } from "react";

const AdjustmentBar = ({
  userInfo,
  caseInfo,
  slides,
  slide,
  report,
  application,
  viewerIds,
  enableAI,
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
  handleTILFeedBar,
  mediaUpload,
  slideInfo,
  handleFeedBar,
  handleReport,
  showReport,
  setShowReport,
  clinicalStudy,
  questions,
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
}) => {
  const [ifWidthLessthan1920] = useMediaQuery("(max-width:1920px)");
  const { fabricOverlayState } = useFabricOverlayState();
  const { viewerWindow, isAnnotationLoading } = fabricOverlayState;
  const { tile } = viewerWindow[currentViewer];
  const [mongoId, setMongoId] = useState("");

  const getMongoDbId = async () => {
    try {
      const resp = await axios.post(
        "https://backup-quantize-vhut.prr.ai/TILS",
        {
          key: `${getFileBucketFolder(viewerIds[0].originalFileUrl)}`,
          bucket_name: "med-ai-image-processor",
          notifyHook: `${Environment.USER_URL}/notify_viewport_analysis`,
          slideId: `${slide?._id}`,
        }
      );
      // console.log(resp.data.mongodb_id);
      setMongoId(resp.data.mongodb_id);
      // console.log(slide._id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMongoDbId();
  }, [slide?._id]);

  const handleSidebar = () => {
    showSidebar();
  };
  // console.log(mongoId);
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
        <Text color="#151C25" ml="12px" fontSize="14px" fontFamily="inter">
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
          />
        )}
        <ToolbarButton
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
        />
      </Flex>
      <Move
        application={application}
        userInfo={userInfo}
        sidebar={sidebar}
        slide={slide}
        mongoId={mongoId}
        handleTILFeedBar={handleTILFeedBar}
        annotations={annotations}
        enableAI={enableAI}
        enableFilters={enableFilters}
        viewerId={currentViewer}
        viewerIds={viewerIds}
        isMultiview={isMultiview}
        setIsMultiview={setIsMultiview}
        isNavigatorActive={isNavigatorActive}
        setIsNavigatorActive={setIsNavigatorActive}
        setTotalCells={setTotalCells}
      />
      <ActionTools viewerId={currentViewer} />
      <ScreenTools
        viewerId={currentViewer}
        report={report}
        application={application}
        handleAnnotationBar={handleAnnotationBar}
        caseInfo={caseInfo}
        slide={slide}
        saveReport={saveReport}
        saveSynopticReport={saveSynopticReport}
        mediaUpload={mediaUpload}
        slideInfo={slideInfo}
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
};

export default memo(AdjustmentBar);
