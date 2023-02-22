import React, { useState } from "react";
import { useMediaQuery, Tooltip, IconButton } from "@chakra-ui/react";
import Popup from "../Popup/popup";
import { ChatIcon, ChatSelectedIcon } from "../Icons/CustomIcons";

const SlideChat = () => {
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const [chatHover, setChatHover] = useState(false);
  const [popup, setPopup] = useState(false);
  const handlePopup = () => {
    setPopup(!popup);
    setChatHover(false);
  };

  return (
    <>
      <Tooltip
        label="Chat"
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
          icon={chatHover ? <ChatSelectedIcon /> : <ChatIcon />}
          _active={{
            bgColor: "rgba(228, 229, 232, 1)",
            outline: "0.5px solid rgba(0, 21, 63, 1)",
          }}
          _focus={{
            border: "none",
          }}
          mr="7px"
          ml="3px"
          borderRadius={0}
          onClick={() => {
            handlePopup();
            setChatHover(true);
          }}
          backgroundColor="#F8F8F5"
          _hover={{ bgColor: "rgba(228, 229, 232, 1)" }}
        />
      </Tooltip>

      {/* <MessageBox isOpen={isOpen} onClose={close} /> */}
      <Popup
        handlePopup={() => {
          handlePopup();
        }}
        popup={popup}
      />
    </>
  );
};

export default SlideChat;
