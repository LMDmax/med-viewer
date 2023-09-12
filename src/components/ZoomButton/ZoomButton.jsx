import React, { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { useFabricOverlayState } from "../../state/store";
import {
  getScaleFactor,
  getZoomValue,
  zoomToLevel,
} from "../../utility/utility";

const ZoomButton = ({ viewerId, setBottomZoomValue, navigatorCounter }) => {
  const { fabricOverlayState } = useFabricOverlayState();
  const { viewerWindow } = fabricOverlayState;
  const { viewer, fabricOverlay } = viewerWindow[viewerId];
  const [zoomButtonValue, setZoomButtonValue] = useState();
  
  useEffect(() => {
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


  useEffect(()=>{
    if(navigatorCounter > 0){
    setZoomButtonValue("")  
    }
  },[navigatorCounter])

  return (
    <>
      <Box w="35px" display="flex" flexDirection="column" alignItems="center">
        <Box
          w="30px"
          h="30px"
          textAlign="center"
          pb="  8px"
          // color={customZoom4 ? "#468" : ""}
          // borderBottom="1px solid black"
          backgroundColor="#F6F6F6"
          mb="4px"
          cursor="pointer"
          onClick={() => {
            setZoomButtonValue(4);
          }}
        >
          4x
        </Box>
        <Box
          w="30px"
          h="30px"
          mb="4px"
          textAlign="center"
          pt="3px"
          pb="  8px"
          // color={customZoom10 ? "#468" : ""}
          // borderBottom="1px solid black"
          backgroundColor="#F6F6F6"
          cursor="pointer"
          onClick={() => {
            setZoomButtonValue(10);
          }}
        >
          10x
        </Box>
        <Box
          w="30px"
          h="30px"
          mb="4px"
          textAlign="center"
          pt="3px"
          pb="  8px"
          backgroundColor="#F6F6F6"
          // color={customZoom20 ? "#468" : ""}
          // borderBottom="1px solid black"
          cursor="pointer"
          onClick={() => {
            setZoomButtonValue(20);
          }}
        >
          20x
        </Box>
        <Box
          w="30px"
          h="30px"
          mb="4px"
          textAlign="center"
          pt="3px"
          backgroundColor="#F6F6F6"
          pb="  8px"
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
