import React, { useEffect, useState, useRef } from "react";
import {
  IconButton,
  Text,
  Tooltip,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import {
  GET_TILS_ANALYSIS,
  TIL_ANALYSIS_SUBSCRIPTION,
} from "../../graphql/annotaionsQuery";
import { fabric } from "openseadragon-fabricjs-overlay";
import { useFabricOverlayState } from "../../state/store";
import TooltipLabel from "../AdjustmentBar/ToolTipLabel";
import { BiTargetLock } from "react-icons/bi";
import { ImTarget } from "react-icons/im";
import IconSize from "../ViewerToolbar/IconSize";
import { useLazyQuery } from "@apollo/client/react";
import { useApolloClient, useSubscription } from "@apollo/client";
import { getFileBucketFolder } from "../../utility";
import { updateTool } from "../../state/actions/fabricOverlayActions";
import ProgressBar from "../Loading/ProgressBar";

const Til = ({
  viewerId,
  viewerIds,
  setNewHilData,
  setToolSelected,
  setStromaArea,
  setTumorArea,
  navigatorCounter,
  setTilScore,
  setLymphocyteCount,
  modelName,
  setLoadUI,
  setTILReady,
  lymphocyteColor,
}) => {
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const [TilHover, setTilHover] = useState(false);
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { viewerWindow } = fabricOverlayState;
  const { fabricOverlay, viewer, slideId } = viewerWindow[viewerId];
  const [tilCords, setTilCords] = useState([]);
  const [tumorCords, setTumorCords] = useState([]);
  const [stromaCords, setStromaCords] = useState([]);
  const [Tilloading, setTilLoading] = useState(true);
  const [cords, setCords] = useState({});
  const [TILPlotted, setTILPlotted] = useState(false);
  const toast = useToast();
  const client = useApolloClient();
  const prevLoadUIRef = useRef(false);
  const [getTils, { data, loading, error, refetch }] =
    useLazyQuery(GET_TILS_ANALYSIS);
  const [
    getTils1,
    { data: data1, loading: loading1, error: error1, refetch: refetch1 },
  ] = useLazyQuery(GET_TILS_ANALYSIS);

  // ------------------------------------------------------------------------------
  // --------------------Use subscription hook fethcing data for 1st time-------------------------------
  // ---------------------------------------------------------------------------------------

  const { data: tilSubscriptionData, error: vhutSubscription_error } =
    useSubscription(TIL_ANALYSIS_SUBSCRIPTION, {
      variables: {
        body: {
          slideId,
        },
      },
    });

  // console.log("tilSubData", lymphocyteColor);

  useEffect(() => {
    if (data?.getTils?.message === "Til found") {
      // console.log("dataQuery", data);
      setTILReady(true);
    }
  }, [data]);

  // chnage lymphocyte color to custoom color

  // useEffect(() => {
  //   if (lymphocyteColor.patternName === "Lymphocytes") {
  //     const canvas = fabricOverlay.fabricCanvas();
  //     var objects = canvas.getObjects();
  //     for (var i = 0; i < objects.length; i++) {
  //       if (objects[i].roiType === "TIL") {
  //         canvas.remove(objects[i]);
  //       }
  //     }
  //     canvas.renderAll();
  //     const lymphocyteCords = data?.getTils?.data?.lymphocyte_cords;
  //     const roi = lymphocyteCords.flat(2).map((TIL_cord) => {
  //       return new fabric.Rect({
  //         top: TIL_cord[1],
  //         left: TIL_cord[0],
  //         width: TIL_cord[2] - TIL_cord[0],
  //         height: TIL_cord[3] - TIL_cord[1],
  //         stroke: `rgba(${lymphocyteColor.color.r}, ${lymphocyteColor.color.g}, ${
  //           lymphocyteColor.color.b
  //         }, ${lymphocyteColor.color.a * 255})`, // Red in RGB format
  //         fill: "transparent",
  //         strokeWidth: 1,
  //         opacity: 1,
  //         strokeUniform: true,
  //         objectCaching: false,
  //       });
  //     });
  //     const t = new fabric.Group([...roi], {
  //       selectable: false,
  //       lockMovementX: false,
  //       lockMovementY: false,
  //       lockRotation: false,
  //       lockScalingX: false,
  //       lockScalingY: false,
  //       lockUniScaling: false,
  //       hoverCursor: "auto",
  //       evented: false,
  //       stroke: "",
  //       strokeWidth: 1,
  //       objectCaching: false,
  //       roiType: "TIL",
  //     });
  //     canvas.add(t).requestRenderAll();
  //   }
  // }, [lymphocyteColor]);

  // console.log(data)
  // ------------------------------
  // ------------- updating state if data found,if hideModification button clicked,if hook data recived
  // ------------------

  useEffect(() => {
    if (data) {
      setStromaArea(data?.getTils?.data?.stroma_area);
      setTumorArea(data?.getTils?.data?.tumor_area);
      setTilScore(data?.getTils?.data?.TILS_score);
      setLymphocyteCount(data?.getTils?.data?.lymphocyte_count);
    }
    if (tilSubscriptionData) {
      setStromaArea(tilSubscriptionData?.tilStatus?.data?.stroma_area);
      setTumorArea(tilSubscriptionData?.tilStatus?.data?.tumor_area);
      setTilScore(tilSubscriptionData?.tilStatus?.data?.TILS_score);
      setLymphocyteCount(
        tilSubscriptionData?.tilStatus?.data?.lymphocyte_count
      );
    }
  }, [data, tilSubscriptionData]);

  // ------------------------------
  // ------------- updating state for existing slide
  // ------------------

  // console.log(tilSubscriptionData);
  useEffect(() => {
    if (!tilSubscriptionData) {
      // console.log("tiles", slideId)
      getTils({
        variables: {
          query: {
            key: `${getFileBucketFolder(viewerIds[0].originalFileUrl)}`,
            bucket_name: "med-ai-image-processor",
            slideId,
            hilRemoved: false,
          },
        },
        fetchPolicy: "network-only",
      });
      // if (data?.getTils?.data) {
      //   // console.log(data);
      //   setTilCords(data?.getTils?.data?.lymphocyte_cords);
      //   setTumorCords(data?.getTils?.data?.tumor_cords);
      //   setStromaCords(data?.getTils?.data?.stroma_cords);
      //   setTilLoading(false);
      // }
    }
    // console.log("data",data);
    // console.log("eror",error);
    // getData();
  }, [tilSubscriptionData, navigatorCounter]);

  useEffect(() => {
    if (navigatorCounter > 0) {
      setTilCords("");
      setTumorCords("");
      setStromaCords("");
    }
  }, [navigatorCounter]);

  // console.log(tilSubscriptionData?.tilStatus);

  // ------------------------------
  // ------------- updating state after drawing stroma, abd refetching data from DB
  // ------------------

  // useEffect(() => {
  //   if (tilSubscriptionData?.tilStatus?.message === "Hil is completed") {
  //     const canvas = fabricOverlay?.fabricCanvas();
  //     canvas.isDrawingMode = false;
  //     // toast({
  //     //   title: "HIL is processed",
  //     //   description: "",
  //     //   status: "success",
  //     //   duration: 1500,
  //     //   isClosable: true,
  //     // });
  //     client.resetStore();
  //     refetch();
  //     setNewHilData(false);
  //     setTimeout(() => {
  //       const canvas = fabricOverlay?.fabricCanvas();
  //       setTimeout(() => {
  //         const canvas = fabricOverlay?.fabricCanvas();
  //         // canvas.isDrawingMode = true;
  //         setTimeout(() => {
  //           setLoadUI(true);
  //           localStorage.removeItem("ModelName");
  //         }, 7000);
  //         setNewHilData(true);
  //       }, 2000);
  //       // console.log(tilSubscriptionData?.tilStatus);
  //     });
  //   }
  // }, [tilSubscriptionData]);

  // ------------------------------
  // ------------- Plotting TIL after hitting refresh button
  // ------------------

  // useEffect(() => {
  //   if (refreshHil > 0) {
  //     setStromaArea(data?.getTils?.data?.stroma_area);
  //     setTumorArea(data?.getTils?.data?.tumor_area);
  //     setTilScore(data?.getTils?.data?.TILS_score);
  //     setLymphocyteCount(data?.getTils?.data?.lymphocyte_count);
  //     const canvas = fabricOverlay?.fabricCanvas();
  //     setLoadUI(false);
  //     localStorage.setItem("ModelName", "TIL");
  //     canvas?.remove(cords)?.requestRenderAll();
  //     canvas?.remove(originalTil)?.requestRenderAll();
  //     allPathStroma?.forEach((obj) => {
  //       canvas?.remove(obj).requestRenderAll();
  //     });
  //     const color = "#2Aff00";
  //     const roi = tilCords.flat(2).map((TIL_cord) => {
  //       return new fabric.Rect({
  //         top: TIL_cord[1],
  //         // bottom:TIL_cord[1],
  //         left: TIL_cord[0],
  //         // right:TIL_cord[2],
  //         width: TIL_cord[2] - TIL_cord[0],
  //         height: TIL_cord[3] - TIL_cord[1],
  //         stroke: "red",
  //         fill: "transparent",
  //         strokeWidth: 1,
  //         opacity: 1,
  //         strokeUniform: true,
  //       });
  //     });
  //     const roi2 = tumorCords?.map((tumor_cord) => {
  //       // console.log(tumor_cord);
  //       const points2 = tumor_cord.map((point2) => ({
  //         x: point2[0][0],
  //         y: point2[0][1],
  //       }));
  //       return new fabric.Polygon(points2, {
  //         stroke: `${color}83`,
  //         strokeWidth: 1.2,
  //         fill: "green",
  //         opacity: 0.2,
  //         strokeUniform: true,
  //       });
  //     });
  //     const roi3 = stromaCords?.map((stroma_cord) => {
  //       const points3 = stroma_cord.map((point3) => ({
  //         x: point3[0][0],
  //         y: point3[0][1],
  //       }));
  //       return new fabric.Polygon(points3, {
  //         stroke: `yellow`,
  //         strokeWidth: 1.2,
  //         fill: color ? `yellow` : "",
  //         opacity: 0.5,
  //         strokeUniform: true,
  //       });
  //     });
  //     canvas?.remove(cords)?.requestRenderAll();
  //     const t = new fabric.Group([...roi2, ...roi3, ...roi], {
  //       selectable: false,
  //       lockMovementX: false,
  //       lockMovementY: false,
  //       lockRotation: false,
  //       lockScalingX: false,
  //       lockScalingY: false,
  //       lockUniScaling: false,
  //       hoverCursor: "auto",
  //       evented: false,
  //       stroke: "",
  //       strokeWidth: 1,
  //       objectCaching: false,
  //       roiType: "TIL",
  //     });
  //     // console.log(t);
  //     setCords(t);
  //     setTimeout(() => {
  //       canvas.add(t);
  //     }, 1000);
  //     setTimeout(() => {
  //       requestAnimationFrame(() => {
  //         // console.log("Task completed by requestAnimationFrame");
  //         setTimeout(() => {
  //           setLoadUI(true);
  //           localStorage.removeItem("ModelName");
  //         }, 4000);
  //       });
  //     }, 1000);
  //   }
  // }, [refreshHil]);

  // ------------------------------
  // ------------- fetching data only TIL for hideModification
  // ------------------

  // useEffect(() => {
  //   if (TilHover === true) {
  //     getTils1({
  //       variables: {
  //         query: {
  //           key: `${getFileBucketFolder(viewerIds[0].originalFileUrl)}`,
  //           bucket_name: "med-ai-image-processor",
  //           slideId: `${slide?._id}`,
  //           hilRemoved: true,
  //         },
  //       },
  //       fetchPolicy: "network-only",
  //     });
  //     // console.log(data1);
  //     // console.log(data);
  //     setModifiedLymphocyte(data1?.getTils?.data?.lymphocyte_cords);
  //     setModifiedTumor(data1?.getTils?.data?.tumor_cords);
  //     setModifiedStroma(data1?.getTils?.data?.stroma_cords);

  //     // console.log(modifiedTumor);
  //   }
  // }, [TilHover]);

  // ------------------------------
  // ------------- updating state if data found
  // ------------------

  // useEffect(() => {
  //   if (data?.getTils?.data) {
  //     setTilCords(data?.getTils?.data?.lymphocyte_cords);
  //     setTumorCords(data?.getTils?.data?.tumor_cords);
  //     setStromaCords(data?.getTils?.data?.stroma_cords);
  //     setTilLoading(false);
  //   }
  // }, [data]);

  // ------------------------------
  // ------------- Plotting TIL only and removing HIL
  // ------------------

  // useEffect(() => {
  //   if (hideModification && data1) {
  //     setStromaArea(data1?.getTils?.data?.stroma_area);
  //     setTumorArea(data1?.getTils?.data?.tumor_area);
  //     setTilScore(data1?.getTils?.data?.TILS_score);
  //     setLymphocyteCount(data1?.getTils?.data?.lymphocyte_count);
  //     const canvas = fabricOverlay.fabricCanvas();
  //     setLoadUI(false);
  //     localStorage.setItem("ModelName", "TIL");
  //     const color = "#2Aff00";
  //     const roi = data1?.getTils?.data?.lymphocyte_cords
  //       ?.flat(2)
  //       .map((TIL_cord) => {
  //         return new fabric.Rect({
  //           top: TIL_cord[1],
  //           // bottom:TIL_cord[1],
  //           left: TIL_cord[0],
  //           // right:TIL_cord[2],
  //           width: TIL_cord[2] - TIL_cord[0],
  //           height: TIL_cord[3] - TIL_cord[1],
  //           stroke: "red",
  //           fill: "transparent",
  //           strokeWidth: 1,
  //           opacity: 1,
  //           strokeUniform: true,
  //         });
  //       });
  //     const roi2 = data1?.getTils?.data?.tumor_cords?.map((tumor_cord) => {
  //       // console.log(tumor_cord);
  //       const points2 = tumor_cord.map((point2) => ({
  //         x: point2[0][0],
  //         y: point2[0][1],
  //       }));
  //       return new fabric.Polygon(points2, {
  //         stroke: `${color}83`,
  //         strokeWidth: 1.2,
  //         fill: "green",
  //         opacity: 0.2,
  //         strokeUniform: true,
  //       });
  //     });
  //     const roi3 = data1?.getTils?.data?.stroma_cords?.map((stroma_cord) => {
  //       const points3 = stroma_cord.map((point3) => ({
  //         x: point3[0][0],
  //         y: point3[0][1],
  //       }));
  //       return new fabric.Polygon(points3, {
  //         stroke: `yellow`,
  //         strokeWidth: 1.2,
  //         fill: color ? `yellow` : "",
  //         opacity: 0.5,
  //         strokeUniform: true,
  //       });
  //     });
  //     canvas?.remove(cords)?.requestRenderAll();
  //     canvas?.remove(originalTil)?.requestRenderAll();
  //     const ts = new fabric.Group([...roi2, ...roi3, ...roi], {
  //       selectable: false,
  //       lockMovementX: false,
  //       lockMovementY: false,
  //       lockRotation: false,
  //       lockScalingX: false,
  //       lockScalingY: false,
  //       lockUniScaling: false,
  //       hoverCursor: "auto",
  //       evented: false,
  //       stroke: "",
  //       strokeWidth: 1,
  //       objectCaching: false,
  //       roiType: "TIL",
  //     });
  //     setOriginalTil(ts);
  //     setTimeout(() => {
  //       canvas.add(ts);
  //     }, 1000);
  //     setTimeout(() => {
  //       requestAnimationFrame(() => {
  //         // console.log("Task completed by requestAnimationFrame");
  //         setTimeout(() => {
  //           setLoadUI(true);
  //           localStorage.removeItem("ModelName");
  //         }, 4000);
  //       });
  //     }, 1000);
  //   } else {
  //     setStromaArea(data?.getTils?.data?.stroma_area);
  //     setTumorArea(data?.getTils?.data?.tumor_area);
  //     setTilScore(data?.getTils?.data?.TILS_score);
  //     setLymphocyteCount(data?.getTils?.data?.lymphocyte_count);
  //     if (
  //       tumorCords?.length > 0 ||
  //       stromaCords?.length > 0 ||
  //       tilCords?.length > 0
  //     ) {
  //       setLoadUI(false);
  //       localStorage.setItem("ModelName", "TIL");
  //       localStorage.setItem("til", "til");
  //       const canvas = fabricOverlay.fabricCanvas();
  //       const color = "#2Aff00";
  //       const roi = tilCords.flat(2).map(
  //         (TIL_cord) =>
  //           new fabric.Rect({
  //             top: TIL_cord[1],
  //             left: TIL_cord[0],
  //             width: TIL_cord[2] - TIL_cord[0],
  //             height: TIL_cord[3] - TIL_cord[1],
  //             stroke: "red",
  //             fill: "transparent",
  //             strokeWidth: 1,
  //             opacity: 1,
  //             strokeUniform: true,
  //           })
  //       );
  //       const roi2 = tumorCords?.map((tumor_cord) => {
  //         const points2 = tumor_cord.map((point2) => ({
  //           x: point2[0][0],
  //           y: point2[0][1],
  //         }));
  //         return new fabric.Polygon(points2, {
  //           stroke: `${color}83`,
  //           strokeWidth: 1.2,
  //           fill: "green",
  //           opacity: 0.2,
  //           strokeUniform: true,
  //         });
  //       });
  //       const roi3 = stromaCords?.map((stroma_cord) => {
  //         const points3 = stroma_cord.map((point3) => ({
  //           x: point3[0][0],
  //           y: point3[0][1],
  //         }));
  //         return new fabric.Polygon(points3, {
  //           stroke: `yellow`,
  //           strokeWidth: 1.2,
  //           fill: color ? `yellow` : "",
  //           opacity: 0.5,
  //           strokeUniform: true,
  //         });
  //       });
  //       canvas?.remove(cords)?.requestRenderAll();
  //       canvas?.remove(originalTil)?.requestRenderAll();
  //       const t = new fabric.Group([...roi2, ...roi3, ...roi], {
  //         selectable: false,
  //         lockMovementX: false,
  //         lockMovementY: false,
  //         lockRotation: false,
  //         lockScalingX: false,
  //         lockScalingY: false,
  //         lockUniScaling: false,
  //         hoverCursor: "auto",
  //         evented: false,
  //         stroke: "",
  //         strokeWidth: 1,
  //         objectCaching: false,
  //         roiType: "TIL",
  //       });
  //       setCords(t);
  //       setTimeout(() => {
  //         canvas.add(t);
  //       }, 1000);
  //       if (TilHover === false) {
  //         //  toast ({
  //         //     title: "TIL Process Done",
  //         //     description: "",
  //         //     status: "success",
  //         //     duration: 1500,
  //         //     isClosable: true,
  //         //   });
  //       }
  //       setTimeout(() => {
  //         requestAnimationFrame(() => {
  //           // console.log("Task completed by requestAnimationFrame");
  //           setTimeout(() => {
  //             setLoadUI(true);
  //             localStorage.removeItem("ModelName");
  //           }, 4000);
  //         });
  //       }, 1000);
  //     } else if (
  //       tilSubscriptionData?.tilStatus?.data?.tumor_cords?.length > 0 ||
  //       tilSubscriptionData?.tilStatus?.data?.stroma_cords?.length > 0 ||
  //       tilSubscriptionData?.tilStatus?.data?.lymphocyte_cords?.length > 0
  //     ) {
  //       // console.log("til is setting in canvas");
  //       setLoadUI(false);
  //       localStorage.setItem("ModelName", "TIL");

  //       localStorage.setItem("til", "til");
  //       const canvas = fabricOverlay.fabricCanvas();
  //       const color = "#2Aff00";
  //       const roi = tilSubscriptionData?.tilStatus?.data?.lymphocyte_cords
  //         .flat(2)
  //         .map((TIL_cord) => {
  //           return new fabric.Rect({
  //             top: TIL_cord[1],
  //             // bottom:TIL_cord[1],
  //             left: TIL_cord[0],
  //             // right:TIL_cord[2],
  //             width: TIL_cord[2] - TIL_cord[0],
  //             height: TIL_cord[3] - TIL_cord[1],
  //             stroke: "red",
  //             fill: "transparent",
  //             strokeWidth: 1,
  //             opacity: 1,
  //             strokeUniform: true,
  //           });
  //         });
  //       const roi2 = tilSubscriptionData?.tilStatus?.data?.tumor_cords?.map(
  //         (tumor_cord) => {
  //           // console.log(tumor_cord);
  //           const points2 = tumor_cord.map((point2) => ({
  //             x: point2[0][0],
  //             y: point2[0][1],
  //           }));
  //           return new fabric.Polygon(points2, {
  //             stroke: `${color}83`,
  //             strokeWidth: 1.2,
  //             fill: "green",
  //             opacity: 0.2,
  //             strokeUniform: true,
  //           });
  //         }
  //       );
  //       const roi3 = tilSubscriptionData?.tilStatus?.data?.stroma_cords?.map(
  //         (stroma_cord) => {
  //           const points3 = stroma_cord.map((point3) => ({
  //             x: point3[0][0],
  //             y: point3[0][1],
  //           }));
  //           return new fabric.Polygon(points3, {
  //             stroke: `yellow`,
  //             strokeWidth: 1.2,
  //             fill: color ? `yellow` : "",
  //             opacity: 0.5,
  //             strokeUniform: true,
  //           });
  //         }
  //       );
  //       canvas?.remove(cords)?.requestRenderAll();
  //       canvas?.remove(originalTil)?.requestRenderAll();
  //       const newSlidet = new fabric.Group([...roi2, ...roi3, ...roi], {
  //         selectable: false,
  //         lockMovementX: true,
  //         lockMovementY: true,
  //         lockRotation: true,
  //         lockScalingX: true,
  //         lockScalingY: true,
  //         lockUniScaling: true,
  //         hoverCursor: "auto",
  //         evented: false,
  //         stroke: "red",
  //         strokeWidth: 1,
  //         objectCaching: false,
  //         roiType: "TIL",
  //       });
  //       setCords(newSlidet);
  //       setTimeout(() => {
  //         canvas.add(newSlidet);
  //       }, 1000);
  //       setTimeout(() => {
  //         requestAnimationFrame(() => {
  //           // console.log("Task completed by requestAnimationFrame");
  //           setTimeout(() => {
  //             setLoadUI(true);
  //             localStorage.removeItem("ModelName");
  //           }, 4000);
  //         });
  //       }, 1000);
  //     }
  //   }
  // }, [hideModification]);

  // ------------------------------
  // ------------- updating state after drawing stroma, and clearing canvas on hit til button
  // ------------------

  // useEffect(() => {
  //   if (pathStroma) {
  //     setAllPathStroma((prevState) => [...prevState, pathStroma]);
  //   }
  //   if (TilHover === false) {
  //     // console.log("object", cords);
  //     // console.log(allPathStroma);
  //     const canvas = fabricOverlay?.fabricCanvas();
  //     canvas?.remove(cords)?.requestRenderAll();
  //     canvas?.remove(originalTil)?.requestRenderAll();
  //     allPathStroma?.forEach((obj) => {
  //       canvas?.remove(obj);
  //     });
  //     localStorage.removeItem("til", "til");
  //     localStorage.removeItem("ModelName");
  //     setToolSelected("");
  //   }
  // }, [TilHover, pathStroma]);

  // ------------------------------
  // ------------- hitting til button for first time
  // ------------------

  const handleTIL = () => {
    if (modelName === "TIL") {
      const canvas = fabricOverlay.fabricCanvas();
      const tilURL = data?.getTils?.data?.tumor_url;

      setTimeout(() => {
        viewer.addTiledImage({
          tileSource: tilURL,
          x: 0,
          y: 0,
          width: 1,
          opacity: 0.5,
        });
      }, 2000);
      setTimeout(() => {
        requestAnimationFrame(() => {
          // console.log("Task completed by requestAnimationFrame");
          setTimeout(() => {
            setTILPlotted(true);
            setLoadUI(true);
            localStorage.removeItem("ModelName");
            localStorage.setItem("til", "TIL");
            setToolSelected("TIL");
          }, 4000);
        });
      }, 1000);
    }
    if (modelName === "TILClear") {
      setTILPlotted(false);
      localStorage.removeItem("til", "TIL");
      const canvas = fabricOverlay.fabricCanvas();
      var topImage = viewer?.world?.getItemAt(1);
      var lowImage = viewer?.world?.getItemAt(2);
      if (topImage || lowImage) {
        viewer.world.removeItem(topImage);
        viewer.world.removeItem(lowImage);
      }
      var objects = canvas.getObjects();
      for (var i = 0; i < objects.length; i++) {
        if (objects[i].roiType === "TIL") {
          canvas.remove(objects[i]);
        }
      }
      canvas.renderAll();
    }
  };
  // console.log(TILPlotted);

  //   if (TILPlotted) {
  //     var noOfTimesSwitchedLayer = 0;
  //     if (hideTumor && !hideStroma && !hideLymphocyte) {
  //       noOfTimesSwitchedLayer += 1;
  //       // console.log("YES");
  //
  //     }
  //     if (hideStroma && !hideTumor && !hideLymphocyte) {
  //       noOfTimesSwitchedLayer += 1;
  //
  //     }

  //     if (
  //       !hideLymphocyte &&
  //       !hideStroma &&
  //       !hideTumor &&
  //       noOfTimesSwitchedLayer > 0
  //     ) {
  //       noOfTimesSwitchedLayer += 1;
  //     }

  //     if (
  //       hideLymphocyte &&
  //       !hideStroma &&
  //       !hideTumor
  //     ) {
  //       noOfTimesSwitchedLayer += 1;
  //
  //     }

  //     console.log("NOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",noOfTimesSwitchedLayer);
  //   }
  // }, [hideLymphocyte, hideStroma, hideTumor]);
  // ------------------------------
  // ------------- hiding stroma or tumor or lymphocytes
  // ------------------

  useEffect(() => {
    if (modelName === "TIL" && data) {
      handleTIL();
      setLoadUI(false);
      setTilHover(!TilHover);
    }
    if (modelName === "TILClear") {
      handleTIL();
      setTilHover(!TilHover);
    }
  }, [modelName]);

  return <></>;
};

export default Til;
