import React, { useState, useRef, useEffect } from "react";
import { fabric } from "openseadragon-fabricjs-overlay";
import {
  IconButton,
  useDisclosure,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import useCanvasHelpers from "../../hooks/use-fabric-helpers";
import { fonts } from "../Text/fontPicker";
import {
  createAnnotationMessage,
  getScaleFactor,
  saveAnnotationToDB,
} from "../../utility";
import { useFabricOverlayState } from "../../state/store";
import {
  addToActivityFeed,
  updateTool,
} from "../../state/actions/fabricOverlayActions";
import { SquareIcon, SquareIconSelected } from "../Icons/CustomIcons";

const Square = ({
  viewerId,
  onSaveAnnotation,
  setToolSelected,
  setNewToolSettings,
  newToolSettings,
  addLocalRegion,
}) => {
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { color, viewerWindow, activeTool } = fabricOverlayState;

  const { fabricOverlay, viewer, slideId } = viewerWindow[viewerId];

  const { deselectAll } = useCanvasHelpers(viewerId);
  const isActive = activeTool === "Square";
  const [toolState, setToolState] = useState(false);

  const [shape, setShape] = useState(null);
  const [textbox, setTextbox] = useState(false);
  const toast = useToast();

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
    setMyState({ activeShape: null, isActive });
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

    // Deselect all Fabric Canvas objects
    deselectAll();
  }, [isActive]);

  /**
   * Add shapes and handle mouse events
   */
  useEffect(() => {
    if (!fabricOverlay) return;
    const canvas = fabricOverlay.fabricCanvas();

    /**
     * Mouse down
     */
    function handleMouseDown(event) {
      // console.log("isMouseDown");
      if (event.button !== 1 || event.target || !myStateRef.current.isActive) {
        return;
      }

      canvas.selection = false;

      // Disable OSD mouseclicks
      viewer.setMouseNavEnabled(false);
      viewer.outerTracker.setTracking(false);

      // Save starting mouse down coordinates
      const pointer = canvas.getPointer(event.e);
      const origX = pointer.x;
      const origY = pointer.y;

      // Create new Shape instance
      let newShape = null;
      const shapeOptions = {
        color: myStateRef.current.color.hex,
        left: origX,
        top: origY,
        width: 0,
        height: 0,
      };

      // Stroke fill
      const scaleFactor = getScaleFactor(viewer);

      const fillProps = {
        fill: "",
        stroke: newToolSettings.strokeColor || "black",
        strokeWidth: 2 / scaleFactor,
        strokeUniform: true,
        borderScaleFactor: 0.5,
        strokeDashArray:
          newToolSettings.strokeType !== "" &&
          newToolSettings.strokeType !== "solid"
            ? [10, 10] // Set the dash array to [10, 10] when strokeDashArray is not empty and strokeType is not solid
            : [0, 0], // Otherwise, set it to [0, 0]
      };

      newShape = new fabric.Rect({
        ...shapeOptions,
        ...fillProps,
        width: pointer.x - origX,
        height: pointer.y - origY,
      });
      canvas.add(newShape).requestRenderAll();

      setMyState({
        ...myStateRef.current,
        currentDragShape: newShape,
        isMouseDown: true,
        origX,
        origY,
      });
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

      /**
       * Rectangle or Triangle
       */
      if (c.origX > pointer.x) {
        c.currentDragShape.set({
          left: Math.abs(pointer.x),
        });
      }
      if (c.origY > pointer.y) {
        c.currentDragShape.set({ top: Math.abs(pointer.y) });
      }
      c.currentDragShape.set({
        width: Math.abs(c.origX - pointer.x),
        height: Math.abs(c.origY - pointer.y),
      });

      canvas.requestRenderAll();
    }

    // // Create new Textbox instance and add it to canvas
    // const createTextbox = ({ left, top, height }) => {
    //   const tbox = new fabric.IText("", {
    //     left: left,
    //     top: top + height + 2,
    //     fontFamily: fonts[0].fontFamily,
    //     fontSize: fontSize,
    //     fontWeight: "bold",
    //     selectionBackgroundColor: "rgba(255, 255, 255, 0.5)",
    //   });

    //   fabricOverlay.fabricCanvas().add(tbox);
    //   canvas.setActiveObject(tbox);
    //   tbox.enterEditing();
    // };

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

      canvas.setActiveObject(myStateRef.current.currentDragShape);

      canvas.requestRenderAll();

      setShape(myStateRef.current.currentDragShape);

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

    return () => {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:move", handleMouseMove);
      canvas.off("mouse:up", handleMouseUp);
    };
  }, [isActive]);

  // group shape and textbox together
  // first remove both from canvas then group them and then add group to canvas
  useEffect(() => {
    if (!shape) return;
    setToolSelected("RunRoi");
    // console.log(viewerId);
    const addToFeed = async () => {
      // console.log("added");
      // console.log("shape", shape);
      const message = createAnnotationMessage({
        slideId,
        shape,
        viewer,
        type: "rect",
        isClosed: true,
        addLocalRegion: addLocalRegion ? true : false
      });

console.log(message);
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
    setFabricOverlayState(updateTool({ tool: "Square" }));
  };

  const handleSave = ({ text, tag }) => {
    shape.set({ text, tag });
    setTextbox(true);
    onClose();
  };

  const handleClose = () => {
    shape.set({ text: "" });
    setTextbox(true);
    onClose();
  };

  return (
    <IconButton
      icon={isActive ? <SquareIconSelected /> : <SquareIcon />}
      onClick={() => {
        handleClick();
        setToolSelected("RectangleTool");
        toast({
          title: "Rectangle annotation tool selected",
          status: "success",
          duration: 1500,
          isClosable: true,
        });
      }}
      borderRadius={0}
      bg={isActive ? "#DEDEDE" : "#F6F6F6"}
      title="Rectangular Annotations"
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

export default Square;
