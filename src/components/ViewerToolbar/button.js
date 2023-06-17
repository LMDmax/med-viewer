import React, { memo } from "react";
import PropTypes from "prop-types";
import {
  IconButton,
  Tooltip,
  Box,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { useWindowHeight } from "@react-hook/window-size";
import { isMobile, isTablet } from "react-device-detect";

const ToolbarButton = ({
  label = "Toolbar button",
  isActive,
  ...restProps
}) => {
  const windowHeight = useWindowHeight();
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const iconSizes = { size: "lg", fontSize: "2xl" };

  if (!isMobile) {
    if (windowHeight <= 645) {
      iconSizes.size = "sm";
      iconSizes.fontSize = "md";
    } else if (windowHeight <= 693) {
      iconSizes.size = "sm";
      iconSizes.fontSize = "md";
    }
  }

  if (isMobile && !isTablet) {
    iconSizes.size = "sm";
    iconSizes.fontSize = "md";
  }

  return (
    <Box>
      <Tooltip
        label={label}
        aria-label={label}
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
          width={ifScreenlessthan1536px ? "30px" : "40px"}
          size={ifScreenlessthan1536px ? 60 : 0}
          height={ifScreenlessthan1536px ? "26px" : "34px"}
          variant="unstyled"
          backgroundColor="#F8F8F5"
          color="#3963c3"
          pl={ifScreenlessthan1536px ? "7px" : "10px"}
          mr="7px"
          borderRadius="0px"
          _hover={{ bgColor: isActive ? "" : "rgba(228, 229, 232, 1)" }}
          _active={{
            bgColor: "rgba(228, 229, 232, 1)",
            outline: "0.5px solid rgba(0, 21, 63, 1)",
          }}
          _focus={{
            border: "none",
          }}
          {...restProps}
        />
        {/* rgba(0, 21, 63, 1) */}
      </Tooltip>
      {/* <Text color="white" align="center" fontSize="0.6rem">
        {label}
      </Text> */}
    </Box>
  );
};

export default memo(ToolbarButton);
