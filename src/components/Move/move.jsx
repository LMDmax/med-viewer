import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";
import {
  Flex,
  IconButton,
  useMediaQuery,
  Tooltip,
  Text,
  Image,
  Box,
} from "@chakra-ui/react";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { MdOutlineDragIndicator } from "react-icons/md";
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
  socketIsConnected,
  lessonId,
  newSliderInputs,
  setBinaryMask,
  AdjustmentTool,
  setAdjustmentTool,
  setImageFilter,
  Environment,
  enableAI,
  setGleasonScoring,
  gleasonScoring,
  caseInfo,
  enableFilters,
  setShowRightPanel,
  hitTil,
  setStromaArea,
  setLoadUI,
  setTumorArea,
  bottomZoomValue,
  setToolSelected,
  setTilScore,
  setLymphocyteCount,
  setNewHilData,
  sidebar,
  navigatorCounter,
  isMultiview,
  setIsMultiview,
  setNavigatorCounter,
  modelName,
  isNavigatorActive,
  setIsNavigatorActive,
  setTotalCells,
  application,
  zoomValue,
  viewerIds,
  setModelname,
  handleTILFeedBar,
  slide,
  mongoId,
  toolSelected,
  isXmlAnnotations,
  setGleasonScoringData,
  selectedPattern,
  newToolSettings,
  setNewToolSettings,
  setSelectedPattern,
  SetBenignColor,
  setPattern5Color,
  setPattern4Color,
  setPattern3Color,
  pattern3Color,
  pattern4Color,
  pattern5Color,
  benignColor,
  tumorColor,
  setTumorColor,
  setStromaColor,
  stromaColor,
  setLymphocyteColor,
  lymphocyteColor,
  undoRedoCounter,
  gleasonScoringData,
  setUndoRedoCounter,
  showGleason,
  setShowGleason,
  setMaskAnnotationData,
  addLocalRegion,
  setAddLocalRegion,
  setIsLocalRegion,
  isLocalRegion,
  setLymphocyteArea,
}) {
  const [ifBiggerScreen] = useMediaQuery("(min-width:2000px)");
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const [typeToolsToggle, setTypeToolsToggle] = useState(false);
  const [popup, setPopup] = useState(false);
  const [TILReady, setTILReady] = useState(false);
  const [showTILS, setShowTILS] = useState(false);

  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { activeTool, viewerWindow } = fabricOverlayState;
  const { fabricOverlay } = viewerWindow[viewerId];
  let isActive = activeTool === "Move";
  const [activeAnnotations, setActiveAnnotations] = useState(false);

  useEffect(() => {
    if (typeToolsToggle) {
      setToolSelected("Annotation");
      setFabricOverlayState(updateTool({ tool: "Annotations" }));
    } else {
      setToolSelected("");
      setFabricOverlayState(updateTool({ tool: "Move" }));
    }
  }, [typeToolsToggle]);

  const handleClick = () => {
    // setFabricOverlayState(updateTool({ tool: "Move" }));
  };
  const handleAnnotationsClick = () => {
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
      zIndex="99"
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
            h="100%"
            // border="1px solid black"
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
              <Text
                align="center"
                color="black"
                fontSize="10px"
                fontFamily="inter"
              >
                Annotation
              </Text>
            </Flex>
          </Box>
        ) : null}

        {/* <Measuremnet /> */}
        <Mode
          setImageFilter={setImageFilter}
          viewerId={viewerId}
          setShowRightPanel={setShowRightPanel}
          socketIsConnected={socketIsConnected}
          AdjustmentTool={AdjustmentTool}
          setAdjustmentTool={setAdjustmentTool}
        />

        <CommentBox
          userInfo={userInfo}
          viewerId={viewerId}
          setToolSelected={setToolSelected}
          application={application}
          caseInfo={caseInfo}
          navigatorCounter={navigatorCounter}
        />

        {enableFilters ? (
          <FilterAdjustments
            setToolSelected={setToolSelected}
            viewerId={viewerId}
            AdjustmentTool={AdjustmentTool}
            newSliderInputs={newSliderInputs}
            toolSelected={toolSelected}
            navigatorCounter={navigatorCounter}
          />
        ) : null}

        <Til
          handleTILFeedBar={handleTILFeedBar}
          viewerIds={viewerIds}
          slide={slide}
          hitTil={hitTil}
          modelName={modelName}
          setToolSelected={setToolSelected}
          mongoId={mongoId}
          setTILReady={setTILReady}
          setLoadUI={setLoadUI}
          setNewHilData={setNewHilData}
          refreshHil={refreshHil}
          viewerId={viewerId}
          setStromaArea={setStromaArea}
          setTumorArea={setTumorArea}
          setTilScore={setTilScore}
          setLymphocyteCount={setLymphocyteCount}
          navigatorCounter={navigatorCounter}
          setIsLocalRegion={setIsLocalRegion}
          isLocalRegion={isLocalRegion}
          showTILS={showTILS}
          addLocalRegion={addLocalRegion}
          setAddLocalRegion={setAddLocalRegion}
          setLymphocyteArea={setLymphocyteArea}
        />
        {!isXmlAnnotations && application !== "education" ? (
          <AiModels
            bottomZoomValue={bottomZoomValue}
            toolSelected={toolSelected}
            zoomValue={zoomValue}
            viewerId={viewerId}
            setLoadUI={setLoadUI}
            Environment={Environment}
            viewerIds={viewerIds}
            TILReady={TILReady}
            gleasonScoring={gleasonScoring}
            setGleasonScoring={setGleasonScoring}
            setModelname={setModelname}
            setBinaryMask={setBinaryMask}
            navigatorCounter={navigatorCounter}
            slide={slide}
            setGleasonScoringData={setGleasonScoringData}
            setToolSelected={setToolSelected}
            newToolSettings={newToolSettings}
            selectedPattern={selectedPattern}
            setSelectedPattern={setSelectedPattern}
            setNewToolSettings={setNewToolSettings}
            pattern3Color={pattern3Color}
            pattern4Color={pattern4Color}
            pattern5Color={pattern5Color}
            benignColor={benignColor}
            SetBenignColor={SetBenignColor}
            setPattern5Color={setPattern5Color}
            setPattern4Color={setPattern4Color}
            setPattern3Color={setPattern3Color}
            tumorColor={tumorColor}
            stromaColor={stromaColor}
            undoRedoCounter={undoRedoCounter}
            gleasonScoringData={gleasonScoringData}
            setUndoRedoCounter={setUndoRedoCounter}
            setShowGleason={setShowGleason}
            showGleason={showGleason}
            setMaskAnnotationData={setMaskAnnotationData}
            lymphocyteColor={lymphocyteColor}
            setShowTILS={setShowTILS}
            showTILS={showTILS}
            setAddLocalRegion={setAddLocalRegion}
          />
        ) : null}
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
        {typeToolsToggle || selectedPattern || addLocalRegion ? (
          <TypeTools
            application={application}
            enableAI={enableAI}
            toolSelected={toolSelected}
            viewerIds={viewerIds}
            setToolSelected={setToolSelected}
            userInfo={userInfo}
            viewerId={viewerId}
            caseInfo={caseInfo}
            lessonId={lessonId}
            setTotalCells={setTotalCells}
            selectedPattern={selectedPattern}
            setNewToolSettings={setNewToolSettings}
            newToolSettings={newToolSettings}
            setPattern3Color={setPattern3Color}
            setPattern5Color={setPattern5Color}
            setPattern4Color={setPattern4Color}
            SetBenignColor={SetBenignColor}
            setTumorColor={setTumorColor}
            setStromaColor={setStromaColor}
            setLymphocyteColor={setLymphocyteColor}
            lymphocyteColor={lymphocyteColor}
            showGleason={showGleason}
            setMaskAnnotationData={setMaskAnnotationData}
            addLocalRegion={addLocalRegion}
            showTILS={showTILS}
            setIsLocalRegion={setIsLocalRegion}
            setAddLocalRegion={setAddLocalRegion}
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
