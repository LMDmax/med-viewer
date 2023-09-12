import React, { useState } from "react";

import { Flex, useDisclosure } from "@chakra-ui/react";

import DownloadImage from "../downloadImage";

import ImageFilter from "../ImageFilter/imageFilter";
import ViewerChat from "../ViewerChat";

function ScreenTools({
  viewerId,
  setLoadUI,
  chatFeedBar,
  base64URL,
  application,
  setOriginalPixels,
  imageFilter,
  socketRef,
  setToolSelected,
  normalizeDefault,
  handleChatFeedbar,
  navigatorCounter,
  setChatHover,
  handleChatFeedBarClose,
  chatHover,
}) {
  const [popup, setPopup] = useState(false);
  const [menuHover, setMenuHover] = useState(false);
  const handlePopup = () => {
    setPopup(!popup);
  };
  const {
    isOpen: isImgDetailsOpen,
    onOpen: onImgDetailsOpen,
    onClose: onImgDetailsClose,
  } = useDisclosure();

  return (
    <Flex h="100%" w="25%" alignItems="center" justifyContent="flex-end">
      <ImageFilter
        imageFilter={imageFilter}
        normalizeDefault={normalizeDefault}
        socketRef={socketRef}
        base64URL={base64URL}
        setLoadUI={setLoadUI}
        setOriginalPixels={setOriginalPixels}
        navigatorCounter={navigatorCounter}
        setToolSelected={setToolSelected}
        viewerId={viewerId}
      />
      <DownloadImage viewerId={viewerId} setToolSelected={setToolSelected} />
      {application === "hospital" && (
        <ViewerChat
          chatHover={chatHover}
          setChatHover={setChatHover}
          setToolSelected={setToolSelected}
          chatFeedBar={chatFeedBar}
          handleChatFeedBarClose={handleChatFeedBarClose}
          handleChatFeedbar={handleChatFeedbar}
          navigatorCounter={navigatorCounter}
        />
      )}
      {/* <Cancel /> */}
      {/* <Divider orientation="vertical" ml="5px" border="1px solid gray" /> */}
      {/* <Crop /> */}
      {/* <Share /> */}
    </Flex>
  );
}

export default ScreenTools;
