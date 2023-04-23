import React, { useState, useEffect, useRef } from "react";
import { BsSlash } from "react-icons/bs";
import { fabric } from "openseadragon-fabricjs-overlay";
import {
  IconButton,
  useDisclosure,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { useFabricOverlayState } from "../../state/store";
import {
  updateTool,
  addToActivityFeed,
} from "../../state/actions/fabricOverlayActions";
import {
  createAnnotationMessage,
  getScaleFactor,
  saveAnnotationToDB,
} from "../../utility";

const Line = ({ viewerId, onSaveAnnotation, setToolSelected }) => {
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { activeTool, viewerWindow, color } = fabricOverlayState;
  const { fabricOverlay, viewer, slideId } = viewerWindow[viewerId];
  const isActive = activeTool === "Line";
  const toast = useToast();

  const [shape, setShape] = useState(null);
  const [textbox, setTextbox] = useState(false);

  const [myState, setState] = useState({
    color: null,
    currentDragShape: null,
    isActive: false, // Is the Shape tool itself active
    isMouseDown: false,
  });
  const myStateRef = useRef(myState);
  const setMyState = (data) => {
    myStateRef.current = { ...myState, ...data };
    setState((state) => ({ ...state, ...data }));
  };
  const { isOpen, onClose, onOpen } = useDisclosure();

  const screenSize = useMediaQuery([
    "(max-width: 1280px)",
    "(max-width: 1440px)",
    "(max-width: 1920px)",
    "(max-width: 2560px)",
  ]);

  /**
   * Handle primary tool change
   */
  useEffect(() => {
    setMyState({ isActive });
  }, [isActive]);

  /**
   * Handle color change
   */
  useEffect(() => {
    setMyState({ color });
  }, [color]);

  /**
   * Handle an individual shape being selected
   */
  useEffect(() => {
    if (!fabricOverlay || !isActive) return;
    const canvas = fabricOverlay.fabricCanvas();

    canvas.defaultCursor = "crosshair";
  }, [isActive]);

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
      if (event.button !== 1 || event.target || !myStateRef.current.isActive) {
        return;
      }

      canvas.selection = false;

      // Disable OSD mouseclicks
      viewer.setMouseNavEnabled(false);
      viewer.outerTracker.setTracking(false);

      // Save starting mouse down coordinates
      const pointer = canvas.getPointer(event.e);

      // Create new Shape instance
      let newShape = null;
      const shapeOptions = {
        color: "black",
      };

      // Stroke fill
      const scaleFactor = getScaleFactor(viewer);

      const fillProps = {
        stroke: "black",
        strokeWidth: 2 / scaleFactor,
        strokeUniform: true,
      };

      const points = [pointer.x, pointer.y, pointer.x, pointer.y];
      newShape = new fabric.Line(points, {
        ...shapeOptions,
        ...fillProps,
      });
      canvas.add(newShape);

      setMyState({
        ...myStateRef.current,
        currentDragShape: newShape,
        isMouseDown: true,
      });

      // Add new shape to the canvas
      // newShape && fabricOverlay.fabricCanvas().add(newShape);
    }

    /**
     * Mouse move
     */
    function handleMouseMove(event) {
      if (
        // event.target ||
        !myStateRef.current.isActive ||
        !myStateRef.current.currentDragShape
      ) {
        return;
      }
      const c = myStateRef.current;

      // Dynamically drag size element to the canvas
      const pointer = canvas.getPointer(event.e);

      c.currentDragShape.set({ x2: pointer.x, y2: pointer.y });
      canvas.renderAll();
    }

    /**
     * Mouse up
     */
    function handleMouseUp(event) {
      if (
        event.button !== 1 ||
        !myStateRef.current.isActive ||
        !myStateRef.current.currentDragShape
      ) {
        return;
      }

      canvas.selection = true;
      viewer.setMouseNavEnabled(true);
      viewer.outerTracker.setTracking(true);

      const currShape = myStateRef.current.currentDragShape;

      // Check if the shape has been dragged
      if (currShape.x1 !== currShape.x2 || currShape.y1 !== currShape.y2) {
        canvas.add(currShape);
        currShape.setCoords();
        setShape(myStateRef.current.currentDragShape);
        onOpen();
      } else {
        toast({
          title: "Please Draw Again",
          status: "error",
          duration: 500,
          isClosable: true,
        });
        canvas.remove(currShape);
        setFabricOverlayState(updateTool({ tool: "Move" }));
      }

      canvas.renderAll();

      setMyState({
        ...myStateRef.current,
        currentDragShape: null,
        isMouseDown: false,
      });
    }

    // Add click handlers
    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:up", handleMouseUp);

    // Remove handler
    return () => {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:move", handleMouseMove);
      canvas.off("mouse:up", handleMouseUp);
    };
  }, [isActive]);

  // save annotation to db
  // create message for annotation feed
  useEffect(() => {
    const addToFeed = async () => {
      if (!shape) return;

      const message = createAnnotationMessage({
        slideId,
        shape,
        viewer,
        type: "line",
      });

      const { x1, y1, x2, y2 } = message.object;
      message.object.set({
        cords: [x1, y1, x2, y2],
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

    // change tool back to move
    setFabricOverlayState(updateTool({ tool: "Move" }));

    // send annotation
    // socket.emit(
    //   "send_annotations",
    //   JSON.stringify({
    //     roomName,
    //     username,
    //     content: canvas,
    //     feed: [...activityFeed, message],
    //   })
    // );
  }, [shape]);

  const handleClick = () => {
    setFabricOverlayState(updateTool({ tool: "Line" }));
  };

  const handleSave = ({ text, tag }) => {
    shape.set({ isExist: true, text, tag });
    setTextbox(true);
    onClose();
  };

  const handleClose = () => {
    shape.set({ isExist: true, text: "" });
    setTextbox(true);
    onClose();
  };

  return (
    <IconButton
      icon={<BsSlash size={40} color={isActive ? "#3B5D7C" : "#000"} />}
      onClick={() => {
        handleClick();
        setToolSelected("LineTool");
      }}
      borderRadius={0}
      bg={isActive ? "#DEDEDE" : "#F6F6F6"}
      title="Line Annotations"
      _focus={{ border: "none" }}
      boxShadow={
        isActive
          ? "inset -2px -2px 2px rgba(0, 0, 0, 0.1), inset 2px 2px 2px rgba(0, 0, 0, 0.1)"
          : null
      }
      _hover={{ bgColor: "rgba(228, 229, 232, 1)" }}
    />
  );
};

export default Line;
