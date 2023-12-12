import React, { useState, useRef, useEffect } from "react";

import { useLazyQuery, useMutation, useSubscription } from "@apollo/client";
import { BsArrowRepeat } from "react-icons/bs";
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
  useToast,
  Collapse,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  AiFillCaretRight,
  AiFillCaretDown,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { BiRectangle, BiText } from "react-icons/bi";
import { AiOutlinePlusCircle } from "react-icons/ai";
import {
  BsEye,
  BsEyeSlash,
  BsCircle,
  BsSlash,
  BsPlusLg,
  BsArrowUpLeft,
} from "react-icons/bs";
import { FaDrawPolygon } from "react-icons/fa";
import { GrFormClose } from "react-icons/gr";
import {
  MdModeEditOutline,
  MdDelete,
  MdTextsms,
  MdOutlineFontDownload,
  MdOutlineFontDownloadOff,
} from "react-icons/md";
import { RiCheckboxBlankLine, RiCheckboxBlankFill } from "react-icons/ri";
import { v4 as uuidv4 } from "uuid";

import {
  DELETE_ANNOTATION,
  UPDATE_ANNOTATION,
  HITL_INPUT,
  VHUT_ANALYSIS_SUBSCRIPTION,
  GET_LOCAL_REGION_SUBS,
  GET_ALL_LOCAL_REGIONS,
} from "../../graphql/annotaionsQuery";
import useCanvasHelpers from "../../hooks/use-fabric-helpers";
import { useFabricOverlayState } from "../../state/store";
import {
  createAnnotation,
  getFileBucketFolder,
  updateAnnotationInDB,
} from "../../utility";
import DeleteConfirmation from "../Annotations/DeleteConfirmation";
import { GroupTil } from "../Icons/CustomIcons";
import ScrollBar from "../ScrollBar";
import EditText from "./editText";

function EditTextButton({ feed, handleEditClick, ...restProps }) {
  return (
    <Icon
      as={MdModeEditOutline}
      cursor="pointer"
      onClick={() => handleEditClick(feed)}
      {...restProps}
    />
  );
}
function CardDetailsRow({ title, value, ...restProps }) {
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
}
function CustomTab({ title, ...props }) {
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
}

function CustomTabPanel({ children, title, annotation, totalCells, ...props }) {
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
}

const MotionBox = motion(Box);

