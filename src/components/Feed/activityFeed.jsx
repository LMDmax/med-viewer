import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useMutation, useSubscription } from "@apollo/client";
import { BsEye, BsEyeSlash, BsCircle, BsSlash } from "react-icons/bs";

import {
  Box,
  Flex,
  HStack,
  Text,
  Icon,
  useDisclosure,
  useMediaQuery,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  Tooltip,
  TabPanel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Circle,
  IconButton,
} from "@chakra-ui/react";
import { BiRectangle } from "react-icons/bi";

import { FaDrawPolygon } from "react-icons/fa";
import { GrFormClose } from "react-icons/gr";
import { MdModeEditOutline, MdDelete, MdTextsms } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { AiFillCaretRight, AiFillCaretDown } from "react-icons/ai";
import { RiCheckboxBlankLine, RiCheckboxBlankFill } from "react-icons/ri";
import { GroupTil } from "../Icons/CustomIcons";

import {
  DELETE_ANNOTATION,
  UPDATE_ANNOTATION,
  VHUT_ANALYSIS_SUBSCRIPTION,
} from "../../graphql/annotaionsQuery";
import useCanvasHelpers from "../../hooks/use-fabric-helpers";
import { useFabricOverlayState } from "../../state/store";
import { updateAnnotationInDB } from "../../utility";
import DeleteConfirmation from "../Annotations/DeleteConfirmation";
import ScrollBar from "../ScrollBar";
import EditText from "./editText";

const EditTextButton = ({ feed, handleEditClick, ...restProps }) => {
  return (
    <Icon
      as={MdModeEditOutline}
      cursor="pointer"
      onClick={() => handleEditClick(feed)}
      {...restProps}
    />
  );
};
const CardDetailsRow = ({ title, value, ...restProps }) => {
  return (
    <HStack
      py="8px"
      marginStart="18px"
      borderBottom="1px solid #F6F6F6"
      pb="0.5vw"
      {...restProps}
    >
      <Text minW="35%">{title}:</Text>
      <Text>{value}</Text>
    </HStack>
  );
};
const CustomTab = ({ title, ...props }) => {
  return (
    <Tab
      {...props}
      fontSize="12px"
      lineHeight="15px"
      letterSpacing="0.005em"
      fontWeight="400"
      background="#FFFFFF"
      _selected={{
        background: "#FCFCFC",
        boxShadow: "inset 0px 1px 2px rgba(0, 0, 0, 0.05)",
        border: "none",
        outline: "none",
        color: "#3B5D7C",
        fontWeight: "500",
      }}
      _disabled={{ background: "#FFFFFF90", cursor: "not-allowed" }}
      flex="1"
      p="8px"
    >
      {title}
    </Tab>
  );
};

const CustomTabPanel = ({
  children,
  title,
  annotation,
  totalCells,
  ...props
}) => {
  return (
    <TabPanel {...props} px={0} py="8px">
      <Text
        py="12px"
        px="18px"
        bg="#FFFFFF"
        fontSize="14px"
        lineHeight="17px"
        letterSpacing="0.0025em"
        fontWeight="400"
      >
        {title}
      </Text>
      {children ? (
        <Flex flexDir="column" minH="0px" h="fit-content">
          <ScrollBar>
            <Flex flexDir="column" pb="85px">
              {children}
            </Flex>
          </ScrollBar>
        </Flex>
      ) : null}
    </TabPanel>
  );
};

const MotionBox = motion(Box);

