import React, { useEffect, useState } from "react";
import axios from "axios";
import { IconButton, useToast } from "@chakra-ui/react";
import { VscWand } from "react-icons/vsc";
import { useMutation, useSubscription } from "@apollo/client";
import { useFabricOverlayState } from "../../state/store";
import {
  updateTool,
  addToActivityFeed,
  updateIsViewportAnalysing,
} from "../../state/actions/fabricOverlayActions";
import {
  createAnnotationMessage,
  getFileBucketFolder,
  getZoomValue,
  saveAnnotationToDB,
  createContour,
  getViewportBounds,
} from "../../utility";
import { VHUT_ANALYSIS_SUBSCRIPTION, VHUT_VIEWPORT_ANALYSIS } from "../../graphql/annotaionsQuery";

const cellColor = {
  Neutrophil: { hex: "#FFFF00" },
  Epithelial: { hex: "#FF0000" },
  Lymphocyte: { hex: "#00FFFF" },
  Plasma: { hex: "#8FED66" },
  Eosinohil: { hex: "#FF00FF" },
  Connective: { hex: "#FFA500" },
};

const MagicWandTool = ({
  userInfo,
  viewerId,
  onSaveAnnotation,
  toolSelected,
  setToolSelected,
  setTotalCells,
}) => {
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { viewerWindow, activeTool } = fabricOverlayState;
  const { fabricOverlay, viewer, slideId, originalFileUrl } =
    viewerWindow[viewerId];
  const [zoomValue, setZoomValue] = useState(1);


  const toast = useToast();

  const isActive = activeTool === "MagicWand";

  useEffect(() => {
    if (isActive) return;
    setFabricOverlayState(updateIsViewportAnalysing(false));
  }, [isActive, setFabricOverlayState]);

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
    if (!viewer) return;
    const handleZoomValueChange = () => {
      setZoomValue(getZoomValue(viewer));
    };

    handleZoomValueChange();
    viewer.addHandler("zoom", handleZoomValueChange);
    return () => {
      viewer.removeHandler("zoom", handleZoomValueChange);
    };
  }, [viewer]);

  const [onVhutViewportAnalysis] = useMutation(VHUT_VIEWPORT_ANALYSIS);

  useEffect(() => {
    if (!fabricOverlay || !isActive) return;
    const canvas = fabricOverlay.fabricCanvas();

    const { x: left, y: top, width, height } = getViewportBounds(viewer);

    // get s3 folder key of originalFileUrl
    const key = getFileBucketFolder(originalFileUrl);

    // initiate analysis, sending viewport coordinates and s3 folder key
    const initiateAnalysis = async (body) => {
      try {
        onVhutViewportAnalysis({
          variables: { body },
        });
      } catch (error) {
        // console.log(error);
        setFabricOverlayState(updateTool({ tool: "Move" }));
        toast({
          title: "Viewport Analysing",
          description: "Failed, try  again",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        setFabricOverlayState(updateIsViewportAnalysing(false));
      }
    };



    initiateAnalysis({
      left,
      top,
      width,
      height,
      key,
      type: "viewport",
      slideId,
    });

    // create annotation of cell
    const createContours = async (body) => {
      // get cell data from the clicked position in viewer
      const resp = await axios.post(
        "https://backup-quantize-vhut.prr.ai/vhut/click/xy",
        body
      );
        // console.log(body);
      // if the click positon is a cell, create annotation
      // also add it the annotation feed
      if (resp && typeof resp.data === "object") {
        const { contour, area, centroid, perimeter, end_points, type } =
          resp.data;

        const shape = createContour({
          contour,
          color: cellColor[type],
          left,
          top,
        });

        const message = createAnnotationMessage({ shape, viewer });

        if (!message || !message.object) return;

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
      } else if (resp && typeof resp.data === "string") {
        toast({
          status: "info",
          title: "No cell detected!",
          isClosable: true,
          duration: 1500,
        });
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
    setFabricOverlayState(updateIsViewportAnalysing(true));
  };

  const { data: vhutSubscriptionData, error: vhutSubscription_error } =
  useSubscription(VHUT_ANALYSIS_SUBSCRIPTION, {
    variables: {
      body: {
        slideId,
      },
    },
  });

  useEffect(()=>{
    if (vhutSubscriptionData) {
      // console.log("subscribed", vhutSubscriptionData);
      // console.log("subscribedError", vhutSubscription_error);
      const {
        data,
        status,
        message,
        analysisType: type,
      } = vhutSubscriptionData.analysisStatus;

      if (type === "VIEWPORT_ANALYSIS" && data.results !== null){
          // console.log(data.results[0]);
    const canvas = fabricOverlay.fabricCanvas();
          const neutrophilContours = data.results[0].contours;
          const EpithelialContours = data.results[1].contours;
          const LympocyteContours = data.results[2].contours;
          const PlasmaContours = data.results[3].contours;
          const EosinohilContours = data.results[4].contours;
          const ConnectiveContours = data.results[5].contours;
    const { x: left, y: top, width, height } = getViewportBounds(viewer);
    const neutrophile = neutrophilContours?.flat().map((coords) => {
      // Map each nested array of coordinates to a Point object
      const points = coords.map((coord) => {
        return {
          x: coord[0][0] + left,
          y: coord[0][1] + top,
        };
      });
      
      // Create and return a new fabric.js Polygon object
      return new fabric.Polygon(points, {
        stroke: 'black',
        strokeWidth: 1,
        fill: '',
        opacity: 0.7,
        strokeUniform: true,
      });
    });
    const epithelial = EpithelialContours?.flat().map((coords) => {
      // Map each nested array of coordinates to a Point object
      const points = coords.map((coord) => {
        return {
          x: coord[0][0] + left,
          y: coord[0][1] + top,
        };
      });
      
      // Create and return a new fabric.js Polygon object
      return new fabric.Polygon(points, {
        stroke: 'black',
        strokeWidth: 1,
        fill: '',
        opacity: 0.7,
        strokeUniform: true,
      });
    });
    const lymphocyte = LympocyteContours?.flat().map((coords) => {
      // Map each nested array of coordinates to a Point object
      const points = coords.map((coord) => {
        return {
          x: coord[0][0] + left,
          y: coord[0][1] + top,
        };
      });
      
      // Create and return a new fabric.js Polygon object
      return new fabric.Polygon(points, {
        stroke: 'black',
        strokeWidth: 1,
        fill: '',
        opacity: 0.7,
        strokeUniform: true,
      });
    });
    const plasma = PlasmaContours?.flat().map((coords) => {
      // Map each nested array of coordinates to a Point object
      const points = coords.map((coord) => {
        return {
          x: coord[0][0] + left,
          y: coord[0][1] + top,
        };
      });
      
      // Create and return a new fabric.js Polygon object
      return new fabric.Polygon(points, {
        stroke: 'black',
        strokeWidth: 1,
        fill: '',
        opacity: 0.7,
        strokeUniform: true,
      });
    });
    const eosinoil = EosinohilContours?.flat().map((coords) => {
      // Map each nested array of coordinates to a Point object
      const points = coords.map((coord) => {
        return {
          x: coord[0][0] + left,
          y: coord[0][1] + top,
        };
      });
      
      // Create and return a new fabric.js Polygon object
      return new fabric.Polygon(points, {
        stroke: 'black',
        strokeWidth: 1,
        fill: '',
        opacity: 0.7,
        strokeUniform: true,
      });
    });
    const connective = ConnectiveContours?.flat().map((coords) => {
      // Map each nested array of coordinates to a Point object
      const points = coords.map((coord) => {
        return {
          x: coord[0][0] + left,
          y: coord[0][1] + top,
        };
      });
      
      // Create and return a new fabric.js Polygon object
      return new fabric.Polygon(points, {
        stroke: 'black',
        strokeWidth: 1,
        fill: '',
        opacity: 0.7,
        strokeUniform: true,
      });
    });
    const t = new fabric.Group(
      [...neutrophile, ...epithelial, ...lymphocyte, ...plasma, ...eosinoil, ...connective],
      {
        selectable: false,
        lockMovementX: false,
        lockMovementY: false,
        lockRotation: false,
        lockScalingX: false,
        lockScalingY: false,
        lockUniScaling: false,
        hoverCursor: "auto",
        evented: false,
        stroke: "",
        strokeWidth: 1,
        objectCaching: false,
      })
    
    // // Add the Polygon objects to the canvas and request a render
    // console.log(roi2);
    setToolSelected("MagicWand");
    canvas.add(t).bringToFront().requestRenderAll();
      }
    }
  },[vhutSubscriptionData])

  return (
    <IconButton
      icon={<VscWand size={24} color={isActive ? "#3B5D7C" : "#000"} />}
      onClick={() => {
        handleClick();
        toast({
          title: "Magic wand tool selected",
          status: "success",
          duration: 500,
          isClosable: true,
        });
      }}
      borderRadius={0}
      bg={isActive ? "#DEDEDE" : "#F6F6F6"}
      title="Magic Wand"
      disabled={zoomValue < 20}
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
