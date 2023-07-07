import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Tooltip,
  useDisclosure,
  useMediaQuery,
  VStack,
  Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { GrFormClose } from "react-icons/gr";
import axios from "axios";
import {
  SlidesIcon,
  TimelineIcon,
  TimelineIconSelected,
  Annotations,
  AnnotationsSelected,
  Comments,
  CommentsSelected,
  Information,
  InformationSelected,
  ReportIcon,
  ReportSelected,
  SlidesIconSelected,
  MessagesIcon,
  MessagesIconSelected,
  adjustmentIcon,
  adjustmentIconSelected,
} from "../Icons/CustomIcons";
import SlidesMenu from "./slidesMenu";
import { useFabricOverlayState } from "../../state/store";
import Studies from "../Sidebar/studies";
import ActivityFeed from "../Feed/activityFeed";
import CommentFeed from "../Feed/CommentFeed";
import ShowReport from "../Toolbar/ShowReport";
import SynopticReport from "../SynopticReport/SynopticReport";
import Report from "../Report/Report";
import Timeline from "../Timeline/Timeline";
import ChatFeed from "../Feed/ChatFeed";
import { ModeIcon, ModeIconSelected } from "../Icons/CustomIcons";
import Adjustments from "../Adjustments/Adjustments";

import { BsSliders } from "react-icons/bs";
import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
} from "react-icons/hi";
import IconSize from "../ViewerToolbar/IconSize";
import Navigator from "../Navigator/navigator";
import { updateAnnotationInDB } from "../../utility";
import {
  GET_ANNOTATION,
  UPDATE_ANNOTATION,
} from "../../graphql/annotaionsQuery";
import { useLazyQuery, useMutation } from "@apollo/client";
import { debounce } from "lodash";
import ModeMeanu from "./ModeMeanu";
import Studies2 from "../Sidebar/studies2";

