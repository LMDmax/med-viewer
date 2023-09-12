import React, { useState, useEffect, useRef } from "react";
import { fabric } from "openseadragon-fabricjs-overlay";
import { IconButton, useDisclosure, useToast } from "@chakra-ui/react";
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
import { PolygonIcon, PolygonIconFilled } from "../Icons/CustomIcons";

const MAX = 999999;
const MIN = 99;

const Polygon = ({ viewerId, onSaveAnnotation, setToolSelected }) => {
  const toast = useToast();
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { color, viewerWindow, activeTool } = fabricOverlayState;

  const { fabricOverlay, viewer, slideId } = viewerWindow[viewerId];

  const isActive = activeTool === "Polygon";

  const [shape, setShape] = useState(null);
  const [textbox, setTextbox] = useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const arrayRef = useRef({
    pointArray: [],
    lineArray: [],
  });
  const myStateRef = useRef({
    activeLine: null,
    activeShape: null,
    color,
  });

  const setState = (data) => {
    myStateRef.current = { ...myStateRef.current, ...data };
  };
  const setArrayRef = (data) => {
    arrayRef.current = { ...arrayRef, ...data };
  };

  useEffect(() => {
    setState({ color });
  }, [color.hex]);

  useEffect(() => {
    if (!fabricOverlay || !isActive) return;
    const canvas = fabricOverlay.fabricCanvas();
    canvas.defaultCursor = "crosshair";

    // Disable OSD mouseclicks
    viewer.setMouseNavEnabled(false);
    viewer.outerTracker.setTracking(false);

    return () => {
      // Enable OSD mouseclicks
      viewer.setMouseNavEnabled(true);
      viewer.outerTracker.setTracking(true);
    };
  }, [isActive, fabricOverlay]);

  useEffect(() => {
    if (!fabricOverlay || !isActive) return;
    const canvas = fabricOverlay.fabricCanvas();

    const generatePolygon = async () => {
      const points = [];
      arrayRef.current.pointArray.forEach((point) => {
        points.push({
          x: point.left,
          y: point.top,
        });
        canvas.remove(point);
      });
      arrayRef.current.lineArray.forEach((line) => {
        canvas.remove(line);
      });
      canvas
        .remove(myStateRef.current.activeShape)
        .remove(myStateRef.current.activeLine);

      const scaleFactor = getScaleFactor(viewer);
      const polygon = new fabric.Polygon(points, {
        stroke: "black",
        strokeWidth: 2 / scaleFactor,
        fill: "",
        strokeUniform: true,
      });
      canvas.add(polygon);
      setState({
        activeLine: null,
        activeShape: null,
      });

      setArrayRef({ pointArray: [], lineArray: [] });
      canvas.renderAll();
      setShape(polygon);
    };

    const addPoints = (event) => {
      const random = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
      const id = new Date().getTime() + random;
      const pointer = canvas.getPointer(event.e);
      const scaleFactor = getScaleFactor(viewer);

      const circle = new fabric.Circle({
        radius: 4 / scaleFactor,
        fill: "#ffffff",
        stroke: "#333333",
        strokeWidth: 2 / scaleFactor,
        left: pointer.x,
        top: pointer.y,
        selectable: false,
        hasBorders: false,
        hasControls: false,
        originX: "center",
        originY: "center",
        id,
        objectCaching: false,
      });
      if (arrayRef.current.pointArray.length === 0) {
        circle.set({
          fill: "red",
        });
      }
      let points = [pointer.x, pointer.y, pointer.x, pointer.y];
      const line = new fabric.Line(points, {
        strokeWidth: 2 / scaleFactor,
        fill: `${myStateRef.current.color.hex}40`,
        stroke: "black",
        class: "line",
        originX: "center",
        originY: "center",
        selectable: false,
        hasBorders: false,
        hasControls: false,
        evented: false,
        objectCaching: false,
      });

      let polygon = null;

      if (myStateRef.current.activeShape) {
        points = myStateRef.current.activeShape.get("points");
        points.push({
          x: pointer.x,
          y: pointer.y,
        });
        polygon = new fabric.Polygon(points, {
          stroke: "black",
          strokeWidth: 2 / scaleFactor,
          fill: `${myStateRef.current.color.hex}40`,
          selectable: false,
          hasBorders: false,
          hasControls: false,
          evented: false,
          objectCaching: false,
        });
        canvas.remove(myStateRef.current.activeShape);
      } else {
        const polyPoint = [
          {
            x: pointer.x,
            y: pointer.y,
          },
        ];
        polygon = new fabric.Polygon(polyPoint, {
          stroke: "black",
          strokeWidth: 2 / scaleFactor,
          fill: `${myStateRef.current.color.hex}40`,
          selectable: false,
          hasBorders: false,
          hasControls: false,
          evented: false,
          objectCaching: false,
        });
      }

      setState({ activeShape: polygon, activeLine: line });
      setArrayRef({
        pointArray: [...arrayRef.current.pointArray, circle],
        lineArray: [...arrayRef.current.lineArray, line],
      });

      canvas.add(polygon);
      canvas.add(line);
      canvas.add(circle);
      canvas.selection = false;
      canvas.renderAll();
    };

    const handleMouseDown = (event) => {
      if (event.button !== 1) return;
      if (
        arrayRef.current.pointArray.length !== 0 &&
        event.target &&
        event.target.id === arrayRef.current.pointArray[0].id
      ) {
        canvas.selection = true;
        generatePolygon();
      } else {
        addPoints(event);
      }
    };

    const handleMouseMove = (event) => {
      if (
        myStateRef.current.activeLine &&
        myStateRef.current.activeLine.class === "line"
      ) {
        const pointer = canvas.getPointer(event.e);
        myStateRef.current.activeLine.set({ x2: pointer.x, y2: pointer.y });

        const points = myStateRef.current.activeShape.get("points");
        points[arrayRef.current.pointArray.length] = {
          x: pointer.x,
          y: pointer.y,
        };
        myStateRef.current.activeShape.set({
          points,
        });
        canvas.renderAll();
      }
    };

    const handleMouseDblClick = (event) => {
      if (event.button !== 1 || arrayRef.current.pointArray.length === 0)
        return;
      if (
        event.target &&
        event.target.id !== arrayRef.current.pointArray[0].id
      ) {
        addPoints(event);
      }
      canvas.selection = true;
      generatePolygon();
    };

    // add handlers
    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:dblclick", handleMouseDblClick);

    // remove handlers
    return () => {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:move", handleMouseMove);
      canvas.off("mouse:dblclick", handleMouseDblClick);
    };
  }, [fabricOverlay, isActive]);

  useEffect(() => {
    if (!shape) return;
    setToolSelected("RunRoi");

    const addToFeed = async () => {
      const message = createAnnotationMessage({ slideId, shape, viewer, type:"polygon",isClosed:true, });

      saveAnnotationToDB({
        slideId,
        annotation: message.object,
        onSaveAnnotation,
      });

      setFabricOverlayState(addToActivityFeed({ id: viewerId, feed: message }));

      setShape(null);
      setTextbox(false);
    };

    addToFeed();

    // change tool back to move
    setFabricOverlayState(updateTool({ tool: "Move" }));
  }, [shape]);

  const handleClick = () => {
    setFabricOverlayState(updateTool({ tool: "Polygon" }));
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
      icon={isActive ? <PolygonIconFilled /> : <PolygonIcon />}
      onClick={() => {
        handleClick();
				setToolSelected("PolygonTool");
        toast({
          title: "Polygon annotation tool selected",
          status: "success",
          duration: 1500,
          isClosable: true,
        });
      }}
      borderRadius={0}
      bg={isActive ? "#DEDEDE" : "#F6F6F6"}
      title="Free Hand Polygon Annotations"
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

export default Polygon;
