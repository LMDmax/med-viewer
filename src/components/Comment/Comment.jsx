import React, { useState, useEffect, useRef } from "react";
import { Tooltip, useToast, useDisclosure } from "@chakra-ui/react";
import TooltipLabel from "../AdjustmentBar/ToolTipLabel";
import { RiChatQuoteLine } from "react-icons/ri";
import ToolbarButton from "../ViewerToolbar/button";
import IconSize from "../ViewerToolbar/IconSize";
import { fabric } from "openseadragon-fabricjs-overlay";
import { useFabricOverlayState } from "../../state/store";
import useCanvasHelpers from "../../hooks/use-fabric-helpers";
import {
  createAnnotationMessage,
  getCanvasImage,
  getScaleFactor,
  saveAnnotationToDB,
} from "../../utility";
import {
  addToActivityFeed,
  updateTool,
} from "../../state/actions/fabricOverlayActions";
import { SAVE_ANNOTATION } from "../../graphql/annotaionsQuery";
import { useMutation } from "@apollo/client";

const CommentBox = ({ userInfo, viewerId, application }) => {
  const [addComments, setAddComments] = useState(false);
  const iconSize = IconSize();
  const toast = useToast();

  const onSaveAnnotation = (data) => {
    createAnnotation({ variables: { body: { ...data, app: application } } });
  };
  const [createAnnotation, { data, error, loading }] =
    useMutation(SAVE_ANNOTATION);

  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { color, viewerWindow, activeTool } = fabricOverlayState;

  const { fabricOverlay, viewer, activityFeed, slideId } =
    viewerWindow[viewerId];

  const isActive = activeTool === "Circle";

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

    var rect = new fabric.Rect({
      originX: "top",
      originY: "top",
      width: 1500,
      height: 1200,
      fill: "rgba(255,0,0,0.5)",
      transparentCorners: true,
    });
    var text = new fabric.Text("hello world", {
      fontSize: 30,
      originX: "top",
      originY: "top",
    });

    var group = new fabric.Group([rect, text], {
      left: 0,
      top: 0,
      selectable: false,
      visible: false,
    });
    canvas.add(group);
    canvas.renderAll();

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

      // Create new Shape instance
      let newShape = null;
      const shapeOptions = {
        color: myStateRef.current.color.hex,
        left: origX,
        top: origY,
        width: 2,
        height: 2,
      };

      // Stroke fill
      const scaleFactor = getScaleFactor(viewer);

      var mousecursor = new fabric.Ellipse({
        color: myStateRef.current.color.hex,
        left: origX,
        top: origY,
        fill: "green",
        stroke: "#000000",
        strokeWidth: 2 / scaleFactor,
        strokeUniform: true,
        originX: "center",
        originY: "center",
        rx: 15,
        ry: 15,
        angle: 0,
        opacity: "0.3",
      });

      var text = new fabric.Textbox("Comment", {
        width: 450,
        left: origX,
        top: origY,
        styles: null,
        backgroundColor: "#B0C8D6",
        opacity: "0.75",
        title: `${userInfo.firstName} ${userInfo.lastName}`,
      });

      //
      canvas.add(text);

      // canvas.add(mousecursor);
      setMyState({
        ...myStateRef.current,
        currentDragShape: text,
        isMouseDown: true,
        origX,
        origY,
      });

      // Add new shape to the canvas
      text && fabricOverlay.fabricCanvas().add(text);

      canvas.setActiveObject(myStateRef.current.currentDragShape);

      canvas.renderAll();

      const currShape = myStateRef.current.currentDragShape;

      setShape(myStateRef.current.currentDragShape);
      if (currShape.type === "textbox") {
        if (currShape.originX === "right") left -= width;
        if (currShape.originY === "bottom") height = 0;
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

  // group shape and textbox together
  // first remove both from canvas then group them and then add group to canvas
  useEffect(() => {
    const addToFeed = async () => {
      if (!shape) return;

      const message = createAnnotationMessage({
        slideId,
        shape,
        viewer,
        userInfo,
      });

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
    // setFabricOverlayState(updateTool({ tool: "Move" }));
  }, [shape]);

  const handleClick = () => {
    setFabricOverlayState(updateTool({ tool: "Circle" }));
  };

  useEffect(() => {
    if (addComments) {
      toast({
        title: "Comments can be added now",
        description: "",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
    }
  }, [addComments]);

  return (
    <>
      <Tooltip
        aria-label="comment"
        placement="bottom"
        openDelay={0}
        bg="#E4E5E8"
        color="rgba(89, 89, 89, 1)"
        fontSize="14px"
        fontFamily="inter"
        hasArrow
        borderRadius="0px"
        size="20px"
      >
        <ToolbarButton
          icon={
            addComments ? (
              <RiChatQuoteLine size={iconSize} color="#3B5D7C" />
            ) : (
              <RiChatQuoteLine size={iconSize} color="#151C25" />
            )
          }
          label={<TooltipLabel heading="Add comments" />}
          backgroundColor={!addComments ? "" : "#E4E5E8"}
          outline={addComments ? " 0.5px solid rgba(0, 21, 63, 1)" : ""}
          boxShadow={
            addComments
              ? "inset -2px -2px 2px rgba(0, 0, 0, 0.1), inset 2px 2px 2px rgba(0, 0, 0, 0.1)"
              : null
          }
          onClick={() => {
            setAddComments(!addComments);
            handleClick();
          }}
          _hover={{ bgColor: "rgba(228, 229, 232, 1)" }}
        />
      </Tooltip>
    </>
  );
};

export default CommentBox;
