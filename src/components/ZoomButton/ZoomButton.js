import React, { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { useFabricOverlayState } from "../../state/store";
import {
  getScaleFactor,
  getZoomValue,
  zoomToLevel,
} from "../../utility/utility";

const ZoomButton = ({ viewerId }) => {
  const { fabricOverlayState } = useFabricOverlayState();
  const { viewerWindow } = fabricOverlayState;
  const { viewer, fabricOverlay } = viewerWindow[viewerId];
  const [customZoom4, setCustomZoom4] = useState(false);
  const [customZoom10, setCustomZoom10] = useState(false);
  const [customZoom20, setCustomZoom20] = useState(false);
  const [customZoom40, setCustomZoom40] = useState(false);
  useEffect(() => {
    if (customZoom10) {
      console.log("10");
      const value = 10;
      zoomToLevel({ viewer, value });
    } else if (customZoom4) {
      console.log("4");
      const value = 4;
      zoomToLevel({ viewer, value });
    } else if (customZoom20) {
      console.log("20");
      const value = 20;
      zoomToLevel({ viewer, value });
    } else if (customZoom40) {
      console.log("40");
      const value = 40;
      zoomToLevel({ viewer, value });
    } else {
      const value = 1;
      zoomToLevel({ viewer, value });
    }
  });
  console.log(customZoom10,'10');
  console.log(customZoom4,'4');
  console.log(customZoom20,'20');
  console.log(customZoom40,'40');
  return (
    <>
      <Box
        w="30px"
        textAlign="center"
        pb="5px"
        color={customZoom4 ? "#468" : ""}
        borderBottom="1px solid black"
        cursor="pointer"
        onClick={() =>{ 
          setCustomZoom10(false);
          setCustomZoom20(false);
          setCustomZoom40(false);
          setCustomZoom4(!customZoom4)}}
      >
        4X
      </Box>
      <Box
        w="30px"
        textAlign="center"
        pb="5px"
        color={customZoom10 ? "#468" : ""}
        borderBottom="1px solid black"
        cursor="pointer"
        onClick={() =>{
          setCustomZoom10(false);
          setCustomZoom4(false);
          setCustomZoom20(false);
          setCustomZoom10(!customZoom10)} }
      >
        10X
      </Box>
      <Box
        w="30px"
        textAlign="center"
        pb="5px"
        color={customZoom20 ? "#468" : ""}
        borderBottom="1px solid black"
        cursor="pointer"
        onClick={() =>{
          setCustomZoom10(false);
          setCustomZoom4(false);
          setCustomZoom40(false);
         setCustomZoom20(!customZoom20)}
        }
      >
        20X
      </Box>
      <Box
        w="30px"
        textAlign="center"
        pb="5px"
        color={customZoom40 ? "#468" : ""}
        borderBottom="1px solid black"
        cursor="pointer"
        onClick={() => {
          setCustomZoom10(false);
          setCustomZoom4(false);
          setCustomZoom20(false);
          setCustomZoom40(!customZoom40)}
        }
      >
        40x
      </Box>
    </>
  );
};

export default ZoomButton;