const AnnotationFeed = ({
  userInfo,
  viewerId,
  totalCells,
  gleasonScoring,
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
  gleasonScoringData,
  selectedPattern,
  setSelectedPattern,
  pattern3Color,
  pattern4Color,
  pattern5Color,
  benignColor,
  tumorColor,
  stromaColor,
  lymphocyteColor,
  setLoadUI,
  maskAnnotationData,
  setToolSelected,
  viewerIds,
  setAddLocalRegion,
  addLocalRegion,
}) => {
  // console.log("lymphocyteColor", lymphocyteColor);
  // const onUpdateAnnotation = (data) => {
  //   console.log("annotationFeed", data);
  // };
  // console.log("ON", selectedPattern);
  const toast = useToast();
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const [isTILBoxVisible, setIsTilBoxVisible] = useState(false);
  const [localRegionsAnnotations, setLocalRegionsAnnotations] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);

  const [onHITLInput, { data: analysis_data, error: analysis_error }] =
    useMutation(HITL_INPUT);
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
    // console.log("activity feed delete", deletedData);
    // console.log("====================================");
    removeAnnotation({ variables: { body: data } });
    setTimeout(function () {
      window.location.reload();
    }, 2000);
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
  const canvas = fabricOverlay.fabricCanvas();
  const [annotationObject, setAnnotationObject] = useState(null);
  const [hideDescription, setHideDescription] = useState(false);
  const [allLocalRegionAnnotations, setAllLocalRegionAnnotations] = useState(
    []
  );
  const [annotationDetails, setAnnotationsDetails] = useState(null);
  const [ifScreenlessthan1660px] = useMediaQuery("(max-width:1660px)");
  const [ki67Feed, setKi67Feed] = useState({});
  const [collapseStates, setCollapseStates] = useState({
    grade1: false,
    grade2: false,
    grade3: false,
    grade4: false,
  });

  const annotationFeed = activityFeed?.filter(
    (eachAnnotation) =>
      eachAnnotation.object.type !== "textbox" &&
      eachAnnotation.addLocalRegion !== true
  );
  // set description text and visibility
  const textObjects = canvas
    .getObjects()
    .filter((obj) => obj?.type === "textbox");
  const textObjectsData = textObjects?.map((object) => {
    return {
      [object?.text]: object?.visible,
    };
  });
  const mergedObject = Object.assign({}, ...textObjectsData);
  const [descriptionData, setDescriptionData] = useState(mergedObject);
  //
  const [accordionState, setAccordionState] = useState(
    annotationFeed.map(() => ({ isOpen: false, isFocused: false }))
  );

  const { data: Local_region, error: subscription_error } = useSubscription(
    GET_LOCAL_REGION_SUBS,
    {
      variables: {
        body: {
          slideId,
        },
      },
      fetchPolicy: "network-only", // Set the fetchPolicy to 'no-cache'
    }
  );

  const [checkTils, { data, loading, error, refetch }] = useLazyQuery(
    GET_ALL_LOCAL_REGIONS
  );

  useEffect(() => {
    const fetchData = async () => {
      await checkTils({
        variables: {
          query: slideId,
        },
        fetchPolicy: "network-only",
      });
    };

    fetchData(); // Initial fetch

    return () => {
      // Cleanup function to prevent memory leaks
      // You can cancel subscriptions or perform other cleanup here if needed
    };
  }, [checkTils, slideId]);

  useEffect(() => {
    if (Local_region && Local_region?.localTilStatus?.status === "success") {
      checkTils({
        variables: {
          query: slideId,
        },
        fetchPolicy: "network-only",
      });
      setToolSelected("Local_Region_Added");
    }
  }, [Local_region, checkTils, slideId]);

  useEffect(() => {
    if (data) {
      // setLoadUI(true);
      setIsTilBoxVisible(false);
      const infoList = data?.checkTils?.data?.info_list || [];
      setAllLocalRegionAnnotations(infoList);
      setTimeout(() => {
        setIsTilBoxVisible(true);
        setLoadUI(true);
      }, 3000);
    }
  }, [data, setAllLocalRegionAnnotations]);

  useEffect(() => {
    const canvas = fabricOverlay.fabricCanvas();
    if (allLocalRegionAnnotations.length > 0 && isTILBoxVisible) {
      let shape;
      allLocalRegionAnnotations.forEach((eachAnnotation) => {
        shape = createAnnotation(eachAnnotation.annotation);
        shape.set({ selectable: false });
        canvas.add(shape);
      });
    }
    if (allLocalRegionAnnotations.length > 0 && !isTILBoxVisible) {
      const allAnnotations = canvas?.getObjects();
      const filteredAnnotations = allAnnotations?.filter(
        (annotation) => annotation?.addLocalRegion === true
      );
      filteredAnnotations?.forEach((obj) => {
        // console.log(obj);
        canvas?.remove(obj);
      });
    }
  }, [allLocalRegionAnnotations, isTILBoxVisible, data]);

  // console.log({ localRegionsAnnotations });

  useEffect(() => {
    if (localRegionsAnnotations !== null) {
      let shape;
      shape = createAnnotation(localRegionsAnnotations);
      const vpoint = viewer.viewport.imageToViewportRectangle(
        shape.left + shape.width / 2,
        shape.top + shape.height / 2
      );
      viewer.viewport.panTo(vpoint);
      const zoomLevel = localRegionsAnnotations.zoomLevel;
      viewer.viewport.zoomTo(3);
    }
  }, [localRegionsAnnotations]);

  // useEffect(() => {
  //   const canvas = fabricOverlay.fabricCanvas();

  //   if (localRegionsAnnotations.length > 0) {
  //     let shape;
  //     localRegionsAnnotations.forEach((eachAnnotation) => {
  //       shape = createAnnotation(eachAnnotation);
  //     });
  //     if (shape && shape.type !== "viewport") canvas.add(shape);

  //     const vpoint = viewer.viewport.imageToViewportRectangle(
  //       shape.left + shape.width / 2,
  //       shape.top + shape.height / 2
  //     );
  //     viewer.viewport.panTo(vpoint);
  //   }

  //   const allAnnotations = canvas.getObjects();
  //   const filteredAnnotations = allAnnotations.filter(
  //     (annotation) => annotation.addLocalRegion === true
  //   );
  //   const isObjectEqual = (obj1, obj2) => obj1.hash !== obj2.hash;

  //   // Create a unique array of objects that are in arr2 but not in arr1
  //   const uniqueArray = filteredAnnotations.filter(
  //     (obj2) =>
  //       !localRegionsAnnotations.some((obj1) => isObjectEqual(obj1, obj2))
  //   );

  //   // console.log({ uniqueArray });
  //   // Remove the unwanted objects from the canvas
  //   uniqueArray.forEach((obj) => {
  //     canvas.remove(obj);
  //   });

  //   // console.log({ allAnnotations });
  // }, [localRegionsAnnotations]);

  // console.log({ localRegionsAnnotations });

  // console.log({ localRegionsAnnotations });

  useEffect(() => {
    if (scrollbar.current) scrollbar.current.scrollToBottom();
    if (annotationFeed.length === 0) setAnnotationsDetails(null);
  }, [annotationFeed]);

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
    const newAccordionState = [...accordionState];
    if (newAccordionState[index]) {
      newAccordionState[index].isOpen = !newAccordionState[index].isOpen;
      newAccordionState[index].isFocused = true;
      setAccordionState(newAccordionState);
    }
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

    if (feed?.object?.type !== "viewport") {
      canvas.setActiveObject(feed?.object);
    }
    // change position to annotation object location
    // except for when MagicWand tool is activated
    if (activeTool !== "MagicWand") {
      const { zoomLevel, left, top, width, height } = feed.object;
      // if (isXmlAnnotations) {
      // 	viewer.viewport.zoomTo(zoomLevel * 2.2);
      // } else {
      // viewer.viewport.zoomTo(zoomLevel);
      // }
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
  // console.log(annotationFeed);

  // set the tabName of Gleasons score
  const handleCollapseToggle = (grade) => {
    setCollapseStates((prevState) => ({
      ...prevState,
      [grade]: !prevState[grade],
    }));
  };
  // toggle all annotations description
  const handletoggleClick = () => {
    setHideDescription((state) => !state);
    const notCommentObjects = textObjects?.filter(
      (obj) => obj?.usingAs !== "comment"
    );
    if (hideDescription) {
      notCommentObjects?.forEach((obj) => {
        obj.set({ visible: true });
      });
    } else {
      notCommentObjects?.forEach((obj) => {
        obj.set({ visible: false });
      });
    }
    canvas.requestRenderAll();
  };
  // toggle single description
  const toggleDescription = (annotation) => {
    const notCommentObjects = textObjects?.filter(
      (obj) => obj?.usingAs !== "comment"
    );
    const selectedDescription = notCommentObjects?.filter(
      (obj) => obj?.text === annotation?.text
    );
    if (selectedDescription) {
      selectedDescription[0].set({ visible: !selectedDescription[0]?.visible });
    }
    setDescriptionData({
      ...descriptionData,
      [annotation?.text]: !descriptionData[annotation?.text],
    });
    canvas.requestRenderAll();
  };
  // console.log(annotationFeed);

  // UPDATE HITL RESULT

  const handleupdateResult = () => {
    setToolSelected("UpdateMask");
    const data = {
      key: `${getFileBucketFolder(viewerIds[0].originalFileUrl)}`,
      slideId: gleasonScoringData.slideId,
    };
    onHITLInput({ variables: { body: data } });
    // console.log(gleasonScoringData);
  };

  return (
    <Flex
      as="section"
      w="100%"
      h="100%"
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
          <Flex>
            {/* {isXmlAnnotations && (
              <Tooltip
                label={
                  hideDescription ? "Show description" : "Hide description"
                }
                closeOnClick={false}
              >
                <IconButton
                  icon={
                    hideDescription ? (
                      <AiOutlineEyeInvisible size={18} />
                    ) : (
                      <AiOutlineEye size={18} />
                    )
                  }
                  size="sm"
                  variant="unstyled"
                  cursor="pointer"
                  isDisabled={annotationFeed.length === 0}
                  _focus={{ border: "none", outline: "none" }}
                  onClick={() => handletoggleClick()}
                />
              </Tooltip>
            )} */}
            {!isXmlAnnotations && (
              <IconButton
                icon={<MdDelete size={18} />}
                size="sm"
                variant="unstyled"
                cursor="pointer"
                isDisabled={annotationFeed.length === 0}
                _focus={{ border: "none", outline: "none" }}
                onClick={onDeleteConfirmationOpen}
              />
            )}
          </Flex>
        </HStack>
        <ScrollBar>
          <Flex direction="column" h="80vh">
            {annotationFeed.map((feed, index) => {
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
                          alignItems="flex-start"
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
                              <Flex justifyContent="space-between">
                                <Box w="10%" mt="4px">
                                  {feed.object?.type === "marker" ? (
                                    <BsPlusLg color="#E23636" />
                                  ) : feed.object?.type === "arrow" ? (
                                    <BsArrowUpLeft color="#E23636" />
                                  ) : feed.object?.type === "rect" ? (
                                    <BiRectangle color="#E23636" />
                                  ) : feed.object?.type === "polygon" ? (
                                    <FaDrawPolygon color="#E23636" />
                                  ) : feed.object?.type === "ellipse" ? (
                                    <BsCircle color="#E23636" />
                                  ) : (
                                    <BsSlash color="#E23636" />
                                  )}
                                </Box>
                                <Text
                                  ml="0.8vw"
                                  wordBreak="break-word"
                                  style={{ whiteSpace: "pre-wrap" }}
                                  textAlign="left"
                                >
                                  {feed.object?.title ? (
                                    slideId ===
                                      "bb614ca0-8639-4574-8996-be14eabe2942" ||
                                    slideId ===
                                      "757bc483-78cd-4ae6-836f-94fff0528db8" ? (
                                      <Text
                                        wordBreak="break-word"
                                        style={{ whiteSpace: "pre-wrap" }}
                                      >
                                        {feed.object.text}
                                      </Text>
                                    ) : (
                                      <Text
                                        wordBreak="break-word"
                                        style={{ whiteSpace: "pre-wrap" }}
                                        textAlign="left"
                                      >
                                        {feed.object.text}
                                      </Text>
                                    )
                                  ) : feed.object?.roiType === "morphometry" ? (
                                    `ROI ${index + 1}`
                                  ) : feed.object?.roiType === "KI67" ? (
                                    `ROI ${index + 1}`
                                  ) : feed.object?.type === "viewport" ? (
                                    `Viewport ${index + 1}`
                                  ) : (
                                    `Annotation ${index + 1}`
                                  )}
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
                          {isXmlAnnotations && feed?.object?.text && (
                            <IconButton
                              icon={
                                descriptionData?.[feed?.object?.text] ? (
                                  <MdOutlineFontDownload size={18} />
                                ) : (
                                  <MdOutlineFontDownloadOff size={18} />
                                )
                              }
                              size="sm"
                              variant="unstyled"
                              cursor="pointer"
                              _focus={{ border: "none", outline: "none" }}
                              onClick={() => toggleDescription(feed?.object)}
                            />
                          )}
                        </Flex>
                      </AccordionButton>
                    </h2>
                    {slideId === "bb614ca0-8639-4574-8996-be14eabe2942" ||
                    slideId === "757bc483-78cd-4ae6-836f-94fff0528db8" ? (
                      <AccordionPanel px="0">
                        <Flex
                          direction="column"
                          flexWrap="wrap"
                          w="100%"
                          pr="0.5rem"
                        >
                          <Text
                            wordBreak="break-word"
                            style={{ whiteSpace: "pre-wrap" }}
                          >
                            {feed.object.text}
                          </Text>
                        </Flex>
                      </AccordionPanel>
                    ) : (
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
                                    <Flex flexDirection="row" ml="0.8vw">
                                      <Text height="fit-content">
                                        Description:
                                      </Text>
                                      {feed?.object?.text ? (
                                        <Text
                                          ml="1.0vw"
                                          wordBreak="break-word"
                                          whiteSpace="pre-wrap"
                                        >
                                          {feed.object.text}
                                        </Text>
                                      ) : (
                                        <Text>-</Text>
                                      )}
                                    </Flex>

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
                                    isDisabled={
                                      !annotationDetails?.analysedData
                                    }
                                  >
                                    {ki67Feed?.object
                                      ? "KI - 67 Analysis"
                                      : "Morphometry values"}
                                  </AccordionButton>
                                ) : null}
                              </h2>
                              <AccordionPanel pb={4}>
                                {annotationDetails.analysedData &&
                                annotationDetails.analysedData.data.length >
                                  0 &&
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
                                                        {cell.min_area.toFixed(
                                                          2
                                                        )}
                                                      </>
                                                    }
                                                  />
                                                  <CardDetailsRow
                                                    title="Max. Area"
                                                    value={
                                                      <>
                                                        {cell.max_area.toFixed(
                                                          2
                                                        )}
                                                      </>
                                                    }
                                                  />
                                                  <CardDetailsRow
                                                    title="Avg. Area"
                                                    value={
                                                      <>
                                                        {cell.avg_area.toFixed(
                                                          2
                                                        )}
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
                                        {
                                          ki67Feed?.object?.analysedData
                                            ?.num_positive
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
                                        <span as="b">
                                          Proliferation Score :
                                        </span>
                                        {ki67Feed?.object?.analysedData?.proliferation_score
                                          ?.toString()
                                          .substring(0, 4)}
                                      </Text>
                                    </Box>
                                  </Flex>
                                )}
                              </AccordionPanel>
                            </AccordionItem>
                          </Accordion>
                        ) : null}
                      </AccordionPanel>
                    )}
                  </AccordionItem>
                  <AccordionItem />
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
                    {/* // ###### Tumor ############ */}
                    <Flex
                      borderBottom="1px solid lightgray"
                      my="0"
                      ml="40px"
                      alignItems="center"
                      bg={selectedPattern === "Tumor" ? "#DEDEDE" : null}
                      onClick={() => {
                        if (selectedPattern === "Tumor") {
                          setSelectedPattern("");
                        } else {
                          setSelectedPattern("Tumor");
                        }
                      }}
                      py="8px"
                    >
                      <RiCheckboxBlankFill
                        size="30px"
                        color={
                          tumorColor.color
                            ? `rgba(${tumorColor.color.r}, ${tumorColor.color.g}, ${tumorColor.color.b}, ${tumorColor.color.a})`
                            : "#8080fc"
                        }
                      />
                      <Text ml="5px">Tumor</Text>
                      <Flex
                        alignItems="flex-end"
                        justifyContent="flex-end"
                        w="100%"
                      ></Flex>
                    </Flex>
                    {/* // ###### Stroma ############ */}
                    <Flex
                      borderBottom="1px solid lightgray"
                      my="0"
                      ml="40px"
                      alignItems="center"
                      bg={selectedPattern === "Stroma" ? "#DEDEDE" : null}
                      onClick={() => {
                        if (selectedPattern === "Stroma") {
                          setSelectedPattern("");
                        } else {
                          setSelectedPattern("Stroma");
                        }
                      }}
                      py="8px"
                    >
                      <RiCheckboxBlankFill
                        size="30px"
                        color={
                          stromaColor.color
                            ? `rgba(${stromaColor.color.r}, ${stromaColor.color.g}, ${stromaColor.color.b}, ${stromaColor.color.a})`
                            : "yellow"
                        }
                      />
                      <Text ml="5px">Stroma</Text>
                      <Flex
                        alignItems="flex-end"
                        justifyContent="flex-end"
                        w="100%"
                      ></Flex>
                    </Flex>
                    {/* // ###### Lymphocytes ############ */}
                    <Flex
                      my="0"
                      ml="40px"
                      alignItems="center"
                      borderBottom="1px solid lightgray"
                      bg={selectedPattern === "Lymphocytes" ? "#DEDEDE" : null}
                      onClick={() => {
                        if (selectedPattern === "Lymphocytes") {
                          setSelectedPattern("");
                        } else {
                          setSelectedPattern("Lymphocytes");
                        }
                      }}
                      py="8px"
                    >
                      <RiCheckboxBlankFill
                        size="25px"
                        color={
                          lymphocyteColor?.color
                            ? `rgba(${lymphocyteColor.color.r}, ${lymphocyteColor.color.g}, ${lymphocyteColor.color.b}, ${lymphocyteColor.color.a})`
                            : "red"
                        }
                      />
                      <Text ml="5px">Lymphocytes</Text>
                    </Flex>
                    {allLocalRegionAnnotations?.map((elem, index) => {
                      return (
                        <Flex w="100%" h="auto">
                          <Accordion
                            allowToggle
                            onClick={() => {
                              // console.log(elem);
                              setLocalRegionsAnnotations(elem.annotation);
                            }}
                            w="100%"
                          >
                            <AccordionItem>
                              <h2>
                                <AccordionButton>
                                  <Flex ml="30px" as="span" textAlign="left">
                                    <Box w="10%" mt="4px">
                                      {elem.annotation?.type === "marker" ? (
                                        <BsPlusLg color="#E23636" />
                                      ) : elem.annotation?.type === "arrow" ? (
                                        <BsArrowUpLeft color="#E23636" />
                                      ) : elem.annotation?.type === "rect" ? (
                                        <BiRectangle color="#E23636" />
                                      ) : elem.annotation?.type ===
                                        "polygon" ? (
                                        <FaDrawPolygon color="#E23636" />
                                      ) : elem.annotation?.type ===
                                        "ellipse" ? (
                                        <BsCircle color="#E23636" />
                                      ) : (
                                        <BsSlash color="#E23636" />
                                      )}
                                    </Box>
                                    <Text ml="0.8vw">
                                      Local Region {index + 1}
                                    </Text>
                                  </Flex>
                                  <AccordionIcon />
                                </AccordionButton>
                              </h2>
                              <AccordionPanel w="100%">
                                <Flex
                                  w="100%"
                                  flexDir="column"
                                  h="125px"
                                  justifyContent="space-between"
                                >
                                  <Box>
                                    <Flex
                                      justifyContent="space-between"
                                      alignItems="center"
                                      w="100%"
                                    >
                                      <p>Local TIL Score :</p>
                                      <p>{elem.tils_score}</p>
                                    </Flex>
                                  </Box>
                                  <Box>
                                    <Flex
                                      justifyContent="space-between"
                                      alignItems="center"
                                      w="100%"
                                    >
                                      <p>Tumor Area :</p>
                                      <p>
                                        {(elem?.tumor_area / 1000000)?.toFixed(
                                          2
                                        )}
                                        sq mm
                                      </p>
                                    </Flex>
                                  </Box>
                                  <Box>
                                    <Flex
                                      justifyContent="space-between"
                                      alignItems="center"
                                      w="100%"
                                    >
                                      <p>Intra - Tumoral Stroma Area :</p>
                                      <p>
                                        {(elem.stroma_area / 1000000).toFixed(
                                          2
                                        )}{" "}
                                        sq mm
                                      </p>
                                    </Flex>
                                  </Box>
                                  <Box>
                                    <Flex
                                      justifyContent="space-between"
                                      alignItems="center"
                                      w="100%"
                                    >
                                      <p>Lymphocyte Count :</p>
                                      <p>{elem.counts}</p>
                                    </Flex>
                                  </Box>
                                </Flex>
                              </AccordionPanel>
                            </AccordionItem>
                          </Accordion>
                        </Flex>
                      );
                    })}

                    <Flex
                      my="0"
                      ml="40px"
                      alignItems="center"
                      py="8px"
                      bg="#FCFCFC"
                      onClick={() => {
                        setAddLocalRegion(!addLocalRegion);
                      }}

                      // cursor="not-allowed"
                    >
                      <AiOutlinePlusCircle size="30px" color="#1B75BC" />
                      <Text ml="5px" color="#1B75BC">
                        Add Local Region
                      </Text>
                      <Flex
                        alignItems="flex-end"
                        justifyContent="flex-end"
                        w="100%"
                      ></Flex>
                    </Flex>
                    <Box w="100%" mx="25px" my="10px" textAlign="left">
                      <Text color="#3B5D7C">TIL Values</Text>
                    </Box>
                    <Box px="25px">
                      <Text mb="10px" borderTop="1px solid lightgray">
                        Global TIL Score : {tilScore}
                      </Text>
                      {/* <Text mb="10px">
                        TIL Formula : <br /> (Lymphocyte Area / Stroma Area) *
                        100
                      </Text> */}
                      <Text
                        mb="10px"
                        borderTop="1px solid lightgray"
                        borderBottom="1px solid lightgray"
                      >
                        Tumor Area : {(tumorArea / 1000000).toFixed(2)} sq mm
                      </Text>
                      <Text mb="10px" borderBottom="1px solid lightgray">
                        Intra-Tumoral Stroma Area: :{" "}
                        {(stromaArea / 1000000).toFixed(2)} sq mm
                      </Text>
                      <Text borderBottom="1px solid lightgray">
                        Lymphocytes Count : {lymphocyteCount}
                      </Text>
                    </Box>
                  </MotionBox>
                )}
              </Box>
            ) : gleasonScoring ? (
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
                  <Box>
                    <GroupTil />
                  </Box>
                  <Text
                    ml="0.8vw"
                    style={{
                      fontWeight:
                        selectedItemIndex === "til" ? "bold" : "normal",
                    }}
                  >
                    Gleason Grades
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
                    <Flex px="25px" flexDir="column" w="100%">
                      <Flex
                        borderTop="1px solid lightgray"
                        borderBottom="1px solid lightgray"
                        onClick={() => {
                          if (
                            selectedPattern === "" ||
                            selectedPattern === "Pattern 4" ||
                            selectedPattern === "Pattern 5" ||
                            selectedPattern === "Benign"
                          ) {
                            setSelectedPattern("Pattern 3");
                          } else {
                            setSelectedPattern("");
                          }
                        }}
                        my="0"
                        py="10px"
                        bg={selectedPattern === "Pattern 3" ? "#DEDEDE" : null}
                        alignItems="center"
                      >
                        <Box ml="15px">
                          <RiCheckboxBlankFill
                            color={
                              pattern3Color.color
                                ? `rgba(${pattern3Color.color.r}, ${pattern3Color.color.g}, ${pattern3Color.color.b}, ${pattern3Color.color.a})`
                                : "yellow"
                            }
                          />
                        </Box>
                        <Text ml="5px">Pattern 3</Text>
                        <Box w="100%">
                          <Text textAlign="end" mr="5px">
                            {gleasonScoringData?.pattern3 !== null
                              ? gleasonScoringData?.pattern3?.toFixed(2)
                              : "-"}{" "}
                            %
                          </Text>
                        </Box>
                      </Flex>

                      <Flex
                        borderBottom="1px solid lightgray"
                        my="0"
                        pt="10px"
                        pb="15px"
                        alignItems="center"
                        onClick={() => {
                          if (
                            selectedPattern === "" ||
                            selectedPattern === "Pattern 3" ||
                            selectedPattern === "Pattern 5" ||
                            selectedPattern === "Benign"
                          ) {
                            setSelectedPattern("Pattern 4");
                          } else {
                            setSelectedPattern("");
                          }
                        }}
                        bg={selectedPattern === "Pattern 4" ? "#DEDEDE" : null}
                      >
                        <Box ml="15px">
                          <RiCheckboxBlankFill
                            color={
                              pattern4Color.color
                                ? `rgba(${pattern4Color.color.r}, ${pattern4Color.color.g}, ${pattern4Color.color.b}, ${pattern4Color.color.a})`
                                : "orange"
                            }
                          />
                        </Box>
                        <Text ml="5px">Pattern 4</Text>
                        <Box w="100%">
                          <Text textAlign="end" mr="5px">
                            {gleasonScoringData?.pattern4 !== null
                              ? gleasonScoringData?.pattern4?.toFixed(2)
                              : "-"}{" "}
                            %
                          </Text>
                        </Box>
                      </Flex>

                      <Flex
                        borderBottom="1px solid lightgray"
                        my="0"
                        pt="10px"
                        pb="15px"
                        alignItems="center"
                        onClick={() => {
                          if (
                            selectedPattern === "" ||
                            selectedPattern === "Pattern 3" ||
                            selectedPattern === "Pattern 4" ||
                            selectedPattern === "Benign"
                          ) {
                            setSelectedPattern("Pattern 5");
                          } else {
                            setSelectedPattern("");
                          }
                        }}
                        bg={selectedPattern === "Pattern 5" ? "#DEDEDE" : null}
                      >
                        <Box ml="15px">
                          <RiCheckboxBlankFill
                            color={
                              pattern5Color.color
                                ? `rgba(${pattern5Color.color.r}, ${pattern5Color.color.g}, ${pattern5Color.color.b}, ${pattern5Color.color.a})`
                                : "red"
                            }
                          />
                        </Box>
                        <Text ml="5px">Pattern 5</Text>
                        <Box w="100%">
                          <Text textAlign="end" mr="5px">
                            {gleasonScoringData?.pattern5 !== null
                              ? gleasonScoringData?.pattern5?.toFixed(2)
                              : "-"}{" "}
                            %
                          </Text>
                        </Box>
                      </Flex>

                      <Flex
                        borderBottom="1px solid lightgray"
                        my="0"
                        pt="10px"
                        pb="15px"
                        alignItems="center"
                        onClick={() => {
                          if (
                            selectedPattern === "" ||
                            selectedPattern === "Pattern 3" ||
                            selectedPattern === "Pattern 5" ||
                            selectedPattern === "Pattern 4"
                          ) {
                            setSelectedPattern("Benign");
                          } else {
                            setSelectedPattern("");
                          }
                        }}
                        bg={selectedPattern === "Benign" ? "#DEDEDE" : null}
                      >
                        <Box ml="15px">
                          <RiCheckboxBlankFill
                            color={
                              benignColor.color
                                ? `rgba(${benignColor.color.r}, ${benignColor.color.g}, ${benignColor.color.b}, ${benignColor.color.a})`
                                : "green"
                            }
                          />
                        </Box>
                        <Text ml="5px">Benign Glands</Text>
                        <Box w="100%">
                          <Text textAlign="end" mr="5px">
                            {gleasonScoringData?.pattern0 !== null
                              ? gleasonScoringData?.pattern0?.toFixed(2)
                              : "-"}{" "}
                            %
                          </Text>
                        </Box>
                      </Flex>
                    </Flex>
                    <Flex
                      w="100%"
                      alignItems="center"
                      justifyContent="flex-end"
                      height="45px"
                      px="25px"
                      my="10px"
                      bg="#FCFCFC"
                    >
                      <Box
                        w="52%"
                        display="flex"
                        justifyContent="flex-end"
                        onClick={() => {
                          if (
                            (gleasonScoringData.hilLength < 2 ||
                              gleasonScoringData.hilLength === undefined) &&
                            maskAnnotationData.length > 0
                          ) {
                            maskAnnotationData.map((eachAnnotationData) => {
                              const canvas = fabricOverlay.fabricCanvas();
                              canvas.remove(eachAnnotationData.object);
                            });
                            setLoadUI(false);
                            handleupdateResult();
                          }
                          if (maskAnnotationData.length < 0) {
                            toast({
                              title: "HITL Error",
                              description: "No mask selection is done",
                              status: "error",
                              duration: 1500,
                              isClosable: true,
                            });
                          }
                          if (gleasonScoringData.hilLength >= 2) {
                            toast({
                              title: "HITL Error",
                              description:
                                "HITL can't be run more than 2 times",
                              status: "error",
                              duration: 1500,
                              isClosable: true,
                            });
                          }
                        }}
                      >
                        {" "}
                        {/* Wrap the Flex to control its alignment */}
                        <Flex alignItems="center">
                          <Box cursor="pointer">
                            <BsArrowRepeat
                              size={20}
                              style={{ color: "#1B75BC" }}
                            />
                          </Box>
                          <Text pl="10px"> Update Results</Text>
                        </Flex>
                      </Box>
                    </Flex>

                    <Flex
                      flexDir="column"
                      alignItems="center"
                      justifyContent="space-evenly"
                      mt="15px"
                      h="400px"
                      w="95%"
                      bg="white"
                      px="25px"
                      // border="1px solid red"
                      cursor="default"
                    >
                      <Flex w="100%" justifyContent="space-between">
                        <Text>Specimen Type :</Text>
                        <Text>Needle Biopsy</Text>
                      </Flex>
                      <Flex w="100%" justifyContent="space-between">
                        <Text>Core Length :</Text>
                        <Text>
                          {gleasonScoringData?.coreLength !== null
                            ? gleasonScoringData?.coreLength
                            : "-"}
                        </Text>
                      </Flex>
                      <Flex w="100%" justifyContent="space-between">
                        <Text>Tumor Length :</Text>
                        <Text>
                          <Text>
                            {gleasonScoringData?.tumorLength !== null
                              ? `${(
                                  parseFloat(
                                    gleasonScoringData?.tumorLength?.replace(
                                      "mm",
                                      ""
                                    )
                                  ) * 1000
                                ).toFixed(2)}μm`
                              : "-"}
                          </Text>{" "}
                        </Text>
                      </Flex>
                      <Flex
                        // border="1px solid red"
                        w="100%"
                        alignItems="flex-end"
                        justifyContent="space-between"
                      >
                        <Text w="100%">
                          Prostate tissue involved by
                          <br /> Tumor :
                        </Text>
                        <Text textAlign="right">
                          {gleasonScoringData?.pptTumor !== null
                            ? `${gleasonScoringData?.pptTumor?.toFixed(2)} %`
                            : "-"}
                        </Text>
                      </Flex>

                      <Flex w="100%" justifyContent="space-between">
                        <Text>Primary Pattern :</Text>
                        <Text>
                          {gleasonScoringData?.primaryPattern !== null
                            ? gleasonScoringData?.primaryPattern
                            : "-"}
                        </Text>
                      </Flex>
                      <Flex w="100%" justifyContent="space-between">
                        <Text>Worst remaining Pattern :</Text>
                        <Text>
                          {gleasonScoringData?.worstPattern !== null
                            ? gleasonScoringData?.worstPattern
                            : "-"}
                        </Text>
                      </Flex>
                      <Flex w="100%" justifyContent="space-between">
                        <Text>Gleason Score :</Text>
                        <Text>
                          {gleasonScoringData?.gleasonScore !== null
                            ? gleasonScoringData?.gleasonScore
                            : "-"}
                        </Text>
                      </Flex>
                      <Flex w="100%" justifyContent="space-between">
                        <Text>Grade Group :</Text>
                        <Text>
                          {gleasonScoringData?.gradeGroup !== null
                            ? gleasonScoringData?.gradeGroup
                            : "-"}
                        </Text>
                      </Flex>
                      <Flex w="100%" justifyContent="space-between">
                        <Text>Risk Category :</Text>
                        <Text>
                          {gleasonScoringData?.riskCategory !== null
                            ? gleasonScoringData?.riskCategory
                            : "-"}
                        </Text>
                      </Flex>
                    </Flex>
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
        annotationObject={annotationObject}
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

export default AnnotationFeed;
