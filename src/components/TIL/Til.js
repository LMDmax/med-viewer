import React, { useEffect, useState } from "react";
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

const Til = ({
  viewerId,
  viewerIds,
  setNewHilData,
  setStromaArea,
  setTumorArea,
  setTilScore,
  setLymphocyteCount,
  hitTil,
  slide,
  refreshHil,
  hideTumor,
  hideStroma,
  hideModification,
  pathStroma,
  hideLymphocyte,
}) => {
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const [TilHover, setTilHover] = useState(false);
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { viewerWindow } = fabricOverlayState;
  const { fabricOverlay, viewer } = viewerWindow[viewerId];
  const [tilCords, setTilCords] = useState([]);
  const [allPathStroma, setAllPathStroma] = useState([]);
  const [tumorCords, setTumorCords] = useState([]);
  const [originalTil,setOriginalTil] = useState();
  const [stromaCords, setStromaCords] = useState([]);
  const [Tilloading, setTilLoading] = useState(true);
  const [cords, setCords] = useState({});
  const [modifiedStroma, setModifiedStroma] = useState([])
  const [modifiedTumor, setModifiedTumor] = useState([])
  const [modifiedLymphocyte, setModifiedLymphocyte] = useState([])
  const toast = useToast();
  const client = useApolloClient();
  const [getTils, { data, loading, error, refetch }] = useLazyQuery(GET_TILS_ANALYSIS);
  const [getTils1, { data: data1, loading: loading1, error: error1, refetch: refetch1 }] = useLazyQuery(GET_TILS_ANALYSIS);
  const { data: tilSubscriptionData, error: vhutSubscription_error } =
    useSubscription(TIL_ANALYSIS_SUBSCRIPTION, {
      variables: {
        body: {
          slideId: slide?._id,
        },
      },
    });

  useEffect(() => {
    if (!data || !tilSubscriptionData) {
      toast({
        title: "TIL is processing",
        description: "",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
    }
  }, []);


  useEffect(()=>{
    if(Tilloading === false){
      toast({
        title: "TIL can be run now",
        description: "",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
    }
  },[Tilloading])

useEffect(()=>{
if(data){
  setStromaArea(data?.getTils?.data?.stroma_area);
  setTumorArea(data?.getTils?.data?.tumor_area);
  setTilScore(data?.getTils?.data?.TILS_score);
  setLymphocyteCount(data?.getTils?.data?.lymphocyte_count);
}
if(hideModification){
  setStromaArea(data1?.getTils?.data?.stroma_area);
  setTumorArea(data1?.getTils?.data?.tumor_area);
  setTilScore(data1?.getTils?.data?.TILS_score);
  setLymphocyteCount(data1?.getTils?.data?.lymphocyte_count);
}
if(tilSubscriptionData){
  setStromaArea(tilSubscriptionData?.tilStatus?.data?.stroma_area);
  setTumorArea(tilSubscriptionData?.tilStatus?.data?.tumor_area);
  setTilScore(tilSubscriptionData?.tilStatus?.data?.TILS_score);
  setLymphocyteCount(tilSubscriptionData?.tilStatus?.data?.lymphocyte_count);
}
},[data,hideModification,tilSubscriptionData])

// console.log(tilSubscriptionData);
  useEffect(() => {
    if (!tilSubscriptionData && hitTil === true) {
      getTils({
        variables: {
          query: {
            key: `${getFileBucketFolder(viewerIds[0].originalFileUrl)}`,
            bucket_name: "med-ai-image-processor",
            slideId: `${slide?._id}`,
            hilRemoved: false,
          },
        },
        fetchPolicy: "network-only",
      });
      if (data?.getTils?.data) {
        // console.log(data);
        setTilCords(data?.getTils?.data?.lymphocyte_cords);
        setTumorCords(data?.getTils?.data?.tumor_cords);
        setStromaCords(data?.getTils?.data?.stroma_cords);
        setTilLoading(false);
      }
    }
    // console.log("data",data);
    // console.log("eror",error);
    // getData();
  }, [hitTil,tilSubscriptionData]);

    // console.log(tilSubscriptionData?.tilStatus);


  useEffect(()=>{
    if(tilSubscriptionData?.tilStatus?.message=== "Hil is completed"){
    const canvas = fabricOverlay?.fabricCanvas();
      canvas.isDrawingMode = false;
      toast({
                title: "HIL is processed",
                description: "",
                status: "success",
                duration: 1500,
                isClosable: true,
              });
      client.resetStore();
        refetch();
     setNewHilData(false);
     setTimeout(() => {
      const canvas = fabricOverlay?.fabricCanvas();
      canvas.isDrawingMode = true;
      setNewHilData(true);
    }, 2000);
    // console.log(tilSubscriptionData?.tilStatus);
  }
},[tilSubscriptionData])

useEffect(()=>{
  if(refreshHil>0){
    setStromaArea(data?.getTils?.data?.stroma_area);
  setTumorArea(data?.getTils?.data?.tumor_area);
  setTilScore(data?.getTils?.data?.TILS_score);
  setLymphocyteCount(data?.getTils?.data?.lymphocyte_count);
    const canvas = fabricOverlay?.fabricCanvas();
    canvas?.remove(cords)?.requestRenderAll();
    canvas?.remove(originalTil)?.requestRenderAll();
    allPathStroma?.forEach(obj => {
      canvas?.remove(obj).requestRenderAll();
    });
        const color = "#2Aff00";
        const roi = tilCords.flat(2).map((TIL_cord) => {
          return new fabric.Rect({
            top: TIL_cord[1],
            // bottom:TIL_cord[1],
            left: TIL_cord[0],
            // right:TIL_cord[2],
            width: TIL_cord[2] - TIL_cord[0],
            height: TIL_cord[3] - TIL_cord[1],
            stroke: "red",
            fill: "transparent",
            strokeWidth: 1,
            opacity: 1,
            strokeUniform: true,
          });
        });
        const roi2 = tumorCords?.map((tumor_cord) => {
          // console.log(tumor_cord);
          const points2 = tumor_cord.map((point2) => ({
            x: point2[0][0],
            y: point2[0][1],
          }));
          return new fabric.Polygon(points2, {
            stroke: `${color}83`,
            strokeWidth: 1.2,
            fill: "green",
            opacity: 0.2,
            strokeUniform: true,
          });
        });
        const roi3 = stromaCords?.map((stroma_cord) => {
          const points3 = stroma_cord.map((point3) => ({
            x: point3[0][0],
            y: point3[0][1],
          }));
          return new fabric.Polygon(points3, {
            stroke: `yellow`,
            strokeWidth: 1.2,
            fill: color ? `yellow` : "",
            opacity: 0.5,
            strokeUniform: true,
          });
        });
            canvas?.remove(cords)?.requestRenderAll();
            const t = new fabric.Group([...roi2, ...roi3, ...roi], {
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
            });
            // console.log(t);
            setCords(t);
            canvas.add(t);
  }
},[refreshHil])

useEffect(()=>{
 if(data?.getTils?.data?.tumor_cord || data?.getTils?.data?.stroma_cord || data?.getTils?.data?.stroma_cord || tilSubscriptionData?.tilStatus?.data?.tumor_cord || tilSubscriptionData?.tilStatus?.data?.stroma_cord){
  getTils1({
    variables: {
      query: {
        key: `${getFileBucketFolder(viewerIds[0].originalFileUrl)}`,
        bucket_name: "med-ai-image-processor",
        slideId: `${slide?._id}`,
        hilRemoved: true,
      },
    },
    fetchPolicy: "network-only",
  });
// console.log(data1);
// console.log(data);
    setModifiedLymphocyte(data1?.getTils?.data?.lymphocyte_cords);
  setModifiedTumor(data1?.getTils?.data?.tumor_cords);
  setModifiedStroma(data1?.getTils?.data?.stroma_cords);
 }
  // console.log(modifiedTumor);

},[data, tilSubscriptionData])


useEffect(()=>{
  if (data?.getTils?.data) {
    setTilCords(data?.getTils?.data?.lymphocyte_cords);
    setTumorCords(data?.getTils?.data?.tumor_cords);
    setStromaCords(data?.getTils?.data?.stroma_cords);
    setTilLoading(false);
  }
},[data])

useEffect(()=>{
if(hideModification && data1){
  setStromaArea(data1?.getTils?.data?.stroma_area);
  setTumorArea(data1?.getTils?.data?.tumor_area);
  setTilScore(data1?.getTils?.data?.TILS_score);
  setLymphocyteCount(data1?.getTils?.data?.lymphocyte_count);
  const canvas = fabricOverlay.fabricCanvas();
  const color = "#2Aff00";
  const roi = data1?.getTils?.data?.lymphocyte_cords?.flat(2).map((TIL_cord) => {
    return new fabric.Rect({
      top: TIL_cord[1],
      // bottom:TIL_cord[1],
      left: TIL_cord[0],
      // right:TIL_cord[2],
      width: TIL_cord[2] - TIL_cord[0],
      height: TIL_cord[3] - TIL_cord[1],
      stroke: "red",
      fill: "transparent",
      strokeWidth: 1,
      opacity: 1,
      strokeUniform: true,
    });
  });
  const roi2 = data1?.getTils?.data?.tumor_cords?.map((tumor_cord) => {
    // console.log(tumor_cord);
    const points2 = tumor_cord.map((point2) => ({
      x: point2[0][0],
      y: point2[0][1],
    }));
    return new fabric.Polygon(points2, {
      stroke: `${color}83`,
      strokeWidth: 1.2,
      fill: "green",
      opacity: 0.2,
      strokeUniform: true,
    });
  })
  const roi3 = data1?.getTils?.data?.stroma_cords?.map((stroma_cord) => {
    const points3 = stroma_cord.map((point3) => ({
      x: point3[0][0],
      y: point3[0][1],
    }));
    return new fabric.Polygon(points3, {
      stroke: `yellow`,
      strokeWidth: 1.2,
      fill: color ? `yellow` : "",
      opacity: 0.5,
      strokeUniform: true,
    });
  });
      canvas?.remove(cords)?.requestRenderAll();
      canvas?.remove(originalTil)?.requestRenderAll();
      const ts = new fabric.Group([...roi2, ...roi3, ...roi], {
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
      });
      setOriginalTil(ts);
      canvas.add(ts);
}
else{
  setStromaArea(data?.getTils?.data?.stroma_area);
  setTumorArea(data?.getTils?.data?.tumor_area);
  setTilScore(data?.getTils?.data?.TILS_score);
  setLymphocyteCount(data?.getTils?.data?.lymphocyte_count);
  handleTIL();
}
},[hideModification])



  useEffect(() => {
    if(pathStroma){
      setAllPathStroma(prevState => [...prevState, pathStroma]);
    }
    if (TilHover === false) {
      // console.log("object", cords);
    // console.log(allPathStroma);
      const canvas = fabricOverlay?.fabricCanvas();
      canvas?.remove(cords)?.requestRenderAll();
      canvas?.remove(originalTil)?.requestRenderAll();
      allPathStroma?.forEach(obj => {
        canvas?.remove(obj);
      });
      localStorage.removeItem("til", "til");
    }
  }, [TilHover,pathStroma]);




  const handleTIL = () => {
    if(TilHover === false || hideModification === false){
      if (
        tumorCords?.length > 0 ||
        stromaCords?.length > 0 ||
        (tilCords?.length > 0)
      ) {
        localStorage.setItem("til", "til");
        // console.log("til is setting in canvas");
        const canvas = fabricOverlay.fabricCanvas();
        const color = "#2Aff00";
        const roi = tilCords.flat(2).map((TIL_cord) => {
          return new fabric.Rect({
            top: TIL_cord[1],
            // bottom:TIL_cord[1],
            left: TIL_cord[0],
            // right:TIL_cord[2],
            width: TIL_cord[2] - TIL_cord[0],
            height: TIL_cord[3] - TIL_cord[1],
            stroke: "red",
            fill: "transparent",
            strokeWidth: 1,
            opacity: 1,
            strokeUniform: true,
          });
        });
        const roi2 = tumorCords?.map((tumor_cord) => {
          // console.log(tumor_cord);
          const points2 = tumor_cord.map((point2) => ({
            x: point2[0][0],
            y: point2[0][1],
          }));
          return new fabric.Polygon(points2, {
            stroke: `${color}83`,
            strokeWidth: 1.2,
            fill: "green",
            opacity: 0.2,
            strokeUniform: true,
          });
        });
        const roi3 = stromaCords?.map((stroma_cord) => {
          const points3 = stroma_cord.map((point3) => ({
            x: point3[0][0],
            y: point3[0][1],
          }));
          return new fabric.Polygon(points3, {
            stroke: `yellow`,
            strokeWidth: 1.2,
            fill: color ? `yellow` : "",
            opacity: 0.5,
            strokeUniform: true,
          });
        });
            canvas?.remove(cords)?.requestRenderAll();
      canvas?.remove(originalTil)?.requestRenderAll();
            const t = new fabric.Group([...roi2, ...roi3, ...roi], {
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
            });
            // console.log(t);
            setCords(t);
            canvas.add(t);
        // console.log(roi);
        if (TilHover === false) {
          toast({
            title: "TIL Process Done",
            description: "",
            status: "success",
            duration: 2500,
            isClosable: true,
          });
        }
      }
      else if (
          tilSubscriptionData?.tilStatus?.data?.tumor_cords?.length > 0 ||
          tilSubscriptionData?.tilStatus?.data?.stroma_cords?.length > 0 ||
          tilSubscriptionData?.tilStatus?.data?.lymphocyte_cords?.length > 0
        ) {
          // console.log("til is setting in canvas");
          localStorage.setItem("til", "til");
          const canvas = fabricOverlay.fabricCanvas();
          const color = "#2Aff00";
          const roi = tilSubscriptionData?.tilStatus?.data?.lymphocyte_cords
            .flat(2)
            .map((TIL_cord) => {
              return new fabric.Rect({
                top: TIL_cord[1],
                // bottom:TIL_cord[1],
                left: TIL_cord[0],
                // right:TIL_cord[2],
                width: TIL_cord[2] - TIL_cord[0],
                height: TIL_cord[3] - TIL_cord[1],
                stroke: "red",
                fill: "transparent",
                strokeWidth: 1,
                opacity: 1,
                strokeUniform: true,
              });
            });
          const roi2 = tilSubscriptionData?.tilStatus?.data?.tumor_cords?.map(
            (tumor_cord) => {
              // console.log(tumor_cord);
              const points2 = tumor_cord.map((point2) => ({
                x: point2[0][0],
                y: point2[0][1],
              }));
              return new fabric.Polygon(points2, {
                stroke: `${color}83`,
                strokeWidth: 1.2,
                fill: "green",
                opacity: 0.2,
                strokeUniform: true,
              });
            }
          );
          const roi3 = tilSubscriptionData?.tilStatus?.data?.stroma_cords?.map(
            (stroma_cord) => {
              const points3 = stroma_cord.map((point3) => ({
                x: point3[0][0],
                y: point3[0][1],
              }));
              return new fabric.Polygon(points3, {
                stroke: `yellow`,
                strokeWidth: 1.2,
                fill: color ? `yellow` : "",
                opacity: 0.5,
                strokeUniform: true,
              });
            }
          );
           canvas?.remove(cords)?.requestRenderAll();
      canvas?.remove(originalTil)?.requestRenderAll();
            const newSlidet = new fabric.Group([...roi2, ...roi3, ...roi], {
              selectable: false,
              lockMovementX: true,
              lockMovementY: true,
              lockRotation: true,
              lockScalingX: true,
              lockScalingY: true,
              lockUniScaling: true,
              hoverCursor: "auto",
              evented: false,
              stroke: "red",
              strokeWidth: 1,
              objectCaching: false,
            });
            setCords(newSlidet);
            canvas.add(newSlidet);
          
          // console.log(roi);
          if (TilHover === false) {
            toast({
              title: "TIL Process Done",
              description: "",
              status: "success",
              duration: 2500,
              isClosable: true,
            });
          }
        
    
        }

    }
  };


  
  
  useEffect(()=>{
    //  handleTIL();
    if (
      tumorCords?.length > 0 ||
      stromaCords?.length > 0 ||
      (tilCords?.length > 0)
    ){
      if(TilHover && hideTumor === true){
        // console.log("s");
        const canvas = fabricOverlay.fabricCanvas();
        const color = "#2Aff00";
        const roi = tilCords.flat(2).map((TIL_cord) => {
          return new fabric.Rect({
            top: TIL_cord[1],
            // bottom:TIL_cord[1],
            left: TIL_cord[0],
            // right:TIL_cord[2],
            width: TIL_cord[2] - TIL_cord[0],
            height: TIL_cord[3] - TIL_cord[1],
            stroke: "red",
            fill: "transparent",
            strokeWidth: 1,
        opacity: 1,
        strokeUniform: true,
      });
    });
    const roi2 = tumorCords?.map((tumor_cord) => {
      // console.log(tumor_cord);
      const points2 = tumor_cord.map((point2) => ({
        x: point2[0][0],
        y: point2[0][1],
      }));
      return new fabric.Polygon(points2, {
        stroke: `${color}83`,
        strokeWidth: 1.2,
        fill: "green",
        opacity: 0.2,
        strokeUniform: true,
      });
    });
    const roi3 = stromaCords?.map((stroma_cord) => {
      const points3 = stroma_cord.map((point3) => ({
        x: point3[0][0],
        y: point3[0][1],
      }));
      return new fabric.Polygon(points3, {
        stroke: `yellow`,
        strokeWidth: 1.2,
        fill: color ? `yellow` : "",
        opacity: 0.5,
        strokeUniform: true,
      });
    });
    canvas?.remove(cords)?.requestRenderAll();
    canvas?.remove(originalTil)?.requestRenderAll();
    const t = new fabric.Group([...roi3, ...roi], {
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
        });
        // console.log(t);
        setCords(t);
        canvas.add(t);
        setStromaArea(data?.getTils?.data?.stroma_area);
  setTumorArea(0);
  setTilScore(data?.getTils?.data?.TILS_score);
  setLymphocyteCount(data?.getTils?.data?.lymphocyte_count);
  }
  if(TilHover && hideStroma === true){
    // console.log("s");
    const canvas = fabricOverlay.fabricCanvas();
    const color = "#2Aff00";
    const roi = tilCords.flat(2).map((TIL_cord) => {
      return new fabric.Rect({
        top: TIL_cord[1],
        // bottom:TIL_cord[1],
        left: TIL_cord[0],
        // right:TIL_cord[2],
        width: TIL_cord[2] - TIL_cord[0],
        height: TIL_cord[3] - TIL_cord[1],
        stroke: "red",
        fill: "transparent",
        strokeWidth: 1,
     opacity: 1,
     strokeUniform: true,
   });
  });
  const roi2 = tumorCords?.map((tumor_cord) => {
    // console.log(tumor_cord);
    const points2 = tumor_cord.map((point2) => ({
      x: point2[0][0],
      y: point2[0][1],
    }));
    return new fabric.Polygon(points2, {
      stroke: `${color}83`,
     strokeWidth: 1.2,
     fill: "green",
     opacity: 0.2,
     strokeUniform: true,
    });
  });
  const roi3 = stromaCords?.map((stroma_cord) => {
    const points3 = stroma_cord.map((point3) => ({
     x: point3[0][0],
     y: point3[0][1],
   }));
   return new fabric.Polygon(points3, {
     stroke: `yellow`,
     strokeWidth: 1.2,
     fill: color ? `yellow` : "",
     opacity: 0.5,
     strokeUniform: true,
    });
  });
  canvas?.remove(cords)?.requestRenderAll();
  canvas?.remove(originalTil)?.requestRenderAll();
     const t = new fabric.Group([...roi2, ...roi], {
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
     });
    //  console.log(t);
     setCords(t);
     canvas.add(t);
     setStromaArea(0);
     setTumorArea(data?.getTils?.data?.tumor_area);
     setTilScore(data?.getTils?.data?.TILS_score);
  setLymphocyteCount(data?.getTils?.data?.lymphocyte_count);
  }
  if(TilHover && hideLymphocyte === true){
    // console.log("s");
    const canvas = fabricOverlay.fabricCanvas();
    const color = "#2Aff00";
    const roi = tilCords.flat(2).map((TIL_cord) => {
      return new fabric.Rect({
        top: TIL_cord[1],
        // bottom:TIL_cord[1],
        left: TIL_cord[0],
        // right:TIL_cord[2],
        width: TIL_cord[2] - TIL_cord[0],
        height: TIL_cord[3] - TIL_cord[1],
        stroke: "red",
        fill: "transparent",
        strokeWidth: 1,
        opacity: 1,
        strokeUniform: true,
      });
    });
    const roi2 = tumorCords?.map((tumor_cord) => {
      // console.log(tumor_cord);
      const points2 = tumor_cord.map((point2) => ({
        x: point2[0][0],
        y: point2[0][1],
      }));
      return new fabric.Polygon(points2, {
        stroke: `${color}83`,
        strokeWidth: 1.2,
        fill: "green",
        opacity: 0.2,
        strokeUniform: true,
      });
    });
    const roi3 = stromaCords?.map((stroma_cord) => {
      const points3 = stroma_cord.map((point3) => ({
        x: point3[0][0],
        y: point3[0][1],
      }));
      return new fabric.Polygon(points3, {
        stroke: `yellow`,
        strokeWidth: 1.2,
        fill: color ? `yellow` : "",
        opacity: 0.5,
        strokeUniform: true,
      });
    });
        canvas?.remove(cords)?.requestRenderAll();
      canvas?.remove(originalTil)?.requestRenderAll();
        const t = new fabric.Group([...roi2, ...roi3,], {
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
        });
        // console.log(t);
        setCords(t);
        canvas.add(t);
        setStromaArea(data?.getTils?.data?.stroma_area);
  setTumorArea(data?.getTils?.data?.tumor_area);
  setTilScore(data?.getTils?.data?.TILS_score);
  setLymphocyteCount(0);

  }
  if(TilHover && hideTumor === false && hideStroma === false && hideLymphocyte === false){
    const canvas = fabricOverlay.fabricCanvas();
    const color = "#2Aff00";
    const roi = tilCords.flat(2).map((TIL_cord) => {
      return new fabric.Rect({
        top: TIL_cord[1],
        // bottom:TIL_cord[1],
        left: TIL_cord[0],
        // right:TIL_cord[2],
        width: TIL_cord[2] - TIL_cord[0],
        height: TIL_cord[3] - TIL_cord[1],
        stroke: "red",
        fill: "transparent",
        strokeWidth: 1,
        opacity: 1,
        strokeUniform: true,
      });
    });
    const roi2 = tumorCords?.map((tumor_cord) => {
      // console.log(tumor_cord);
      const points2 = tumor_cord.map((point2) => ({
        x: point2[0][0],
        y: point2[0][1],
      }));
      return new fabric.Polygon(points2, {
        stroke: `${color}83`,
        strokeWidth: 1.2,
        fill: "green",
        opacity: 0.2,
        strokeUniform: true,
      });
    });
    const roi3 = stromaCords?.map((stroma_cord) => {
      const points3 = stroma_cord.map((point3) => ({
        x: point3[0][0],
        y: point3[0][1],
      }));
      return new fabric.Polygon(points3, {
        stroke: `yellow`,
        strokeWidth: 1.2,
        fill: color ? `yellow` : "",
        opacity: 0.5,
        strokeUniform: true,
      });
    });
        canvas?.remove(cords)?.requestRenderAll();
      canvas?.remove(originalTil)?.requestRenderAll();
        const t = new fabric.Group([...roi2, ...roi3, ...roi], {
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
        });
        // console.log(t);
        setCords(t);
        canvas.add(t);
        setStromaArea(data?.getTils?.data?.stroma_area);
        setTumorArea(data?.getTils?.data?.tumor_area);
        setTilScore(data?.getTils?.data?.TILS_score);
     setLymphocyteCount(data?.getTils?.data?.lymphocyte_count);
  }
    }
    else if (
      tilSubscriptionData?.tilStatus?.data?.tumor_cords?.length > 0 ||
      tilSubscriptionData?.tilStatus?.data?.stroma_cords?.length > 0 ||
      tilSubscriptionData?.tilStatus?.data?.lymphocyte_cords?.length > 0
    ) {
      if(TilHover && hideTumor === true){
        // console.log("s");
        const canvas = fabricOverlay.fabricCanvas();
        const color = "#2Aff00";
        const roi = tilSubscriptionData?.tilStatus?.data?.lymphocyte_cords.flat(2).map((TIL_cord) => {
          return new fabric.Rect({
            top: TIL_cord[1],
            // bottom:TIL_cord[1],
            left: TIL_cord[0],
            // right:TIL_cord[2],
            width: TIL_cord[2] - TIL_cord[0],
            height: TIL_cord[3] - TIL_cord[1],
            stroke: "red",
            fill: "transparent",
            strokeWidth: 1,
        opacity: 1,
        strokeUniform: true,
      });
    });
    const roi3 = tilSubscriptionData?.tilStatus?.data?.stroma_cords?.map((stroma_cord) => {
      const points3 = stroma_cord.map((point3) => ({
        x: point3[0][0],
        y: point3[0][1],
      }));
      return new fabric.Polygon(points3, {
        stroke: `yellow`,
        strokeWidth: 1.2,
        fill: color ? `yellow` : "",
        opacity: 0.5,
        strokeUniform: true,
      });
    });
    canvas?.remove(cords)?.requestRenderAll();
    canvas?.remove(originalTil)?.requestRenderAll();
    const t = new fabric.Group([...roi3, ...roi], {
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
        });
        // console.log(t);
        setCords(t);
        canvas.add(t);
        setStromaArea(tilSubscriptionData?.tilStatus?.data?.stroma_area);
        setTumorArea(0);
        setTilScore(tilSubscriptionData?.tilStatus?.data?.TILS_score);
     setLymphocyteCount(tilSubscriptionData?.tilStatus?.data?.lymphocyte_count);
  }
  if(TilHover && hideStroma === true){
    // console.log("s");
    const canvas = fabricOverlay.fabricCanvas();
    const color = "#2Aff00";
    const roi = tilSubscriptionData?.tilStatus?.data?.lymphocyte_cords.flat(2).map((TIL_cord) => {
      return new fabric.Rect({
        top: TIL_cord[1],
        // bottom:TIL_cord[1],
        left: TIL_cord[0],
        // right:TIL_cord[2],
        width: TIL_cord[2] - TIL_cord[0],
        height: TIL_cord[3] - TIL_cord[1],
        stroke: "red",
        fill: "transparent",
        strokeWidth: 1,
     opacity: 1,
     strokeUniform: true,
   });
  });
  const roi2 = tilSubscriptionData?.tilStatus?.data?.tumor_cords?.map((tumor_cord) => {
    // console.log(tumor_cord);
    const points2 = tumor_cord.map((point2) => ({
      x: point2[0][0],
      y: point2[0][1],
    }));
    return new fabric.Polygon(points2, {
      stroke: `${color}83`,
     strokeWidth: 1.2,
     fill: "green",
     opacity: 0.2,
     strokeUniform: true,
    });
  });
  canvas?.remove(cords)?.requestRenderAll();
  canvas?.remove(originalTil)?.requestRenderAll();
     const t = new fabric.Group([...roi2, ...roi], {
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
     });
    //  console.log(t);
     setCords(t);
     canvas.add(t);
     setStromaArea(0);
     setTumorArea(tilSubscriptionData?.tilStatus?.data?.tumor_area);
     setTilScore(tilSubscriptionData?.tilStatus?.data?.TILS_score);
  setLymphocyteCount(tilSubscriptionData?.tilStatus?.data?.lymphocyte_count);
  }
  if(TilHover && hideLymphocyte === true){
    // console.log("s");
    const canvas = fabricOverlay.fabricCanvas();
    const color = "#2Aff00";
    const roi2 =  tilSubscriptionData?.tilStatus?.data?.tumor_cords?.map((tumor_cord) => {
      // console.log(tumor_cord);
      const points2 = tumor_cord.map((point2) => ({
        x: point2[0][0],
        y: point2[0][1],
      }));
      return new fabric.Polygon(points2, {
        stroke: `${color}83`,
        strokeWidth: 1.2,
        fill: "green",
        opacity: 0.2,
        strokeUniform: true,
      });
    });
    const roi3 =  tilSubscriptionData?.tilStatus?.data?.stroma_cords?.map((stroma_cord) => {
      const points3 = stroma_cord.map((point3) => ({
        x: point3[0][0],
        y: point3[0][1],
      }));
      return new fabric.Polygon(points3, {
        stroke: `yellow`,
        strokeWidth: 1.2,
        fill: color ? `yellow` : "",
        opacity: 0.5,
        strokeUniform: true,
      });
    });
        canvas?.remove(cords)?.requestRenderAll();
      canvas?.remove(originalTil)?.requestRenderAll();
        const t = new fabric.Group([...roi2, ...roi3,], {
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
        });
        // console.log(t);
        setCords(t);
        canvas.add(t);
        setStromaArea(tilSubscriptionData?.tilStatus?.data?.stroma_area);
        setTumorArea(tilSubscriptionData?.tilStatus?.data?.tumor_area);
        setTilScore(tilSubscriptionData?.tilStatus?.data?.TILS_score);
     setLymphocyteCount(0);
  }
  if(TilHover && hideTumor === false && hideStroma === false && hideLymphocyte === false){
    const canvas = fabricOverlay.fabricCanvas();
    const color = "#2Aff00";
    const roi = tilSubscriptionData?.tilStatus?.data?.lymphocyte_cords.flat(2).map((TIL_cord) => {
      return new fabric.Rect({
        top: TIL_cord[1],
        // bottom:TIL_cord[1],
        left: TIL_cord[0],
        // right:TIL_cord[2],
        width: TIL_cord[2] - TIL_cord[0],
        height: TIL_cord[3] - TIL_cord[1],
        stroke: "red",
        fill: "transparent",
        strokeWidth: 1,
        opacity: 1,
        strokeUniform: true,
      });
    });
    const roi2 = tilSubscriptionData?.tilStatus?.data?.tumor_cords?.map((tumor_cord) => {
      // console.log(tumor_cord);
      const points2 = tumor_cord.map((point2) => ({
        x: point2[0][0],
        y: point2[0][1],
      }));
      return new fabric.Polygon(points2, {
        stroke: `${color}83`,
        strokeWidth: 1.2,
        fill: "green",
        opacity: 0.2,
        strokeUniform: true,
      });
    });
    const roi3 =  tilSubscriptionData?.tilStatus?.data?.stroma_cords?.map((stroma_cord) => {
      const points3 = stroma_cord.map((point3) => ({
        x: point3[0][0],
        y: point3[0][1],
      }));
      return new fabric.Polygon(points3, {
        stroke: `yellow`,
        strokeWidth: 1.2,
        fill: color ? `yellow` : "",
        opacity: 0.5,
        strokeUniform: true,
      });
    });
        canvas?.remove(cords)?.requestRenderAll();
      canvas?.remove(originalTil)?.requestRenderAll();
        const t = new fabric.Group([...roi2, ...roi3, ...roi], {
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
        });
        // console.log(t);
        setCords(t);
        canvas.add(t);
        setStromaArea(tilSubscriptionData?.tilStatus?.data?.stroma_area);
        setTumorArea(tilSubscriptionData?.tilStatus?.data?.tumor_area);
        setTilScore(tilSubscriptionData?.tilStatus?.data?.TILS_score);
     setLymphocyteCount(tilSubscriptionData?.tilStatus?.data?.lymphocyte_count);
  }
    }
  },[hideLymphocyte, hideStroma, hideTumor])
  
  return (
    <>
      <Tooltip
        label={<TooltipLabel heading="TIL" />}
        aria-label="TIL"
        placement="bottom"
        openDelay={0}
        bg="#E4E5E8"
        color="rgba(89, 89, 89, 1)"
        fontSize="14px"
        fontFamily="inter"
        hasArrow
        borderRadius="0px"
        size="20px"
      >
        <IconButton
          width={ifScreenlessthan1536px ? "30px" : "40px"}
          size={ifScreenlessthan1536px ? 60 : 0}
          height={ifScreenlessthan1536px ? "26px" : "34px"}
          icon={
            !TilHover ? (
              <BiTargetLock size={IconSize()} color="#151C25" />
            ) : (
              <ImTarget size={IconSize()} color="#3b5d7c" />
            )
          }
          _active={{
            bgColor: "rgba(228, 229, 232, 1)",
            outline: "0.5px solid rgba(0, 21, 63, 1)",
          }}
          outline={TilHover ? " 0.5px solid rgba(0, 21, 63, 1)" : ""}
          _focus={{
            border: "none",
          }}
          backgroundColor={!TilHover ? "#F8F8F5" : "#E4E5E8"}
          mr="7px"
          borderRadius={0}
          disabled={
            stromaCords?.length > 0 ||
            tumorCords?.length > 0 ||
            tilCords?.length > 0 ||
            tilSubscriptionData?.tilStatus?.message === "Til is completed"
              ? false
              : true
          }
          onClick={() => {
            handleTIL();
            setTilHover(!TilHover);
          }}
          _hover={{ bgColor: "rgba(228, 229, 232, 1)" }}
        />
       
      </Tooltip>
    </>
  );
};

export default Til;
