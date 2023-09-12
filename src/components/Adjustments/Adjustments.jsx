import React, { useState, useRef, useEffect } from "react";
// import { useRef } from "react";
import AdjustmentRow from "../ImageFilter/AdjustmentRow";
import OpenSeadragon from "openseadragon";
import { Box, VStack, Flex, Text, Button } from "@chakra-ui/react";
import "../ImageFilter/openseadragon-filtering";
import { GrFormClose } from "react-icons/gr";
import { useFabricOverlayState } from "../../state/store";
import { updateTool } from "../../state/actions/fabricOverlayActions";

const getFilters = (sliderInputs) => {
  const filters = [];
  if (sliderInputs.thresholding > -1)
    filters.push(OpenSeadragon.Filters.THRESHOLDING(sliderInputs.thresholding));
  return filters;
};

const Adjustments = ({
  setIsOpen,
  viewer,
  setToolSelected,
  setSelectedOption,
  slideId,
  setAdjustmentTool,
  setNewSliderInputs,
  newSliderInputs,
  onSaveFilterData,
}) => {
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { onFilterData, analysisData, analysisError } = onSaveFilterData;
    

  const [sliderInputs, setSliderInputs] = useState({
    contrast: newSliderInputs.contrast,
    brightness: newSliderInputs.brightness,
    thresholding: newSliderInputs.thresholding,
    gamma: newSliderInputs.gamma,
    exposure: newSliderInputs.exposure,
  });

  const [reset, setReset] = useState(false);

  const sliderStateRef = useRef(sliderInputs);


  const handleSliderChange = (name, value) => {
    // console.log(name,value);
    setSliderInputs({ ...sliderInputs, [name.toLowerCase()]: value });
  };


  const handleOnClose = () => {
    setReset(!reset);
    // setIsOpen(false);
    // setToolSelected("");
    // setSelectedOption("slides");
    onFilterData({
      variables: {
        body: {
          data: {
            brightness: 0,
            contrast: 1,
            gamma: 1,
            thresholding: -1,
          },
          slideId,
        },
      },
    });

    // Reset the slider inputs to their default values
    const defaultSliderInputs = {
      contrast: 1,
      brightness: 0,
      thresholding: -1,
      gamma: 1,
      exposure: 0,
    };

    setSliderInputs(defaultSliderInputs);
    setNewSliderInputs(defaultSliderInputs);
    // Call viewer.setFilterOptions with the default values
    const filters = getFilters(defaultSliderInputs);
    try {
      viewer?.setFilterOptions({
        filters: {
          processors: [
            ...filters,
            OpenSeadragon.Filters.CONTRAST(defaultSliderInputs.contrast),
            OpenSeadragon.Filters.BRIGHTNESS(defaultSliderInputs.brightness),
            OpenSeadragon.Filters.GAMMA(defaultSliderInputs.gamma),
          ],
        },
        loadMode: "async",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = () => {
    sliderStateRef.current = sliderInputs;
    // onClose();
    // console.log(sliderInputs);
    onFilterData({
      variables: {
        body: {
          data: {
            brightness: sliderInputs.brightness,
            contrast: sliderInputs.contrast,
            gamma: sliderInputs.gamma,
            thresholding: sliderInputs.thresholding,
          },
          slideId,
        },
      },
    });
    setNewSliderInputs(sliderInputs);
    setIsOpen(false);
    setToolSelected("FilterSaved");
    setAdjustmentTool(false);
    setFabricOverlayState(updateTool({ tool: "Move" }));
  };

  useEffect(() => {
    if (!viewer) return;
    // console.log(sliderInputs);
    const filters = getFilters(sliderInputs);

    try {
      viewer.setFilterOptions({
        filters: {
          processors: [
            ...filters,
            OpenSeadragon.Filters.CONTRAST(sliderInputs.contrast),
            OpenSeadragon.Filters.BRIGHTNESS(sliderInputs.brightness),
            OpenSeadragon.Filters.GAMMA(sliderInputs.gamma),
          ],
        },
        loadMode: "async",
      });
    } catch (err) {
      console.error(err);
    }
  }, [sliderInputs, viewer]);
  return (
    <Box w="100%" bg="white" h="80vh" px="5px">
      <Flex
        mb="3vh"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text
          fontFamily="Inter"
          fontStyle="normal"
          fontWeight="500"
          fontSize={20}
          letterSpacing=" 0.0025em"
          color=" #3B5D7C"
        >
          Adjustments
        </Text>
        <GrFormClose
          size={20}
          cursor="pointer"
          _hover={{ cursor: "pointer" }}
          onClick={() => {
            handleOnClose();
            handleSave();
          }}
        />
      </Flex>
      <VStack mb="30px" spacing={4}>
        <AdjustmentRow
          label="Contrast"
          min={1}
          max={255}
          reset={reset}
          baseValue={1}
          defaultValue={
            newSliderInputs ? newSliderInputs.contrast : sliderInputs.contrast
          }
          handleSliderChange={handleSliderChange}
        />
        <AdjustmentRow
          label="Brightness"
          min={-255}
          max={255}
          reset={reset}
          baseValue={0}
          defaultValue={
            newSliderInputs
              ? newSliderInputs.brightness
              : sliderInputs.brightness
          }
          handleSliderChange={handleSliderChange}
        />
        <AdjustmentRow
          label="Thresholding"
          min={-1}
          max={255}
          reset={reset}
          baseValue={-1}
          defaultValue={
            newSliderInputs
              ? newSliderInputs.thresholding
              : sliderInputs.thresholding
          }
          handleSliderChange={handleSliderChange}
        />
        <AdjustmentRow
          label="Gamma"
          min={1}
          max={255}
          reset={reset}
          baseValue={1}
          defaultValue={
            newSliderInputs ? newSliderInputs.gamma : sliderInputs.gamma
          }
          handleSliderChange={handleSliderChange}
        />
      </VStack>
      <Flex alignItems="center" justifyItems="flex-start">
        <Button
          h="32px"
          borderRadius="0px"
          bg="none"
          border="2px solid #00153F"
          color="#00153F"
          _hover={{ border: "2px solid #00153F" }}
          _focus={{
            border: "2px solid #00153F",
          }}
          _active={{ background: "none" }}
          fontFamily="inter"
          fontSize="14px"
          fontWeight="bold"
          onClick={handleOnClose}
        >
          Reset
        </Button>
        <Button
          variant="solid"
          h="32px"
          ml="15px"
          borderRadius="0px"
          backgroundColor="#00153F"
          _hover={{ border: "none" }}
          _focus={{
            border: "none",
          }}
          color="#fff"
          fontFamily="inter"
          fontSize="14px"
          fontWeight="bold"
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </Flex>
    </Box>
  );
};

export default Adjustments;
