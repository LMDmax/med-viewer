import React from "react";
import { Flex, Text, HStack, IconButton, Tooltip } from "@chakra-ui/react";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import TooltipLabel from "../AdjustmentBar/ToolTipLabel";
import { useFabricOverlayState } from "../../state/store";

const ChangeHelper2 = ({
  title,
  disabledLeft,
  disabledRight,
  slideName,
  clickHandler,
  setIsMultiview,
  setIsNavigatorActive,
  slide,
  loadUI,
  isNavigatorActive,
  isAnnotationLoading,
}) => {
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { viewerWindow } = fabricOverlayState;
  // const abbreviatedName = viewerWindow[vKeys[1]]?.slideName ? viewerWindow[vKeys[1]]?.slideName.substring(0, 4) : "";
  var vKeys = Object.keys(viewerWindow);
// console.log(viewerWindow[vKeys[0]].viewer);
  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      height="18px"
      minW="140px"
      maxW="800px"
    >
      <HStack>
        <Tooltip
          label={
            <TooltipLabel
              heading="Navigator"
              paragraph="For previous WSI image"
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
        >
          <IconButton
            icon={<MdOutlineKeyboardArrowLeft color="#151C25" />}
            color="#fff"
            variant="unstyled"
            cursor="pointer"
            minW={0}
            _focus={{ background: "none" }}
            disabled={disabledLeft || !loadUI}
            onClick={() => {
              clickHandler(-1);
            }}
          />
        </Tooltip>

        <Tooltip
          label={<TooltipLabel heading="Slide Title" paragraph={viewerWindow[vKeys[1]]?.slideName} />}
          placement="bottom"
          openDelay={0}
          bg="#E4E5E8"
          color="rgba(89, 89, 89, 1)"
          fontSize="14px"
          fontFamily="inter"
          hasArrow
          borderRadius="0px"
          size="20px"
        >
    <Text
      mr="24px"
      fontWeight="400"
      fontSize="14px"
      lineHeight="25px"
      letterSpacing="0.0025em"
      fontFamily="Inter"
      wordBreak="break-word"
      noOfLines={1}
      cursor="pointer"
      isDisabled={isAnnotationLoading}
      isActive={isNavigatorActive}
    >
    {`${viewerWindow[vKeys[1]]?.slideName.substring(0, 6)}...`}
    </Text>


        </Tooltip>
        <Tooltip
          label={
            <TooltipLabel heading="Navigator" paragraph="For next WSI image" />
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
        >
          <IconButton
            icon={<MdOutlineKeyboardArrowRight color="#151C25" />}
            variant="unstyled"
            color="#fff"
            cursor="pointer"
            minW={0}
            _focus={{ background: "none", border: "none" }}
            disabled={disabledRight || !loadUI}
            onClick={() => {
              clickHandler(1);
            }}
          />
        </Tooltip>
      </HStack>
    </Flex>
  );
};

export default ChangeHelper2;
