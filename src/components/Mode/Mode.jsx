import {
  Flex,
  IconButton,
  useMediaQuery,
  Tooltip,
  Image,
  Box,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ModeIcon } from "../Icons/CustomIcons";
import modeImgSelect from "../../assets/images/modeIconSelect.svg";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { useFabricOverlayState } from "../../state/store";

const Mode = ({
  setAdjustmentTool,
  AdjustmentTool,
  showRightPanel,
  setShowRightPanel,
  viewerId,
  setImageFilter,
  socketIsConnected,
}) => {
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { viewerWindow, activeTool } = fabricOverlayState;
  const { viewer, fabricOverlay } = viewerWindow[viewerId];
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const [isOpen, setIsOpen] = useState();
  const [showNormalisationCount, setShowNormalisationCount] = useState(false);
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (showNormalisationCount)  {
      localStorage.setItem("mode", "normalisation");
      setShowRightPanel(true);
      setImageFilter(true)

    }
  }, [showNormalisationCount]);

  useEffect(() => {
    if (!localStorage.getItem("mode")) {
      setShowNormalisationCount(0);
    }
  });
  return (
    <Box
      w="60px"
      h="100%"
      // border="1px solid green"
      // border="1px solid black"
      style={{ position: "relative", display: "inline-block" }}
      _hover={{ bgColor: "transparent" }}
      // border="2px solid red"
      onClick={() => handleClick()}
      sx={{
        ":before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          cursor: "pointer",
          width: "100%",
          height: "100%",
          backgroundColor: isOpen ? "rgba(157,195,226,0.4)" : "transparent",
          zIndex: 1,
        },
      }}
    >
      <Flex
        direction="column"
        mt={ifScreenlessthan1536px ? "1px" : "-2px"}
        justifyContent="center"
        alignItems="center"
        h="100%"
      >
        <IconButton
          width={ifScreenlessthan1536px ? "100%" : "100%"}
          height={ifScreenlessthan1536px ? "50%" : "50%"}
          _hover={{ bgColor: "transparent" }}
          icon={<ModeIcon transform="scale(1.5)" />}
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
        />
        <Flex
          justifyContent="space-evenly"
          w="100%"
          alignItems="center"
          cursor="pointer"
        >
          <Text
            ml="3px"
            fontFamily="inter"
            fontSize="10px"
            userSelect="none"
            align="center"
            color="black"
          >
            Mode
          </Text>
          <RiArrowDownSLine color="black" size="16px" />
        </Flex>
      </Flex>

      {isOpen && (
        <Box
          style={{
            position: "absolute",
            top: "120%",
            left: 0,
            width: "120px",
            backgroundColor: "#F5F5F5",
            borderTop: "none",
            padding: "5px 0",
          }}
        >
          <ul style={{ listStyleType: "none", margin: 0, padding: 0 }}>
            <li
              style={{
                padding: "5px",
                backgroundColor: "transparent",
                cursor: socketIsConnected ? "pointer" : "not-allowed",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "#3b5d7c";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "black";
              }}
              onClick={() => {
                if (socketIsConnected) {
                  setShowNormalisationCount(true);
                }
              }}
            >
              Normalisation
            </li>
            <li
              style={{
                padding: "5px",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "#3b5d7c";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "black";
              }}
              onClick={() => {
                setAdjustmentTool(!AdjustmentTool);
              }}
            >
              Adjustments
            </li>
          </ul>
        </Box>
      )}
    </Box>
  );
};

export default Mode;
