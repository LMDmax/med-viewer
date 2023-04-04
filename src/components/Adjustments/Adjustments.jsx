import React, { useState, useRef, useEffect } from "react";
// import { useRef } from "react";
import AdjustmentRow from "../ImageFilter/AdjustmentRow";
import OpenSeadragon from "openseadragon";
import { Box, VStack, Flex, Text, Button } from "@chakra-ui/react";
import "../ImageFilter/openseadragon-filtering";

const getFilters = (sliderInputs) => {
  const filters = [];
  if (sliderInputs.thresholding > -1)
    filters.push(OpenSeadragon.Filters.THRESHOLDING(sliderInputs.thresholding));
  return filters;
};

const Adjustments = ({ setIsOpen, viewer, setToolSelected, setSelectedOption }) => {
  const [sliderInputs, setSliderInputs] = useState({
    contrast: 1,
    brightness: 0,
    thresholding: -1,
    gamma: 1,
    exposure: 0,
  });

  const sliderStateRef = useRef(sliderInputs);

  const handleSliderChange = (name, value) => {
    setSliderInputs({ ...sliderInputs, [name.toLowerCase()]: value });
  };

  const handleOnClose = () => {
    // setIsActive(false);
    // setIsOpen(false);
    // if (sliderStateRef.current) setSliderInputs(sliderStateRef.current);
    // onClose();
    // setToolSelected("");
    setSelectedOption("slides");
  };

  const handleSave = () => {
    sliderStateRef.current = sliderInputs;
    // setIsActive(false);
    // onClose();
    setIsOpen(false);
    setToolSelected("FilterSaved");
  };

  useEffect(() => {
    if (!viewer) return;

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
    <Box w="100%" bg="white" px="5px">
      <Text
        fontFamily="Inter"
        fontStyle="normal"
        fontWeight="500"
        fontSize={20}
        letterSpacing=" 0.0025em"
        color=" #3B5D7C"
        mb="3vh"
      >
        Adjustments
      </Text>
      <VStack mb="30px" spacing={4}>
        <AdjustmentRow
          label="Contrast"
          min={1}
          max={255}
          baseValue={1}
          defaultValue={sliderInputs.contrast}
          handleSliderChange={handleSliderChange}
        />
        <AdjustmentRow
          label="Brightness"
          min={-255}
          max={255}
          baseValue={0}
          defaultValue={sliderInputs.brightness}
          handleSliderChange={handleSliderChange}
        />
        <AdjustmentRow
          label="Thresholding"
          min={-1}
          max={255}
          baseValue={-1}
          defaultValue={sliderInputs.thresholding}
          handleSliderChange={handleSliderChange}
        />
        <AdjustmentRow
          label="Gamma"
          min={1}
          max={255}
          baseValue={1}
          defaultValue={sliderInputs.gamma}
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
          Cancel
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
