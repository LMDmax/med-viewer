import React, { useEffect, useState, useRef } from "react";
import {
  IconButton,
  Text,
  Tooltip,
  Box,
  Flex,
  useMediaQuery,
  useToast,
  Image,
} from "@chakra-ui/react";
import TooltipLabel from "../AdjustmentBar/ToolTipLabel";
import { BsInfoCircleFill } from "react-icons/bs";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import IconSize from "../ViewerToolbar/IconSize";
import { AiIcon } from "../Icons/CustomIcons";

const AiModels = ({
  slide,
  setToolSelected,
  setModelname,
  toolSelected,
  bottomZoomValue,
  bottombottomZoomValue,
  navigatorCounter,
}) => {
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const [TilHover, setTilHover] = useState(false);
  const [animationActive, setAnimationActive] = useState(true);
  const [TilActiveState, setTilActiveState] = useState(0);
  const [infoBox, setInfoBox] = useState(false);
  const [infoItem, setInfoItem] = useState("");

  // console.log(slide);

  useEffect(() => {
    if (!TilHover) {
      setModelname("");
      setInfoBox(false);
    }
  }, [TilHover]);

  useEffect(() => {
    if (navigatorCounter > 0) {
      setTilHover(false);
      if (TilActiveState > 0) {
        setTilActiveState(0);
      }
      setToolSelected("");
      setModelname("");
    }
  }, [navigatorCounter]);

  const handleKI67 = () => {
    if (
      (slide?.stainType === "IHC" &&
        bottomZoomValue > 39 &&
        slide?.bioMarkerType === "kI67") ||
      application === "education"
    ) {
      // console.log("1");
      setModelname("KI67");
      // console.log("1");
    }
    if (slide?.stainType !== "IHC" || slide?.bioMarkerType !== "kI67") {
      setToolSelected("KI67Error");
      // console.log("1");
      // console.log("3");
      setModelname("");
    }
    if (bottomZoomValue < 39) {
      setToolSelected("ZoomError");
      // console.log("1");
      setModelname("");
    }
  };

  const handleMorphometry = () => {
    // console.log("2");
    if (slide.stainType === "H&E" && bottomZoomValue >= 40 || application ==="education") {
      setModelname("Morphometry");
    }
    if (slide.stainType !== "H&E") {
      setToolSelected("MorphometrySlideIssue");
    }
    if (bottomZoomValue < 40) {
      setToolSelected("ZoomError");
    }
  };

  // console.log(slide);
  useEffect(() => {
    if (slide.stainType === "H&E") {
      if (TilActiveState / 2 !== 0) {
        setModelname("TIL");
      } else {
        setModelname("TILClear");
      }
      // console.log("object");
    } else {
      setToolSelected("TILError");
      // console.log("object2");
    }
  }, [TilActiveState]);

  useEffect(() => {
    if (toolSelected === "RunRoi") {
      setAnimationActive(true); // start the animation
      const timeoutId = setTimeout(() => {
        setAnimationActive(false); // stop the animation after 3 seconds
      }, 3000);
      return () => clearTimeout(timeoutId); // clear the timeout when component unmounts
    } else {
      setAnimationActive(false); // stop the animation if the condition is not met
    }
  }, [toolSelected]);

  return (
    <>
      <Box
        w="fit-content"
        h="100%"
        // border="1px solid green"
        // border="1px solid black"
        style={{ position: "relative", display: "inline-block" }}
        _hover={{ bgColor: "transparent" }}
        // border="2px solid red"
        onClick={() => setTilHover(!TilHover)}
        sx={{
          ":before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            cursor: "pointer",
            width: "100%",
            height: "100%",
            backgroundColor: TilHover ? "rgba(157,195,226,0.4)" : "transparent",
            zIndex: 1,
          },
          ...(animationActive && {
            animation: `pulse 1s infinite`,
            "@keyframes pulse": {
              "0%": {
                transform: "scale(1)",
              },
              "50%": {
                transform: "scale(1.2)",
              },
              "100%": {
                transform: "scale(1)",
              },
            },
          }),
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
            icon={
              !TilHover ? (
                <AiIcon transform="scale(1.2)" color="red" />
              ) : (
                <AiIcon transform="scale(1.2)" color="red" />
              )
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
          />
          <Flex
            justifyContent="space-between"
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
              color="#5497cd"
            >
              PRR AI
            </Text>
            <RiArrowDownSLine color="#5497cd" size="16px" />
          </Flex>
        </Flex>
        {TilHover && (
          <Box
            style={{
              position: "absolute",
              top: "120%",
              left: 0,
              width: "140px",
              backgroundColor: "#F5F5F5",
              borderTop: "none",
              padding: "5px 0",
            }}
          >
            <ul style={{ listStyleType: "none", margin: 0, padding: 0 }}>
              <Flex px="6px" gap="12px" direction="column">
                <Flex alignItems="center" justifyContent="space-between">
                  <li
                    style={{
                      backgroundColor: "transparent",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#3b5d7c";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "black";
                    }}
                    onClick={() => handleMorphometry()}
                  >
                    Morphometry
                  </li>
                  <BsInfoCircleFill
                    onMouseEnter={() => {
                      setInfoBox(true);
                      setInfoItem("morphometry");
                    }}
                    onMouseLeave={() => {
                      setInfoBox(false);
                      setInfoItem("");
                    }}
                    cursor="pointer"
                    color="gray"
                  />
                </Flex>
                <Flex
                  w="100%"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <li
                    style={{
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
                      setTilActiveState(TilActiveState + 1);
                    }}
                  >
                    TILS
                  </li>
                  <BsInfoCircleFill
                    onMouseEnter={() => {
                      setInfoBox(true);
                      setInfoItem("tils");
                    }}
                    onMouseLeave={() => {
                      setInfoBox(false);
                      setInfoItem("");
                    }}
                    cursor="pointer"
                    color="gray"
                  />
                </Flex>
                <Flex alignItems="center" justifyContent="space-between">
                  <li
                    style={{
                      backgroundColor: "transparent",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#3b5d7c";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "black";
                    }}
                    onClick={() => handleKI67()}
                  >
                    KI-67
                  </li>
                  <BsInfoCircleFill
                    onMouseEnter={() => {
                      setInfoBox(true);
                      setInfoItem("ki67");
                    }}
                    onMouseLeave={() => {
                      setInfoBox(false);
                      setInfoItem("");
                    }}
                    cursor="pointer"
                    color="gray"
                  />
                </Flex>
              </Flex>
            </ul>
          </Box>
        )}
        {infoBox && (
          <Box
            style={{
              position: "absolute",
              top: "120%",
              left: "150px",
              height: "fit-content",
              width: "220px",
              padding: "5px",
              backgroundColor: "#F5F5F5",
              borderTop: "none",
            }}
          >
            {infoItem === "tils" ? (
              <Box>
                <Box lineHeight="1.2" marginBottom="8px">
                  Here we are finding Tumor infiltrating lymphocytes (TILS).
                </Box>
                <Box lineHeight="1.2" marginBottom="8px">
                  <strong>Model Info</strong>: It segments Tumor regions and
                  tumor-associated Stroma. Detection of lymphocytes within
                  tumor-associated stroma.
                </Box>
                <Box lineHeight="1.2" marginBottom="8px">
                  <strong>Model Output</strong>: Tumor Area, Tumor percentage,
                  Stroma Area, Stroma percentage, bounding boxes around cells
                  (units for area: micron^2).
                </Box>
              </Box>
            ) : infoItem === "morphometry" ? (
              <Box>
                <Box lineHeight="1.2" marginBottom="8px">
                  <strong>Model Info</strong>:
                </Box>
                <Box lineHeight="1.2" marginBottom="8px">
                  <strong>Method Used</strong>:
                </Box>
                <Box lineHeight="1.2" marginBottom="8px">
                  <strong>Method Input</strong>: Image(ROI).
                </Box>
                <Box lineHeight="1.2" marginBottom="8px">
                  <strong>Model Output</strong>:
                </Box>
              </Box>
            ) : infoItem === "ki67" ? (
              <Box>
                <Box lineHeight="1.2" marginBottom="8px">
                  <strong>Model Info</strong>: It detects the positve
                  cells(appear brown) and negative cells(appear blue).
                </Box>
                <Box lineHeight="1.2" marginBottom="8px">
                  <strong>Method Used</strong>: OpenCV.
                </Box>
                <Box lineHeight="1.2" marginBottom="8px">
                  <strong>Method Input</strong>: Image(ROI).
                </Box>
                <Box lineHeight="1.2" marginBottom="8px">
                  <strong>Model Output</strong>: Location of centers of cells,
                  proliferation score.
                </Box>
              </Box>
            ) : (
              ""
            )}
          </Box>
        )}
      </Box>
    </>
  );
};

export default AiModels;
