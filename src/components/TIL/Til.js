import React, { useEffect, useState } from "react";
import {
  IconButton,
  Text,
  Tooltip,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { GET_TILS_ANALYSIS, VHUT_ANALYSIS_SUBSCRIPTION } from "../../graphql/annotaionsQuery";
import axios from "axios";
import { fabric } from "openseadragon-fabricjs-overlay";
import { useFabricOverlayState } from "../../state/store";
import TooltipLabel from "../AdjustmentBar/ToolTipLabel";
import { BiTargetLock } from "react-icons/bi";
import { ImTarget } from "react-icons/im";
import IconSize from "../ViewerToolbar/IconSize";
import { useLazyQuery } from "@apollo/client/react";
import { getDataFromTree } from "@apollo/client/react/ssr";
import { useSubscription } from "@apollo/client";

const Til = ({ viewerId, mongoId, slide }) => {
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const [TilHover, setTilHover] = useState(false);
  const { fabricOverlayState } = useFabricOverlayState();
  const { viewerWindow } = fabricOverlayState;
  const { fabricOverlay, viewer } = viewerWindow[viewerId];
  const [tilCords, setTilCords] = useState([]);
  const [tumorCords, setTumorCords] = useState([]);
  const [stromaCords, setStromaCords] = useState([]);
  const [tilMessage , setTilMessage] = useState('');
  const toast = useToast();
  const [getTils, { data, loading, error }] = useLazyQuery(GET_TILS_ANALYSIS);
  const { data: vhutSubscriptionData, error: vhutSubscription_error } =
		useSubscription(VHUT_ANALYSIS_SUBSCRIPTION, {
			variables: {
				body: {
					slideId : slide?._id,
				},
			},
		});
    // console.log(slide?._id);
  useEffect(() => {
    if(vhutSubscriptionData){
      console.log(vhutSubscriptionData.analysisStatus.message);
      setTilMessage(vhutSubscriptionData.analysisStatus.message);
      getTils({
        variables: {
          query: {
            tilId: mongoId,
          },
        },
      });
      // console.log(vhutSubscriptionData);
    }
    if (TilHover === false) {
      const canvas = fabricOverlay?.fabricCanvas();
      canvas?.clear()?.requestRenderAll();
      localStorage.removeItem("til", "til");
    }
    // console.log(tilCords);
  },[vhutSubscriptionData, TilHover]);
  
function getData(){
console.log(data);
 setTilCords(data?.getTils?.data?.tils_cords);
    setTumorCords(data?.getTils?.data?.tumor_cords);
    setStromaCords(data?.getTils?.data?.stroma_cords);
}
  useEffect(()=>{
    // console.log(data);
    const handle =  setTimeout(getData,3000);
     if(tumorCords?.length>0 || tilCords?.length>0 || stromaCords?.length>0 && TilHover === false){
      clearTimeout(handle);
      toast({
        title: "TIL can be run now",
        description: "",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
     }
  });

  console.log(tumorCords,stromaCords,tilCords);

  const handleTIL = () => {
    // clearTimeout(handle);
    if(tilMessage != "Til is Stored"){
      return toast({
        title: "Something Went Wrong in til",
        description: "",
        status: "error",
        duration: 1500,
        isClosable: true,
      });
    }
      if (!fabricOverlay) {
         toast({
          title: "Something Went Wrong in faric overlay",
          description: "",
          status: "error",
          duration: 1500,
          isClosable: true,
        });
      }
      // console.log(tilCords);
        console.log(data);
if(tumorCords.length>0 || stromaCords.length>0 || tilCords.length>0 ){
  console.log("til is setting in canvas");
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
  const t = new fabric.Group([...roi2, ...roi, ...roi3], {
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
  // console.log(roi);
  canvas.add(t);
  if(TilHover === false && vhutSubscriptionData?.analysisStatus?.message == "Til is Stored" && fabricOverlay){
    toast({
      title: "TIL Process Done",
      description: "",
      status: "success",
      duration: 2500,
      isClosable: true,
    });
  }
}
  };
  return (
    <>
      <Tooltip
        label={<TooltipLabel heading="TIL" />}
        aria-label="Chat"
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
          disabled = {stromaCords?.length>0 || tumorCords?.length>0 || tilCords?.length> 0 ? false : true}
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
