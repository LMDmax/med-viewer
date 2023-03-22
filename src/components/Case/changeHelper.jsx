import React from "react";
import { Flex, Text, HStack, IconButton, Tooltip } from "@chakra-ui/react";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import TooltipLabel from "../AdjustmentBar/ToolTipLabel";

const ChangeHelper = ({
  title,
  disabledLeft,
  disabledRight,
  clickHandler,
  ...restProps
}) => {
  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      height="18px"
      minW="140px"
      maxW="800px"
      {...restProps}
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
            disabled={disabledLeft}
            onClick={() => clickHandler(-1)}
          />
        </Tooltip>

        <Text
          mr="24px"
          fontWeight="400"
          fontSize="14px"
          lineHeight="17px"
          letterSpacing="0.0025em"
          fontFamily="Inter"
          wordBreak="break-word"
          noOfLines={1}
        >
          {title}
        </Text>
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
            disabled={disabledRight}
            onClick={() => clickHandler(1)}
          />
        </Tooltip>
      </HStack>
    </Flex>
  );
};

export default ChangeHelper;