const ActivityFeed = ({
  userInfo,
  viewerId,
  totalCells,
  hideTumor,
  setHideTumor,
  hideLymphocyte,
  setHideLymphocyte,
  setHideStroma,
  hideStroma,
  handlePopup,
  setSelectedOption,
  popup,
  tumorArea,
  stromaArea,
  lymphocyteCount,
  showFeedBar,
  tilScore,
  isXmlAnnotations,
  activeObject,
  searchSelectedData,
}) => {
  // const onUpdateAnnotation = (data) => {
  //   console.log("activityfeed", data);
  // };
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const [isTILBoxVisible, setIsTilBoxVisible] = useState(false);
  const [visibleTumor, setVisibleTumor] = useState(true);
  const [visibleStroma, setVisibleStroma] = useState(true);
  const [visibleLymphocyte, setVisibleLymphocyte] = useState(true);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [
    modifyAnnotation,
    { data: updatedData, error: updateError, loading: updateLoading },
  ] = useMutation(UPDATE_ANNOTATION);

  const onUpdateAnnotation = (data) => {
    // console.log("====================================");
    // console.log("activity feed update");
    // console.log("====================================");
    delete data?.slideId;
    modifyAnnotation({
      variables: { body: { ...data } },
    });
  };

  const [removeAnnotation, { data: deletedData, error: deleteError }] =
    useMutation(DELETE_ANNOTATION);
  if (deleteError)
    toast({
      title: "Annotation could not be deleted",
      description: "server error",
      status: "error",
      duration: 1000,
      isClosable: true,
    });
  const onDeleteAnnotation = (data) => {
    // console.log("====================================");
    // console.log("activity feed delete", data);
    // console.log("====================================");
    removeAnnotation({ variables: { body: data } });
  };

  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { activeTool, viewerWindow } = fabricOverlayState;
  const { fabricOverlay, activityFeed, viewer, tile, slideId } =
    viewerWindow[viewerId];
  const { deleteAllAnnotations } = useCanvasHelpers(viewerId);

  const scrollbar = useRef(null);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isDeleteConfirmationOpen,
    onClose: onDeleteConfirmationClose,
    onOpen: onDeleteConfirmationOpen,
  } = useDisclosure();

  const [annotationObject, setAnnotationObject] = useState(null);
  const [annotationDetails, setAnnotationsDetails] = useState(null);
  const [ifScreenlessthan1660px] = useMediaQuery("(max-width:1660px)");
  const [ki67Feed, setKi67Feed] = useState({});
  const [accordionState, setAccordionState] = useState(
    activityFeed.map(() => ({ isOpen: false, isFocused: false }))
  );

  useEffect(() => {
    if (scrollbar.current) scrollbar.current.scrollToBottom();
    if (activityFeed.length === 0) setAnnotationsDetails(null);
  }, [activityFeed]);

  // console.log(activeObject);

  useEffect(() => {
    if (isTILBoxVisible) {
    }
    if (annotationDetails) {
    }
  }, [isTILBoxVisible, annotationDetails]);

  useEffect(() => {
    return () => {
      setAnnotationObject(null);
      setAnnotationsDetails(null);
    };
  }, []);

  useEffect(() => {
    setAnnotationObject(null);
    setAnnotationsDetails(null);
  }, [tile]);

  const handleClick = (feed, index) => {
    // console.log(feed,index);
    const newAccordionState = [...accordionState];
    newAccordionState[index].isOpen = !newAccordionState[index].isOpen;
    newAccordionState[index].isFocused = true;
    setAccordionState(newAccordionState);
    setSelectedItemIndex(index);
    if (selectedItemIndex === index) {
      setSelectedItemIndex("");
    }
    if (feed.object.roiType === "KI67") {
      setKi67Feed(feed);
      // console.log(ki67Feed);
    }
    if (feed.object.roiType !== "KI67") {
      setKi67Feed({});
    }
    if (!feed.object || !feed.object?.visible) return;
    const canvas = fabricOverlay.fabricCanvas();

    if (feed?.object?.type !== "viewport") {
      canvas.setActiveObject(feed?.object);
    }
    // change position to annotation object location
    // except for when MagicWand tool is activated
    if (activeTool !== "MagicWand") {
      const { zoomLevel, left, top, width, height } = feed.object;
      if (isXmlAnnotations) {
        viewer.viewport.zoomTo(zoomLevel * 2.2);
      } else {
        viewer.viewport.zoomTo(zoomLevel);
      }
      // get viewport point of middle of selected annotation
      const vpoint = viewer.viewport.imageToViewportRectangle(
        left + width / 2,
        top + height / 2
      );
      viewer.viewport.panTo(vpoint);
    }
    canvas.requestRenderAll();
    setAnnotationsDetails(feed.object);
  };
  // on annotation click
  useEffect(() => {
    if (searchSelectedData) {
      setAnnotationsDetails(searchSelectedData);
    } else {
      setAnnotationsDetails(activeObject);
    }
  }, [activeObject, searchSelectedData]);

  const handleSave = ({ text, title }) => {
    annotationObject.text = text;
    annotationObject.title = title;

    updateAnnotationInDB({
      slideId,
      hash: annotationObject.hash,
      updateObject: { text, title },
      onUpdateAnnotation,
    });
    setAnnotationObject(null);
    onClose();
    window.location.reload();
  };

  const handleEditClick = (feed) => {
    setAnnotationObject(feed.object);
    onOpen();
  };

  const deleteAnnotations = () => {
    deleteAllAnnotations(onDeleteAnnotation);
    onDeleteConfirmationClose();
  };

  useEffect(() => {
    if (isTILBoxVisible) {
      //   setAnnotationsDetails(null);
      setSelectedItemIndex("til");
    }
  }, [isTILBoxVisible, annotationDetails]);
  // console.log(activityFeed);
  return (
    <Flex
      as="section"
      w="100%"
      h="86vh"
      pb="30px"
      margin={0}
      right="0"
      zIndex={2}
      background="#FCFCFC"
      boxShadow="-1px 0px 2px rgba(176, 200, 214, 0.3)"
      direction="column"
      pr="2px"
    >
      <Flex
        direction="column"
        marginStart="0.8vw"
        pt="2px"
        overflowY="auto"
        flex="1"
      >
        <HStack justify="space-between">
          <Text fontSize="1rem" pb="3px">
            Annotation List
          </Text>
          {!isXmlAnnotations && (
            <IconButton
              icon={<MdDelete size={18} />}
              size="sm"
              variant="unstyled"
              cursor="pointer"
              isDisabled={activityFeed.length === 0}
              _focus={{ border: "none", outline: "none" }}
              onClick={onDeleteConfirmationOpen}
            />
          )}
        </HStack>
        <ScrollBar>
          <Flex direction="column" h="80vh">
            {activityFeed.map((feed, index) => {
              return feed?.object && feed.object?.type !== "textbox" ? (
                <Accordion key={index} allowToggle allowMultiple>
                  <AccordionItem
                    key={feed.object.hash}
                    onClose={() =>
                      setAccordionState((prevAccordionState) =>
                        prevAccordionState.map((state, i) =>
                          i === index ? { ...state, isOpen: false } : state
                        )
                      )
                    }
                  >
                    <h2>
                      <AccordionButton
                        pl="0"
                        _focus={{ outline: "none" }}
                        style={{
                          fontWeight:
                            selectedItemIndex === index ||
                            feed.object.hash === activeObject?.hash
                              ? "bold"
                              : "normal",
                        }}
                        onClick={() => handleClick(feed, index)}
                      >
                        <Flex
                          w="100%"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Flex>
                            <Box mr="1.2vw" mt="2px">
                              {accordionState[index]?.isOpen ? (
                                <AiFillCaretDown color="#3B5D7C" />
                              ) : (
                                <AiFillCaretRight color="gray" />
                              )}
                            </Box>
                            <Box>
                              <Flex
                                alignItems="center"
                                justifyContent="space-between"
                              >
                                {feed.object?.type === "rect" ? (
                                  <BiRectangle color="#E23636" />
                                ) : feed.object?.type === "polygon" ? (
                                  <FaDrawPolygon color="#E23636" />
                                ) : feed.object?.type === "ellipse" ? (
                                  <BsCircle color="#E23636" />
                                ) : (
                                  <BsSlash color="#E23636" />
                                )}
                                <Text ml="0.8vw">
                                  {feed.object?.title
                                    ? feed.object.title
                                    : feed.object?.roiType === "morphometry"
                                    ? `ROI ${index + 1}`
                                    : feed.object?.roiType === "KI67"
                                    ? `ROI ${index + 1}`
                                    : feed.object?.type === "viewport"
                                    ? `Viewport ${index + 1}`
                                    : `Annotation ${index + 1}`}
                                </Text>
                              </Flex>
                            </Box>
                          </Flex>
                          {!isXmlAnnotations && (
                            <EditTextButton
                              feed={feed}
                              handleEditClick={handleEditClick}
                              mr={2}
                            />
                          )}
                        </Flex>
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={2}>
                      {annotationDetails ? (
                        <Accordion allowToggle>
                          <AccordionItem>
                            <h3>
                              <AccordionButton>
                                Annotation Values
                              </AccordionButton>
                            </h3>
                            <AccordionPanel pb={4}>
                              {annotationDetails ? (
                                <>
                                  <CardDetailsRow
                                    title="Annotation"
                                    value={
                                      annotationDetails?.type
                                        ? annotationDetails.type
                                        : "-"
                                    }
                                  />
                                  <CardDetailsRow
                                    title="Description"
                                    value={
                                      annotationDetails?.text
                                        ? annotationDetails.text
                                        : "-"
                                    }
                                  />

                                  {annotationDetails?.area ? (
                                    <>
                                      <CardDetailsRow
                                        title="Class"
                                        value={annotationDetails?.classType}
                                      />
                                      <CardDetailsRow
                                        title="Perimeter"
                                        value={
                                          <>
                                            {annotationDetails.perimeter.toFixed(
                                              2
                                            )}
                                          </>
                                        }
                                      />
                                      <CardDetailsRow
                                        title="Area"
                                        value={annotationDetails.area}
                                      />
                                    </>
                                  ) : null}
                                </>
                              ) : null}
                            </AccordionPanel>
                          </AccordionItem>
                          <AccordionItem>
                            <h2>
                              {annotationDetails?.analysedData ? (
                                <AccordionButton
                                  isDisabled={!annotationDetails?.analysedData}
                                >
                                  {ki67Feed?.object
                                    ? "KI - 67 Analysis"
                                    : "Morphometry values"}
                                </AccordionButton>
                              ) : null}
                            </h2>
                            <AccordionPanel pb={4}>
                              {annotationDetails.analysedData &&
                              annotationDetails.analysedData.data.length > 0 &&
                              !ki67Feed?.object ? (
                                <>
                                  {annotationDetails.analysedData.data.map(
                                    (cell) => {
                                      return (
                                        <Accordion allowToggle>
                                          <AccordionItem
                                            key={uuidv4()}
                                            color="black"
                                            isDisabled={
                                              cell.status !== "detected"
                                            }
                                          >
                                            <h2>
                                              <AccordionButton
                                                _focus={{ outline: "none" }}
                                              >
                                                <HStack
                                                  flex="1"
                                                  textAlign="left"
                                                  align="center"
                                                >
                                                  <Text fontSize="14px">
                                                    {cell.type}
                                                  </Text>
                                                  {cell.status ===
                                                  "detected" ? (
                                                    <Circle
                                                      size="12px"
                                                      bg={cell.color}
                                                    />
                                                  ) : null}
                                                </HStack>
                                                <AccordionIcon />
                                              </AccordionButton>
                                            </h2>
                                            {cell.status === "detected" ? (
                                              <AccordionPanel pb={4}>
                                                <CardDetailsRow
                                                  title="Nucleus Count"
                                                  value={cell.count}
                                                />
                                                <CardDetailsRow
                                                  title="Min. Perimeter"
                                                  value={
                                                    <>
                                                      {cell.min_perimeter.toFixed(
                                                        2
                                                      )}
                                                    </>
                                                  }
                                                />
                                                <CardDetailsRow
                                                  title="Max. Perimeter"
                                                  value={
                                                    <>
                                                      {cell.max_perimeter.toFixed(
                                                        2
                                                      )}
                                                    </>
                                                  }
                                                />
                                                <CardDetailsRow
                                                  title="Avg. Perimeter"
                                                  value={
                                                    <>
                                                      {cell.avg_perimeter.toFixed(
                                                        2
                                                      )}
                                                    </>
                                                  }
                                                />
                                                <CardDetailsRow
                                                  title="Min. Area"
                                                  value={
                                                    <>
                                                      {cell.min_area.toFixed(2)}
                                                    </>
                                                  }
                                                />
                                                <CardDetailsRow
                                                  title="Max. Area"
                                                  value={
                                                    <>
                                                      {cell.max_area.toFixed(2)}
                                                    </>
                                                  }
                                                />
                                                <CardDetailsRow
                                                  title="Avg. Area"
                                                  value={
                                                    <>
                                                      {cell.avg_area.toFixed(2)}
                                                    </>
                                                  }
                                                />
                                              </AccordionPanel>
                                            ) : null}
                                          </AccordionItem>
                                        </Accordion>
                                      );
                                    }
                                  )}
                                </>
                              ) : (
                                <Flex flexDir="column" w="30px" h="100%">
                                  <Flex
                                    w="10%"
                                    mt="10px"
                                    h="35%"
                                    justifyContent="space-between"
                                    alignItems="flex-start"
                                    direction="column"
                                  >
                                    <Flex
                                      justifyContent="flex-start"
                                      px="18px"
                                      alignItems="center"
                                      w="100%"
                                    >
                                      <Circle size="10px" bg="#BB4139" />
                                      <Text ml="5px">Positive Cells</Text>
                                    </Flex>
                                    <Flex
                                      justifyContent="flex-start"
                                      px="18px"
                                      alignItems="center"
                                      w="100%"
                                    >
                                      <Circle size="10px" bg="#17478D" />

                                      <Text ml="5px">Negative Cells</Text>
                                    </Flex>
                                  </Flex>
                                  <Box w="10%" h="90px" mt="15px">
                                    <Text
                                      borderBottom="1px solid #C0C0C0"
                                      py="5px"
                                    >
                                      <span as="b">Positive Count :</span>
                                      {ki67Feed?.object?.analysedData?.num_positive
                                        }
                                    </Text>
                                    <Text
                                      borderBottom="1px solid #C0C0C0"
                                      py="5px"
                                    >
                                      <span as="b">Negative Count :</span>
                                      {
                                        ki67Feed?.object?.analysedData
                                          ?.num_negative
                                      }
                                    </Text>
                                    <Text
                                      borderBottom="1px solid #C0C0C0"
                                      py="5px"
                                    >
                                      <span as="b">Proliferation Score :</span>
                                      {
                                        ki67Feed?.object?.analysedData
                                          ?.proliferation_score?.toString()
                                          .substring(0, 4)
                                      }
                                    </Text>
                                  </Box>
                                </Flex>
                              )}
                            </AccordionPanel>
                          </AccordionItem>
                        </Accordion>
                      ) : null}
                    </AccordionPanel>
                  </AccordionItem>
                  <AccordionItem></AccordionItem>
                </Accordion>
              ) : null;
            })}

            {localStorage.getItem("til") ? (
              <Box my="10px" cursor="pointer">
                <Flex
                  w="40%"
                  onClick={() => setIsTilBoxVisible(!isTILBoxVisible)}
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <Box mr="6px">
                    {isTILBoxVisible ? (
                      <AiFillCaretDown color="#3B5D7C" />
                    ) : (
                      <AiFillCaretRight color="gray" />
                    )}
                  </Box>
                  <Box ml="18px">
                    <GroupTil />
                  </Box>
                  <Text
                    ml="0.8vw"
                    style={{
                      fontWeight:
                        selectedItemIndex === "til" ? "bold" : "normal",
                    }}
                  >
                    TIL Analysis
                  </Text>
                </Flex>
                {isTILBoxVisible && (
                  <MotionBox
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    h="fit-content"
                    w="100%"
                    mt={2}
                    //   onClick={handleBoxClick}
                  >
                    <Flex
                      borderBottom="1px solid lightgray"
                      my="0"
                      ml="50px"
                      alignItems="center"
                    >
                      <RiCheckboxBlankFill color="#cce6cc" />
                      <Text ml="5px">Tumor</Text>
                      <Flex
                        alignItems="flex-end"
                        justifyContent="flex-end"
                        w="100%"
                      >
                        <Tooltip
                          label={
                            !visibleTumor
                              ? "Click to enable tumor"
                              : "Click to disable tumor"
                          }
                          placement="left"
                          hasArrow
                        >
                          <IconButton
                            width={ifScreenlessthan1536px ? "30px" : "40px"}
                            size={ifScreenlessthan1536px ? 60 : 0}
                            height={ifScreenlessthan1536px ? "26px" : "34px"}
                            icon={
                              !visibleTumor ? (
                                <BsEyeSlash color="#151C25" />
                              ) : (
                                <BsEye color="#3b5d7c" />
                              )
                            }
                            _active={{
                              bgColor: "none",
                              outline: "none",
                            }}
                            _focus={{
                              border: "none",
                            }}
                            _hover={{ bgColor: "none" }}
                            bg="transparent"
                            borderRadius={0}
                            onClick={() => {
                              setHideTumor(!hideTumor);
                              setHideStroma(false);
                              setHideLymphocyte(false);
                              setVisibleTumor(!visibleTumor);
                              setVisibleStroma(true);
                              setVisibleLymphocyte(true);
                            }}
                          />
                        </Tooltip>
                      </Flex>
                    </Flex>
                    <Flex
                      borderBottom="1px solid lightgray"
                      my="0"
                      ml="50px"
                      alignItems="center"
                    >
                      <RiCheckboxBlankFill color="#f7d66e" />
                      <Text ml="5px">Stroma</Text>
                      <Flex
                        alignItems="flex-end"
                        justifyContent="flex-end"
                        w="100%"
                      >
                        <Tooltip
                          label={
                            !visibleStroma
                              ? "Click to enable stroma"
                              : "Click to disable stroma"
                          }
                          placement="left"
                          hasArrow
                        >
                          <IconButton
                            width={ifScreenlessthan1536px ? "30px" : "40px"}
                            size={ifScreenlessthan1536px ? 60 : 0}
                            height={ifScreenlessthan1536px ? "26px" : "34px"}
                            icon={
                              !visibleStroma ? (
                                <BsEyeSlash color="#151C25" />
                              ) : (
                                <BsEye color="#3b5d7c" />
                              )
                            }
                            _active={{
                              bgColor: "none",
                              outline: "none",
                            }}
                            _focus={{
                              border: "none",
                            }}
                            _hover={{ bgColor: "none" }}
                            backgroundColor="transparent"
                            borderRadius={0}
                            onClick={() => {
                              setHideStroma(!hideStroma);
                              setHideLymphocyte(false);
                              setHideTumor(false);
                              setVisibleStroma(!visibleStroma);
                              setVisibleLymphocyte(true);
                              setVisibleTumor(true);
                            }}
                          />
                        </Tooltip>
                      </Flex>
                    </Flex>
                    <Flex my="0" ml="50px" alignItems="center">
                      <RiCheckboxBlankLine color="red" />
                      <Text ml="5px">Lymphocytes</Text>
                      <Flex
                        alignItems="flex-end"
                        justifyContent="flex-end"
                        w="100%"
                      >
                        <Tooltip
                          label={
                            !visibleLymphocyte
                              ? "Click to enable Lymphocytes"
                              : "Click to disable Lymphocytes"
                          }
                          placement="left"
                          hasArrow
                        >
                          <IconButton
                            width={ifScreenlessthan1536px ? "30px" : "40px"}
                            size={ifScreenlessthan1536px ? 60 : 0}
                            height={ifScreenlessthan1536px ? "26px" : "34px"}
                            icon={
                              !visibleLymphocyte ? (
                                <BsEyeSlash color="#151C25" />
                              ) : (
                                <BsEye color="#3b5d7c" />
                              )
                            }
                            _active={{
                              bgColor: "none",
                              outline: "none",
                            }}
                            _focus={{
                              border: "none",
                            }}
                            _hover={{ bgColor: "none" }}
                            bg="transparent"
                            borderRadius={0}
                            onClick={() => {
                              setHideLymphocyte(!hideLymphocyte);
                              setHideStroma(false);
                              setHideTumor(false);
                              setVisibleLymphocyte(!visibleLymphocyte);
                              setVisibleTumor(true);
                              setVisibleStroma(true);
                            }}
                          />
                        </Tooltip>
                      </Flex>
                    </Flex>
                    <Box w="100%" mx="25px" my="10px" textAlign="left">
                      <Text color="#3B5D7C">TIL Values</Text>
                    </Box>
                    <Box px="25px">
                      {/* <Text mb="10px" borderBottom="1px solid lightgray">
                        TIL Score : {tilScore}
                      </Text> */}
                      {/* <Text mb="10px">
                        TIL Formula : <br /> (Lymphocyte Area / Stroma Area) *
                        100
                      </Text> */}
                      <Text
                        mb="10px"
                        borderTop="1px solid lightgray"
                        borderBottom="1px solid lightgray"
                      >
                        Tumor Area : {tumorArea}
                      </Text>
                      <Text mb="10px" borderBottom="1px solid lightgray">
                        Stroma Area : {stromaArea}
                      </Text>
                      <Text borderBottom="1px solid lightgray">
                        Lymphocytes Count : {lymphocyteCount}
                      </Text>
                    </Box>
                  </MotionBox>
                )}
              </Box>
            ) : null}
          </Flex>
        </ScrollBar>
      </Flex>

      <EditText
        isOpen={isOpen}
        onClose={onClose}
        textValue={annotationObject?.text ? annotationObject.text : ""}
        titleValue={annotationObject?.title ? annotationObject.title : ""}
        handleClose={onClose}
        handleSave={handleSave}
      />
      <DeleteConfirmation
        isOpen={isDeleteConfirmationOpen}
        onClose={onDeleteConfirmationClose}
        handleConfirmation={deleteAnnotations}
        type="annotations"
      />
    </Flex>
  );
};

export default ActivityFeed;
