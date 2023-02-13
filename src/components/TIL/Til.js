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
import { useSubscription } from "@apollo/client";
import { getFileBucketFolder } from "../../utility";
import { updateTool } from "../../state/actions/fabricOverlayActions";

const Til = ({
  viewerId,
  viewerIds,
  slide,
  hideTumor,
  hideStroma,
  hideLymphocyte,
}) => {
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const [TilHover, setTilHover] = useState(false);
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { viewerWindow } = fabricOverlayState;
  const { fabricOverlay, viewer } = viewerWindow[viewerId];
  const [tilCords, setTilCords] = useState([]);
  const [tumorCords, setTumorCords] = useState([]);
  const [stromaCords, setStromaCords] = useState([]);
  const toast = useToast();
  const [getTils, { data, loading, error }] = useLazyQuery(GET_TILS_ANALYSIS);
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
        title: "Tils is processing",
        description: "",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
    }
  }, []);

  useEffect(() => {
    if (TilHover) {
      setFabricOverlayState(updateTool({ tool: "" }));
      if (
        tilSubscriptionData?.tilStatus?.data?.TILS_score ||
        tilSubscriptionData?.tilStatus?.data?.tumor_area ||
        tilSubscriptionData?.tilStatus?.data?.stroma_area
      ) {
        localStorage.setItem(
          "tilScore",
          tilSubscriptionData?.tilStatus?.data?.TILS_score
        );
        localStorage.setItem(
          "tumorArea",
          tilSubscriptionData?.tilStatus?.data?.tumor_area
        );
        localStorage.setItem(
          "stromaArea",
          tilSubscriptionData?.tilStatus?.data?.stroma_area
        );
        localStorage.setItem(
          "lymphocyteCount",
          tilSubscriptionData?.tilStatus?.data?.lymphocyte_count
        );
      } else if (
        data?.getTils?.data?.TILS_score ||
        data?.getTils?.data?.tumor_area ||
        data?.getTils?.data?.stroma_area
      ) {
        localStorage.setItem("tilScore", data?.getTils?.data?.TILS_score);
        localStorage.setItem("tumorArea", data?.getTils?.data?.tumor_area);
        localStorage.setItem("stromaArea", data?.getTils?.data?.stroma_area);
        localStorage.setItem(
          "lymphocyteCount",
          data?.getTils?.data?.lymphocyte_count
        );
      }
    } else {
      localStorage.removeItem("tumorArea");
      localStorage.removeItem("stromaArea");
      localStorage.removeItem("tilScore");
      localStorage.removeItem("lymphocyteCount");
      setFabricOverlayState(updateTool({ tool: "Move" }));
    }
  }, [TilHover]);

  console.log(tilSubscriptionData);
  useEffect(() => {
    if (
      stromaCords?.length > 0 ||
      tumorCords?.length > 0 ||
      tilCords?.length > 0 ||
      tilSubscriptionData?.tilStatus?.message === "Til is completed"
    ) {
      toast({
        title: "Tils can be run now",
        description: "",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
    }
  }, [
    stromaCords,
    tumorCords,
    tilCords,
    tilSubscriptionData?.tilStatus?.message,
  ]);
  useEffect(() => {
    if (!tilSubscriptionData) {
      getTils({
        variables: {
          query: {
            key: `${getFileBucketFolder(viewerIds[0].originalFileUrl)}`,
            bucket_name: "med-ai-image-processor",
            slideId: `${slide?._id}`,
          },
        },
      });
      if (data?.getTils?.data) {
        setTilCords(data?.getTils?.data?.lymphocyte_cords);
        setTumorCords(data?.getTils?.data?.tumor_cords);
        setStromaCords(data?.getTils?.data?.stroma_cords);
      }
    }
    console.log(data);
    // getData();
  }, [data]);

  useEffect(() => {
    if (TilHover === false) {
      const canvas = fabricOverlay?.fabricCanvas();
      canvas?.clear()?.requestRenderAll();
      localStorage.removeItem("til", "til");
    }
  }, [TilHover]);

  const handleTIL = () => {
    // if (!fabricOverlay) {
    //      toast({
    //         title: "Something Went Wrong in faric overlay",
    //         description: "",
    //         status: "error",
    //         duration: 1500,
    //         isClosable: true,
    //       });
    //     }
    if (
      tumorCords?.length > 0 ||
      stromaCords?.length > 0 ||
      (tilCords?.length > 0 && TilHover === false)
    ) {
      localStorage.setItem("til", "til");
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
      if (hideTumor) {
        canvas?.clear()?.requestRenderAll();
        const t = new fabric.Group([...roi3, ...roi], {
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
        canvas.add(t);
      } else if (hideStroma) {
        canvas?.clear()?.requestRenderAll();
        const t = new fabric.Group([...roi2, ...roi], {
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
        canvas.add(t);
      } else if (hideLymphocyte) {
        canvas?.clear()?.requestRenderAll();
        const t = new fabric.Group([...roi3, ...roi2], {
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
        canvas.add(t);
      } else {
        canvas?.clear()?.requestRenderAll();
        const t = new fabric.Group([...roi2, ...roi3, ...roi], {
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
        canvas.add(t);
      }
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
    } else if (
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
      if (hideTumor) {
        canvas?.clear()?.requestRenderAll();

        const t = new fabric.Group([...roi3, ...roi], {
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
        canvas.add(t);
      } else if (hideStroma) {
        canvas?.clear()?.requestRenderAll();
        const t = new fabric.Group([...roi2, ...roi], {
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
        canvas.add(t);
      } else if (hideLymphocyte) {
        canvas?.clear()?.requestRenderAll();
        const t = new fabric.Group([...roi3, ...roi2], {
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
        canvas.add(t);
      } else {
        const t = new fabric.Group([...roi2, ...roi3, ...roi], {
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
        canvas.add(t);
      }
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
  };

  useEffect(() => {
    handleTIL();
    console.log(hideStroma);
  }, [hideTumor, hideStroma, hideLymphocyte]);
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
