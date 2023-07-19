import React, { useEffect, useState } from "react";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  HStack,
  Text,
  Box,
  Icon,
  Tooltip,
} from "@chakra-ui/react";
import { GrPowerReset } from "react-icons/gr";
import "./openseadragon-filtering";
import TooltipLabel from "../AdjustmentBar/ToolTipLabel";

const AdjustmentRow = ({
  label,
  defaultValue,
  min,
  max,
  baseValue,
  reset,
  handleSliderChange,
}) => {
  const [sliderValue, setSliderValue] = useState(defaultValue);

  const handleChange = (val) => {
    handleSliderChange(label, val);
    setSliderValue(val);
  };

  const handleInput = (event) => {
    const value = event.target.value ? parseInt(event.target.value, 10) : 1;
    handleSliderChange(label, value);
    setSliderValue(value);
  };

  const handleReset = () => {
    setSliderValue(baseValue);
    handleSliderChange(label, baseValue);
  };

  useEffect(()=>{
      setSliderValue(defaultValue)
  },[reset])

  return (
    <HStack w="100%" justify="space-between" spacing={4}>
      <Text flex="2">{label}</Text>
      <Slider
        flex="3"
        defaultValue={defaultValue}
        min={min}
        max={max}
        value={sliderValue}
        onChange={handleChange}
      >
        <SliderTrack bg="#60606050">
          <SliderFilledTrack bg="#3B5D7C" />
        </SliderTrack>
        <SliderThumb
          borderRadius={0}
          bg="#3B5D7C"
          _focus={{ border: "none" }}
        />
      </Slider>
      <Box
        // flex="1"
        minW="20px"
        bg="#F6F6F6"
        fontSize="14px"
        py={1}
        textAlign="center"
      >
        {sliderValue}
      </Box>
      <Box>
        {/* <Tooltip
          label={
            <TooltipLabel
              heading="Reset"
              paragraph={`Base value: ${baseValue}`}
            />
          }
          placement="bottom"
          openDelay={0}
          bg="#E4E5E8"
          color="rgba(89, 89, 89, 1)"
          fontSize="14px"
          fontFamily="inter"
          hasArrow
          borderRadius="0px"
          size="20px"
        > */}
        <Icon as={GrPowerReset} cursor="pointer" onClick={handleReset} />
        {/* </Tooltip> */}
      </Box>
    </HStack>
  );
};

export default AdjustmentRow;
