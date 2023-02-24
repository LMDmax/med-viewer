import { Flex, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useFabricOverlayState } from "../../state/store";
import { getAnnotationJSON, getAnnotationMetric } from "../../utility";

const ShowMetric = ({ viewerId, slide }) => {
  const { fabricOverlayState } = useFabricOverlayState();
  const { viewerWindow } = fabricOverlayState;
  const { viewer, fabricOverlay } = viewerWindow[viewerId];

  const [metric, setMetric] = useState({
    type: "",
    value: 0,
    unit: "",
  });
  const [position, setPosition] = useState({
    left: "",
    top: "",
  });

  console.log(metric);

  useEffect(() => {
    if (!viewer || !fabricOverlay) return;

    const canvas = fabricOverlay.fabricCanvas();

    const handleMouseOver = (event) => {
      if (!event.target) {
        return;
      }

      const { offsetX: x, offsetY: y } = event.e;
      const annotation = getAnnotationJSON(event.target);
      const mpp = slide?.metadata?.mpp || 0.25;
      setMetric(getAnnotationMetric(annotation, mpp));
      setPosition({ left: x, top: y });
    };

    const handleMouseOut = () => {
      setMetric({ type: "", value: 0 });
    };

    canvas.on("mouse:over", handleMouseOver);
    canvas.on("mouse:out", handleMouseOut);

    return () => {
      canvas.off("mouse:over", handleMouseOver);
      canvas.off("mouse:out", handleMouseOut);
    };
  }, [viewer, fabricOverlay]);

  return metric?.value ? (
    <Flex
      pos="absolute"
      top={position.top}
      left={position.left}
      bg="white"
      p={1}
      zIndex="25"
    >
      <Text fontSize="14px">
        {metric.value} {metric.unit}
        {metric.type === "area" ? <sup>2</sup> : ""}
      </Text>
    </Flex>
  ) : null;
};

export default ShowMetric;
