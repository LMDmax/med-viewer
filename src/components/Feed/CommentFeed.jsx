import React, { useState, useRef, useEffect } from "react";
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
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import { BsCircle, BsSlash } from "react-icons/bs";
import { GrFormClose } from "react-icons/gr";
import { FaDrawPolygon } from "react-icons/fa";
import { MdTextsms } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import EditText from "./editText";
import { useFabricOverlayState } from "../../state/store";
import { updateAnnotationInDB } from "../../utility";
import ScrollBar from "../ScrollBar";
import useCanvasHelpers from "../../hooks/use-fabric-helpers";
import DeleteConfirmation from "../Annotations/DeleteConfirmation";
import { useMutation } from "@apollo/client";
import {
  DELETE_ANNOTATION,
  UPDATE_ANNOTATION,
} from "../../graphql/annotaionsQuery";

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

const CardDetailsRow = ({ title, value, ...restProps }) => (
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

const CustomTab = ({ title, ...props }) => (
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

const CustomTabPanel = ({
  children,
  title,
  annotation,
  totalCells,
  ...props
}) => (
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
      <Flex flexDir="column" minH="0px" h="42vh">
        <ScrollBar>
          <Flex flexDir="column" pb="85px">
            {children}
          </Flex>
        </ScrollBar>
      </Flex>
    ) : null}
  </TabPanel>
);

const CommentFeed = ({
  userInfo,
  viewerId,
  totalCells,
  handlePopup,
  popup,
  showFeedBar,
}) => {
  // const onUpdateAnnotation = (data) => {
  //   console.log("activityfeed", data);
  // };

  const [
    modifyAnnotation,
    { data: updatedData, error: updateError, loading: updateLoading },
  ] = useMutation(UPDATE_ANNOTATION);

  const onUpdateAnnotation = (data) => {
    console.log("====================================");
    console.log("activity feed update");
    console.log("====================================");
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
    console.log("====================================");
    console.log("activity feed delete", data);
    console.log("====================================");
    removeAnnotation({ variables: { body: data } });
  };

  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { activeTool, viewerWindow } = fabricOverlayState;
  const { fabricOverlay, activityFeed, viewer, tile, slideId } =
    viewerWindow[viewerId];

  const { deleteAllAnnotations, deleteAllComments } =
    useCanvasHelpers(viewerId);

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

  useEffect(() => {
    if (scrollbar.current) scrollbar.current.scrollToBottom();
    if (activityFeed.length === 0) setAnnotationsDetails(null);
  }, [activityFeed]);

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

  const handleClick = (feed) => {
    if (!feed.object || !feed.object?.visible) return;
    const canvas = fabricOverlay.fabricCanvas();

    if (feed.object.type !== "viewport") {
      canvas.setActiveObject(feed.object);
    }

    // change position to annotation object location
    // except for when MagicWand tool is activated
    if (activeTool !== "MagicWand") {
      const { zoomLevel, left, top, width, height } = feed.object;
      viewer.viewport.zoomTo(zoomLevel);

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

  const deleteAnnotations = () => {
    deleteAllComments(onDeleteAnnotation);
    onDeleteConfirmationClose();
  };

  return (
    <Flex
      as="section"
      w="100%"
      position={showFeedBar ? "unset" : "absolute"}
      // h={ifScreenlessthan1660px ? "calc(100% - 90px)" : "90%"}
      h={
        showFeedBar
          ? "90vh"
          : !showFeedBar && ifScreenlessthan1660px
          ? "calc(100% - 90px)"
          : "90%"
      }
      padding={0}
      margin={0}
      right="0"
      zIndex={2}
      background="#FCFCFC"
      boxShadow={showFeedBar ? "" : "-1px 0px 2px rgba(176, 200, 214, 0.3)"}
      direction="column"
      pr="2px"
    >
      <Flex
        py="0.5px"
        justifyContent="flex-end"
        alignItems="center"
        background="#F6F6F6"
        display={showFeedBar ? "none" : "flex"}
      >
        <GrFormClose
          size={16}
          onClick={() => handlePopup(!popup)}
          _hover={{ cursor: "pointer" }}
        />
      </Flex>

      <Flex
        direction="column"
        marginStart="0.8vw"
        pt="2px"
        overflowY="auto"
        flex="1"
      >
        <HStack justify="space-between">
          <Text fontSize="1rem" pb="3px">
            Comments List
          </Text>
          <IconButton
            icon={<MdDelete size={18} />}
            size="sm"
            variant="unstyled"
            cursor="pointer"
            isDisabled={activityFeed.length === 0}
            _focus={{ border: "none", outline: "none" }}
            onClick={onDeleteConfirmationOpen}
          />
        </HStack>
        <ScrollBar>
          <Flex direction="column">
            {activityFeed.map((feed) => {
              return feed?.object && feed?.object?.type === "textbox" ? (
                <Flex
                  key={feed.object.hash}
                  borderBottom="1px solid #F6F6F6"
                  cursor="pointer"
                  onClick={() => handleClick(feed)}
                  justify="space-between"
                  mb="0.5vh"
                  direction="column"
                >
                  <Text fontSize={10}>{`${feed?.object?.title}`}</Text>
                  <Flex align="center" bgColor="#E6E6E6" p="1vh">
                    <Text>{`${feed?.object?.text}`}</Text>
                  </Flex>
                </Flex>
              ) : null;
            })}
          </Flex>
        </ScrollBar>
      </Flex>

      <DeleteConfirmation
        isOpen={isDeleteConfirmationOpen}
        onClose={onDeleteConfirmationClose}
        handleConfirmation={deleteAnnotations}
        type="comments"
      />
    </Flex>
  );
};

export default CommentFeed;
