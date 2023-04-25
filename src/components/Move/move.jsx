import React, { useEffect, useState } from "react";

import {
  Flex,
  IconButton,
  useMediaQuery,
  Tooltip,
  Text,
  Image,
  Box,
} from "@chakra-ui/react";

import { updateTool } from "../../state/actions/fabricOverlayActions";
import { useFabricOverlayState } from "../../state/store";
import TooltipLabel from "../AdjustmentBar/ToolTipLabel";
import TypeTools from "../AdjustmentBar/typeTools";
import CommentBox from "../Comment/Comment";
import { AnnotationIcon, AnnotationSelectedIcon } from "../Icons/CustomIcons";
import FilterAdjustments from "../ImageFilter/FilterAdjustments";
import Multiview from "../Multiview/multiview";
import Popup from "../Popup/popup";
import Rotate from "../Rotate/Rotate";
import Til from "../TIL/Til";
import Measuremnet from "../Measurement/Measuremnet";
import IconSize from "../ViewerToolbar/IconSize";
import Mode from "../Mode/Mode";
import AiModels from "../AIModels/AiModels";
import MoveTool from "../MoveTool/MoveTool";

function Move({
  userInfo,
  viewerId,
  refreshHil,
  annotations,
  enableAI,
  enableFilters,
  hitTil,
  setStromaArea,
  setLoadUI,
  setTumorArea,
  bottomZoomValue,
  setToolSelected,
  setTilScore,
  setLymphocyteCount,
  pathStroma,
  hideModification,
  setNewHilData,
  sidebar,
  navigatorCounter,
  isMultiview,
  hideStroma,
  setIsMultiview,
  setNavigatorCounter,
  hideLymphocyte,
  modelName,
  isNavigatorActive,
  setIsNavigatorActive,
  setTotalCells,
  application,
  hideTumor,
  zoomValue,
  viewerIds,
  setModelname,
  handleTILFeedBar,
  slide,
  mongoId,
  toolSelected,
  isXmlAnnotations,
}) {
  const [ifBiggerScreen] = useMediaQuery("(min-width:2000px)");
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const [typeToolsToggle, setTypeToolsToggle] = useState(false);
  const [popup, setPopup] = useState(false);
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { activeTool, viewerWindow } = fabricOverlayState;
  const { fabricOverlay } = viewerWindow[viewerId];
  const isActive = activeTool === "Move";
  const [activeAnnotations, setActiveAnnotations] = useState(false);

  

  useEffect(() => {
    if (typeToolsToggle) {
      setToolSelected("Annotation");
    } else {
      setToolSelected("");
    }
  }, [typeToolsToggle]);

  const handleClick = () => {
    // setFabricOverlayState(updateTool({ tool: "Move" }));
  };
  const handleAnnotationsClick = () => {
    if (!isActive) setFabricOverlayState(updateTool({ tool: "Move" }));
    setTypeToolsToggle((state) => !state);
  };
  const handlePopup = () => {
    setPopup(!popup);
  };
  const iconSize = IconSize();

  useEffect(() => {
    if (navigatorCounter > 0) {
      setActiveAnnotations(false);
      setTypeToolsToggle(false);
    }
  }, [navigatorCounter]);

  useEffect(() => {
    if (!fabricOverlay || !isActive) return;
    const canvas = fabricOverlay.fabricCanvas();

    canvas.defaultCursor = "default";
    canvas.hoverCursor = "move";
    canvas.selection = false;

    canvas.on("selection:created", () => {
      canvas.selection = true;
    });
    canvas.on("selection:cleared", () => {
      canvas.selection = false;
    });
  }, [isActive, fabricOverlay]);

  return (
    <Flex
      direction="row"
      justifyContent="space-evenly"
      w="40%"
      h="100%"
      // border="2px solid red"
    >
      <Flex
        alignItems="center"
        justifyContent="space-evenly"
        gap="0px"
        ml="0px"
        w="100%"
      >
        {/* <ToolbarPointerControl viewerId={viewerId} /> */}
        <MoveTool handleClick={handleClick} isActive={isActive} />
        <Rotate
          setIsNavigatorActive={setIsNavigatorActive}
          navigatorCounter={navigatorCounter}
          setToolSelected={setToolSelected}
          viewerId={viewerId}
        />
        <Multiview
          viewerId={viewerId}
          isMultiview={isMultiview}
          setToolSelected={setToolSelected}
          setIsMultiview={setIsMultiview}
          setIsNavigatorActive={setIsNavigatorActive}
          navigatorCounter={navigatorCounter}
        />
        {annotations && !isXmlAnnotations ? (
          <Box
            onClick={() => {
              handleAnnotationsClick();
              setActiveAnnotations(!activeAnnotations);
            }}
            w="70px"
            pt="8px"
            h="100%"
            style={{ position: "relative", display: "inline-block" }}
            _hover={{ bgColor: "transparent" }}
            sx={{
              ":before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                cursor: "pointer",
                width: "100%",
                height: "100%",
                backgroundColor: activeAnnotations
                  ? "rgba(157,195,226,0.4)"
                  : "transparent",
                zIndex: 1,
              },
            }}
            F
          >
            <IconButton
              width={ifScreenlessthan1536px ? "100%" : "100%"}
              height={ifScreenlessthan1536px ? "50%" : "70%"}
              // border="2px solid red"
              _hover={{ bgColor: "transparent" }}
              icon={
                <AnnotationIcon
                  transform="scale(1.2)"
                  size={iconSize}
                  color="black"
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
            <Text align="center" color="black" fontSize="10px" fontFamily="inter">Annotation</Text>
          </Box>
        ) : null}

        {/* <Measuremnet /> */}

        <CommentBox
          userInfo={userInfo}
          viewerId={viewerId}
          setToolSelected={setToolSelected}
          application={application}
          navigatorCounter={navigatorCounter}
        />

        {enableFilters ? (
          <FilterAdjustments
            setToolSelected={setToolSelected}
            viewerId={viewerId}
            toolSelected={toolSelected}
            navigatorCounter={navigatorCounter}
          />
        ) : null}

        <Til
          hideLymphocyte={hideLymphocyte}
          hideStroma={hideStroma}
          hideTumor={hideTumor}
          handleTILFeedBar={handleTILFeedBar}
          viewerIds={viewerIds}
          hideModification={hideModification}
          slide={slide}
          hitTil={hitTil}
          modelName={modelName}
          setToolSelected={setToolSelected}
          mongoId={mongoId}
          setLoadUI={setLoadUI}
          setNewHilData={setNewHilData}
          refreshHil={refreshHil}
          viewerId={viewerId}
          setStromaArea={setStromaArea}
          setTumorArea={setTumorArea}
          setTilScore={setTilScore}
          setLymphocyteCount={setLymphocyteCount}
          pathStroma={pathStroma}
        />
        <AiModels
          bottomZoomValue={bottomZoomValue}
          toolSelected={toolSelected}
          zoomValue={zoomValue}
          viewerId={viewerIds}
          setModelname={setModelname}
          navigatorCounter={navigatorCounter}
          slide={slide}
          setToolSelected={setToolSelected}
        />
        {/* <Mode /> */}
      </Flex>
      <Flex
        top={
          isNavigatorActive || isMultiview
            ? "250px"
            : Object.keys(viewerWindow).length > 1
            ? "150px"
            : "calc(1% + 100px)"
        }
        left={sidebar ? "22%" : "1%"}
        direction="column"
        pos="absolute"
        zIndex="1000"
        ml={ifBiggerScreen ? "100px" : ""}
      >
        {typeToolsToggle ? (
          <TypeTools
            application={application}
            enableAI={enableAI}
            toolSelected={toolSelected}
            setToolSelected={setToolSelected}
            userInfo={userInfo}
            viewerId={viewerId}
            setTotalCells={setTotalCells}
          />
        ) : null}
      </Flex>

      {/* Dummy component */}
      <Popup
        handlePopup={() => {
          handlePopup();
        }}
        popup={popup}
      />
    </Flex>
  );
}
export default Move;
