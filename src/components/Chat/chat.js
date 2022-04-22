import React, { useState } from "react";
import PropTypes from "prop-types";
import { ChatIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/react";
import { BsChatLeftText } from "react-icons/bs";
import ToolbarButton from "../ViewerToolbar/button";
import TypeButton from "../typeButton";
import MessageBox from "./messageBox";
import Popup from "../Popup/popup";
import IconSize from "../ViewerToolbar/IconSize";

const SlideChat = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [popup, setPopup] = useState(false);
  const handlePopup = () => {
    setPopup(!popup);
  };

  const close = () => {
    onClose();
  };

  return (
    <>
      <ToolbarButton
        onClick={handlePopup}
        icon={<BsChatLeftText size={IconSize()} color="#151C25" />}
        // backgroundColor={isActive ? "white" : "#3963c3"}
        // border="0.5px solid rgba(255, 255, 255, 0.5)"
        label="Chat"
        ml="5px"

        // transform="scale(1.5)"
      />
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
