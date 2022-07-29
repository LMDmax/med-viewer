import React, { useEffect, useState } from "react";
import { BsCursorFill, BsCursor } from "react-icons/bs";
import { RiNavigationFill, RiPencilRulerLine } from "react-icons/ri";
import { AiOutlineSliders } from "react-icons/ai";
import { Flex, IconButton, useMediaQuery, Tooltip } from "@chakra-ui/react";
import { HiOutlinePencilAlt } from "react-icons/hi";
import md5 from "md5";
import ToolbarButton from "../ViewerToolbar/button";
import Rotate from "../Rotate/Rotate";
import TypeTools from "../AdjustmentBar/typeTools";
import ColorOptionsPanel from "../Color/optionsPanel";
import ToolbarPointerControl from "../ViewerToolbar/pointerControl";
import Popup from "../Popup/popup";
import IconSize from "../ViewerToolbar/IconSize";
import { useFabricOverlayState } from "../../state/store";
import { updateTool } from "../../state/actions/fabricOverlayActions";
import Multiview from "../Multiview/multiview";
import { AnnotationIcon, AnnotationSelectedIcon } from "../Icons/CustomIcons";
import Tags from "../AnnotationTags/Tags";

const Move = ({
  viewerId,
  annotations,
  sidebar,
  isMultiview,
  setIsMultiview,
  isNavigatorActive,
  setIsNavigatorActive,
  setTotalCells,
  saveAnnotationsHandler,
}) => {
  const [ifBiggerScreen] = useMediaQuery("(min-width:2000px)");
  const [ifMiddleScreen] = useMediaQuery("(min-width:1560px)");
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const [typeToolsToggle, setTypeToolsToggle] = useState(false);
  const [colorBar, setColorBar] = useState(false);
  const [popup, setPopup] = useState(false);
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { activeTool, viewerWindow } = fabricOverlayState;
  const { fabricOverlay, viewer } = viewerWindow[viewerId];
  const isActive = activeTool === "Move";
  const [activeAnnotations, setActiveAnnotations] = useState(false);

  const handleClick = () => {
    setFabricOverlayState(updateTool({ tool: "Move" }));
  };
  const handleAnnotationsClick = () => {
    if (!isActive) setFabricOverlayState(updateTool({ tool: "Move" }));
    setTypeToolsToggle((state) => !state);
  };
  const handleColorClick = () => {
    setColorBar((state) => !state);
  };
  const handlePopup = () => {
    setPopup(!popup);
  };
  const iconSize = IconSize();

  const groupAnnotations = () => {
    const canvas = fabricOverlay.fabricCanvas();
    if (!canvas.getActiveObject()) {
      return;
    }
    if (canvas.getActiveObject().type !== "activeSelection") {
      return;
    }
    const annoGroup = canvas.getActiveObject().toGroup();
    annoGroup.hash = md5(annoGroup);
    canvas.requestRenderAll();
    // const annotations = canvas.getObjects();

    // if (annotations.length > 1) {
    //   const annoGroup = new fabric.Group(annotations);
    //   const hash = md5(annoGroup);
    //   annoGroup.set({ hash });
    //   annotations.forEach((obj) => canvas.remove(obj));
    //   canvas.add(annoGroup);
    //   canvas.renderAll();
    // }
  };

  const ungroupAnnotations = () => {
    const canvas = fabricOverlay.fabricCanvas();
    if (!canvas.getActiveObject()) {
      return;
    }
    if (canvas.getActiveObject().type !== "group") {
      return;
    }
    canvas.getActiveObject().toActiveSelection();
    canvas.requestRenderAll();
  };

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
          label="Move"
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
            label="Annotations"
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
        {/* <ToolbarButton
          icon={<BsCircleHalf size={iconSize} color="#151C25" />}
          label="Colors"
          backgroundColor={colorBar ? "#E4E5E8" : ""}
          outline={colorBar ? " 0.5px solid rgba(0, 21, 63, 1)" : ""}
          onClick={handleColorClick}
        /> */}
        {/* <ToolbarButton
          icon={<RiPencilRulerLine size={iconSize} color="#151C25" />}
          onClick={handlePopup}
          label="Measurement"
        /> */}
        {/* {annotations ? (
          <>
            <ToolbarButton
              icon={<ImMakeGroup size={iconSize} color="#151C25" />}
              label="Group"
              onClick={groupAnnotations}
            />
            <ToolbarButton
              icon={<ImUngroup size={iconSize} color="#151C25" />}
              label="Ungroup"
              onClick={ungroupAnnotations}
            />
          </>
        ) : null} */}
        <Tags />
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
            viewerId={viewerId}
            setTotalCells={setTotalCells}
            saveAnnotationsHandler={saveAnnotationsHandler}
          />
        ) : null}
        {colorBar ? <ColorOptionsPanel /> : null}
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
