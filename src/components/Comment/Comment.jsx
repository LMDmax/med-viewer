import React, { useState, useEffect, useRef } from "react";

import { useMutation } from "@apollo/client";
import {
  Tooltip,
  useMediaQuery,
  useToast,
  useDisclosure,
  Flex,
  IconButton,
  Box,
  Text,
} from "@chakra-ui/react";
import { fabric } from "openseadragon-fabricjs-overlay";
import { RiChatQuoteLine } from "react-icons/ri";

import {
  DELETE_ANNOTATION,
  SAVE_ANNOTATION,
  UPDATE_ANNOTATION,
} from "../../graphql/annotaionsQuery";
import {
  addToActivityFeed,
  updateTool,
} from "../../state/actions/fabricOverlayActions";
import { useFabricOverlayState } from "../../state/store";
import {
  createAnnotationMessage,
  getCanvasImage,
  getScaleFactor,
  saveAnnotationToDB,
  updateAnnotationInDB,
} from "../../utility";
import TooltipLabel from "../AdjustmentBar/ToolTipLabel";
import ToolbarButton from "../ViewerToolbar/button";
import IconSize from "../ViewerToolbar/IconSize";

const CommentBox = ({
  userInfo,
  viewerId,
  application,
  caseInfo,
  setToolSelected,
  navigatorCounter,
}) => {
  const [addComments, setAddComments] = useState(false);
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const iconSize = IconSize();
  const toast = useToast();
  const caseData = JSON.parse(localStorage.getItem("caseData"));
  const [textBoxData, setTextBoxData] = useState("");
  const caseId =
    application === "hospital"
      ? caseInfo?._id
      : application === "education"
      ? caseInfo?.id
      : application === "clinical"
      ? caseInfo?.caseId
      : null; // Handle other cases or provide a default value if needed
  const [
    modifyAnnotation,
    { data: updatedData, error: updateError, loading: updateLoading },
  ] = useMutation(UPDATE_ANNOTATION);

  // console.log({ userInfo });
  const onSaveAnnotation = (data) => {
    createAnnotation({
      variables: {
        body: {
          ...data,
          app: application,
          addLocalRegion: false,
          createdBy:
            application === "hospital"
              ? `${userInfo?.firstName} ${userInfo?.lastName}`
              : application === "clinical"
              ? `Dr. ${userInfo?.data[0]?.firstName} ${userInfo?.data[0]?.lastName}`
              : `${userInfo?.firstName}`,
          caseId,
        },
      },
    });
  };
  const [createAnnotation, { data, error, loading }] =
    useMutation(SAVE_ANNOTATION);

  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { color, viewerWindow, activeTool } = fabricOverlayState;

  const { fabricOverlay, viewer, activityFeed, slideId } =
    viewerWindow[viewerId];

  const [removeAnnotation, { data: deletedData, error: deleteError }] =
    useMutation(DELETE_ANNOTATION);

  const isActive = activeTool === "Comment";

  const [shape, setShape] = useState(null);
  const [textbox, setTextbox] = useState(false);

  const [myState, setState] = useState({
    activeShape: null, // active shape in event Panel
    color: null,
    currentDragShape: null,
    isActive: false, // Is the Shape tool itself active
    isMouseDown: false,
    origX: null, // starting X point for drag creating an object
    origY: null,
  });
  const myStateRef = useRef(myState);
  const setMyState = (data) => {
    myStateRef.current = { ...myState, ...data };
    setState((state) => ({ ...state, ...data }));
  };
  const { isOpen, onClose, onOpen } = useDisclosure();

  /**
   * Handle primary tool change
   */
  useEffect(() => {
    setMyState({ activeShape: null, isActive });
  }, [isActive]);

  /**
   * Handle color change
   */
  useEffect(() => {
    setMyState({ color });
  }, [color.hex]);

  /**
   * Handle an individual shape being selected
   */

  /**
   * Add shapes and handle mouse events
   */
  useEffect(() => {
    if (!fabricOverlay || !isActive) return;
    const canvas = fabricOverlay.fabricCanvas();

    /**
     * Mouse down
     */

    function handleMouseDown(event) {
      if (
        event.button !== 1 ||
        event.target ||
        !myStateRef.current.isActive ||
        !addComments
      ) {
        return;
      }

      canvas.selection = false;

      const pointer = canvas.getPointer(event.e);
      const origX = pointer.x;
      const origY = pointer.y;

      // Create a textbox with initial content and width
      const initialContent = "";
      const defaultWidth = 100;

      const text = new fabric.Textbox(initialContent, {
        width: defaultWidth,
        left: origX,
        top: origY - 48,
        styles: null,
        backgroundColor: "#B0C8D6",
        opacity: 0.75,
        title: `${userInfo.firstName} ${userInfo.lastName}`,
        hasControls: false,

        hasRotatingPoint: false,
        lockUniScaling: true,
        lockMovementX: true,
        lockMovementY: true,
        cursorColor: "#000000", // Set the cursor color
        cursorWidth: 2, // Set the cursor width
        cursorDuration: 1000, // Set the blinking speed in milliseconds
        blinkingCursor: true, // Enable blinking cursor
      });
      // console.log(text);
      canvas.add(text);
      setTimeout(() => {
        text.enterEditing();

        // Event listener for keyup event
        text.on("changed", function (options) {
          const content = this.text;
          const contentLength = content.length;

          // Calculate the width based on the content length
          const calculatedWidth =
            contentLength > 0 ? contentLength * 20 : defaultWidth;

          // Set the width of the textbox
          this.set("width", calculatedWidth);
          setTextBoxData(this.text);

          canvas.renderAll();
        });
      }, 1000);

      // canvas.add(mousecursor);
      setMyState({
        ...myStateRef.current,
        currentDragShape: text,
        isMouseDown: true,
        origX,
        origY,
      });

      // Add new shape to the canvas
      // text && fabricOverlay.fabricCanvas().add(text);

      canvas.setActiveObject(myStateRef.current.currentDragShape);

      canvas.renderAll();

      const currShape = myStateRef.current.currentDragShape;

      setShape(myStateRef.current.currentDragShape);
      if (currShape && currShape.type === "textbox") {
        // Get the current left and top positions
        let left = currShape.left || 0;
        let top = currShape.top || 0;

        // Check the originX and originY properties
        if (currShape.originX === "right") {
          // Adjust the left position based on the width
          left -= currShape.width || 0;
        }

        if (currShape.originY === "bottom") {
          // Adjust the top position based on the height
          top -= currShape.height || 0;
        }

        // Set the adjusted position of the textbox
        currShape.set({ left, top });

        // Update the canvas
        fabricOverlay.fabricCanvas().renderAll();

        // Set the tool selected to "SelectedComment"
        setToolSelected("SelectedComment");
      }

      setMyState({
        ...myStateRef.current,
        currentDragShape: null,
        isMouseDown: false,
      });
    }

    // Add click handlers
    canvas.on("mouse:down", handleMouseDown);

    return () => {
      canvas.off("mouse:down", handleMouseDown);
    };
  }, [addComments, fabricOverlay, isActive]);

  const onUpdateAnnotation = (data) => {
    // console.log(data);
    delete data?.slideId;
    modifyAnnotation({
      variables: { body: { ...data } },
    });
  };

  useEffect(() => {
    const canvas = fabricOverlay?.fabricCanvas();

    const checkActiveObject = () => {
      const activeObject = canvas?.getActiveObject();
      if (activeObject && activeObject.type === "textbox") {
        // set the tool selected to "SelectedComment"
        setToolSelected("SelectedComment");
      } else {
        setToolSelected("");
      }
    };

    // Check the active object when the component mounts
    checkActiveObject();

    // Add a click listener to the canvas
    canvas?.on("mouse:down", checkActiveObject);

    // Remove the click listener when the component unmounts
    return () => canvas?.off("mouse:down", checkActiveObject);
  }, [fabricOverlay]);

  useEffect(() => {
    const canvas = fabricOverlay?.fabricCanvas();
    const updateCommentText = () => {
      const textboxObjects = canvas
        .getObjects()
        .filter((obj) => obj.type === "textbox");

      const lastAddedTextbox = textboxObjects.pop();
      // console.log(lastAddedTextbox);
      if (textBoxData !== "") {
        updateAnnotationInDB({
          slideId,
          hash: lastAddedTextbox.hash,
          updateObject: {
            text: textBoxData,
            width: lastAddedTextbox.width,
            height: lastAddedTextbox.height,
          },
          onUpdateAnnotation,
        });
        setTextBoxData("");
        textboxObjects.push(lastAddedTextbox);
        // console.log(textboxObjects);
      }
    };

    canvas?.on("mouse:down", updateCommentText);

    // Remove the click listener when the component unmounts
    return () => canvas?.off("mouse:down", updateCommentText);
  }, [textBoxData]);

  // group shape and textbox together
  // first remove both from canvas then group them and then add group to canvas
  useEffect(() => {
    const addToFeed = async () => {
      // console.log(shape);
      if (!shape) return;
      // console.log(shape);
      const message = createAnnotationMessage({
        slideId,
        shape,
        viewer,
        userInfo,
        type: "textbox",
        application,
        isClosed: true,
        usingAs: "comment",
      });
      // console.log({message})
      saveAnnotationToDB({
        slideId,
        annotation: message.object,
        onSaveAnnotation,
      });

      setShape(null);
      setTextbox(false);

      setFabricOverlayState(addToActivityFeed({ id: viewerId, feed: message }));
    };

    addToFeed();
    setFabricOverlayState(updateTool({ tool: "Move" }));
    setAddComments(false);
  }, [shape]);

  const handleClick = () => {
    if (addComments) {
      setFabricOverlayState(updateTool({ tool: "Move" }));
    } else {
      setFabricOverlayState(updateTool({ tool: "Comment" }));
    }
  };

  useEffect(() => {
    if (addComments) {
      setToolSelected("AddComment");
      // toast({
      //   title: "Comments can be added now",
      //   description: "",
      //   status: "success",
      //   duration: 1500,
      //   isClosable: true,
      // });
    }
  }, [addComments]);

  useEffect(() => {
    if (navigatorCounter > 0) {
      setAddComments(false);
      setFabricOverlayState(updateTool({ tool: "Move" }));
    }
  }, [navigatorCounter]);

  return (
    <Box
      onClick={() => {
        setAddComments(!addComments);
        handleClick();
      }}
      // border="1px solid black"
      w="60px"
      h="100%"
      style={{ position: "relative", display: "inline-block" }}
      _hover={{ bgColor: "transparent" }}
      sx={{
        ":before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          cursor: "pointer",
          width: "100%",
          height: "100%",
          backgroundColor: isActive ? "rgba(157,195,226,0.4)" : "transparent",
          zIndex: 1,
        },
      }}
    >
      <Flex
        direction="column"
        mt={ifScreenlessthan1536px ? "1px" : "-2px"}
        justifyContent="center"
        alignItems="center"
        h="100%"
      >
        <IconButton
          width={ifScreenlessthan1536px ? "100%" : "100%"}
          height={ifScreenlessthan1536px ? "50%" : "50%"}
          // border="2px solid red"
          _hover={{ bgColor: "transparent" }}
          icon={
            <RiChatQuoteLine
              transform="scale(1.2)"
              size={iconSize}
              color="black"
            />
          }
          _active={{
            bgColor: "transparent",
            outline: "none",
          }}
          // outline={TilHover ? " 0.5px solid rgba(0, 21, 63, 1)" : ""}
          // _focus={{
          // }}
          backgroundColor="transparent"
          // mr="7px"
          // border="1px solid red"
          borderRadius={0}
        />
        <Text align="center" fontFamily="inter" fontSize="10px">
          Comment
        </Text>
      </Flex>
    </Box>
  );
};

export default CommentBox;
