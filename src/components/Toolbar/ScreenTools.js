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
import Popup from "../Popup/popup";
import DownloadImage from "../downloadImage";
import ImageFilter from "../ImageFilter/imageFilter";
import ShowReport from "./ShowReport";
import ImageDetails from "../ImageDetails/ImageDetails";

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
    <Flex px="20px" height="18px" alignItems="center">
      <ImageFilter viewerId={viewerId} />
      <DownloadImage />
      <Divider orientation="vertical" border="1px solid gray" />
      {report ? (
        <ShowReport
          caseInfo={caseInfo}
          application={application}
          saveReport={saveReport}
          viewerId={viewerId}
          mediaUpload={mediaUpload}
          slideInfo={slideInfo}
          handleReport={handleReport}
          showReport={showReport}
          setShowReport={setShowReport}
          userInfo={userInfo}
          questions={questions}
          responseHandler={responseHandler}
          questionnaireResponse={questionnaireResponse}
        />
      ) : null}
      <Flex borderLeft="2px solid #E4E5E8" ml="18px" pl="15px">
        <Menu zIndex="5">
          <MenuButton
            as={Button}
            transition="all 0.2s"
            fontWeight={500}
            bgColor="#F8F8F5"
            overflow="clip"
            borderRadius="none"
            _focus={{ outline: "none" }}
            title="More"
            onMouseEnter={() => setMenuHover(true)}
            onMouseLeave={() => setMenuHover(false)}
            _hover={{ bgColor: "rgba(228, 229, 232, 1)" }}
          >
            <BiDotsVertical
              size={20}
              color={menuHover ? "#3B5D7C" : "#151C25"}
            />
          </MenuButton>
          <MenuList color="#000">
            <MenuItem onClick={() => onImgDetailsOpen()}>
              Image Details
            </MenuItem>
            <MenuItem onClick={handleFeedBar}>Keypoints</MenuItem>
            <MenuItem onClick={handleAnnotationBar}>
              Annotation Details
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <ImageDetails
        caseInfo={caseInfo}
        slideInfo={slide}
        isOpen={isImgDetailsOpen}
        onClose={onImgDetailsClose}
      />
    </Flex>
  );
};

export default ScreenTools;
