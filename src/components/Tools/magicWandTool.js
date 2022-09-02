import React, { useEffect, useState } from "react";
import axios from "axios";
import { IconButton, Image, useToast } from "@chakra-ui/react";
import { VscWand } from "react-icons/vsc";
import TypeButton from "../typeButton";
import { useFabricOverlayState } from "../../state/store";
import {
  updateTool,
  addToActivityFeed,
} from "../../state/actions/fabricOverlayActions";
import {
  createAnnotationMessage,
  getFileBucketFolder,
  getZoomValue,
  saveAnnotationToDB,
  createContour,
  getViewportBounds,
} from "../../utility";

const MagicWandTool = ({ viewerId, onSaveAnnotation, setTotalCells }) => {
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { color, viewerWindow, activeTool } = fabricOverlayState;
  const { fabricOverlay, viewer, activityFeed, slideId, tile } =
    viewerWindow[viewerId];
  const [zoomValue, setZoomValue] = useState(1);
  const toast = useToast();

  const isActive = activeTool === "MagicWand";

  useEffect(() => {
    if (!fabricOverlay || !isActive) return null;
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
    if (!viewer) return null;
    const handleZoomValueChange = () => {
      setZoomValue(getZoomValue(viewer));
    };

    handleZoomValueChange();
    viewer.addHandler("zoom", handleZoomValueChange);
    return () => {
      viewer.removeHandler("zoom", handleZoomValueChange);
    };
  }, [viewer]);

  useEffect(() => {
    if (!fabricOverlay || !isActive) return null;
    const canvas = fabricOverlay.fabricCanvas();

    const { x: left, y: top, width, height } = getViewportBounds(viewer);

    // get s3 folder key of tile
    const key = getFileBucketFolder(tile);

    // // initiate analysis, sending viewport coordinates and s3 folder key
    // const initiateAnalysis = async (body) => {
    //   await axios.post(
    //     "https://development-morphometry-api.prr.ai/vhut/click/init",
    //     body
    //   );
    //   const shape = { ...body, type: "viewport" };
    // };

    // initiateAnalysis({ left, top, width, height, key, type: "rect" });

    // create annotation of cell
    const createContours = async (body) => {
      // get cell data from the clicked position in viewer
      const resp = await axios.post(
        "https://development-morphometry-api.prr.ai/vhut/click/xy",
        body
      );

      // if the click positon is a cell, create annotation
      // also add it the annotation feed
      if (resp && typeof resp.data === "object") {
        const { contour, area, centroid, perimeter, end_points, type } =
          resp.data;

        const shape = createContour({ contour, color, left, top });

        const message = createAnnotationMessage({ shape, viewer });

        if (!message || !message.object) return null;

        message.object.set({
          area,
          perimeter,
          centroid,
          end_points,
          classType: type,
          isAnalysed: true,
        });

        saveAnnotationToDB({
          slideId,
          annotation: message.object,
          onSaveAnnotation,
        });

        canvas.add(shape).requestRenderAll();
        setTotalCells((state) => state + 1);
        setFabricOverlayState(
          addToActivityFeed({
            id: viewerId,
            feed: message,
          })
        );
      }
    };

    const handleMouseDown = (options) => {
      if (!options) return;
      const { x, y } = canvas.getPointer(options.e);

      createContours({
        left,
        top,
        width,
        height,
        key,
        click_x: x - left,
        click_y: y - top,
      });
    };

    canvas.on("mouse:down", handleMouseDown);

    return () => {
      canvas.off("mouse:down", handleMouseDown);
    };
  }, [isActive, fabricOverlay]);

  const handleClick = () => {
    setFabricOverlayState(updateTool({ tool: "MagicWand" }));
  };

  return (
    <IconButton
      icon={<VscWand size={24} color={isActive ? "#3B5D7C" : "#000"} />}
      onClick={() => {
        handleClick();
        toast({
          title: "Magic wand tool selected",
          status: "success",
          duration: 1500,
          isClosable: true,
        });
      }}
      borderRadius={0}
      bg={isActive ? "#DEDEDE" : "#F6F6F6"}
      title="Magic Wand"
      disabled={zoomValue < 40}
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

export default MagicWandTool;
