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

const Rotate = ({ viewerId, setToolSelected, navigatorCounter }) => {
  const { fabricOverlayState } = useFabricOverlayState();
  const { viewer } = fabricOverlayState?.viewerWindow[viewerId];
  const [sliderToggle, setSliderToggle] = useState(false);
  const [rotationValue, setRotationValue] = useState(0);
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");

  useEffect(() => {
    try {
      if (viewer.viewport) {
        viewer.viewport.setRotation(rotationValue);
      }
    } catch (e) {
      console.error("Error handling rotate button click", e);
    }
  }, [rotationValue]);

  useEffect(() => {
    if (sliderToggle) {
      setToolSelected("Rotate");
    } else {
      setToolSelected("");
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
        w="60px"
        h="100%"
        py="5px"
        onClick={() => setSliderToggle(!sliderToggle)}
        backgroundColor={sliderToggle ? "rgba(157,195,226,0.4)" : "transparent"}
      >
        <IconButton
          height={ifScreenlessthan1536px ? "50%" : "70%"}
          width={ifScreenlessthan1536px ? "100%" : "100%"}
          // border="2px solid red"
          _hover={{ bgColor: "transparent" }}
          icon={<FiRotateCw transform="scale(1.5)" color="black" />}
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
        />
        {/* rgba(0, 21, 63, 1) */}

        {/* <Text color="white" align="center" fontSize="0.6rem">
        {label}
      </Text> */}
        <Text align="center">Rotate</Text>
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
