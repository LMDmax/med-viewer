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
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

import { connectWebSocket } from "../../Socket/Socket";
import { useFabricOverlayState } from "../../state/store";
import {
  getPPMfromMPP,
  getScaleFactor,
  getZoomValue,
  zoomToLevel,
} from "../../utility/utility";
import { useLazyQuery } from "@apollo/client";
import AdjustmentBar from "../AdjustmentBar/adjustmentBar";
import ChangeSlide from "../Case/changeSlide";
import ChatFeed from "../Feed/ChatFeed";
import SlideFeed from "../Feed/feed";
import TILFeedBar from "../Feed/TILFeedBar";
import ProgressBar from "../Loading/ProgressBar";
import FunctionsMenu from "../Menu/menu";
import Navigator from "../Navigator/navigator";
import ViewerFactory from "../Viewer/viewerFactory";
import ToolbarButton from "../ViewerToolbar/button";
import LayoutAppBody from "./body";
import LayoutInnerBody from "./innerbody";
import LayoutOuterBody from "./outerbody";
import LayoutAppSidebar from "./sidebar";
import {
  GET_STANDARD_REPORT,
  GET_SYNOPTIC_REPORT,
} from "../../graphql/annotaionsQuery";

function LayoutApp({
  userInfo,
  caseInfo,
  slides,
  viewerIds,
  questionnaire,
  report,
  application,
  hitTil,
  lessonId,
  annotations,
  enableAI,
  slide,
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
  questionIndex,
}) {
  // const { handleEvent } = useKeyboardEvents();

  const [sidebar, setSidebar] = useState(false);
  const [zoomValue, setZoomValue] = useState(1);
  const [isNavigatorActive, setIsNavigatorActive] = useState(false);
  const [isMultiview, setIsMultiview] = useState(false);
  const { fabricOverlayState, fabricOverlay } = useFabricOverlayState();
  const { viewerWindow, isAnnotationLoading } = fabricOverlayState;
  const [newHilData, setNewHilData] = useState(false);
  const [refreshHil, setRefreshHil] = useState(0);
  const [totalCells, setTotalCells] = useState(0);
  const [tilScore, setTilScore] = useState();
  const [tumorArea, setTumorArea] = useState();
  const [stromaArea, setStromaArea] = useState();
  const [lymphocyteCount, setLymphocyteCount] = useState();
  const [navigatorCounter, setNavigatorCounter] = useState(0);
  const [base64URL, setBase64URL] = useState(false);
  const [normalizeDefault, setNormalizeDefault] = useState(false);
  // Right Panel navigation state
  const [selectedOption, setSelectedOption] = useState("slides");
  const [imageFilter, setImageFilter] = useState(false);
  const [newSliderInputs, setNewSliderInputs] = useState({
    contrast: 1,
    brightness: 0,
    thresholding: -1,
    gamma: 1,
    exposure: 0,
  });
  const [ifBiggerScreen] = useMediaQuery("(min-width:1920px)");
  const [currentViewer, setCurrentViewer] = useState(
    viewerIds?.[0]?._id || viewerIds?.[0]?.slideId
  );

  const [showAnnotationsBar, setShowAnnotationsBar] = useState(false);
  const [slideName, setSlideName] = useState(slide?.slideName);
  const [slideName2, setSlideName2] = useState(null);
  const [showFeedBar, setShowFeedBar] = useState(false);
  const [chatFeedBar, setChatFeedBar] = useState(false);
  const [tILFedBar, setTILFedBar] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [feedTab, setFeedBar] = useState(0);
  const [synopticType, setSynopticType] = useState("");
  const [synopticReportType, setSynopticReportType] = useState("");
  const [chatHover, setChatHover] = useState(false);
  const [annotationObject, setAnnotationObject] = useState("");
  const [toolSelected, setToolSelected] = useState("Loading");
  const [bottomZoomValue, setBottomZoomValue] = useState("");
  const socketRef = useRef(null);
  // xml annotations check
  const [isXmlAnnotations, setIsXmlAnnotations] = useState(false);
  const [loadUI, setLoadUI] = useState(true);
  const [unit, setUnit] = useState();
  const [AdjustmentTool, setAdjustmentTool] = useState(false);
  const [socketIsConnected, setSocketIsConnected] = useState(false);
  const [binaryMask, setBinaryMask] = useState("");
  const [modelName, setModelname] = useState("");
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [originalPixels, setOriginalPixels] = useState([]);
  const [editView, setEditView] = useState(false);
  const [gleasonScoringData, setGleasonScoringData] = useState({});
  const [gleasonScoring, setGleasonScoring] = useState(false);
  const { tile, viewer } = viewerWindow[currentViewer];
  const [newToolSettings, setNewToolSettings] = useState({
    strokeColor: "",
    strokeType: "",
    fillColor: "",
  });
  const [pattern3Color, setPattern3Color] = useState({});
  const [pattern4Color, setPattern4Color] = useState({});
  const [pattern5Color, setPattern5Color] = useState({});
  const [benignColor, SetBenignColor] = useState({});
  const [tumorColor, setTumorColor] = useState({});
  const [stromaColor, setStromaColor] = useState({});
  const [lymphocyteColor, setLymphocyteColor] = useState({});
  // meanu_Report
  const [slideData, setSlideData] = useState(null);
  const [reportedStatus, setReportedStatus] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState("");
  const [synopticReportData, setSynopticReportData] = useState("");
  const [getStandardReport, { data: standardReportData, standardReportError }] =
    useLazyQuery(GET_STANDARD_REPORT);
  const [getSynopticReportData, { data: synopticReport, synopticReportError }] =
    useLazyQuery(GET_SYNOPTIC_REPORT);

  // Human - In - The -Loop

  const caseId = caseInfo?._id;

  // useEffect(() => {
  //   if (hash !== "") {
  //     zoomToLevel(hash)
  //   }
  // },[hash])

  useEffect(() => {
    if (synopticType === "breast-cancer") {
      setSynopticReportType("breast-cancer");
    } else if (synopticType === "prostate-cancer") {
      setSynopticReportType("prostate-cancer");
    } else if (synopticType === "lymphoma") {
      setSynopticReportType("lymphoma-cancer");
    } else {
      setSynopticReportType("");
    }
  }, [synopticType]);

  // fetch based on synoptic type
  useEffect(() => {
    if (synopticReportType !== "") {
      const fetchData = async () => {
        try {
          const response = await getSynopticReportData({
            variables: {
              query: {
                caseId:
                  application === "hospital"
                    ? caseId
                    : application === "education"
                    ? lessonId
                    : application === "clinical"
                    ? caseInfo.caseId
                    : "",
              },
            },
            fetchPolicy: "network-only",
          });
          setSynopticReportData(response.data.loadSynopticReport);
        } catch (error) {
          //   console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [caseInfo?._id, synopticReportType]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getStandardReport({
          variables: {
            query: {
              caseId:
                application === "hospital"
                  ? caseId
                  : application === "education"
                  ? lessonId
                  : application === "clinical"
                  ? caseInfo.caseId
                  : "",
            },
          },
          fetchPolicy: "network-only",
        });
        // You can also update the slide data with the new standardReportData
        if (response.data.loadReport.message !== "Report not found") {
          setSlideData(response.data.loadReport);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [caseInfo, showReport]);

  useEffect(() => {
    const UnitStore = localStorage.getItem("unit");
    setUnit(UnitStore);
    // console.log(bottomZoomValue);
  }, [bottomZoomValue]);

  // console.log(MouseDown);

  // console.log("sssss", selectedOption);

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
    case "Loading":
      returnText = "Initialising viewer";
      break;
    case "Multiview":
      returnText = "Multiview is selected.";
      break;
    case "MultiviewSlideChoosed":
      returnText =
        "Multiscreen view is active. Link slide to work on both slides simultaneously.";
      break;
    case "OpenPath":
      returnText = "ROI Analysis can be done on closed annotations only.";
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
        "Annotation is marked on the slide. Click on PRR AI button from top bar to run ROI analysis";
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
      returnText = "Comment selected. Click in the textbox to add a comment.";
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
    case "pathError":
      returnText = "Please draw a closed path to run ROI analysis.";
      break;

    case "KI67Error":
      returnText =
        "KI67 analysis can only be run on stain type IHC and marker type must be KI67 .";
      break;
    case "MorphometryError":
      returnText = "Something went wrong";
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
    case "Error":
      returnText = "Something Went Wrong!";
      break;
    case "AddMask":
      returnText = "Please draw to add mask";
      break;

    default:
      returnText = "";
      break;
  }

  // console.log(slideInfo);

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

  // connect websocket

  useEffect(() => {
    connectWebSocket()
      .then((socket) => {
        // console.log('WebSocket connection established.');
        socketRef.current = socket;
        // console.log(socketRef);
        setSocketIsConnected(true);
      })
      .catch((error) => {
        console.error("WebSocket connection error:", error);
      });
  }, []);

  let h;

  if (application === "education" || application === "clinical") {
    h = ifBiggerScreen ? "calc(100vh - 5.5vh)" : "93vh";
  } else if (application === "hospital") {
    h = ifBiggerScreen ? "calc(100vh - 5.5vh)" : "100vh";
  } else {
    // Handle other cases or provide a default value for h
  }

  useEffect(() => {
    setSelectedPattern("");
    localStorage.removeItem("til");
    localStorage.removeItem("ModelName");
    // console.log("FFFFFF");
  }, [navigatorCounter]);
  // console.log("slide", navigatorCounter);

  return (
    <Flex style={{ height: h }} direction="column">
      <LayoutOuterBody>
        <AdjustmentBar
          userInfo={userInfo}
          lessonId={lessonId}
          imageFilter={imageFilter}
          chatFeedBar={chatFeedBar}
          setImageFilter={setImageFilter}
          caseInfo={caseInfo}
          Environment={Environment}
          setBinaryMask={setBinaryMask}
          normalizeDefault={normalizeDefault}
          setGleasonScoring={setGleasonScoring}
          gleasonScoring={gleasonScoring}
          setAdjustmentTool={setAdjustmentTool}
          setOriginalPixels={setOriginalPixels}
          AdjustmentTool={AdjustmentTool}
          loadUI={loadUI}
          setLoadUI={setLoadUI}
          toolSelected={toolSelected}
          setToolSelected={setToolSelected}
          setShowRightPanel={setShowRightPanel}
          refreshHil={refreshHil}
          navigatorCounter={navigatorCounter}
          base64URL={base64URL}
          setNavigatorCounter={setNavigatorCounter}
          hitTil={hitTil}
          zoomValue={zoomValue}
          setTumorArea={setTumorArea}
          setTilScore={setTilScore}
          setStromaArea={setStromaArea}
          setLymphocyteCount={setLymphocyteCount}
          newSliderInputs={newSliderInputs}
          slide={viewerIds?.[0]}
          socketIsConnected={socketIsConnected}
          slides={slides}
          socketRef={socketRef}
          annotations={annotations}
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
          setGleasonScoringData={setGleasonScoringData}
          selectedPattern={selectedPattern}
          setNewToolSettings={setNewToolSettings}
          newToolSettings={newToolSettings}
          setSelectedPattern={setSelectedPattern}
          SetBenignColor={SetBenignColor}
          setPattern5Color={setPattern5Color}
          setTumorColor={setTumorColor}
          tumorColor={tumorColor}
          setPattern4Color={setPattern4Color}
          setPattern3Color={setPattern3Color}
          pattern3Color={pattern3Color}
          pattern4Color={pattern4Color}
          pattern5Color={pattern5Color}
          benignColor={benignColor}
          setStromaColor={setStromaColor}
          stromaColor={stromaColor}
          lymphocyteColor={lymphocyteColor}
          setLymphocyteColor={setLymphocyteColor}
        />
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
              slideName2={slideName2}
              setLoadUI={setLoadUI}
              binaryMask={binaryMask}
              setNewSliderInputs={setNewSliderInputs}
              slideName={slideName}
              setModelname={setModelname}
              viewerIds={viewerIds}
              runAiModel={runAiModel}
              isXmlAnnotations={isXmlAnnotations}
              setToolSelected={setToolSelected}
              navigatorCounter={navigatorCounter}
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
            setBase64URL={setBase64URL}
            viewerId={currentViewer}
            setIsMultiview={setIsMultiview}
            setIsNavigatorActive={setIsNavigatorActive}
            isNavigatorActive={isNavigatorActive}
            isMultiview={isMultiview}
            slide={viewerIds?.[0]}
            originalPixels={originalPixels}
            viewerIds={viewerIds}
            setToolSelected={setToolSelected}
            setAdjustmentTool={setAdjustmentTool}
            slideData={slideData}
            setSlideData={setSlideData}
            gleasonScoring={gleasonScoring}
            reportedStatus={reportedStatus}
            synopticReportData={synopticReportData}
            setSlideName2={setSlideName2}
            navigatorCounter={navigatorCounter}
            Environment={Environment}
            tilScore={tilScore}
            setOriginalPixels={setOriginalPixels}
            setNavigatorCounter={setNavigatorCounter}
            setSlideName={setSlideName}
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
            setCurrentViewer={setCurrentViewer}
            showRightPanel={showRightPanel}
            setSelectedOption={setSelectedOption}
            selectedOption={selectedOption}
            setShowRightPanel={setShowRightPanel}
            questions={questions}
            app={application}
            setSlideId={setSlideId}
            responseHandler={responseHandler}
            questionnaireResponse={questionnaireResponse}
            synopticType={synopticType}
            setSynopticType={setSynopticType}
            newSliderInputs={newSliderInputs}
            setNewSliderInputs={setNewSliderInputs}
            getSynopticReport={getSynopticReport}
            updateSynopticReport={updateSynopticReport}
            chatFeedBar={chatFeedBar}
            setEditView={setEditView}
            editView={editView}
            handleChatFeedBarClose={handleChatFeedBarClose}
            setChatFeedBar={setChatFeedBar}
            feedTab={feedTab}
            setNormalizeDefault={setNormalizeDefault}
            users={users}
            client2={client2}
            mentionUsers={mentionUsers}
            addUsersToCase={addUsersToCase}
            setSelectedPattern={setSelectedPattern}
            selectedPattern={selectedPattern}
            searchSelectedData={searchSelectedData}
            questionIndex={questionIndex}
            gleasonScoringData={gleasonScoringData}
            pattern3Color={pattern3Color}
            pattern4Color={pattern4Color}
            pattern5Color={pattern5Color}
            benignColor={benignColor}
            tumorColor={tumorColor}
            stromaColor={stromaColor}
            lymphocyteColor={lymphocyteColor}
          />
        </LayoutInnerBody>
        <Flex
          bg="#FFFFFF"
          py="5px"
          boxShadow="0px 0px 1px 0.1px"
          pl="30px"
          w="100%"
          zIndex={99}
          h={application === "hospital" ? "32px" : "25px"}
        >
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
                  loadUI={loadUI}
                  slide={slide}
                  slideName={slideName}
                  setSlideName={setSlideName}
                  viewerId={currentViewer}
                  setSelectedOption={setSelectedOption}
                  setNavigatorCounter={setNavigatorCounter}
                  slideUrl={tile}
                  setIsMultiview={setIsMultiview}
                  setIsNavigatorActive={setIsNavigatorActive}
                  isAnnotationLoading={isAnnotationLoading}
                  isNavigatorActive={isNavigatorActive}
                />
              )}
            </Flex>
            <Text
              ml="10px"
              fontSize="14px"
              style={{
                color: localStorage.getItem("ModelName")
                  ? "#1B75BC"
                  : toolSelected === "RunRoi"
                  ? "#1B75BC"
                  : "black",
              }}
            >
              {localStorage.getItem("ModelName")
                ? `Running ${localStorage.getItem("ModelName")}`
                : returnText}
            </Text>
            <Flex ml="10px" justifyContent="flex-end" alignItems="center">
              {/* <ProgressBar /> */}
              {!loadUI === true ? <ProgressBar /> : null}
            </Flex>
            <Box pos="absolute" right="0" me="30px">
              <Flex>
                <Text fontSize="14px" mr="5px">
                  {bottomZoomValue}X
                </Text>
                <Image
                  src="https://i.ibb.co/7CtYTC2/bottom-Bar.png"
                  alt="Bottom Bar"
                />
                <Text ml="5px" fontSize="14px">
                  {unit}
                </Text>
              </Flex>
            </Box>
          </Flex>
        </Flex>
      </LayoutOuterBody>
    </Flex>
  );
}

LayoutApp.propTypes = {
  finalSubmitHandler: PropTypes.func,
};

export default LayoutApp;
