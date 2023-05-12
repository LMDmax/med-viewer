import React, { useState } from "react";
import {
  Flex,
  Button,
  MenuButton,
  MenuItem,
  Menu,
  MenuList,
  Divider,
  useDisclosure,
} from "@chakra-ui/react";
import { BiDotsVertical } from "react-icons/bi";
import DownloadImage from "../downloadImage";
import ImageFilter from "../ImageFilter/imageFilter";
// import ImageDetails from "../ImageDetails/ImageDetails";

const ScreenTools = ({
  viewerId,
  report,
  application,
  handleAnnotationBar,
  caseInfo,
  slide,
  saveReport,
  mediaUpload,
  slideInfo,
  handleFeedBar,
  handleReport,
  showReport,
  setShowReport,
  userInfo,
  questions,
  responseHandler,
  questionnaireResponse,
}) => {
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
    <Flex px="20px" w="25%" h="100%"  alignItems="center" justifyContent="flex-end">
      <ImageFilter viewerId={viewerId} />
      <DownloadImage />
      {/* <ImageDetails
        caseInfo={caseInfo}
        slideInfo={slide}
        isOpen={isImgDetailsOpen}
        onClose={onImgDetailsClose}
      /> */}
    </Flex>
  );
};

export default ScreenTools;
