import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { Flex, Input, Text, useMediaQuery, useToast } from "@chakra-ui/react";
import { useFabricOverlayState } from "../../state/store";
import {
  getScaleFactor,
  getZoomValue,
  zoomToLevel,
} from "../../utility/utility";

const ZoomSlider = ({ viewerId , setBottomZoomValue}) => {
  const { fabricOverlayState } = useFabricOverlayState();
  const { viewerWindow } = fabricOverlayState;
  const { viewer, fabricOverlay } = viewerWindow[viewerId];
  const [zoomValue, setZoomValue] = useState(1);
  const [alphabet, setAlphabet] = useState(false);

  const inputRef = useRef(null);
  const toast = useToast();
  const handleKeyDown = (event) => {
    var regExpr = new RegExp("^[0-9.]+$");
    if (!regExpr.test(event.key)) {
      if (
        !(
          event.key === "Backspace" ||
          event.key === "Shift" ||
          event.key === "Enter" ||
          event.key === "Ctrl" ||
          event.key === "Alt" ||
          event.key === "Tab" ||
          event.key === "Esc" ||
          event.key === "CapsLock"
        )
      ) {
        toast({
          title: "Not Valid Input",
          description: "Please Provide Me A Valid Input",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        setAlphabet(true);
      }
    }
  };
  const handleZoomLevel = (e) => {
    const { value } = e.target;

    if (
      alphabet ||
      parseInt(value) > 40 ||
      value.split(".")[1]?.length >= 3 ||
      value.length >= 6 ||
      parseInt(value) < -1 ||
      value === "0" ||
      value === "-1" ||
      value === "+" ||
      value === "-" ||
      value === "_" ||
      value === "."
    ) {
      if (value === "+" || value === "-" || value === "_" || alphabet) {
        setAlphabet(false);
      } else {
        toast({
          title: "Not Valid Input",
          description: "Please provide me a valid input",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        setAlphabet(false);
      }
    } else {
      zoomToLevel({ viewer, value });
      setZoomValue(value);
    }
  };

  const handleZoomLevelBlur = () => {
    if (zoomValue) return;
    const value = getZoomValue(viewer);
    setZoomValue(value);
  };

useEffect(()=>{
  setBottomZoomValue(zoomValue);
  // console.log(zoomValue);
// localStorage.setItem("zoom",zoomValue);
},[zoomValue])

  useEffect(() => {
    if (!viewer) return;
    const adjustAnnotations = () => {
      // const value = parseInt((e.zoom * 40) / viewer.viewport.getMaxZoom(), 10);
      // const scaleFactor = value !== 0 ? value / 40 : 1 / 40;
      const scaleFactor = getScaleFactor(viewer);
      const canvas = fabricOverlay.fabricCanvas();
      const strokeWidth = 2 / scaleFactor;
      const objs = canvas.getObjects();
      objs.forEach((object) => {
        if (object && object.type !== "group") {
          // object.item(0).set("strokeWidth", strokeWidth);
          object.set("strokeWidth", strokeWidth);
        }
      });
      canvas.requestRenderAll();
    };
    const handler = (e) => {
      const value = parseInt(
        Math.ceil((e.zoom * 40) / viewer.viewport.getMaxZoom()),
        10
      );
      setZoomValue(value > 40 ? 40 : value);
      // const bounds = viewer.viewport.getBounds();
      // const { x, y, width, height } = viewer.viewport.viewportToImageRectangle(
      //   bounds.x,
      //   bounds.y,
      //   bounds.width,
      //   bounds.height
      // );
      // console.log({ x, y, width, height });
      adjustAnnotations(value);
      // const tiledImage = viewer.world.getItemAt(0);
      // const ssValue = tiledImage._scaleSpring.current.value;
      // const cValue = tiledImage.viewport._containerInnerSize.x;
      // const srcX = tiledImage.source.dimensions.x;
      // const zoom = viewer.viewport.getZoom(true);
      // const imageZoom = zoom * ((ssValue * cValue) / srcX);
      // const cPPM = imageZoom * 4000000;
      // console.log({ ssValue, cValue, srcX, zoom, imageZoom, cPPM });
    };
    viewer.addHandler("zoom", handler);
    return () => {
      viewer.removeHandler("zoom", handler);
    };
  }, [viewer]);

  return (
    <Flex>
      <Input
        ref={inputRef}
        maxLength={6}
        onKeyDown={handleKeyDown}
        value={zoomValue > 40 ? 40 : zoomValue}
        onChange={handleZoomLevel}
        onBlur={handleZoomLevelBlur}
        variant="unstyled"
        w={inputRef?.current?.value?.length > 2 ? "45px" : "25px"}
        textAlign="center"
      />
      <Text fontFamily="inter">x</Text>
    </Flex>
  );
};

export default ZoomSlider;
