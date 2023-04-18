import React, { useEffect, useState } from "react";
import {
  IconButton,
  Tooltip,
  useMediaQuery,
  Box,
  Text,
} from "@chakra-ui/react";
import IconSize from "./ViewerToolbar/IconSize";
import TooltipLabel from "./AdjustmentBar/ToolTipLabel";
import { BsChatRightText, BsFillChatRightTextFill } from "react-icons/bs";

const ViewerChat = ({
  handleChatFeedbar,
  handleChatFeedBarClose,
  setChatHover,
  chatFeedBar,
  setToolSelected,
  navigatorCounter,
  chatHover,
}) => {
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  useEffect(() => {
    if (chatHover === false) {
      handleChatFeedBarClose();
      setToolSelected("");
    } else {
      setToolSelected("Chat");
    }
  }, [chatHover]);

  useEffect(() => {
    if (navigatorCounter > 0) {
      handleChatFeedBarClose();
      setToolSelected("");
    }
  }, [navigatorCounter]);
  return (
    <Box
      w="60px"
      h="100%"
      py="5px"
      bg={chatHover ? "rgba(157,195,226,0.4)" : ""}
      cursor="pointer"
      onClick={() => {
        handleChatFeedbar();
      }}
    >
      <IconButton
        height={ifScreenlessthan1536px ? "50%" : "70%"}
        width={ifScreenlessthan1536px ? "100%" : "100%"}
        // border="2px solid red"
        _hover={{ bgColor: "transparent" }}
        icon={<BsChatRightText transform="scale(1.2)" color="black" />}
        _active={{
          bgColor: "transparent",
          outline: "none",
        }}
        backgroundColor="transparent"
        borderRadius={0}
      />
      <Text align="center">Chat</Text>
    </Box>
  );
};

export default ViewerChat;
