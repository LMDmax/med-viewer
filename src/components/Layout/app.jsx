import React, { useState, useEffect } from "react";
import { Flex, useMediaQuery } from "@chakra-ui/react";
import PropTypes from "prop-types";
import AdjustmentBar from "../AdjustmentBar/adjustmentBar";
import LayoutAppBody from "./body";
import LayoutInnerBody from "./innerbody";
import LayoutOuterBody from "./outerbody";
import LayoutAppSidebar from "./sidebar";
import ViewerFactory from "../Viewer/viewerFactory";
import Navigator from "../Navigator/navigator";
import SlideFeed from "../Feed/feed";
import ChatFeed from "../Feed/ChatFeed";
import TILFeedBar from "../Feed/TILFeedBar";

const LayoutApp = ({
  userInfo,
  caseInfo,
  slides,
  viewerIds,
  questionnaire,
  report,
  application,
  annotations,
  enableAI,
  enableFilters,
  userIdToQuery,
  response,
  finalSubmitHandler,
  saveReport,
  saveSynopticReport,
  mediaUpload,
  slideInfo,
  clinicalStudy,
  questions,
  setSlideId,
  responseHandler,
  questionnaireResponse,
  getSynopticReport,
  client2,
  users,
  mentionUsers,
  Environment,
  updateSynopticReport,
}) => {
  // const { handleEvent } = useKeyboardEvents();

  const [sidebar, setSidebar] = useState(false);
  const [isNavigatorActive, setIsNavigatorActive] = useState(false);
  const [isMultiview, setIsMultiview] = useState(false);
  const [totalCells, setTotalCells] = useState(0);
  const [ifBiggerScreen] = useMediaQuery("(min-width:1920px)");
  const [currentViewer, setCurrentViewer] = useState(
    viewerIds?.[0]?._id || viewerIds?.[0]?.slideId
  );
  // console.log('slideInfo',slideInfo);
  const [showAnnotationsBar, setShowAnnotationsBar] = useState(false);
  const [showFeedBar, setShowFeedBar] = useState(false);
  const [chatFeedBar, setChatFeedBar] = useState(false);
  const [tILFedBar, setTILFedBar] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [feedTab, setFeedBar] = useState(0);
  const [synopticType, setSynopticType] = useState("");
  const [chatHover, setChatHover] = useState(false);

  const showSidebar = () => {
    setSidebar(!sidebar);
  };

  const handleFeedBar = () => {
    setShowFeedBar(true);
    setFeedBar(0);
  };
  const handleChatFeedbar = () => {
    setChatFeedBar(true);
    setChatHover(!chatHover);
  };
  const handleTILFeedBar = () => {
    setTILFedBar(true);
  };
  const handleFeedBarClose = () => {
    setShowFeedBar(false);
    setChatFeedBar(false);
    setTILFedBar(false);
  };
  const handleChatFeedBarClose = () => {
    setChatFeedBar(false);
    setChatHover(false);
  };
  const handleReport = () => {
    setShowReport(true);
  };
  const handleAnnotationBar = () => {
    setShowAnnotationsBar(!showAnnotationsBar);
    setShowFeedBar(true);

    setFeedBar(1);
  };

  return (
    <Flex
      h={ifBiggerScreen ? "calc(100vh - 5.5vh)" : "calc(100vh - 44px)"}
      direction="column"
    >
      <LayoutOuterBody>
        <AdjustmentBar
          userInfo={userInfo}
          caseInfo={caseInfo}
          slide={viewerIds?.[0]}
          slides={slides}
          annotations={annotations}
          report={report}
          enableAI={enableAI}
          enableFilters={enableFilters}
          application={application}
          tILFedBar={tILFedBar}
          setChatHover={setChatHover}
          chatHover={chatHover}
          currentViewer={currentViewer}
          showSidebar={() => showSidebar()}
          sidebar={sidebar}
          setTotalCells={setTotalCells}
          isNavigatorActive={isNavigatorActive}
          setIsNavigatorActive={setIsNavigatorActive}
          isMultiview={isMultiview}
          setIsMultiview={setIsMultiview}
          handleAnnotationBar={handleAnnotationBar}
          saveReport={saveReport}
          saveSynopticReport={saveSynopticReport}
          mediaUpload={mediaUpload}
          slideInfo={slideInfo}
          handleFeedBar={handleFeedBar}
          handleChatFeedbar={handleChatFeedbar}
          handleChatFeedBarClose={handleChatFeedBarClose}
          handleTILFeedBar={handleTILFeedBar}
          handleReport={handleReport}
          synopticType={synopticType}
          setSynopticType={setSynopticType}
          showReport={showReport}
          setShowReport={setShowReport}
          clinicalStudy={clinicalStudy}
          questions={questions}
          app={application}
          viewerIds={viewerIds}
          setSlideId={setSlideId}
          responseHandler={responseHandler}
          questionnaireResponse={questionnaireResponse}
          getSynopticReport={getSynopticReport}
          updateSynopticReport={updateSynopticReport}
        />

        {isNavigatorActive && (
          <Navigator
            caseInfo={caseInfo}
            slides={slides}
            viewerId={currentViewer}
            isActive={isNavigatorActive}
            setIsNavigatorActive={setIsNavigatorActive}
          />
        )}
        {isMultiview && (
          <Navigator
            caseInfo={caseInfo}
            slides={slides}
            viewerId={currentViewer}
            isActive={isMultiview}
            isMultiview={isMultiview}
            setIsMultiview={setIsMultiview}
          />
        )}
        <LayoutInnerBody>
          {sidebar ? (
            <LayoutAppSidebar
              caseInfo={caseInfo}
              questionnaire={questionnaire}
              annotations={annotations}
              report={report}
              viewerIds={viewerIds}
              userIdToQuery={userIdToQuery}
              userInfo={userInfo}
              finalSubmitHandler={finalSubmitHandler}
              response={response}
              currentViewer={currentViewer}
              setSidebar={setSidebar}
            />
          ) : null}
          {showFeedBar ? (
            <SlideFeed
              viewerId={currentViewer}
              showFeedBar={showFeedBar}
              handleFeedBarClose={handleFeedBarClose}
              showReport={showReport}
              feedTab={feedTab}
              synopticType={synopticType}
            />
          ) : null}
          {chatFeedBar ? (
            <ChatFeed
              viewerId={currentViewer}
              chatFeedBar={chatFeedBar}
              handleChatFeedBarClose={handleChatFeedBarClose}
              showReport={showReport}
              feedTab={feedTab}
              userInfo={userInfo}
              caseInfo={caseInfo}
              synopticType={synopticType}
              application={application}
              app={application}
              users={users}
              client2={client2}
              mentionUsers={mentionUsers}
              Environment={Environment}
            />
          ) : null}
          {tILFedBar ? (
            <TILFeedBar
              viewerId={currentViewer}
              chatFeedBar={chatFeedBar}
              handleFeedBarClose={handleFeedBarClose}
              showReport={showReport}
              feedTab={feedTab}
              userInfo={userInfo}
              caseInfo={caseInfo}
              synopticType={synopticType}
              application={application}
              app={application}
              showFeedBar={showFeedBar}
              users={users}
              client2={client2}
              mentionUsers={mentionUsers}
              Environment={Environment}
            />
          ) : null}
          <LayoutAppBody>
            <ViewerFactory
              application={application}
              enableAI={enableAI}
              caseInfo={caseInfo}
              userInfo={userInfo}
              slide={viewerIds?.[0]}
              slides={slides}
              setCurrentViewer={setCurrentViewer}
              client2={client2}
              mentionUsers={mentionUsers}
            />
          </LayoutAppBody>
        </LayoutInnerBody>
      </LayoutOuterBody>
    </Flex>
  );
};

LayoutApp.propTypes = {
  finalSubmitHandler: PropTypes.func,
};

export default LayoutApp;
