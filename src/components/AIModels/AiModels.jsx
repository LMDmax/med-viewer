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
  Environment,
  viewerId,
  bottomZoomValue,
  bottombottomZoomValue,
  setLoadUI,
  navigatorCounter,
}) => {
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { viewerWindow, isViewportAnalysing } = fabricOverlayState;
  const { viewer, fabricOverlay, slideId, originalFileUrl, tile } =
    viewerWindow[viewerId];
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const [PRRHover, setPRRHover] = useState(false);
  const [animationActive, setAnimationActive] = useState(true);
  const [TilActiveState, setTilActiveState] = useState(0);
  const [infoBox, setInfoBox] = useState(false);
  const [infoItem, setInfoItem] = useState("");
  const [showTumor, setShowTumor] = useState(false);
  const [detectTumor, setDetectTumor] = useState(false);
  const [modelType, setModelType] = useState("")
  const [showGleason, setShowGleason] = useState(false);
  const [onTumorAnalysis, { data: analysis_data, error: analysis_error }] =
    useMutation(TUMOR_ANALYSIS);
  const slideid = slide?._id;
  const { data: subscription, error: subscription_error } = useSubscription(
    TUMOR_DETECTION_SUBSCRIPTION,
    {
      variables: {
        body: {
          data: {
            slideid,
            type:modelType
          },
        },
      },
    }
  );

  // console.log("sssssub", subscription);
  // console.log("sssssubEEEEEEEE", subscription_error);

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

const handleGleasonScore = ()=>{
  const body = {
    key: `${getFileBucketFolder(viewerIds[0].originalFileUrl)}`,
    slideId: slideid,
    type:"gleason"
  };
  onTumorAnalysis({
    variables: { body: { ...body } },
  });
  localStorage.setItem("ModelName", "Gleason Scoring");
  setLoadUI(false);
}

  useEffect(() => {
    if (gleasonScoring) {
      handleGleasonScore();
    }
    else{
      var topImage = viewer?.world?.getItemAt(1);
      if (topImage) {
        viewer.world.removeItem(topImage);
    }
    setShowGleason(false);
  }
  }, [gleasonScoring]);

  useEffect(() => {
    if (showTumor || showGleason) {
      // console.log("object");
      viewer.setFilterOptions({
        filters: {
          processors: reinhardFilter,
        },
        loadMode: "async",
      });
      setLoadUI(true);
    }
      localStorage.removeItem("ModelName");
  }, [showTumor, showGleason]);

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
    if(subscription && gleasonScoring){
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
          setShowGleason(true);
        }, 2000);
      }
    }
  else {
      setShowTumor(false);
      setShowGleason(false);


    }
  }, [subscription]);

  useEffect(() => {
    if (!PRRHover) {
      setModelname("");
      setInfoBox(false);
    }
  }, [PRRHover]);

  useEffect(() => {
    if (navigatorCounter > 0) {
      setPRRHover(false);
      setShowTumor(false);
      setDetectTumor(false);
      if (TilActiveState > 0) {
        setTilActiveState(0);
      }
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



  //#########################  HANDLE TUMOR     ################################################################

  const handleDetectTumor = () => {
    setLoadUI(false);
    localStorage.setItem("ModelName", "Detect Tumor");
    const body = {
      key: `${getFileBucketFolder(viewerIds[0].originalFileUrl)}`,
      slideId: slideid,
      type:"tumour"
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
                    onClick={() => {
                      setDetectTumor(!detectTumor);
                      setModelType("tumuor")
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
                    onClick={() => {
                      setGleasonScoring(!gleasonScoring);
                      setModelType("gleason")

                    }}
                  >
                    Gleason Scoring
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