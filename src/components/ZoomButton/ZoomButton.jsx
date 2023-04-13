import React, { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { useFabricOverlayState } from "../../state/store";
import {
  getScaleFactor,
  getZoomValue,
  zoomToLevel,
} from "../../utility/utility";

const ZoomButton = ({ viewerId, setBottomZoomValue }) => {
  const { fabricOverlayState } = useFabricOverlayState();
  const { viewerWindow } = fabricOverlayState;
  const { viewer, fabricOverlay } = viewerWindow[viewerId];
  const [customZoom4, setCustomZoom4] = useState(false);
  const [customZoom10, setCustomZoom10] = useState(false);
  const [customZoom20, setCustomZoom20] = useState(false);
  const [customZoom40, setCustomZoom40] = useState(false);
  const [zoomButtonValue, setZoomButtonValue] = useState();
  useEffect(() => {
    // 	if (customZoom10) {
    // 		// console.log("10");
    // 		const value = 10;
    // 		zoomToLevel({ viewer, value });
    // 	} else if (customZoom4) {
    // 		const value = 4;
    // 		zoomToLevel({ viewer, value });
    // 	} else if (customZoom20) {
    // 		const value = 20;
    // 		zoomToLevel({ viewer, value });
    // 	} else if (customZoom40) {
    // 		const value = 40;
    // 		zoomToLevel({ viewer, value });
    // 	}

    // 	const value = getZoomValue(viewer);
    // 	setBottomZoomValue(value);
    if (zoomButtonValue === 4) {
      const value = 4;
      zoomToLevel({ viewer, value });
	  setZoomButtonValue("")
    }
	if (zoomButtonValue === 10) {
		const value = 10;
		zoomToLevel({ viewer, value });
		setZoomButtonValue("")
	  }
	  if (zoomButtonValue === 20) {
		const value = 20;
		zoomToLevel({ viewer, value });
		setZoomButtonValue("")
	  }
	  if (zoomButtonValue === 40) {
		const value = 40;
		zoomToLevel({ viewer, value });
		setZoomButtonValue("")
	  }
  });

  return (
    <>
      <Box w="35px" display="flex" flexDirection="column" alignItems="center">
        <Box
          w="30px"
          textAlign="center"
          pb="5px"
          // color={customZoom4 ? "#468" : ""}
          borderBottom="1px solid black"
          cursor="pointer"
          onClick={() => {
            setZoomButtonValue(4);
          }}
        >
          4X
        </Box>
        <Box
          w="30px"
          textAlign="center"
          pt="3px"
          pb="5px"
          // color={customZoom10 ? "#468" : ""}
          borderBottom="1px solid black"
          cursor="pointer"
          onClick={() => {
            setZoomButtonValue(10);
          }}
        >
          10X
        </Box>
        <Box
          w="30px"
          textAlign="center"
          pt="3px"
          pb="5px"
          // color={customZoom20 ? "#468" : ""}
          borderBottom="1px solid black"
          cursor="pointer"
          onClick={() => {
            setZoomButtonValue(20);
          }}
        >
          20X
        </Box>
        <Box
          w="30px"
          textAlign="center"
          pt="3px"
          pb="5px"
          // color={customZoom40 ? "#468" : ""}
          cursor="pointer"
          onClick={() => {
            setZoomButtonValue(40);
          }}
        >
          40x
        </Box>
      </Box>
    </>
  );
};

export default ZoomButton;
