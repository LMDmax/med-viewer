import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  IconButton,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Tooltip,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import html2canvas from "html2canvas";
import IconSize from "./ViewerToolbar/IconSize";
import { ScreenshotIcon, ScreenshotSelectedIcon } from "./Icons/CustomIcons";
import TooltipLabel from "./AdjustmentBar/ToolTipLabel";
import { BsChatRightText, BsFillChatRightTextFill } from "react-icons/bs";

const ViewerChat = ({ handleChatFeedbar }) => {
  const [img, setImg] = useState();
  const [chatHover, setChatHover] = useState(false);
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  useEffect(() => {
    if (localStorage.getItem("closeChat")) {
      setChatHover(false);
    }
  });
  return (
    <>
      <Tooltip
        label={<TooltipLabel heading="Chat" />}
        aria-label="Chat"
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
          icon={
            chatHover ? (
              <BsFillChatRightTextFill size={IconSize()} color="#151C25" />
            ) : (
              <BsChatRightText size={IconSize()} color="#151C25" />
            )
          }
          _active={{
            bgColor: "rgba(228, 229, 232, 1)",
            outline: "0.5px solid rgba(0, 21, 63, 1)",
          }}
          _focus={{
            border: "none",
          }}
          mr="7px"
          borderRadius={0}
          onClick={() => {
            handleChatFeedbar();
            setChatHover(true);
            localStorage.removeItem("closeChat");
          }}
          backgroundColor="#F8F8F5"
          _hover={{ bgColor: "rgba(228, 229, 232, 1)" }}
        />
      </Tooltip>
    </>
  );
};

export default ViewerChat;