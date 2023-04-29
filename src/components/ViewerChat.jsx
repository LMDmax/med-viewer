import React, { useEffect, useState } from "react";
import {
  IconButton,
  Tooltip,
  useMediaQuery,
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";
import IconSize from "./ViewerToolbar/IconSize";
import TooltipLabel from "./AdjustmentBar/ToolTipLabel";
import { BsChatRightText, BsFillChatRightTextFill } from "react-icons/bs";
import { useFabricOverlayState } from "../state/store";
import { updateTool } from "../state/actions/fabricOverlayActions";

const ViewerChat = ({
  handleChatFeedbar,
  handleChatFeedBarClose,
  setChatHover,
  chatFeedBar,
  setToolSelected,
  navigatorCounter,
  chatHover,
}) => {
  const { fabricOverlayState,setFabricOverlayState } = useFabricOverlayState();
  const { activeTool, } = fabricOverlayState;
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const isActive = activeTool === "Chat";
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
      bg={chatFeedBar ? "rgba(157,195,226,0.4)" : ""}
      cursor="pointer"
      onClick={() => {
        handleChatFeedbar();
      }}
    >
     <Flex direction="column" mt={ifScreenlessthan1536px? "1px" : "-2px"} justifyContent="center" alignItems="center" h="100%">
     <IconButton
        height={ifScreenlessthan1536px ? "50%" : "50%"}
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
      <Text align="center" fontFamily="inter" fontSize="10px">Chat</Text>
     </Flex>
    </Box>
  );
};

export default ViewerChat;
