import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Tooltip,
  useDisclosure,
  useMediaQuery,
  VStack,
  Text,
  HStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
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
} from "../Icons/CustomIcons";
import SlidesMenu from "./slidesMenu";
import { useFabricOverlayState } from "../../state/store";
import Studies from "../Sidebar/studies";
import ActivityFeed from "../Feed/activityFeed";
import CommentFeed from "../Feed/CommentFeed";
import ShowReport from "../Toolbar/ShowReport";
import SynopticReport from "../SynopticReport/SynopticReport";
import Report from "../Report/Report";
import Timeline from "./timeline";

const FunctionsMenu = ({
  caseInfo,
  slides,
  viewerId,
  setIsMultiview,
  setIsNavigatorActive,
  isNavigatorActive,
  isMultiview,
  slide,
  userInfo,
  isXmlAnnotations,
  application,
  saveReport,
  saveSynopticReport,
  mediaUpload,
  slideInfo,
  handleReport,
  showReport,
  setShowReport,
  questions,
  app,
  setSlideId,
  responseHandler,
  questionnaireResponse,
  synopticType,
  setSynopticType,
  getSynopticReport,
  updateSynopticReport,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ifWidthLessthan1920] = useMediaQuery("(max-width:1920px)");
  const [selectedOption, setSelectedOption] = useState("slides");
  const { fabricOverlayState } = useFabricOverlayState();
  const { viewerWindow } = fabricOverlayState;
  const { tile, slideId } = viewerWindow[viewerId];
  const [reportData, setReportData] = useState({
    clinicalStudy: "",
    grossDescription: "",
    microscopicDescription: "",
    impression: "",
    advice: "",
    annotedSlides: "",
  });
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

  return (
    <Box
      pos="absolute"
      right={0}
      background="rgba(217, 217, 217, 0.3)"
      zIndex={10}
      h={ifWidthLessthan1920 ? "calc(100vh - 92px)" : "calc(100vh - 10.033vh)"}
    >
      <motion.div
        animate={{
          width: isOpen
            ? ifWidthLessthan1920
              ? selectedOption === "report"
                ? "35vw"
                : "350px"
              : selectedOption === "report"
              ? "40vw"
              : "18vw"
            : "70px",
        }}
        style={{
          background: "rgba(217, 217, 217, 0.5)",
          overflow: "hidden",
          whiteSpace: "nowrap",
          position: "absolute",
          right: "0",
          height: "100%",
          top: "0",
        }}
      >
        <Flex>
          <Flex direction="column">
            <Button
              onClick={() => setIsOpen(!isOpen)}
              w="70px"
              borderRadius={0}
              background="rgba(246, 246, 246,0.5)"
              box-shadow="0px 4px 7px rgba(0, 0, 0, 0.05)"
              _hover={{ bgColor: "rgba(246, 246, 246,0.5)" }}
            >
              {isOpen ? ">>" : "<<"}
            </Button>
            <Tooltip label="View slides">
              <Button
                height="73px"
                w="73px"
                borderRadius={0}
                background="#F6F6F6"
                box-shadow="0px 4px 7px rgba(0, 0, 0, 0.05)"
                onClick={() => {
                  setSelectedOption("slides");
                  setIsOpen(true);
                }}
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
            <Tooltip label="View timeline">
              <Button
                height="73px"
                w="73px"
                borderRadius={0}
                background="#F6F6F6"
                box-shadow="0px 4px 7px rgba(0, 0, 0, 0.05)"
                onClick={() => setSelectedOption("timeline")}
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
            <Tooltip label="View annotations">
              <Button
                height="73px"
                w="73px"
                borderRadius={0}
                background="#F6F6F6"
                box-shadow="0px 4px 7px rgba(0, 0, 0, 0.05)"
                onClick={() => setSelectedOption("annotations")}
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
            <Tooltip label="View comments">
              <Button
                height="73px"
                w="73px"
                borderRadius={0}
                background="#F6F6F6"
                box-shadow="0px 4px 7px rgba(0, 0, 0, 0.05)"
                onClick={() => setSelectedOption("comments")}
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
            <Tooltip label="View slide info">
              <Button
                height="73px"
                w="73px"
                borderRadius={0}
                background="#F6F6F6"
                box-shadow="0px 4px 7px rgba(0, 0, 0, 0.05)"
                onClick={() => setSelectedOption("information")}
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
            <Tooltip label="Report slide">
              <Button
                height="73px"
                w="73px"
                borderRadius={0}
                background="#F6F6F6"
                box-shadow="0px 4px 7px rgba(0, 0, 0, 0.05)"
                onClick={() => setSelectedOption("report")}
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
          </Flex>
          <Flex
            w="100%"
            h={
              ifWidthLessthan1920
                ? "calc(100vh - 92px)"
                : "calc(100vh - 10.033vh)"
            }
          >
            {selectedOption === "slides" ? (
              <SlidesMenu
                caseInfo={caseInfo}
                slides={slides}
                viewerId={viewerId}
                tile={tile}
                setIsNavigatorActive={setIsNavigatorActive}
              />
            ) : selectedOption === "information" ? (
              <Flex w="100%" bg="#FCFCFC">
                <Studies caseInfo={caseInfo} slideInfo={slide} />
              </Flex>
            ) : selectedOption === "annotations" ? (
              <ActivityFeed
                userInfo={userInfo}
                isXmlAnnotations={isXmlAnnotations}
                viewerId={viewerId}
              />
            ) : selectedOption === "comments" ? (
              <CommentFeed viewerId={viewerId} />
            ) : selectedOption === "report" ? (
              <Flex w="100%" h="100%" direction="column" bgColor="#FCFCFC">
                <Flex w="100%" direction="row" p="5px 5px 0px 20px">
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
                    showReport={showReport}
                    setShowReport={setShowReport}
                    userInfo={userInfo}
                    questions={questions}
                    app={app}
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
                </Flex>
                <Flex>
                  {showReport ? (
                    <Report
                      userInfo={userInfo}
                      handleReport={handleReport}
                      report={showReport}
                      reportData={reportData}
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
            ) : (
              <Flex w="100%" h="100%" bgColor="#FCFCFC" p="5px">
                <Timeline />
              </Flex>
            )}
          </Flex>
        </Flex>
      </motion.div>
    </Box>
  );
};

export default FunctionsMenu;