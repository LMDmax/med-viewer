import React, { useState, useEffect } from "react";
import { FiRotateCw } from "react-icons/fi";
import ToolbarButton from "../ViewerToolbar/button";
import IconSize from "../ViewerToolbar/IconSize";
import { useFabricOverlayState } from "../../state/store";
import TooltipLabel from "../AdjustmentBar/ToolTipLabel";
import {
  Box,
  Tooltip,
  IconButton,
  useMediaQuery,
  Slider,
  SliderTrack,
  SliderThumb,
  SliderFilledTrack,
  Flex,
  Text,
  Input,
  HStack,
  CloseButton,
  Divider,
  Button,
} from "@chakra-ui/react";
import { BiRotateLeft, BiRotateRight } from "react-icons/bi";
import { updateTool } from "../../state/actions/fabricOverlayActions";

const Rotate = ({ viewerId, setToolSelected, navigatorCounter }) => {
  const { fabricOverlayState,setFabricOverlayState } = useFabricOverlayState();
  const { activeTool, } = fabricOverlayState;
  const { viewer, fabricOverlay } = fabricOverlayState?.viewerWindow[viewerId];
  const [sliderToggle, setSliderToggle] = useState(false);
  const [rotationValue, setRotationValue] = useState(0);
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const isActive = activeTool === "Rotate";


  // useEffect(() => {
  //   try {
  //     if (viewer.viewport) {
  //       const canvas = fabricOverlay.fabricCanvas();
  
  //       // Set the rotation of the viewer
  //       viewer.viewport.setRotation(rotationValue);
  
  //       // Get all the objects in the canvas
  //       const objects = canvas.getObjects();
  
  //       // Iterate over all the objects and set their angle property
  //       objects.forEach((object) => {
  //         // Check if the object is a Rect, Ellipse, Triangle, Polygon, or Group
  //         if (
  //           object instanceof fabric.Rect ||
  //           object instanceof fabric.Ellipse ||
  //           object instanceof fabric.Triangle ||
  //           object instanceof fabric.Polygon ||
  //           object instanceof fabric.Group
  //         ) {
  //           // Set the object's angle property to the rotation value
  //           object.set('angle', rotationValue);
  //         }
  //       });
  
  //       // Render the canvas after updating the annotations
  //       canvas.renderAll();
  //     }
  //   } catch (e) {
  //     console.error("Error handling rotate button click", e);
  //   }
  // }, [rotationValue]);


  useEffect(() => {
    try {
      if (viewer.viewport) {
        const canvas = fabricOverlay.fabricCanvas();
    
        // Set the rotation of the viewport
        viewer.viewport.setRotation(rotationValue);
    
        // Get the current zoom level and viewport rectangle
        const zoom = viewer.viewport.getZoom();
        const viewportRect = viewer.viewport.getBounds();
    
        // Iterate over all the objects in the canvas and rotate them
        canvas.getObjects().forEach((object) => {
          // Transform the annotation coordinates to image coordinates
          const { x, y } = viewer.viewport.viewportToImageCoordinates(object.left, object.top);
    
          // Calculate the rotation angle in radians
          const angle = (rotationValue * Math.PI) / 180;
    
          // Rotate the annotation object
          object.set({
            angle: rotationValue,
          });
    
          // Transform the image coordinates back to viewport coordinates
          const { x: newX, y: newY } = viewer.viewport.imageToViewportCoordinates(x, y);
    
          // Set the left and top properties of the annotation object
          object.set({
            left: newX,
            top: newY,
          });
        });
    
        // Render the annotations
        canvas.renderAll();
      }
    } catch (e) {
      console.error("Error handling rotate button click", e);
    }
  }, [rotationValue]);
  


  useEffect(() => {
    if (sliderToggle) {
      setToolSelected("Rotate");
    setFabricOverlayState(updateTool({ tool: "Rotate" }));

    } else {
      setToolSelected("");
    setFabricOverlayState(updateTool({ tool: "Move" }));

    }
  }, [sliderToggle]);

  useEffect(() => {
    if (navigatorCounter > 0) {
      setSliderToggle(false);
    }
  }, [navigatorCounter]);

  return (
    <>
      {/* <ToolbarButton
        icon={<FiRotateCw size={IconSize()} color="#151C25" />}
        label={<TooltipLabel heading="Rotate" paragraph="Rotate WSI Image" />}
        onClick={setSliderToggle(true)}
      /> */}
      <Box
      backgroundColor= {sliderToggle ? "rgba(157,195,226,0.4)" : "transparent"}
       w="60px"
      //  border="2px solid black"
       h="100%"
       cursor="pointer"
        onClick={() => setSliderToggle(!sliderToggle)}
      >
      <Flex direction="column" mt={ifScreenlessthan1536px? "1px" : "-2px"} justifyContent="center" alignItems="center" h="100%">
      <IconButton
          height={ifScreenlessthan1536px ? "50%" : "50%"}
          width={ifScreenlessthan1536px ? "100%" : "100%"}
          // border="2px solid red"
          _hover={{ bgColor: "transparent" }}
          icon={<FiRotateCw transform="scale(1.2)" color="black" />}
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
          // mb="3px"
        />
        {/* rgba(0, 21, 63, 1) */}

        {/* <Text color="white" align="center" fontSize="0.6rem">
        {label}
      </Text> */}
        <Text align="center" fontFamily="inter" fontSize="10px">Rotate</Text>
      </Flex>
      </Box>
      {sliderToggle ? (
        <Flex
          pos="absolute"
          w="70vw"
          left="15vw"
          bottom="10vh"
          direction="column"
          fontFamily="inter"
          alignItems="flex-end"
        >
          <Flex
            w="250px"
            h="100%"
            direction="column"
            bgColor="#f5f7fa"
            paddingBottom="0.4vh"
          >
            <HStack justifyContent="space-between" paddingStart="0.4vw">
              <Text fontSize={14} fontWeight="600">
                Rotation
              </Text>
              <CloseButton onClick={() => setSliderToggle(!sliderToggle)} />
            </HStack>
            <Divider mb="1vh" />
            <Flex paddingStart="0.4vw" paddingEnd="0.6vw" mb="1vh">
              <HStack spacing="0.7vw">
                <IconButton
                  aria-label="Rotate left"
                  icon={<BiRotateLeft />}
                  onClick={() => setRotationValue(rotationValue - 90)}
                  borderRadius={0}
                  bgColor="#f5f7fa"
                  disabled={rotationValue <= -180}
                />
                <IconButton
                  aria-label="Rotate right"
                  icon={<BiRotateRight />}
                  onClick={() => setRotationValue(rotationValue + 90)}
                  borderRadius={0}
                  bgColor="#f5f7fa"
                  disabled={rotationValue >= 180}
                />
              </HStack>
              <HStack ml="1vw" spacing="15px">
                <Text>Angle:</Text>
                <Text>{rotationValue}</Text>
              </HStack>
            </Flex>
            <HStack
              fontSize={10}
              w="100%"
              justifyContent="flex-end"
              paddingEnd="0.6vw"
            >
              <Button
                bgColor="#f5f7fa"
                borderRadius={0}
                onClick={() => setRotationValue(0)}
                color="#3B5D7C"
                fontWeight={500}
                fontSize={12}
              >
                Reset
              </Button>
              {/* <Button
                borderRadius={0}
                onClick={() => setSliderToggle(!sliderToggle)}
                bgColor="#3B5D7C"
                color="#fff"
                fontWeight={500}
                fontSize={12}
              >
                Save Action
              </Button> */}
            </HStack>
          </Flex>
          <Slider
            defaultValue={rotationValue}
            min={-180}
            max={180}
            value={rotationValue}
            onChange={(val) => setRotationValue(val)}
          >
            <SliderTrack bgColor="#D9D9D9" h="2vh">
              <SliderFilledTrack bgColor="#D9D9D9" />
            </SliderTrack>
            <SliderThumb bgColor="#3B5D7C" h="20px" w="20px" />
          </Slider>
        </Flex>
      ) : null}
    </>
  );
};

export default Rotate;
