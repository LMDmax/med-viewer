import React, { useEffect, useRef, useState } from "react";
import {
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  IconButton,
  Box,
  VStack,
  ModalFooter,
  Button,
  Text,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { HiAdjustments } from "react-icons/hi";
import OpenSeadragon from "openseadragon";
import TooltipLabel from "../AdjustmentBar/ToolTipLabel";
import ToolbarButton from "../ViewerToolbar/button";
import { useFabricOverlayState } from "../../state/store";
import IconSize from "../ViewerToolbar/IconSize";
import "./openseadragon-filtering";
import AdjustmentRow from "./AdjustmentRow";

const getFilters = (sliderInputs) => {
  const filters = [];
  if (sliderInputs.thresholding > -1)
    filters.push(OpenSeadragon.Filters.THRESHOLDING(sliderInputs.thresholding));
  return filters;
};

const FilterAdjustments = ({
  viewerId,
  setToolSelected,
  toolSelected,
  navigatorCounter,
}) => {
  const { fabricOverlayState } = useFabricOverlayState();
  const { viewerWindow } = fabricOverlayState;
  const { viewer } = viewerWindow[viewerId];
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const [isActive, setIsActive] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [sliderInputs, setSliderInputs] = useState({
    contrast: 1,
    brightness: 0,
    thresholding: -1,
    gamma: 1,
    exposure: 0,
  });

  useEffect(() => {
    if (navigatorCounter > 0) {
      setIsActive(false);
    }
  }, [navigatorCounter]);

  useEffect(() => {
    if (isActive) {
      setToolSelected("Filter");
    } else {
      setToolSelected("");
    }
  }, [isActive]);

  useEffect(() => {
    if (toolSelected === "") {
      setIsActive(false);
    }
  }, [toolSelected]);

  const sliderStateRef = useRef(sliderInputs);
  const modalRef = useRef(null);

  const toast = useToast();

  const handleClick = () => {
    setIsActive((state) => !state);
  };

  const handleSliderChange = (name, value) => {
    setSliderInputs({ ...sliderInputs, [name.toLowerCase()]: value });
  };

  const handleOnClose = () => {
    setIsActive(false);
    if (sliderStateRef.current) setSliderInputs(sliderStateRef.current);
    onClose();
  };

  const handleSave = () => {
    sliderStateRef.current = sliderInputs;
    toast({
      status: "success",
      title: "Filters successfully applied",
      isClosable: true,
      duration: 1000,
    });
    setIsActive(false);
    onClose();
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
    <Box
      w="70px"
      h="100%"
      pt="8px"
      onClick={handleClick}
      style={{ position: "relative", display: "inline-block" }}
      _hover={{ bgColor: "transparent" }}
      sx={{
        ":before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          cursor: "pointer",
          width: "100%",
          height: "100%",
          backgroundColor: isActive ? "rgba(157,195,226,0.4)" : "transparent",
          zIndex: 1,
        },
      }}
    >
      <IconButton
        height={ifScreenlessthan1536px ? "50%" : "70%"}
        width={ifScreenlessthan1536px ? "100%" : "100%"}
        // border="2px solid red"
        _hover={{ bgColor: "transparent" }}
        icon={<HiAdjustments color="black" transform="scale(1.5)" />}
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
        mb="3px"
      />
      <Text align="center" fontFamily="inter" fontSize="10px">Adjustment</Text>
      <Modal
        isOpen={isOpen}
        onClose={handleOnClose}
        size="md"
        finalFocusRef={modalRef}
        closeOnOverlayClick={false}
      >
        <ModalContent borderRadius={0} top="40px" left="40px">
          <ModalHeader
            borderBottom="1px solid rgba(0, 0, 0, 0.25)"
            fontSize="16px"
            py={2}
          >
            Adjustments
          </ModalHeader>
          <ModalCloseButton _focus={{ border: "none" }} />
          <ModalBody>
            <VStack>
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
          </ModalBody>
          <ModalFooter>
            <Button
              h="32px"
              ml="15px"
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
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default FilterAdjustments;
