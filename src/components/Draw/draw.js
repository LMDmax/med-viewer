import React, { useState, useEffect, useRef } from "react";
import { FaPaintBrush } from "react-icons/fa";
import { BsPencil } from "react-icons/bs";
import {
  useMediaQuery,
  useDisclosure,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { fabric } from "openseadragon-fabricjs-overlay";
import md5 from "md5";
import useHexRGB from "../../utility/use-hex-rgb";
import { fonts } from "../Text/fontPicker";
import {
  createAnnotationMessage,
  getCanvasImage,
  getScaleFactor,
  saveAnnotationsToDB,
} from "../../utility/utility";
import TypeButton from "../typeButton";
import EditText from "../Feed/editText";
import { widths } from "./width";
import { useFabricOverlayState } from "../../state/store";
import {
  addToActivityFeed,
  updateTool,
} from "../../state/actions/fabricOverlayActions";

const getDrawCursor = (brushSize, brushColor) => {
  brushSize = brushSize < 4 ? 8 : brushSize * 3;
  const circle = `
		<svg
			height="${brushSize}"
			fill="${brushColor}"
			viewBox="0 0 ${brushSize * 2} ${brushSize * 2}"
			width="${brushSize}"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle
				cx="50%"
				cy="50%"
				r="${brushSize}" 
			/>
		</svg>
	`;

  return `data:image/svg+xml;base64,${window.btoa(circle)}`;
};

const createFreeDrawingCursor = (brushWidth, brushColor) => {
  return `url(${getDrawCursor(brushWidth, brushColor)}) ${brushWidth / 2} ${
    brushWidth / 2
  }, crosshair`;
};

const Draw = ({ viewerId, saveAnnotationsHandler }) => {
  const toast = useToast();
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { color, viewerWindow, activeTool } = fabricOverlayState;

  const { fabricOverlay, viewer, slideId } = viewerWindow[viewerId];

  const isActive = activeTool === "DRAW";

  const [path, setPath] = useState(null);
  const [textbox, setTextbox] = useState(false);

  const [myState, setState] = useState({
    width: widths[0],
    isActive: false,
  });
  const myStateRef = useRef(myState.isActive);
  const setMyState = (data) => {
    myStateRef.current = data;
    setState((state) => ({ ...state, isActive: data }));
  };
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    setMyState(isActive);
  }, [isActive]);

  useEffect(() => {
    if (!fabricOverlay || !isActive) return null;
    const canvas = fabricOverlay.fabricCanvas();

    // // Create new Textbox instance and add it to canvas
    // const createTextbox = ({ left, top, height }) => {
    //   const tbox = new fabric.IText("", {
    //     left,
    //     top: top + height + 10,
    //     fontFamily: fonts[0].fontFamily,
    //     fontSize,
    //     fontWeight: "bold",
    //     selectionBackgroundColor: "rgba(255, 255, 255, 0.5)",
    //   });

    //   fabricOverlay.fabricCanvas().add(tbox);
    //   canvas.setActiveObject(tbox);
    //   tbox.enterEditing();
    // };

    // to set path when draw completes
    const pathCreated = (event) => {
      canvas.selection = true;
      setPath(event.path);
    };

    function handleMouseDown(event) {
      if (event.button !== 1 || !myStateRef.current.isActive) return;
      // Need this as double protection to make sure OSD isn't swallowing
      // Fabric's drawing mode for some reason
      canvas.selection = false;
      viewer.setMouseNavEnabled(false);
      viewer.outerTracker.setTracking(false);
    }

    const brushWidth = myState.width.pixelWidth;
    const scaleFactor = getScaleFactor(viewer);
    // Enable Fabric drawing; disable OSD mouseclicks
    viewer.setMouseNavEnabled(false);
    viewer.outerTracker.setTracking(false);
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush.color = color.hex;
    canvas.freeDrawingBrush.width = brushWidth / scaleFactor;
    canvas.renderAll();

    // EXAMPLE: of using an image for cursor
    // https://i.stack.imgur.com/fp7eL.png
    // canvas.freeDrawingCursor = `url(${logo}) 0 50, auto`;

    canvas.freeDrawingCursor = createFreeDrawingCursor(brushWidth, color.hex);

    canvas.on("path:created", pathCreated);
    canvas.on("mouse:down", handleMouseDown);

    // Remove handler
    return () => {
      canvas.off("path:created", pathCreated);
      canvas.off("mouse:down", handleMouseDown);

      // Disable Fabric drawing; enable OSD mouseclicks
      viewer.setMouseNavEnabled(true);
      viewer.outerTracker.setTracking(true);
      canvas.isDrawingMode = false;
      canvas.freeDrawingCursor = "";
    };
  }, [isActive]);

  useEffect(() => {
    // Update brush color and size with Fabric
    if (!fabricOverlay || !isActive) return;

    const canvas = fabricOverlay.fabricCanvas();
    const brushWidth = myState.width.pixelWidth;
    const scaleFactor = getScaleFactor(viewer);

    canvas.freeDrawingBrush.color = color.hex;
    canvas.freeDrawingBrush.width = brushWidth / scaleFactor;
    canvas.freeDrawingCursor = createFreeDrawingCursor(brushWidth, color.hex);
  }, [color, myState.width]);

  // group drawing (path) and textbox together
  // first remove both from canvas then group them and then add group to canvas
  useEffect(() => {
    if (!path) return;

    const addToFeed = async () => {
      const message = createAnnotationMessage({ shape: path, viewer });

      saveAnnotationsToDB({
        slideId,
        canvas: fabricOverlay.fabricCanvas(),
        saveAnnotationsHandler,
      });

      setFabricOverlayState(
        addToActivityFeed({
          id: viewerId,
          feed: message,
        })
      );

      setPath(null);
      setTextbox(false);

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
    };

    addToFeed();

    // change tool back to move
    setFabricOverlayState(updateTool({ tool: "Move" }));
  }, [path]);

  const handleToolbarClick = () => {
    setFabricOverlayState(updateTool({ tool: "DRAW" }));
  };

  const handleSave = ({ text, tag }) => {
    path.set({ isExist: true, text, tag });
    setTextbox(true);
    onClose();
  };

  const handleClose = () => {
    path.set({ isExist: true, text: "" });
    setTextbox(true);
    onClose();
  };

  return (
    <IconButton
      icon={<BsPencil size={20} color={isActive ? "#3B5D7C" : "#000"} />}
      onClick={() => {
        handleToolbarClick();
        toast({
          title: "Free hand annotation draw tool selected",
          status: "success",
          duration: 1500,
          isClosable: true,
        });
      }}
      borderRadius={0}
      bg={isActive ? "#DEDEDE" : "#F6F6F6"}
      title="Free Draw"
      _focus={{ border: "none" }}
      boxShadow={
        isActive
          ? "inset -2px -2px 2px rgba(0, 0, 0, 0.1), inset 2px 2px 2px rgba(0, 0, 0, 0.1)"
          : null
      }
    />
  );
};

export default Draw;
