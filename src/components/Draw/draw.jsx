import React, { useState, useEffect, useRef } from "react";
import { BsPencil } from "react-icons/bs";
import { useDisclosure, IconButton, useToast } from "@chakra-ui/react";
import {
  createAnnotationMessage,
  getScaleFactor,
  saveAnnotationToDB,
} from "../../utility";
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

const Draw = ({ viewerId, onSaveAnnotation, setToolSelected }) => {
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
    canvas.freeDrawingBrush.color = "black";
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
      
      if (distance < 5) {
        // console.log("Path is closed");
      setToolSelected("RunRoi");
      path.isClosed = true;


      } else {
        // console.log("Path is open");
      setToolSelected("pathError");
      // console.log(path);
      path.isClosed = false;

      }
  
  
    if (path.path.length > 2) {
      const addToFeed = async () => {
        const message = createAnnotationMessage({
          slideId,
          shape: path,
          viewer,
          type: "path",
          isClosed: path.isClosed
        });

        // console.log(message.object);

        saveAnnotationToDB({
          slideId,
          annotation: message.object,
          onSaveAnnotation,
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
        setToolSelected("FreeHand");
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
      _hover={{ bgColor: "rgba(228, 229, 232, 1)" }}
    />
  );
};

export default Draw;
