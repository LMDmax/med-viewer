import React, { useRef, useEffect, useState } from "react";
// import PropTypes from 'prop-types';
import { FiType } from "react-icons/fi";
import { fabric } from "openseadragon-fabricjs-overlay";
import FontFaceObserver from "fontfaceobserver";
import { fonts } from "./fontPicker";
import useCanvasHelpers from "../../hooks/use-fabric-helpers";
import TypeButton from "../typeButton";
import { useFabricOverlayState } from "../../state/store";
import { updateTool } from "../../state/actions/fabricOverlayActions";

const TypeText = ({ viewerId }) => {
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { color, viewerWindow, activeTool } = fabricOverlayState;
  const { fabricOverlay, viewer, activityFeed } = viewerWindow[viewerId];

  const { deselectAll } = useCanvasHelpers(viewerId);
  const isActive = activeTool === "TYPE";

  const [myState, setState] = useState({
    activeFont: fonts[0],
    color: null,
    isActive: false,
    isEditing: false,
    selectedCoords: { top: 0, left: 0 },
  });
  const myStateRef = useRef(myState);
  const setMyState = (data) => {
    myStateRef.current = { ...myState, ...data };
    setState((state) => ({ ...state, ...data }));
  };
  /**
   * Handle main tool change
   */
  useEffect(() => {
    setMyState({ color, isActive });

    if (!fabricOverlay) return;
    fabricOverlay.fabricCanvas().defaultCursor = isActive ? "text" : "auto";
  }, [color, isActive]);

  useEffect(() => {
    if (!isActive) return;
    if (myState.isEditing) {
      fabricOverlay.fabricCanvas().defaultCursor = "auto";
      fabricOverlay.fabricCanvas().hoverCursor = "text";
    } else {
      fabricOverlay.fabricCanvas().defaultCursor = "text";
      fabricOverlay.fabricCanvas().hoverCursor = "move";
    }
  }, [myState.isEditing]);

  /**
   * Handle an individual font being selected
   */
  useEffect(() => {
    if (!fabricOverlay) return;
    const canvas = fabricOverlay.fabricCanvas();

    if (myState.activeFont) {
      // Disable OSD mouseclicks
      viewer.setMouseNavEnabled(false);
      viewer.outerTracker.setTracking(false);

      // Deselect all Fabric Canvas objects
      deselectAll();
    } else {
      // Enable OSD mouseclicks
      viewer.setMouseNavEnabled(true);
      viewer.outerTracker.setTracking(true);
    }
  }, [myState.activeFont]);

  /**
   * Set up event handlers when Fabric is ready
   */
  useEffect(() => {
    if (!fabricOverlay) return;
    const canvas = fabricOverlay.fabricCanvas();

    function handleMouseDown(options) {
      // Selected an existing object OR not in Type Tool mode
      if (options.target || !myStateRef.current.isActive) {
        return;
      }

      // Was user previously editing text?
      if (myStateRef.current.isEditing) {
        deselectAll();
        setMyState({ ...myStateRef.current, isEditing: false });
        return;
      }

      // Create new Textbox instance and add it to canvas
      const textbox = new fabric.IText("", {
        left: options.absolutePointer.x,
        top: options.absolutePointer.y,
        fontFamily: myStateRef.current.activeFont.fontFamily,
        fontSize: 15,
        selectionBackgroundColor: "rgba(255, 255, 255, 0.5)",
      });
      fabricOverlay.fabricCanvas().add(textbox);
      textbox.set({ fill: myStateRef.current.color.hex });
      canvas.setActiveObject(textbox);
      textbox.enterEditing();

      setMyState({
        ...myStateRef.current,
        isEditing: true,
      });
    }

    function handleSelectionCleared(options) {
      if (!myStateRef.current.isSelectedOnCanvas) return;

      setMyState({
        ...myStateRef.current,
        selectedCoords: { top: 0, left: 0 },
      });
    }

    function handleSelected(options) {
      if (options.target.get("type") !== "textbox") return;

      setMyState({
        ...myStateRef.current,
      });
    }

    // Add click handlers
    canvas.on("mouse:down", handleMouseDown);
    canvas.on("selection:created", handleSelected);
    canvas.on("selection:updated", handleSelected);
    canvas.on("selection:cleared", handleSelectionCleared);

    // Remove handler
    return function clearFabricEventHandlers() {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("selection:created", handleSelected);
      canvas.off("selection:updated", handleSelected);
      canvas.off("selection:cleared", handleSelectionCleared);
    };
  }, [fabricOverlay]);

  const handleFontChange = (font) => {
    setMyState({ activeFont: font });
    // loadAndUse(font.fontFamily);
  };

  const handleToolbarButtonClick = (e) => {
    setFabricOverlayState(updateTool({ tool: "TYPE" }));
  };

  const loadAndUse = (font) => {
    const canvas = fabricOverlay.fabricCanvas();
    const activeObject = canvas.getActiveObject();

    if (!activeObject) {
      return;
    }

    const myfont = new FontFaceObserver(font);
    myfont
      .load()
      .then(function () {
        // when font is loaded, use it.
        canvas.getActiveObject().set("fontFamily", font);
        canvas.requestRenderAll();
      })
      .catch(function (e) {
        console.error(e);
      });
  };

  return (
    <TypeButton
      onClick={handleToolbarButtonClick}
      icon={<FiType />}
      backgroundColor={isActive ? "#E4E5E8" : ""}
      // color={isActive ? "black" : "#3963c3"}
      borderRadius="0px"
      label="Type Text"
    />
    // {isActive && (
    //   <ToolbarOptionsPanel>
    //     <TypeTextFontPicker handleFontChange={handleFontChange} />
    //   </ToolbarOptionsPanel>
    // )}
  );
};

export default TypeText;
