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
import { BiInfoCircle } from "react-icons/bi";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import IconSize from "../ViewerToolbar/IconSize";
import { AiIcon } from "../Icons/CustomIcons";
import { useLazyQuery, useMutation, useSubscription } from "@apollo/client";
import {
  TUMOR_ANALYSIS,
  TUMOR_DETECTION_SUBSCRIPTION,
} from "../../graphql/annotaionsQuery";
import { getFileBucketFolder } from "../../utility";
import { useFabricOverlayState } from "../../state/store";

const AiModels = ({
  slide,
  setToolSelected,
  gleasonScoring,
  setModelname,
  toolSelected,
  setBinaryMask,
  viewerIds,
  setGleasonScoring,
  viewerId,
  TILReady,
  bottomZoomValue,
  setLoadUI,
  navigatorCounter,
  setGleasonScoringData,
  newToolSettings,
  selectedPattern,
  setSelectedPattern,
  pattern3Color,
  pattern5Color,
  pattern4Color,
  benignColor,
  SetBenignColor,
  setPattern5Color,
  setPattern4Color,
  setPattern3Color,
  tumorColor,
  stromaColor,
  undoRedoCounter,
  setUndoRedoCounter,
  showGleason,
  setShowGleason,
  setMaskAnnotationData,
  lymphocyteColor,
}) => {
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { viewerWindow, isViewportAnalysing } = fabricOverlayState;
  const { viewer, fabricOverlay, slideId, originalFileUrl, tile } =
    viewerWindow[viewerId];
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const [PRRHover, setPRRHover] = useState(false);
  const [animationActive, setAnimationActive] = useState(true);
  const [TilActiveState, setTilActiveState] = useState(false);
  const [infoBox, setInfoBox] = useState(false);
  const [infoItem, setInfoItem] = useState("");
  const [gleasonEntries, setGleasonEntries] = useState([]);
  const [currentIndexDZIMask, setCurrentIndexDZIMask] = useState();
  const [showTumor, setShowTumor] = useState(false);
  const [detectTumor, setDetectTumor] = useState(false);
  const [modelType, setModelType] = useState("");

  const [showTILS, setShowTILS] = useState(false);
  const [onTumorAnalysis, { data: analysis_data, error: analysis_error }] =
    useMutation(TUMOR_ANALYSIS);

  const { data: subscription, error: subscription_error } = useSubscription(
    TUMOR_DETECTION_SUBSCRIPTION,
    {
      variables: {
        body: {
          data: {
            slideid: slideId,
            type: modelType,
          },
        },
      },
      fetchPolicy: "network-only", // Set the fetchPolicy to 'no-cache'
    }
  );

  console.log("subscriptionAI1st", subscription);
  // console.log("subscriptionErrorAI", subscription_error);

  // ################################# change color as user Input for gleason #####################################################
  // console.log(newToolSettings);
  // console.log(selectedPattern);

  useEffect(() => {
    if (newToolSettings.fillColor !== "" && selectedPattern !== "") {
      if (
        newToolSettings.fillColor.r !== "" ||
        newToolSettings.fillColor.g !== "" ||
        newToolSettings.fillColor.b !== "" ||
        newToolSettings.fillColor.a !== ""
      ) {
        viewer.setFilterOptions({
          filters: {
            processors: changeColorSegment,
          },
          loadMode: "async",
        });
      }
    }
  }, [newToolSettings]);

  const changeColorSegment = async (context, callback) => {
    // console.log("object");
    const imgData = context.getImageData(
      0,
      0,
      context.canvas.width,
      context.canvas.height
    );

    const pixelsData = imgData.data;
    // console.log(pixelsData);
    const length = pixelsData.length;

    for (let i = 0; i < length; i += 4) {
      const red = pixelsData[i];
      const green = pixelsData[i + 1];
      const blue = pixelsData[i + 2];
      const alpha = pixelsData[i + 3];
      // Check if the pixel is black (RGB: 0, 0, 0) or inside the red range (adjust the threshold values as needed)
      if (
        (red === 0 && green === 0 && blue === 0) ||
        (red < 100 && green < 100 && blue < 100)
      ) {
        // Set alpha to 0 for black pixels or pixels inside the red range
        pixelsData[i + 3] = 0;
      }
      // Change green pixels to custom color by modifying RGB values
      if (green > 100 && red < 150 && blue < 150 && benignColor.color) {
        pixelsData[i] = benignColor.color.r; // Brown: R
        pixelsData[i + 1] = benignColor.color.g; // Brown: G
        pixelsData[i + 2] = benignColor.color.b; // Brown: B
        pixelsData[i + 3] = Math.round(benignColor.color.a * 255); // Green: A
      }
      // Change yellow pixels to custom color by modifying RGB values
      if (red > 200 && green > 200 && blue < 100 && pattern3Color.color) {
        // Change yellow pixels to green by modifying RGB values
        pixelsData[i] = pattern3Color.color.r; // Brown: R
        pixelsData[i + 1] = pattern3Color.color.g; // Brown: G
        pixelsData[i + 2] = pattern3Color.color.b; // Brown: B
        pixelsData[i + 3] = Math.round(pattern3Color.color.a * 255); // Green: A
      }
      if (red > 200 && green < 100 && blue < 100 && pattern5Color.color) {
        // Change red pixels to custom color by modifying RGB values
        pixelsData[i] = pattern5Color.color.r; // Brown: R
        pixelsData[i + 1] = pattern5Color.color.g; // Brown: G
        pixelsData[i + 2] = pattern5Color.color.b; // Brown: B
        pixelsData[i + 3] = Math.round(pattern5Color.color.a * 255); // Green: A
      }
      if (
        red > 200 &&
        green > 100 &&
        green < 200 &&
        blue < 100 &&
        pattern4Color.color
      ) {
        // Change orange pixels to a custom color by modifying RGB values
        pixelsData[i] = pattern4Color.color.r; // Brown: R
        pixelsData[i + 1] = pattern4Color.color.g; // Brown: G
        pixelsData[i + 2] = pattern4Color.color.b; // Brown: B
        pixelsData[i + 3] = Math.round(pattern4Color.color.a * 255); // Green: A
      }
      if (red > 200 && green < 100 && blue < 100 && lymphocyteColor.color) {
        // Change red pixels to a custom color (e.g., brown)
        pixelsData[i] = lymphocyteColor.color.r; // Brown: R
        pixelsData[i + 1] = lymphocyteColor.color.g; // Brown: G
        pixelsData[i + 2] = lymphocyteColor.color.b; // Brown: B
        pixelsData[i + 3] = Math.round(lymphocyteColor.color.a * 255); // Brown: A
      }
      if (red > 200 && green > 200 && blue < 100 && stromaColor.color) {
        // Change yellow pixels to green by modifying RGB values
        pixelsData[i] = stromaColor.color.r; // Brown: R
        pixelsData[i + 1] = stromaColor.color.g; // Brown: G
        pixelsData[i + 2] = stromaColor.color.b; // Brown: B
        pixelsData[i + 3] = Math.round(stromaColor.color.a * 255); // Green: A
      }

      if (
        pixelsData[i + 2] > pixelsData[i] &&
        pixelsData[i + 2] > pixelsData[i + 1] &&
        pixelsData[i + 2] > 100 &&
        pixelsData[i] < 100 &&
        pixelsData[i + 1] < 50 &&
        tumorColor.color
      ) {
        // Change blue pixels to a custom color (e.g., red)
        pixelsData[i] = tumorColor.color.r; // Custom Color: R
        pixelsData[i + 1] = tumorColor.color.g; // Custom Color: G
        pixelsData[i + 2] = tumorColor.color.b; // Custom Color: B
        pixelsData[i + 3] = Math.round(tumorColor.color.a * 255); // Custom Color: A
      }
    }

    context.putImageData(imgData, 0, 0);
    callback();
  };

  const reinhardFilter = async (context, callback) => {
    // console.log("object");
    const imgData = context.getImageData(
      0,
      0,
      context.canvas.width,
      context.canvas.height
    );

    const pixelsData = imgData.data;
    // console.log(pixelsData);
    const length = pixelsData.length;

    for (let i = 0; i < length; i += 4) {
      const red = pixelsData[i];
      const green = pixelsData[i + 1];
      const blue = pixelsData[i + 2];
      const alpha = pixelsData[i + 3];
      // Check if the pixel is black (RGB: 0, 0, 0) or inside the red range (adjust the threshold values as needed)
      if (
        (red === 0 && green === 0 && blue === 0) ||
        (red < 100 && green < 100 && blue < 100)
      ) {
        // Set alpha to 0 for black pixels or pixels inside the red range
        pixelsData[i + 3] = 0;
      }
    }

    context.putImageData(imgData, 0, 0);
    callback();
  };

  //gleasongrading
  //################################################# gleason grade ###########################

  const handleGleasonScore = () => {
    const body = {
      key: `${getFileBucketFolder(viewerIds[0].originalFileUrl)}`,
      slideId,
      type: "gleason",
    };
    onTumorAnalysis({
      variables: { body: { ...body } },
    });
    localStorage.setItem("ModelName", "Gleason Scoring");
    setLoadUI(false);
  };

  useEffect(() => {
    if (gleasonScoring) {
      handleGleasonScore();
    } else {
      var topImage = viewer?.world?.getItemAt(1);
      if (topImage) {
        viewer.world.removeItem(topImage);
      }
      setShowGleason(false);
      setSelectedPattern("");
      SetBenignColor({});
      setPattern5Color({});
      setPattern4Color({});
      setPattern3Color({});
    }
  }, [gleasonScoring]);

  useEffect(() => {
    if (showTumor || showGleason || showTILS) {
      // console.log("object");
      viewer.setFilterOptions({
        filters: {
          processors: reinhardFilter,
        },
        loadMode: "async",
      });
      if (!showTILS) {
        setLoadUI(true);
        localStorage.removeItem("ModelName");
      } else {
        // setLoadUI(false);
        localStorage.setItem("ModelName", "TIL");
      }
    }
  }, [showTumor, showGleason, showTILS]);

  useEffect(() => {
    if (subscription && detectTumor) {
      // setBinaryMask(dziUrl);
      // console.log("00", subscription);
      if (subscription.conversionStatus.data.dziUrl !== null) {
        // console.log("11", subscription.conversionStatus.data.dziUrl);
        const dziUrl = subscription.conversionStatus.data.dziUrl;
        viewer.addTiledImage({
          tileSource: dziUrl,
          x: 0,
          y: 0,
          width: 1,
          opacity: 0.2,
        });
        setTimeout(() => {
          setShowTumor(true);
        }, 2000);
      }
      // console.log("1", tiledImage);
      // Change the duration (in milliseconds) as per your requirement
    }
    if (subscription && gleasonScoring) {
      var topImage = viewer?.world?.getItemAt(1);
      if (topImage) {
        viewer.world.removeItem(topImage);
      }
      sortGleasonEntries(subscription);
    } else {
      setShowTumor(false);
      setShowGleason(false);
    }
  }, [subscription]);

  // console.log("HHHHHHHHHHHHHHHHHHH", gleasonEntries);

  // ################HITL CODE#############                 ################HITL CODE#############

  const sortGleasonEntries = (subscription) => {
    const originalMask = subscription.conversionStatus.data.dziUrl
      ? {
          dziUrl: subscription.conversionStatus.data.dziUrl,
          coreLength: subscription.conversionStatus.data.coreLength,
          pattern0: subscription.conversionStatus.data.benign,
          pattern3: subscription.conversionStatus.data.gleason3,
          pattern4: subscription.conversionStatus.data.gleason4,
          pattern5: subscription.conversionStatus.data.gleason5,
          gleasonScore: subscription.conversionStatus.data.gleasonScore,
          gradeGroup: subscription.conversionStatus.data.gradeGroup,
          pptTumor: subscription.conversionStatus.data.pptTumor,
          primaryPattern: subscription.conversionStatus.data.primaryPattern,
          riskCategory: subscription.conversionStatus.data.riskCategory,
          tumorLength: subscription.conversionStatus.data.tumorLength,
          key: subscription.conversionStatus.data.key,
          slideId: subscription.conversionStatus.data.slideid,
          worstPattern:
            subscription.conversionStatus.data.worstRemainingPattern,
          hilLength: subscription?.conversionStatus?.data?.hil?.length,
        }
      : null;

    const hilDziArray =
      subscription?.conversionStatus?.data?.hil?.length > 0
        ? subscription.conversionStatus.data.hil
            .filter((hilObj) => hilObj.dziUrl)
            .map((hilObj) => ({
              dziUrl: hilObj.dziUrl,
              version: hilObj.Version,
              dziUrl: hilObj.dziUrl,
              coreLength: hilObj.coreLength,
              gleason0: hilObj.benign,
              gleason3: hilObj.gleason3,
              gleason4: hilObj.gleason4,
              gleason5: hilObj.gleason5,
              gleasonScore: hilObj.gleasonScore,
              gradeGroup: hilObj.gradeGroup,
              pptTumor: hilObj.pptTumor,
              primaryPattern: hilObj.primaryPattern,
              riskCategory: hilObj.riskCategory,
              tumorLength: hilObj.tumorLength,
              key: subscription.conversionStatus.data.key,
              slideId: subscription.conversionStatus.data.slideid,
              worstPattern: hilObj.worstRemainingPattern,
              hilLength: subscription?.conversionStatus?.data?.hil?.length,
            }))
        : null;

    const allObjects = originalMask
      ? hilDziArray
        ? [originalMask, ...hilDziArray]
        : [originalMask]
      : hilDziArray
      ? hilDziArray
      : null;

    setCurrentIndexDZIMask(allObjects ? allObjects.length - 1 : -1);
    setGleasonEntries(allObjects);
  };
  // console.log("undoRedoCounter", undoRedoCounter);
  // console.log("currentIndexDZIMask", currentIndexDZIMask);

  useEffect(() => {
    if (undoRedoCounter !== currentIndexDZIMask) {
      var topImage = viewer?.world?.getItemAt(1);
      if (topImage) {
        viewer.world.removeItem(topImage);
        setLoadUI(false);
      }
      setTimeout(() => {
        setCurrentIndexDZIMask(undoRedoCounter);
        setLoadUI(true);
      }, 1000);
    }
  }, [undoRedoCounter]);
  useEffect(() => {
    if (currentIndexDZIMask >= 0) {
      setUndoRedoCounter(currentIndexDZIMask);
      setMaskAnnotationData([]);
      const currentMaskData = gleasonEntries[currentIndexDZIMask];
      if (currentMaskData) {
        setLoadUI(true);
        viewer.addTiledImage({
          tileSource: currentMaskData.dziUrl,
          x: 0,
          y: 0,
          width: 1,
          opacity: 0.5,
        });
        const gleasonDataSet = {
          coreLength: currentMaskData.coreLength,
          pattern0: currentMaskData.gleason0 || currentMaskData.pattern0,
          pattern3: currentMaskData.gleason3 || currentMaskData.pattern3,
          pattern4: currentMaskData.gleason4 || currentMaskData.pattern4,
          pattern5: currentMaskData.gleason5 || currentMaskData.pattern5,
          gleasonScore: currentMaskData.gleasonScore,
          gradeGroup: currentMaskData.gradeGroup,
          pptTumor: currentMaskData.pptTumor,
          primaryPattern: currentMaskData.primaryPattern,
          riskCategory: currentMaskData.riskCategory,
          tumorLength: currentMaskData.tumorLength,
          key: subscription.conversionStatus.data.key,
          slideId: subscription.conversionStatus.data.slideid,
          worstPattern: currentMaskData.worstRemainingPattern,
          hilLength: subscription?.conversionStatus?.data?.hil?.length,
        };
        setGleasonScoringData(gleasonDataSet);
        // console.log(gleasonDataSet);

        setTimeout(() => {
          setShowGleason(true);
        }, 2000);
      }
    }
  }, [currentIndexDZIMask, gleasonEntries]);

  useEffect(() => {
    if (!PRRHover) {
      setModelname("");
      setInfoBox(false);
    }
  }, [PRRHover]);

  useEffect(() => {
    if (navigatorCounter > 0) {
      setGleasonScoring(false);
      setPRRHover(false);
      setShowTumor(false);
      setDetectTumor(false);
      setTilActiveState(false);
      setToolSelected("");
      setModelname("");
    }
  }, [navigatorCounter]);

  const handleKI67 = () => {
    if (
      slide?.stainType === "IHC" &&
      bottomZoomValue > 39 &&
      slide?.bioMarkerType === "kI67"
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
    if (slide.stainType === "H&E" && bottomZoomValue >= 40) {
      setModelname("Morphometry");
    }
    if (slide.stainType !== "H&E") {
      setToolSelected("MorphometrySlideIssue");
    }
    if (bottomZoomValue < 40) {
      setToolSelected("ZoomError");
    }
  };

  // console.log("tilState", TilActiveState)

  useEffect(() => {
    if (slide.stainType === "H&E") {
      if (TilActiveState) {
        setModelname("TIL");
        setShowTILS(true);
      } else {
        // console.log("TILClear")
        setModelname("TILClear");
        setShowTILS(false);
        setSelectedPattern("");
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

  //#########################  HANDLE TUMOR     ################################################################

  const handleDetectTumor = () => {
    setLoadUI(false);
    localStorage.setItem("ModelName", "Detect Tumor");
    const body = {
      key: `${getFileBucketFolder(viewerIds[0].originalFileUrl)}`,
      slideId,
      type: "tumour",
    };
    onTumorAnalysis({
      variables: { body: { ...body } },
    });
  };

  useEffect(() => {
    if (detectTumor) {
      localStorage.setItem("detect_tumor", true);
      handleDetectTumor();
    } else {
      var topImage = viewer?.world?.getItemAt(1);
      if (topImage) {
        // console.log("22222");
        // console.log(topImage);
        viewer.world.removeItem(topImage);
        localStorage.removeItem("detect_tumor");
        setBinaryMask("");
        setShowTumor(false);
      }
    }
  }, [detectTumor]);

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
        onClick={() => setPRRHover(!PRRHover)}
        sx={{
          ":before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            cursor: "pointer",
            width: "100%",
            height: "100%",
            backgroundColor: PRRHover ? "rgba(157,195,226,0.4)" : "transparent",
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
              !PRRHover ? (
                <AiIcon transform="scale(1.2)" color="red" />
              ) : (
                <AiIcon transform="scale(1.2)" color="red" />
              )
            }
            _active={{
              bgColor: "transparent",
              outline: "none",
            }}
            // outline={PRRHover ? " 0.5px solid rgba(0, 21, 63, 1)" : ""}
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
        {PRRHover && (
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
                  <BiInfoCircle
                    onMouseEnter={() => {
                      setInfoBox(true);
                      setInfoItem("morphometry");
                    }}
                    onMouseLeave={() => {
                      setInfoBox(false);
                      setInfoItem("");
                    }}
                    cursor="pointer"
                    color={infoItem === "morphometry" ? "black" : "gray"}
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
                      if (TILReady) {
                        setTilActiveState(!TilActiveState);
                      } else {
                        setToolSelected("TILLoading");
                      }
                    }}
                  >
                    TILS
                  </li>
                  <BiInfoCircle
                    onMouseEnter={() => {
                      setInfoBox(true);
                      setInfoItem("tils");
                    }}
                    onMouseLeave={() => {
                      setInfoBox(false);
                      setInfoItem("");
                    }}
                    cursor="pointer"
                    color={infoItem === "tils" ? "black" : "gray"}
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
                  <BiInfoCircle
                    onMouseEnter={() => {
                      setInfoBox(true);
                      setInfoItem("ki67");
                    }}
                    onMouseLeave={() => {
                      setInfoBox(false);
                      setInfoItem("");
                    }}
                    cursor="pointer"
                    color={infoItem === "ki67" ? "black" : "gray"}
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
                    onClick={() => {
                      setDetectTumor(!detectTumor);
                      setModelType("tumuor");
                    }}
                  >
                    Detect Tumor
                  </li>
                  <BiInfoCircle
                    onMouseEnter={() => {
                      setInfoBox(true);
                      setInfoItem("detect_tumor");
                    }}
                    onMouseLeave={() => {
                      setInfoBox(false);
                      setInfoItem("");
                    }}
                    cursor="pointer"
                    color={infoItem === "detect_tumor" ? "black" : "gray"}
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
                    onClick={() => {
                      setGleasonScoring(!gleasonScoring);
                      setModelType("gleason");
                    }}
                  >
                    Gleason Scoring
                  </li>
                  <BiInfoCircle
                    onMouseEnter={() => {
                      setInfoBox(true);
                      setInfoItem("gleason_scoring");
                    }}
                    onMouseLeave={() => {
                      setInfoBox(false);
                      setInfoItem("");
                    }}
                    cursor="pointer"
                    color={infoItem === "gleason_scoring" ? "black" : "gray"}
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
                  <strong>Model info</strong>: It segments Tumor regions and
                  tumor-associated Stroma. Detection of lymphocytes within
                  tumor-associated stroma.
                </Box>
                <Box lineHeight="1.2" marginBottom="8px">
                  <strong>Model output</strong>: Tumor Area, Tumor percentage,
                  Stroma Area, Stroma percentage, bounding boxes around cells
                  (units for area: micron^2).
                </Box>
              </Box>
            ) : infoItem === "morphometry" ? (
              <Box>
                <Box lineHeight="1.2" marginBottom="8px">
                  <strong>Model info</strong>: It detects and classify cell
                  using state of the art model (best result on colon tissue).
                </Box>
                <Box lineHeight="1.2" marginBottom="8px">
                  <strong>Method input</strong>: Image(ROI).
                </Box>
                <Box lineHeight="1.2" marginBottom="8px">
                  <strong>Model output</strong>: Cell boundary, cell class
                  among(lymphocytes, eosinophils, neutrophils, plasma,
                  connective,epithelial cells).
                </Box>
              </Box>
            ) : infoItem === "ki67" ? (
              <Box>
                <Box lineHeight="1.2" marginBottom="8px">
                  <strong>Model info</strong>: It detects the positve
                  cells(appear brown) and negative cells(appear blue).
                </Box>
                <Box lineHeight="1.2" marginBottom="8px">
                  <strong>Method used</strong>: OpenCV.
                </Box>
                <Box lineHeight="1.2" marginBottom="8px">
                  <strong>Method input</strong>: Image(ROI).
                </Box>
                <Box lineHeight="1.2" marginBottom="8px">
                  <strong>Model output</strong>: Location of centers of cells,
                  proliferation score.
                </Box>
              </Box>
            ) : infoItem === "gleason_scoring" ? (
              <Box>
                <Box lineHeight="1.2" marginBottom="8px">
                  <Text>
                    <strong>Gleason Scoring Model</strong> does the tumor
                    segmentation andgives the Gleason grades and area for the
                    tumorous regions present in the slide.
                  </Text>
                </Box>
                <Box lineHeight="1.2" marginBottom="8px">
                  <strong>Model output</strong>: segmented mask representing
                  each grade
                </Box>

                <Box lineHeight="1.2" marginBottom="8px">
                  <strong>Analysis return</strong>: Gleason score, first
                  predominant and secon predominant Grade, Grade area and
                  percentage of grade 3,4,5 and benign epithelium, risk category
                </Box>
              </Box>
            ) : infoItem === "detect_tumor" ? (
              <Box>
                <Box lineHeight="1.2" marginBottom="8px">
                  <Text>
                    <strong>Tumor Detection</strong>: The main goal is to
                    segment the tumour region. This model mainly detects her2+
                    and tnbc(tripple negative) tumors
                  </Text>
                </Box>
                <Box lineHeight="1.2" marginBottom="8px">
                  <strong>Model used</strong>: SEGGPT + VAN
                </Box>
                <Box lineHeight="1.2" marginBottom="8px">
                  <strong>Model output</strong>: segmented mask of tumor
                </Box>

                <Box lineHeight="1.2" marginBottom="8px">
                  <strong>Analysis return</strong>: Tissue area,Tumor area,
                  slide area, tumor percentage .
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
