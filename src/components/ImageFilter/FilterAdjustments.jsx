import React, { useEffect, useRef, useState } from "react";
import {
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  IconButton,
  Box,
  VStack,
  Flex,
  ModalFooter,
  Button,
  Text,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { HiAdjustments } from "react-icons/hi";
import OpenSeadragon from "openseadragon";
import TooltipLabel from "../AdjustmentBar/ToolTipLabel";
import ToolbarButton from "../ViewerToolbar/button";
import { useFabricOverlayState } from "../../state/store";
import IconSize from "../ViewerToolbar/IconSize";
import "./openseadragon-filtering";
import AdjustmentRow from "./AdjustmentRow";
import { updateTool } from "../../state/actions/fabricOverlayActions";

const getFilters = (sliderInputs) => {
  // console.log(sliderInputs);
  const filters = [];
  if (sliderInputs.thresholding > -1)
    filters.push(OpenSeadragon.Filters.THRESHOLDING(sliderInputs.thresholding));
  return filters;
};

const FilterAdjustments = ({
  viewerId,
  setToolSelected,
  toolSelected,
  AdjustmentTool,
  navigatorCounter,
  newSliderInputs,
}) => {
  const { fabricOverlayState,setFabricOverlayState  } = useFabricOverlayState();
  const { viewerWindow, activeTool } = fabricOverlayState;
  const { viewer } = viewerWindow[viewerId];
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const [isActiveTool, setIsActiveTool] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isActive = activeTool === "Filter"

  useEffect(() => {
    if (navigatorCounter > 0) {
      setIsActiveTool(false);
    }
  }, [navigatorCounter]);

  useEffect(() => {
    if (!isActiveTool) {
      setToolSelected("");
      setFabricOverlayState(updateTool({ tool: "Move" }));
    }
  }, [isActiveTool]);

  useEffect(() => {
    if (toolSelected === "") {
      setIsActiveTool(false);
    }
  }, [toolSelected]);


  const handleClick = () => {
    setIsActiveTool((state) => !state);
  };

  // console.log("adj", AdjustmentTool)
  useEffect(()=>{
    if(AdjustmentTool){
      setToolSelected("Filter");
      setFabricOverlayState(updateTool({ tool: "Filter" }));
      // handleClick()
    }
  },[AdjustmentTool])

  // console.log("tool", activeTool)
  // console.log("tool", AdjustmentTool)



  return (
 <></>
  );
};

export default FilterAdjustments;
