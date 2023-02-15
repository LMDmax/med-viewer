import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { Flex, Input, Text, useMediaQuery,useToast } from "@chakra-ui/react";
import { useFabricOverlayState } from "../../state/store";
import {
  getScaleFactor,
  getZoomValue,
  zoomToLevel,
} from "../../utility/utility";

const ZoomSlider = ({ viewerId }) => {
  const { fabricOverlayState } = useFabricOverlayState();
  const { viewerWindow } = fabricOverlayState;
  const { viewer, fabricOverlay  } = viewerWindow[viewerId];
  const [zoomValue, setZoomValue] = useState(1);
  const inputRef = useRef(null);
  const toast = useToast();
  const [validationError, setValidationError] = useState(false);
  const handleZoomLevel = (e) => {
    const { value } = e.target;
    // zoomToLevel({ viewer, value });
    // setZoomValue(value);
    if (value.toString().split(".")[1]?.length >= 2) {
      setValidationError(true);
    }
    if (value > 40 || validationError) {
      toast({
        title: "Not Valid Input",
        description: "Please Provide Me A Valid Input",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      setValidationError(false);
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
        type="number"
        value={zoomValue}
        onChange={handleZoomLevel}
        onBlur={handleZoomLevelBlur}
        variant="unstyled"
        w={inputRef?.current?.value?.length > 2 ? "45px" : "25px"}
        textAlign="center"
      />
      <Text>x</Text>
    </Flex>
  );
};

export default ZoomSlider;
