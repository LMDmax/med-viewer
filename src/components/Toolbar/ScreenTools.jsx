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
import ImageDetails from "../ImageDetails/ImageDetails";
import ImageFilter from "../ImageFilter/imageFilter";
import ViewerChat from "../ViewerChat";
import ShowReport from "./ShowReport";
import Crop from "../Crop/Crop";
import Share from "../Sidebar/Share";

function ScreenTools({
  viewerId,
  report,
  toolSelected,
  chatFeedBar,
  application,
  handleAnnotationBar,
  caseInfo,
  slide,
  saveReport,
  saveSynopticReport,
  mediaUpload,
  slideInfo,
  setToolSelected,
  handleFeedBar,
  handleReport,
  showReport,
  setShowReport,
  userInfo,
  questions,
  app,
  setSlideId,
  responseHandler,
  questionnaireResponse,
  synopticType,
  setSynopticType,
  getSynopticReport,
  handleChatFeedbar,
  handleTILFeedBar,
  navigatorCounter,
  updateSynopticReport,
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
    <Flex h="100%" w="30%"  alignItems="center" justifyContent="center">
      <ImageFilter navigatorCounter={navigatorCounter} setToolSelected={setToolSelected} viewerId={viewerId} />
      <DownloadImage setToolSelected={setToolSelected} />
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
      {/* <Divider orientation="vertical" ml="5px" border="1px solid gray" /> */}
      {/* {report ? (
        <ShowReport
          caseInfo={caseInfo}
          application={application}
          saveReport={saveReport}
          saveSynopticReport={saveSynopticReport}
          viewerId={viewerId}
          mediaUpload={mediaUpload}
          slideInfo={slideInfo}
          handleReport={handleReport}
          showReport={showReport}
          setShowReport={setShowReport}
          userInfo={userInfo}
          questions={questions}
          app={app}
          setSlideId={setSlideId}
          responseHandler={responseHandler}
          questionnaireResponse={questionnaireResponse}
          synopticType={synopticType}
          setSynopticType={setSynopticType}
          getSynopticReport={getSynopticReport}
          updateSynopticReport={updateSynopticReport}
        />
      ) : null} */}
      {/* <Crop /> */}
      {/* <Share /> */}
      {/* <Flex borderLeft="2px solid #E4E5E8" ml="18px" pl="15px">
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
              Annotation and Comment Details
            </MenuItem>
            {localStorage.getItem("til") ? (
              <MenuItem onClick={handleTILFeedBar}>TIL</MenuItem>
            ) : null}
          </MenuList>
        </Menu>
      </Flex> */}
      <ImageDetails
        caseInfo={caseInfo}
        slideInfo={slide}
        isOpen={isImgDetailsOpen}
        onClose={onImgDetailsClose}
      />
    </Flex>
  );
}

export default ScreenTools;
