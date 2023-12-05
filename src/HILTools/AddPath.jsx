import React, { useState, useEffect, useRef } from "react";
import { BsPencil } from "react-icons/bs";
import {
  useDisclosure,
  IconButton,
  useToast,
  Box,
  Flex,
  Tooltip,
} from "@chakra-ui/react";
import {
  createAnnotationMessage,
  getScaleFactor,
  saveAnnotationToDB,
} from "../utility";
import { widths } from "../components/Draw/width";
import { useFabricOverlayState } from "../state/store";
import {
  addToActivityFeed,
  updateTool,
} from "../state/actions/fabricOverlayActions";

const getDrawCursor = (brushSize, brushColor) => {
  brushSize = brushSize < 4 ? 8 : brushSize * 3;
  const circle = `
		<svg
			height="${brushSize}"
			fill="black"
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

const AddPath = ({
  viewerId,
  onSaveAnnotation,
  setToolSelected,
  selectedPattern,
  isHILToolEnabled,
  newToolSettings,
  setMaskAnnotationData,
}) => {
  const toast = useToast();
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { color, viewerWindow, activeTool } = fabricOverlayState;

  const { fabricOverlay, viewer, slideId } = viewerWindow[viewerId];

  const isActive = activeTool === "ADDPATH";

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
    if (!fabricOverlay || !isActive) return;
    const canvas = fabricOverlay.fabricCanvas();

    // to set path when draw completes
    const pathCreated = (event) => {
      canvas.selection = false;
      setPath(event.path);
    };

    function handleMouseDown(event) {
      canvas.selection = false;
      viewer.setMouseNavEnabled(false);
      viewer.outerTracker.setTracking(false);
    }

    const brushWidth = myState.width.pixelWidth;
    const scaleFactor = getScaleFactor(viewer);
    canvas.isDrawingMode = true;
    canvas.selection = true;
    canvas.freeDrawingBrush.color = newToolSettings.strokeColor || "black";
    canvas.freeDrawingBrush.width = brushWidth / scaleFactor;
    canvas.renderAll();

    // EXAMPLE: of using an image for cursor
    // https://i.stack.imgur.com/fp7eL.png
    // canvas.freeDrawingCursor = `url(${logo}) 0 50, auto`;

    canvas.freeDrawingCursor = createFreeDrawingCursor(brushWidth, color.hex);

    canvas.on("mouse:down", handleMouseDown);
    canvas.on("path:created", pathCreated);

    // Remove handler
    return () => {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("path:created", pathCreated);

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

    const canvas = fabricOverlay.fabricCanvas();
    const pathLength = path.path.length;
    // Check if the path is closed
    const startingPoint = path.path[0];
    const endingPoint = path.path[pathLength - 1];
    const x1 = startingPoint[1];
    const y1 = startingPoint[2];
    const x2 = endingPoint[1];
    const y2 = endingPoint[2];

    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    // console.log(distance);

    if (distance < 20 && path.path.length > 2) {
      // console.log("Path is closed");
      const addToFeed = async () => {
        const message = createAnnotationMessage({
          slideId,
          shape: path,
          viewer,
          type: "path",
          isClosed: path.isClosed,
          modelName: "Gleason",
          isProcessed: false,
          patternName:
            selectedPattern === "Pattern 3"
              ? "3"
              : selectedPattern === "Pattern 4"
              ? "4"
              : selectedPattern === "Pattern 5"
              ? "5"
              : selectedPattern === "Benign"
              ? "0"
              : "",
          processType: "add",
        });

        setMaskAnnotationData((prevData) => [...prevData, message]);

        saveAnnotationToDB({
          slideId,
          annotation: message.object,
          onSaveAnnotation,
        });

        path.isClosed = true;
      };
      addToFeed();
    } else {
      // console.log("Path is open");
      setTimeout(() => {
        const canvas = fabricOverlay.fabricCanvas();
        const objects = canvas.getObjects();
        const lastObject = objects[objects.length - 1];
        canvas.remove(lastObject);
      }, 2000);
      toast({
        title: "Mask Error",
        description: "Please draw a closed  annotation",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      // add a chakra ui modal here
      // setToolSelected("pathError");
      // console.log("path is open");
      path.isClosed = false;
    }

    if (path.path.length > 2) {
    }
    if (path.path.length <= 2) {
      const canvas = fabricOverlay.fabricCanvas();
      const objects = canvas.getObjects();
      const lastObject = objects[objects.length - 1];
      canvas.remove(lastObject);
      toast({
        title: "Please Draw Again",
        status: "error",
        duration: 500,
        isClosable: true,
      });
    }

    // change tool back to move
    setFabricOverlayState(updateTool({ tool: "Move" }));
  }, [path]);

  const handleToolbarClick = () => {
    setFabricOverlayState(updateTool({ tool: "ADDPATH" }));
  };


  console.log({isHILToolEnabled});

  return (
    <Tooltip
      label="Add Selection"
      hasArrow
      bg="#D8E7F3"
      color="black"
      fontSize="xs"
    >
      <Flex
        justifyContent="center"
        alignItems="center"
        bg={isActive ? "#DEDEDE" : "#F6F6F6"}
        w="40px"
        h="39px"
        p="5px"
        _focus={{ border: "none" }}
        onClick={() => {
          if (isHILToolEnabled) {
            handleToolbarClick();
            setToolSelected("AddMask");
          }
        }}
        boxShadow={
          isActive
            ? "inset -2px -2px 2px rgba(0, 0, 0, 0.1), inset 2px 2px 2px rgba(0, 0, 0, 0.1)"
            : null
        }
        _hover={isHILToolEnabled ? { bgColor: "rgba(228, 229, 232, 1)" } : ""}
        cursor={isHILToolEnabled ? "pointer" : "not-allowed"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
        >
          <path
            d="M6.5 12V11.5H6H0.5V0.5H11.5V6V6.5H12H17.5V17.5H6.5V12Z"
            stroke={
              isActive
                ? "#3B5D7C" // if isActive is true
                : isHILToolEnabled
                ? "#000" // if isHILToolEnabled is true and isActive is false
                : "grey" // if isHILToolEnabled is false
            }
          />
        </svg>
      </Flex>
    </Tooltip>
  );
};

export default AddPath;