function FunctionsMenu({
  caseInfo,
  slides,
  viewerId,
  viewerIds,
  setIsMultiview,
  hideTumor,
  setHideTumor,
  setNormalizeDefault,
  gleasonScoring,
  setBase64URL,
  hideLymphocyte,
  setSlideName2,
  setSlideName,
  showRightPanel,
  navigatorCounter,
  setHideLymphocyte,
  setToolSelected,
  setHideStroma,
  hideStroma,
  setIsNavigatorActive,
  toolSelected,
  setShowRightPanel,
  tumorArea,
  stromaArea,
  lymphocyteCount,
  isNavigatorActive,
  tilScore,
  setCurrentViewer,
  isMultiview,
  slide,
  userInfo,
  isXmlAnnotations,
  application,
  saveReport,
  saveSynopticReport,
  mediaUpload,
  slideInfo,
  chatFeedBar,
  handleChatFeedBarClose,
  feedTab,
  users,
  client2,
  mentionUsers,
  Environment,
  setChatFeedBar,
  addUsersToCase,
  handleReport,
  showReport,
  setShowReport,
  questions,
  app,
  setEditView,
  editView,
  setSlideId,
  responseHandler,
  questionnaireResponse,
  synopticType,
  setSynopticType,
  getSynopticReport,
  updateSynopticReport,
  searchSelectedData,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [ifWidthLessthan1920] = useMediaQuery("(max-width:1920px)");
  const { fabricOverlayState } = useFabricOverlayState();
  const { viewerWindow } = fabricOverlayState;
  const { tile, slideId, viewer, fabricOverlay } = viewerWindow[viewerId];
  const [activeObject, setActiveObject] = useState();
  const [updatedAnnotation, setUpdatedAnnotation] = useState({});
  const [manipulationComplete, setManipulationComplete] = useState(false);
  const [targetAnnotation, setTargetAnnotation] = useState({});
  const [showNormalisation, setShowNormalisation] = useState(false);
  const [getAnnotation, { data: annotationData, loading, error }] =
    useLazyQuery(GET_ANNOTATION);
  const [selectedOption, setSelectedOption] = useState("slides");
  const [reportData, setReportData] = useState({
    clinicalStudy: "",
    grossDescription: "",
    microscopicDescription: "",
    impression: "",
    advice: "",
    annotedSlides: "",
  });
  const [
    modifyAnnotation,
    { data: updatedData, error: updateError, loading: updateLoading },
  ] = useMutation(UPDATE_ANNOTATION);
  // console.log(caseInfo);
  // console.log(slide);
  const onUpdateAnnotation = (data) => {
    // console.log("====================================");
    // console.log("activity feed update");
    // console.log("====================================");
    delete data?.slideId;
    modifyAnnotation({
      variables: { body: { ...data } },
    });
  };
  const handleReportData = (input) => (e) => {
    const { value } = e.target;
    setReportData((prevState) => ({
      ...prevState,
      [input]: value,
    }));
  };
  const handleUpload = (e) => {
    const { files } = e.target;
    const filesArray = Array.from(files);
    const imagesArray = filesArray.map((file) => file);
    setAnnotedSlideImages(imagesArray);
  };
  const [annotedSlideImages, setAnnotedSlideImages] = useState([]);
  const [slideData, setSlideData] = useState(null);
  const [timelineData, setTimeLineData] = useState([]);
  useEffect(() => {
    if (!chatFeedBar && selectedOption !== "annotations") {
      // setSelectedOption("slides");
      setIsOpen(false);
    }
    if (chatFeedBar) {
      setSelectedOption("messages");
      setIsOpen(true);
    }
  }, [chatFeedBar]);
  useEffect(() => {
    if (toolSelected !== "Filter" && selectedOption !== "annotations") {
      // setSelectedOption("slides");
      setIsOpen(false);
    }
    if (toolSelected === "Filter") {
      setSelectedOption("adjustments");
      setIsOpen(true);
    }
  }, [toolSelected]);

  useEffect(() => {
    if (navigatorCounter > 0) {
      setIsOpen(false);
    }
  }, [navigatorCounter]);

  const fetchData = async () => {
    if (selectedOption === "timeline") {
      const resp = await axios.post(`${Environment.USER_URL}/slide_timeline`, {
        slideId: slide?._id,
        caseId: caseInfo?._id,
      });
      if (resp) {
        const sortedDataByTime = resp.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setTimeLineData(sortedDataByTime);
      }
    }
  };

  useEffect(() => {
    if (application === "hospital") {
      fetchData();
    }
    if (application === "education") {
      getAnnotation({
        variables: {
          query: {
            slideId,
          },
        },
      });
    }
  }, [selectedOption]);
  useEffect(() => {
    if (annotationData) {
      setTimeLineData(annotationData.loadAnnotation.data);
    }
  }, [annotationData]);
  useEffect(() => {
    if (application === "education") {
      setSlideName(slide?.originalName);
      // console.log(slide?.originalName);
    }
  }, [slide]);

  useEffect(() => {
    if (searchSelectedData) {
      if (
        searchSelectedData.type === "textBox" ||
        searchSelectedData.type === "textbox"
      ) {
        setIsOpen(true);
        setSelectedOption("comments");
      } else {
        setIsOpen(true);
        setSelectedOption("annotations");
      }
    }
  }, [searchSelectedData]);

  useEffect(() => {
    if (gleasonScoring) {
      setIsOpen(true);
      setSelectedOption("annotations");
    } else {
      setIsOpen(false);
    }
  }, [gleasonScoring]);

  // console.log(gleasonScoring);

  useEffect(() => {
    const canvas = fabricOverlay?.fabricCanvas();
    let clickedObject = null;
    // Track mouse Events here
    canvas?.on("mouse:down", (e) => {
      clickedObject = canvas?.findTarget(e.e);
      setActiveObject(clickedObject);
    });

    canvas?.on("object:scaling", (e) => {
      const scaledObject = e.target;
      if (scaledObject === clickedObject) {
        const { scaleX, scaleY, width, height } = scaledObject;
        const updatedWidth = width * scaleX;
        const updatedHeight = height * scaleY;

        // Create a new object with updated dimensions
        const updatedObject = {
          ...clickedObject,
          width: updatedWidth,
          height: updatedHeight,
        };

        setUpdatedAnnotation(updatedObject);
        setManipulationComplete(true); // Set manipulation as complete
      }
    });
  }, [fabricOverlay]);

  useEffect(() => {
    if (isMultiview || editView) {
      setSelectedOption("slides");
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [isMultiview, editView]);

  useEffect(() => {
    if (activeObject?.type !== "textbox" && activeObject && activeObject?.type !== "group") {
      setIsOpen(true);
      setSelectedOption("annotations");
      // console.log(activeObject);
    }
  }, [activeObject]);

  const handleReportClose = () => {
    setShowReport(!showReport);
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedOption("slides");
    }
  }, [isOpen]);

  useEffect(() => {
    if (showRightPanel && !editView) {
      setIsOpen(true);
      setSelectedOption("mode");
    } else {
      setIsOpen(false);
      setSelectedOption("slides");
    }
  }, [showRightPanel, showNormalisation]);

  return (
    <Box
      pos="absolute"
      right={0}
      background="#FFFFFF"
      // border="1px solid red"
      zIndex={10}
      mt="2px"
      h={ifWidthLessthan1920 ? "calc(100vh - 18vh)" : "calc(100vh - 18vh)"}
    >
      <motion.div
        animate={{
          width: isOpen
            ? ifWidthLessthan1920
              ? selectedOption === "report"
                ? "40vw"
                : "450px"
              : selectedOption === "report"
              ? "40vw"
              : "18vw"
            : "70px",
        }}
        style={{
          overflowY: isOpen ? "scroll" : "hidden",
          overflowX: "hidden",
          whiteSpace: "nowrap",
          position: "absolute",
          right: isOpen ? "0" : "0px",
          height: "82vh",
          top: "0",
        }}
      >
        <Flex>
          <Flex direction="column" h="fit-content">
            <Button
              onClick={() => setIsOpen(!isOpen)}
              w="70px"
              borderRadius={0}
              background="#FFFFFF"
              box-shadow="0px 4px 7px rgba(0, 0, 0, 0.05)"
              _hover={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
            >
              {isOpen ? (
                <HiOutlineChevronDoubleRight size="20px" />
              ) : (
                <HiOutlineChevronDoubleLeft size="20px" />
              )}
            </Button>
            <Tooltip label="View slides" placement="left">
              <Button
                height="73px"
                w="73px"
                borderRadius={0}
                background="rgba(255, 255, 255, 0.5)"
                box-shadow="0px 4px 7px rgba(0, 0, 0, 0.05)"
                onClick={() => {
                  setSelectedOption("slides");
                  setIsOpen(true);
                }}
                _hover={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
              >
                <VStack>
                  {selectedOption === "slides" ? (
                    <SlidesIconSelected />
                  ) : (
                    <SlidesIcon />
                  )}
                  <Text
                    fontFamily="Inter"
                    fontStyle="normal"
                    fontWeight="400"
                    fontSize="10px"
                    lineHeight="12px"
                    letterSpacing="0.0025em"
                    color={selectedOption === "slides" ? "#3B5D7C" : "fff"}
                  >
                    Slides
                  </Text>
                </VStack>
              </Button>
            </Tooltip>
            <Tooltip label="View timeline" placement="left">
              <Button
                height="73px"
                w="73px"
                borderRadius={0}
                background="rgba(255, 255, 255, 0.5)"
                box-shadow="0px 4px 7px rgba(0, 0, 0, 0.05)"
                _hover={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                onClick={() => {
                  setSelectedOption("timeline");
                  setIsOpen(true);
                }}
              >
                <VStack>
                  {selectedOption === "timeline" ? (
                    <TimelineIconSelected />
                  ) : (
                    <TimelineIcon />
                  )}
                  <Text
                    fontFamily="Inter"
                    fontStyle="normal"
                    fontWeight="400"
                    fontSize="10px"
                    lineHeight="12px"
                    letterSpacing="0.0025em"
                    color={selectedOption === "timeline" ? "#3B5D7C" : "fff"}
                  >
                    Timeline
                  </Text>
                </VStack>
              </Button>
            </Tooltip>
            <Tooltip label="View annotations" placement="left">
              <Button
                height="73px"
                w="73px"
                borderRadius={0}
                background="rgba(255, 255, 255, 0.5)"
                box-shadow="0px 4px 7px rgba(0, 0, 0, 0.05)"
                _hover={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                onClick={() => {
                  setSelectedOption("annotations");
                  setIsOpen(true);
                }}
              >
                <VStack>
                  {selectedOption === "annotations" ? (
                    <AnnotationsSelected />
                  ) : (
                    <Annotations />
                  )}
                  <Text
                    fontFamily="Inter"
                    fontStyle="normal"
                    fontWeight="400"
                    fontSize="10px"
                    lineHeight="12px"
                    letterSpacing="0.0025em"
                    color={selectedOption === "annotations" ? "#3B5D7C" : "fff"}
                  >
                    Annotations
                  </Text>
                </VStack>
              </Button>
            </Tooltip>
            <Tooltip label="View comments" placement="left">
              <Button
                height="73px"
                w="73px"
                background="rgba(255, 255, 255, 0.5)"
                borderRadius={0}
                _hover={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                box-shadow="0px 4px 7px rgba(0, 0, 0, 0.05)"
                onClick={() => {
                  setSelectedOption("comments");
                  setIsOpen(true);
                }}
              >
                <VStack>
                  {selectedOption === "comments" ? (
                    <CommentsSelected />
                  ) : (
                    <Comments />
                  )}
                  <Text
                    fontFamily="Inter"
                    fontStyle="normal"
                    fontWeight="400"
                    fontSize="10px"
                    lineHeight="12px"
                    letterSpacing="0.0025em"
                    color={selectedOption === "comments" ? "#3B5D7C" : "fff"}
                  >
                    Comments
                  </Text>
                </VStack>
              </Button>
            </Tooltip>
            <Tooltip label="View slide info" placement="left">
              <Button
                height="73px"
                w="73px"
                background="rgba(255, 255, 255, 0.5)"
                borderRadius={0}
                box-shadow="0px 4px 7px rgba(0, 0, 0, 0.05)"
                _hover={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                onClick={() => {
                  setSelectedOption("information");
                  setIsOpen(true);
                }}
              >
                <VStack>
                  {selectedOption === "information" ? (
                    <InformationSelected />
                  ) : (
                    <Information />
                  )}
                  <Text
                    fontFamily="Inter"
                    fontStyle="normal"
                    fontWeight="400"
                    fontSize="10px"
                    lineHeight="12px"
                    letterSpacing="0.0025em"
                    color={selectedOption === "information" ? "#3B5D7C" : "fff"}
                  >
                    Information
                  </Text>
                </VStack>
              </Button>
            </Tooltip>
            <Tooltip label="Report slide" placement="left">
              <Button
                height="73px"
                w="73px"
                background="rgba(255, 255, 255, 0.5)"
                borderRadius={0}
                box-shadow="0px 4px 7px rgba(0, 0, 0, 0.05)"
                _hover={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                onClick={() => {
                  setSelectedOption("report");
                  setIsOpen(true);
                }}
              >
                <VStack>
                  {selectedOption === "report" ? (
                    <ReportSelected />
                  ) : (
                    <ReportIcon />
                  )}
                  <Text
                    fontFamily="Inter"
                    fontStyle="normal"
                    fontWeight="400"
                    fontSize="10px"
                    lineHeight="12px"
                    letterSpacing="0.0025em"
                    color={selectedOption === "report" ? "#3B5D7C" : "fff"}
                  >
                    Report
                  </Text>
                </VStack>
              </Button>
            </Tooltip>
            {chatFeedBar ? (
              <Tooltip label=" View Conversation" placement="left">
                <Button
                  height="73px"
                  w="73px"
                  background="rgba(255, 255, 255, 0.5)"
                  borderRadius={0}
                  box-shadow="0px 4px 7px rgba(0, 0, 0, 0.05)"
                  _hover={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                  onClick={() => {
                    setSelectedOption("messages");
                    setIsOpen(true);
                  }}
                >
                  <VStack>
                    {selectedOption === "messages" ? (
                      <MessagesIconSelected />
                    ) : (
                      <MessagesIcon />
                    )}
                    <Text
                      fontFamily="Inter"
                      fontStyle="normal"
                      fontWeight="400"
                      fontSize="10px"
                      lineHeight="12px"
                      letterSpacing="0.0025em"
                      color={selectedOption === "report" ? "#3B5D7C" : "fff"}
                    >
                      Messages
                    </Text>
                  </VStack>
                </Button>
              </Tooltip>
            ) : null}
            {toolSelected === "Filter" ? (
              <Tooltip label=" Adjustments" placement="left">
                <Button
                  height="73px"
                  w="73px"
                  background="rgba(255, 255, 255, 0.5)"
                  borderRadius={0}
                  box-shadow="0px 4px 7px rgba(0, 0, 0, 0.05)"
                  _hover={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                  onClick={() => {
                    setSelectedOption("adjustments");
                    setIsOpen(true);
                  }}
                >
                  <VStack>
                    {selectedOption === "adjustments" ? (
                      //  <adjustmentIconSelected />
                      // <MessagesIconSelected />
                      // <HiOutlineAdjustmentsHorizontal />
                      <BsSliders size="28px" color="#3B5D7C" />
                    ) : (
                      // <adjustmentIconSelected />
                      <BsSliders size="28px" color="black" />
                    )}
                    <Text
                      fontFamily="Inter"
                      fontStyle="normal"
                      fontWeight="400"
                      fontSize="10px"
                      lineHeight="12px"
                      letterSpacing="0.0025em"
                      color={selectedOption === "report" ? "#3B5D7C" : "fff"}
                    >
                      Adjustments
                    </Text>
                  </VStack>
                </Button>
              </Tooltip>
            ) : null}
            {showRightPanel ? (
              <Tooltip label=" Mode" placement="left">
                <Button
                  height="73px"
                  w="73px"
                  background="rgba(255, 255, 255, 0.5)"
                  borderRadius={0}
                  box-shadow="0px 4px 7px rgba(0, 0, 0, 0.05)"
                  _hover={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                  onClick={() => {
                    setSelectedOption("mode");
                    setIsOpen(true);
                  }}
                >
                  <VStack>
                    {selectedOption === "mode" ? (
                      //  <adjustmentIconSelected />
                      // <MessagesIconSelected />
                      // <HiOutlineAdjustmentsHorizontal />
                      <ModeIconSelected transform="scale(1.5)" color="red" />
                    ) : (
                      // <adjustmentIconSelected />
                      <ModeIcon transform="scale(1.5)" color="#3B5D7C" />
                    )}
                    <Text
                      fontFamily="Inter"
                      fontStyle="normal"
                      fontWeight="400"
                      fontSize="10px"
                      lineHeight="12px"
                      letterSpacing="0.0025em"
                      color={selectedOption === "mode" ? "#3B5D7C" : "fff"}
                    >
                      Modes
                    </Text>
                  </VStack>
                </Button>
              </Tooltip>
            ) : null}
          </Flex>
          <Flex
            w="100%"
            position="relative"
            h={ifWidthLessthan1920 ? "100%" : "calc(100vh - 10.033vh)"}
          >
            {selectedOption === "slides" ? (
              <SlidesMenu
                caseInfo={caseInfo}
                slides={slides}
                viewerId={viewerId}
                editView={editView}
                setSelectedOption={setSelectedOption}
                setSlideName2={setSlideName2}
                application={application}
                setIsOpen={setIsOpen}
                setTargetAnnotation={setTargetAnnotation}
                setShowNormalisation={setShowNormalisation}
                isMultiview={isMultiview}
                setSlideName={setSlideName}
                tile={tile}
                setIsMultiview={setIsMultiview}
                setToolSelected={setToolSelected}
                setIsNavigatorActive={setIsNavigatorActive}
              />
            ) : selectedOption === "information" ? (
              <Flex w="100%" bg="#FCFCFC">
                {application === "hospital" ? (
                  <Studies caseInfo={caseInfo} slideInfo={slide} />
                ) : (
                  <Studies2 caseInfo={caseInfo} slideInfo={slide}></Studies2>
                )}
              </Flex>
            ) : selectedOption === "annotations" ? (
              <ActivityFeed
                userInfo={userInfo}
                isXmlAnnotations={isXmlAnnotations}
                viewerId={viewerId}
                tumorArea={tumorArea}
                activeObject={activeObject}
                hideTumor={hideTumor}
                setHideTumor={setHideTumor}
                hideLymphocyte={hideLymphocyte}
                setHideLymphocyte={setHideLymphocyte}
                setSelectedOption={setSelectedOption}
                gleasonScoring={gleasonScoring}
                setHideStroma={setHideStroma}
                hideStroma={hideStroma}
                stromaArea={stromaArea}
                lymphocyteCount={lymphocyteCount}
                tilScore={tilScore}
                searchSelectedData={searchSelectedData}
              />
            ) : selectedOption === "comments" ? (
              <CommentFeed
                viewerId={viewerId}
                searchSelectedData={searchSelectedData}
              />
            ) : selectedOption === "report" ? (
              <Flex w="100%" h="82vh" direction="column" bgColor="#FCFCFC">
                <Flex
                  w="100%"
                  direction="row"
                  alignItems="center"
                  justifyContent="space-evenly"
                  // border="1px solid red"
                  // p="5px 5px 0px 20px"
                >
                  <Text fontFamily="Inter" color="#3B5D7C" mr="60%">
                    Report
                  </Text>

                  <ShowReport
                    caseInfo={caseInfo}
                    application={application}
                    saveReport={saveReport}
                    saveSynopticReport={saveSynopticReport}
                    viewerId={viewerId}
                    mediaUpload={mediaUpload}
                    slideInfo={slideInfo}
                    handleReport={handleReport}
                    setShowReport={setShowReport}
                    userInfo={userInfo}
                    questions={questions}
                    app={app}
                    showReport={showReport}
                    setSlideId={setSlideId}
                    responseHandler={responseHandler}
                    questionnaireResponse={questionnaireResponse}
                    synopticType={synopticType}
                    setSynopticType={setSynopticType}
                    getSynopticReport={getSynopticReport}
                    updateSynopticReport={updateSynopticReport}
                    reportData={reportData}
                    setReportData={setReportData}
                    handleReportData={handleReportData}
                    handleUpload={handleUpload}
                    annotedSlideImages={annotedSlideImages}
                    setAnnotedSlideImages={setAnnotedSlideImages}
                    slideData={slideData}
                    setSlideData={setSlideData}
                  />
                  {showReport ? (
                    <GrFormClose
                      size={16}
                      cursor="pointer"
                      onClick={handleReportClose}
                      _hover={{ cursor: "pointer" }}
                    />
                  ) : null}
                </Flex>
                <Flex>
                  {showReport ? (
                    <Report
                      userInfo={userInfo}
                      handleReport={handleReport}
                      report={showReport}
                      reportData={reportData}
                      showReport={showReport}
                      setShowReport={setShowReport}
                      handleReportData={handleReportData}
                      caseInfo={caseInfo}
                      handleUpload={handleUpload}
                      annotedSlideImages={annotedSlideImages}
                      reportedData={slideData}
                    />
                  ) : synopticType !== "" ? (
                    <SynopticReport
                      userInfo={userInfo}
                      saveSynopticReport={saveSynopticReport}
                      getSynopticReport={getSynopticReport}
                      synopticType={synopticType}
                      caseInfo={caseInfo}
                      setSynopticType={setSynopticType}
                      slideId={slideId}
                      updateSynopticReport={updateSynopticReport}
                    />
                  ) : null}
                </Flex>
              </Flex>
            ) : selectedOption === "messages" ? (
              <ChatFeed
                viewerId={viewerId}
                chatFeedBar={chatFeedBar}
                handleChatFeedBarClose={handleChatFeedBarClose}
                showReport={showReport}
                feedTab={feedTab}
                setChatFeedBar={setChatFeedBar}
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
            ) : selectedOption === "adjustments" ? (
              <Adjustments
                setSelectedOption={setSelectedOption}
                setToolSelected={setToolSelected}
                viewer={viewer}
                setIsOpen={setIsOpen}
              />
            ) : selectedOption === "mode" ? (
              <ModeMeanu
                slide={slide}
                setIsMultiview={setIsMultiview}
                tile={tile}
                setShowNormalisation={setShowNormalisation}
                showNormalisation={showNormalisation}
                setSlideName2={setSlideName2}
                setSlideName={setSlideName}
                setCurrentViewer={setCurrentViewer}
                viewerId={viewerId}
                editView={editView}
                targetAnnotation={targetAnnotation}
                viewerIds={viewerIds}
                setEditView={setEditView}
                setNormalizeDefault={setNormalizeDefault}
                application={application}
                setShowRightPanel={setShowRightPanel}
                setBase64URL={setBase64URL}
                setIsNavigatorActive={setIsNavigatorActive}
                // setShowRightPanel={setShowRightPanel}
              />
            ) : (
              <Flex w="100%" h="95%" pb="25px" bgColor="#FCFCFC" p="5px">
                <Timeline
                  application={application}
                  timelineData={timelineData}
                  viewerId={viewerId}
                />
              </Flex>
            )}
          </Flex>
        </Flex>
      </motion.div>
    </Box>
  );
}

export default FunctionsMenu;
