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
}) => {
  const { fabricOverlayState,setFabricOverlayState  } = useFabricOverlayState();
  const { viewerWindow, activeTool } = fabricOverlayState;
  const { viewer } = viewerWindow[viewerId];
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const [isActiveTool, setIsActiveTool] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [sliderInputs, setSliderInputs] = useState({
    contrast: 1,
    brightness: 0,
    thresholding: -1,
    gamma: 1,
    exposure: 0,
  });
  const isActive = activeTool === "Filter"

  useEffect(() => {
    if (navigatorCounter > 0) {
      setIsActiveTool(false);
    }
  }, [navigatorCounter]);

  useEffect(() => {
    if (isActiveTool) {
      setToolSelected("Filter");
      setFabricOverlayState(updateTool({ tool: "Filter" }));

    } else {
      setToolSelected("");
      setFabricOverlayState(updateTool({ tool: "Move" }));
    }
  }, [isActiveTool]);

  useEffect(() => {
    if (toolSelected === "") {
      setIsActiveTool(false);
    }
  }, [toolSelected]);

  const sliderStateRef = useRef(sliderInputs);
  const modalRef = useRef(null);

  const toast = useToast();

  const handleClick = () => {
    setIsActiveTool((state) => !state);
  };

  useEffect(()=>{
    if(AdjustmentTool > 0){
      handleClick()
    }
  },[AdjustmentTool])


  const handleSliderChange = (name, value) => {
    setSliderInputs({ ...sliderInputs, [name.toLowerCase()]: value });
  };

  const handleOnClose = () => {
    setIsActiveTool(false);
    if (sliderStateRef.current) setSliderInputs(sliderStateRef.current);
    onClose();
  };

  const handleSave = () => {
    sliderStateRef.current = sliderInputs;
    toast({
      status: "success",
      title: "Filters successfully applied",
      isClosable: true,
      duration: 1000,
    });
    setIsActiveTool(false);
    onClose();
  };

  useEffect(() => {
    if (!viewer) return;

    const filters = getFilters(sliderInputs);

    try {
      viewer.setFilterOptions({
        filters: {
          processors: [
            ...filters,
            OpenSeadragon.Filters.CONTRAST(sliderInputs.contrast),
            OpenSeadragon.Filters.BRIGHTNESS(sliderInputs.brightness),
            OpenSeadragon.Filters.GAMMA(sliderInputs.gamma),
          ],
        },
        loadMode: "async",
      });
    } catch (err) {
      console.error(err);
    }
  }, [sliderInputs, viewer]);

  return (
 <></>
  );
};

export default FilterAdjustments;
