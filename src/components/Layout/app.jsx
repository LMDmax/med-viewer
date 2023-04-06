import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  useMediaQuery,
  Text,
  Center,
  Image,
  Divider,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import {
  getPPMfromMPP,
  getScaleFactor,
  getZoomValue,
  zoomToLevel,
} from "../../utility/utility";

import AdjustmentBar from "../AdjustmentBar/adjustmentBar";
import ChatFeed from "../Feed/ChatFeed";
import SlideFeed from "../Feed/feed";
import TILFeedBar from "../Feed/TILFeedBar";
import ProgressBar from "../Loading/ProgressBar";
import Navigator from "../Navigator/navigator";
import ViewerFactory from "../Viewer/viewerFactory";
import LayoutAppBody from "./body";
import LayoutInnerBody from "./innerbody";
import LayoutOuterBody from "./outerbody";
import LayoutAppSidebar from "./sidebar";
import FunctionsMenu from "../Menu/menu";
import ChangeSlide from "../Case/changeSlide";
import { useFabricOverlayState } from "../../state/store";

const LayoutApp = ({
  userInfo,
  caseInfo,
  slides,
  viewerIds,
  questionnaire,
  report,
  application,
  hitTil,
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
  addUsersToCase,
  accessToken,
  searchSelectedData,
}) => {
  // const { handleEvent } = useKeyboardEvents();

  const [sidebar, setSidebar] = useState(false);
  const [zoomValue, setZoomValue] = useState(1);
  const [isNavigatorActive, setIsNavigatorActive] = useState(false);
  const [isMultiview, setIsMultiview] = useState(false);
  const { fabricOverlayState } = useFabricOverlayState();
  const { viewerWindow, isAnnotationLoading } = fabricOverlayState;
  const [newHilData, setNewHilData] = useState(false);
  const [refreshHil, setRefreshHil] = useState(0);
  const [hideModification, setHideModification] = useState(false);
  const [totalCells, setTotalCells] = useState(0);
  const [tilScore, setTilScore] = useState();
  const [tumorArea, setTumorArea] = useState();
  const [stromaArea, setStromaArea] = useState();
  const [lymphocyteCount, setLymphocyteCount] = useState();

  const [ifBiggerScreen] = useMediaQuery("(min-width:1920px)");
  const [currentViewer, setCurrentViewer] = useState(
    viewerIds?.[0]?._id || viewerIds?.[0]?.slideId
  );

  // console.log('slideInfo',refreshHil);
  const [showAnnotationsBar, setShowAnnotationsBar] = useState(false);
  const [showFeedBar, setShowFeedBar] = useState(false);
  const [chatFeedBar, setChatFeedBar] = useState(false);
  const [tILFedBar, setTILFedBar] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [feedTab, setFeedBar] = useState(0);
  const [pathStroma, setPathStroma] = useState(null);
  const [synopticType, setSynopticType] = useState("");
  const [chatHover, setChatHover] = useState(false);
  const [hideTumor, setHideTumor] = useState(false);
  const [hideStroma, setHideStroma] = useState(false);
  const [hideLymphocyte, setHideLymphocyte] = useState(false);
  const [annotationObject, setAnnotationObject] = useState("");
  const [toolSelected, setToolSelected] = useState("");
  const [bottomZoomValue, setBottomZoomValue] = useState('');

  // xml annotations check
  const [isXmlAnnotations, setIsXmlAnnotations] = useState(false);
  const [loadUI, setLoadUI] = useState(true);
  const [unit, setUnit] = useState();

  const [modelName, setModelname] = useState("");

  const { tile, viewer } = viewerWindow[currentViewer];
  const value = getZoomValue(viewer);
  // console.log(value);

  useEffect(() => {
    const UnitStore = localStorage.getItem("unit");
    setUnit(UnitStore);
},[bottomZoomValue]);


  // console.log(modelName);

  let runAiModel;
  switch (modelName) {
    case "":
      runAiModel = "";
      break;
    case "KI67":
      runAiModel = "KI67";
      break;
    case "TIL":
      runAiModel = "TIL";
      break;
      case "Morphometry":
        runAiModel = "Morphometry";
        break;
    default:
      runAiModel = "";
      break;
  }

  // console.log(runAiModel);

  let returnText;

  switch (toolSelected) {
    case "":
      returnText = "Select a Tool to work on the slide";
      break;
    case "Rotate":
      returnText =
        "Click and slide the circle to rotate image. Press enter to save changes,";
      break;
    case "Multiview":
      returnText = "Multiview is selected.";
      break;
    case "MultiviewSlideChoosed":
      returnText =
        "Multiscreen view is active. Link slide to work on both slides simultaneously.";
      break;
    case "Annotation":
      returnText = "Select annotation draw tool.";
      break;
    case "RectangleTool":
      returnText =
        "Rectangle annotation selected. Click and drag to mark an annotation on the slide.";
      break;
    case "LineTool":
      returnText = "Line annotation selected.";
      break;
    case "CircleTool":
      returnText =
        "Circle annotation selected. Click and drag to mark an annotation on the slide.";
      break;
    case "PolygonTool":
      returnText =
        "Polygon annotation selected. Click and drag to mark an annotation on the slide.";
      break;
    case "FreeHand":
      returnText =
        "path annotation selected. Click and drag to mark an annotation on the slide.";
      break;
    case "MagicWand":
      returnText = "Magicwand is active.";
      break;
    case "RunRoi":
      returnText =
        "Annotation is marked on the slide. Right click to run a ROI Algorithm.";
      break;
    case "Filter":
      returnText = "Enhance slide using the adjustment in the right panel. ";
      break;
    case "TIL":
      returnText = "TIL is active.";
      break;
    case "AddComment":
      returnText = "Please click on the slide to add comment.";
      break;
    case "SelectedComment":
      returnText = "Comment selected. Type to add a comment.";
      break;
    case "HideAnnotation":
      returnText = "Annotations are hide.";
      break;
    case "Normalisation":
      returnText = "Normalisation is active.";
      break;
    case "Downloaded":
      returnText = "Screenshot Downloaded.";
      break;
    case "Chat":
      returnText = "Chat Feed is open.";
      break;
    case "MorphometryError":
      returnText = "Please select a annotation to run ROI analysis";
      break;
    case "ZoomError":
      returnText = "ROI analysis can be run on 40X zoom";
      break;
    case "TILError":
      returnText = "TIL analysis can only be run on H&E slides.";
      break;
      case "TILLoading":
      returnText = "TIL will enable after sometime.";
      break;

    case "KI67Error":
      returnText = "KI67 analysis can only be run on stain type IHC and marker type must be KI67 .";
      break;
    case "MorphometrySlideIssue":
      returnText = "Morphometry analysis can only be run on H&E slides.";
      break;
    case "MorphometryAnalysed":
      returnText = "Morphometry done on selected annotation";
      break;
    case "KI67Analysed":
      returnText = "KI67 analysis done on selected annotation";
      break;
      case "FilterSaved":
        returnText = "Adjusment saved successfully ";
        break;

    default:
      returnText = "";
      break;
  }

  const showSidebar = () => {
    setSidebar(!sidebar);
  };

  const handleFeedBar = () => {
    setShowFeedBar(true);
    setFeedBar(0);
  };
  const handleChatFeedbar = () => {
    setChatFeedBar(!chatFeedBar);
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
  const handleAnnotationClick = (annotation) => {
    setAnnotationObject(annotation);
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
          hideStroma={hideStroma}
          hideTumor={hideTumor}
          hideLymphocyte={hideLymphocyte}
          chatFeedBar={chatFeedBar}
          caseInfo={caseInfo}
          loadUI={loadUI}
          setLoadUI={setLoadUI}
          toolSelected={toolSelected}
          setToolSelected={setToolSelected}
          refreshHil={refreshHil}
          pathStroma={pathStroma}
          hitTil={hitTil}
          zoomValue={zoomValue}
          setTumorArea={setTumorArea}
          setTilScore={setTilScore}
          setStromaArea={setStromaArea}
          setLymphocyteCount={setLymphocyteCount}
          slide={viewerIds?.[0]}
          slides={slides}
          annotations={annotations}
          hideModification={hideModification}
          report={report}
          enableAI={enableAI}
          modelName={modelName}
          setModelname={setModelname}
          enableFilters={enableFilters}
          application={application}
          tILFedBar={tILFedBar}
          setNewHilData={setNewHilData}
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
          bottomZoomValue={bottomZoomValue}
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
          isXmlAnnotations={isXmlAnnotations}
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
            setToolSelected={setToolSelected}
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
          {/* {showFeedBar ? (
            <SlideFeed
              viewerId={currentViewer}
              showFeedBar={showFeedBar}
              handleFeedBarClose={handleFeedBarClose}
              showReport={showReport}
              feedTab={feedTab}
              synopticType={synopticType}
              isXmlAnnotations={isXmlAnnotations}
              annotationObject={annotationObject}
            />
          ) : null} */}
          {/* {chatFeedBar ? (
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
              addUsersToCase={addUsersToCase}
            />
          ) : null} */}
          {/* {tILFedBar ? (
            <TILFeedBar
              viewerId={currentViewer}
              hideTumor={hideTumor}
              setHideTumor={setHideTumor}
              hideLymphocyte={hideLymphocyte}
              setHideLymphocyte={setHideLymphocyte}
              setHideStroma={setHideStroma}
              hideStroma={hideStroma}
              chatFeedBar={chatFeedBar}
              setHideModification={setHideModification}
              hideModification={hideModification}
              handleFeedBarClose={handleFeedBarClose}
              showReport={showReport}
              setRefreshHil={setRefreshHil}
              setLoadUI={setLoadUI}
              refreshHil={refreshHil}
              tumorArea={tumorArea}
              stromaArea={stromaArea}
              tilScore={tilScore}
              lymphocyteCount={lymphocyteCount}
              feedTab={feedTab}
              newHilData={newHilData}
              setPathStroma={setPathStroma}
              pathStroma={pathStroma}
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
          ) : null} */}
          <LayoutAppBody>
            <ViewerFactory
              application={application}
              enableAI={enableAI}
              caseInfo={caseInfo}
              userInfo={userInfo}
              slide={viewerIds?.[0]}
              slides={slides}
              bottomZoomValue={bottomZoomValue}
              setBottomZoomValue={setBottomZoomValue}
              setCurrentViewer={setCurrentViewer}
              client2={client2}
              setZoomValue={setZoomValue}
              zoomValue={zoomValue}
              setLoadUI={setLoadUI}
              setModelname={setModelname}
              runAiModel={runAiModel}
              setToolSelected={setToolSelected}
              mentionUsers={mentionUsers}
              addUsersToCase={addUsersToCase}
              Environment={Environment}
              accessToken={accessToken}
              setIsXmlAnnotations={setIsXmlAnnotations}
              handleAnnotationClick={handleAnnotationClick}
            />
          </LayoutAppBody>
          <FunctionsMenu
            caseInfo={caseInfo}
            slides={slides}
            viewerId={currentViewer}
            setIsMultiview={setIsMultiview}
            setIsNavigatorActive={setIsNavigatorActive}
            isNavigatorActive={isNavigatorActive}
            isMultiview={isMultiview}
            slide={viewerIds?.[0]}
            hideTumor={hideTumor}
            setHideTumor={setHideTumor}
            setToolSelected={setToolSelected}
            hideLymphocyte={hideLymphocyte}
            setHideLymphocyte={setHideLymphocyte}
            setHideStroma={setHideStroma}
            hideStroma={hideStroma}
            Environment={Environment}
            tilScore={tilScore}
            userInfo={userInfo}
            toolSelected={toolSelected}
            isXmlAnnotations={isXmlAnnotations}
            application={application}
            saveReport={saveReport}
            saveSynopticReport={saveSynopticReport}
            tumorArea={tumorArea}
            stromaArea={stromaArea}
            lymphocyteCount={lymphocyteCount}
            mediaUpload={mediaUpload}
            slideInfo={slideInfo}
            handleReport={handleReport}
            showReport={showReport}
            setShowReport={setShowReport}
            questions={questions}
            app={application}
            setSlideId={setSlideId}
            responseHandler={responseHandler}
            questionnaireResponse={questionnaireResponse}
            synopticType={synopticType}
            setSynopticType={setSynopticType}
            getSynopticReport={getSynopticReport}
            updateSynopticReport={updateSynopticReport}
            chatFeedBar={chatFeedBar}
            handleChatFeedBarClose={handleChatFeedBarClose}
            setChatFeedBar={setChatFeedBar}
            feedTab={feedTab}
            users={users}
            client2={client2}
            mentionUsers={mentionUsers}
            addUsersToCase={addUsersToCase}
            searchSelectedData={searchSelectedData}
          />
        </LayoutInnerBody>
        <Flex bg="#F0F0F0" pl="30px" w="100%" zIndex={99} h="25px">
          <Flex justifyContent="space-between" alignItems="center">
            <Flex
              h="full"
              justifyContent="center"
              alignItems="center"
              pr="10px"
              borderRight="2px solid gray"
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
            </Flex>
            <Text ml="10px" fontSize="14px">
              {" "}
              {localStorage.getItem("ModelName")
                ? `${localStorage.getItem("ModelName")} is in process`
                : returnText}{" "}
            </Text>
            <Flex ml="10px" justifyContent="flex-end" alignItems="center">
              {/* <ProgressBar /> */}
              {!loadUI === true ? <ProgressBar /> : null}
            </Flex>
            <Box pos="absolute" right="0" me="30px">
              <Flex>
                <Text  mr="5px">{bottomZoomValue}X</Text>
                <Image
                  src="https://i.ibb.co/7CtYTC2/bottom-Bar.png"
                  alt="Bottom Bar"
                />
                <Text  ml="5px">{unit}</Text>
              </Flex>
            </Box>
          </Flex>
        </Flex>
      </LayoutOuterBody>
    </Flex>
  );
};

LayoutApp.propTypes = {
  finalSubmitHandler: PropTypes.func,
};

export default LayoutApp;
