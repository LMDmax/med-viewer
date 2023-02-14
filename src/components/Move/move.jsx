import React, { useEffect, useState } from "react";
import { BsCursorFill, BsCursor } from "react-icons/bs";
import { Flex, IconButton, useMediaQuery, Tooltip } from "@chakra-ui/react";
import ToolbarButton from "../ViewerToolbar/button";
import Rotate from "../Rotate/Rotate";
import TypeTools from "../AdjustmentBar/typeTools";
import Popup from "../Popup/popup";
import IconSize from "../ViewerToolbar/IconSize";
import { useFabricOverlayState } from "../../state/store";
import { updateTool } from "../../state/actions/fabricOverlayActions";
import Multiview from "../Multiview/multiview";
import { AnnotationIcon, AnnotationSelectedIcon } from "../Icons/CustomIcons";
import TooltipLabel from "../AdjustmentBar/ToolTipLabel";
import FilterAdjustments from "../ImageFilter/FilterAdjustments";
import Til from "../TIL/Til";
import CommentBox from "../Comment/Comment";
const Move = ({
  userInfo,
  viewerId,
  annotations,
  enableAI,
  enableFilters,
  sidebar,
  isMultiview,
  hideStroma,
  setIsMultiview,
  hideLymphocyte,
  isNavigatorActive,
  setIsNavigatorActive,
  setTotalCells,
  application,
  hideTumor,
  viewerIds,
  handleTILFeedBar,
  slide,
  mongoId,
}) => {
  const [ifBiggerScreen] = useMediaQuery("(min-width:2000px)");
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const [typeToolsToggle, setTypeToolsToggle] = useState(false);
  const [popup, setPopup] = useState(false);
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { activeTool, viewerWindow } = fabricOverlayState;
  const { fabricOverlay } = viewerWindow[viewerId];
  const isActive = activeTool === "Move";
  const [activeAnnotations, setActiveAnnotations] = useState(false);

  const handleClick = () => {
    setFabricOverlayState(updateTool({ tool: "Move" }));
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
    <Flex direction="column">
      <Flex alignItems="center" ml="16px" mr="7px">
        {/* <ToolbarPointerControl viewerId={viewerId} /> */}
        <ToolbarButton
          icon={
            isActive ? (
              <BsCursorFill
                size={iconSize}
                color="#3B5D7C"
                style={{ transform: "rotate(-90deg)" }}
              />
            ) : (
              <BsCursor
                size={iconSize}
                color="#151C25"
                style={{ transform: "rotate(-90deg)" }}
              />
            )
          }
          label={<TooltipLabel heading="Move" />}
          backgroundColor={!isActive ? "" : "#E4E5E8"}
          outline={isActive ? " 0.5px solid rgba(0, 21, 63, 1)" : ""}
          boxShadow={
            isActive
              ? "inset -2px -2px 2px rgba(0, 0, 0, 0.1), inset 2px 2px 2px rgba(0, 0, 0, 0.1)"
              : null
          }
          onClick={handleClick}
          _hover={{ bgColor: "rgba(228, 229, 232, 1)" }}
        />
        <Rotate viewerId={viewerId} />
        <Multiview
          viewerId={viewerId}
          isMultiview={isMultiview}
          setIsMultiview={setIsMultiview}
          setIsNavigatorActive={setIsNavigatorActive}
        />
        {annotations ? (
          <Tooltip
            label={
              <TooltipLabel
                heading="Annotation"
                paragraph="Open/Close more annotation tools"
              />
            }
            aria-label="Annotations"
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
                activeAnnotations ? (
                  <AnnotationSelectedIcon />
                ) : (
                  <AnnotationIcon />
                )
              }
              _active={{
                bgColor: "rgba(228, 229, 232, 1)",
                outline: "0.5px solid rgba(0, 21, 63, 1)",
              }}
              _focus={{
                border: "none",
              }}
              mr="7px"
              borderRadius={0}
              backgroundColor={typeToolsToggle ? "#E4E5E8" : "#F8F8F5"}
              outline={typeToolsToggle ? " 0.5px solid rgba(0, 21, 63, 1)" : ""}
              label="Annotations"
              onClick={() => {
                handleAnnotationsClick();
                setActiveAnnotations(!activeAnnotations);
              }}
              boxShadow={
                activeAnnotations
                  ? "inset -2px -2px 2px rgba(0, 0, 0, 0.1), inset 2px 2px 2px rgba(0, 0, 0, 0.1)"
                  : null
              }
              _hover={{ bgColor: "rgba(228, 229, 232, 1)" }}
            />
          </Tooltip>
        ) : null}

        {enableFilters ? <FilterAdjustments viewerId={viewerId} /> : null}
        <Til
          hideLymphocyte={hideLymphocyte}
          hideStroma={hideStroma}
          hideTumor={hideTumor}
          handleTILFeedBar={handleTILFeedBar}
          viewerIds={viewerIds}
          slide={slide}
          mongoId={mongoId}
          viewerId={viewerId}
        />
        <CommentBox
          userInfo={userInfo}
          viewerId={viewerId}
          application={application}
        />
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
};
export default Move;
