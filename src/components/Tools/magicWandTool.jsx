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
  Neutrophil: { hex: "#9800FF" },
  Epithelial: { hex: "#0008FF" },
  Lymphocyte: { hex: "#00F6FF" },
  Plasma: { hex: "#2AFF00" },
  Eosinohil: { hex: "#FAFF00" },
  Connective: { hex: "#478C9E" },
};

const MagicWandTool = ({
  userInfo,
  viewerId,
  onSaveAnnotation,
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

  // const { data: vhutSubscriptionData, error: vhutSubscription_error } =
  // useSubscription(VHUT_ANALYSIS_SUBSCRIPTION, {
  //   variables: {
  //     body: {
  //       slideId,
  //     },
  //   },
  // });
//   useEffect(() => {
//     if (vhutSubscriptionData) {
//       console.log("subscribed", vhutSubscriptionData);
//       console.log("subscribedError", vhutSubscription_error);
//       const {
//         data,
//         status,
//         message,
//         analysisType: type,
//       } = vhutSubscriptionData.analysisStatus;
//       if (type === "VIEWPORT_ANALYSIS" && data?.results !== null) {
//        console.log(data.results[0]);
//         if (data && data.isAnalysed )
//           setFabricOverlayState(updateIsViewportAnalysing(false));
//       console.log(data?.results[0]?.contours.flat(2));
//       const color = "#2Aff00";
//       const canvas = fabricOverlay?.fabricCanvas();

//       const roi = data?.results[0]?.contours.flat(2);

//       const roi2 = roi?.map((tumor_cord) => {
//         // console.log(tumor_cord);
//         // console.log(tumorCords);
//         const points2 = tumor_cord.map((point2) => ({
//           x: point2[0],
//           y: point2[1],
//         }));
//         return new fabric.Polygon(points2, {
//           stroke: `${color}83`,
//           strokeWidth: 1.2,
//           fill: "green",
//           opacity: 0.2,
//           strokeUniform: true,
//         });
//       });
// canvas.add(roi2).requestRenderAll();
      
//     //   const pathString = roi.reduce((acc, val, idx, arr) => {
//     //     if (idx === 0) {
//     //       return `M ${val} `;
//     //     } else if (idx % 4 === 1) {
//     //       return `${acc} Q ${arr[idx - 1]} ${arr[idx]} `;
//     //     } else if (idx === arr.length - 2) {
//     //       return `${acc} L ${arr[idx]} ${arr[idx + 1]} `;
//     //     } else {
//     //       return acc;
//     //     }
//     //   }, '');
    
//     //   // Create the path object
//     //   const path = new fabric.Path(pathString, {
//     //     stroke: 'black',
//     //     fill: '',
//     //     strokeWidth: 3,
//     //   });
    
//     //   // Scale down the path to fit within the canvas
//     //   const pathWidth = path.width;
//     //   const pathHeight = path.height;
//     //   const canvasWidth = canvas.width;
//     //   const canvasHeight = canvas.height;
//     //   const scaleFactor = Math.min(canvasWidth / pathWidth, canvasHeight / pathHeight);
//     //   path.scale(scaleFactor);
//     // console.log(scaleFactor);
//     //   // Add the path to the canvas and render it
//     //   canvas.add(path);
//     //   canvas.renderAll();
      
      
      

//       }
//     }
//   }, [vhutSubscriptionData]);

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
        console.log(body);
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
