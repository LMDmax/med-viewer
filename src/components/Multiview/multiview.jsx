import React, { useState } from "react";
import {
  IconButton,
  Tooltip,
  useMediaQuery,
  Box,
  Text,
  Flex,
} from "@chakra-ui/react";
import ToolbarButton from "../ViewerToolbar/button";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import IconSize from "../ViewerToolbar/IconSize";
import { useFabricOverlayState } from "../../state/store";
import { MultiviewIcon, MultiviewSelectedIcon } from "../Icons/CustomIcons";
import TooltipLabel from "../AdjustmentBar/ToolTipLabel";
import { useEffect } from "react";

const Multiview = ({
  viewerId,
  isMultiview,
  setToolSelected,
  navigatorCounter,
  setNavigatorCounter,
  setIsMultiview,
  setIsNavigatorActive,
}) => {
  const iconSize = IconSize();
  const { fabricOverlayState } = useFabricOverlayState();
  const { viewerWindow, isAnnotationLoading } = fabricOverlayState;
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const [state, setState] = useState(false);

  useEffect(() => {
    if (state) {
      // console.log("sdsds");
      setIsNavigatorActive(false);
      setIsMultiview(true);
      setToolSelected("Multiview");
    } else {
      setToolSelected("");
      setState(false);
      setIsMultiview(false);
    }
  }, [state]);

  // console.log(state);

  useEffect(() => {
    if (navigatorCounter > 0) {
      setState(false);
    }
  }, [navigatorCounter]);

  return (
    <Box
      onClick={() => {
        // handleClick();
        setState(!state);
      }}
      pt="8px"
      w="60px"
      backgroundColor={isMultiview ? "rgba(157,195,226,0.4)" : "transparent"}
      h="100%"
      // sx={{
      //   ":before": {
      //     content: '""',
      //     top: 0,
      //     left: 0,
      //     cursor:"pointer",
      //     width: "100%",
      //     height: "100%",
      //     backgroundColor: isMultiview ? "rgba(157,195,226,0.4)" : "transparent",
      //     zIndex: 1,
      //   },
      // }}
    >
      <IconButton
        width={ifScreenlessthan1536px ? "100%" : "100%"}
        height={ifScreenlessthan1536px ? "50%" : "70%"}
        // border="2px solid red"
        _hover={{ bgColor: "transparent" }}
        icon={
          <MultiviewIcon
            transform="scale(1.2)"
            size={iconSize}
            color="#3B5D7C"
          />
        }
        _active={{
          bgColor: "transparent",
          outline: "none",
        }}
        // outline={TilHover ? " 0.5px solid rgba(0, 21, 63, 1)" : ""}
        // _focus={{
        // }}
        backgroundColor="transparent"
        // mr="7px"
        // border="1px solid red"
        borderRadius={0}
        mb="3px"
      />
      <Flex
        justifyContent="center"
        w="100%"
        alignItems="center"
        // border="1px solid red"
        cursor="pointer"
      >
        <Text userSelect="none" fontFamily="inter" fontSize="10px" align="center">
          View
        </Text>
        <RiArrowDownSLine color="black" size="12px" />
      </Flex>
    </Box>
  );
};

export default Multiview;
