import React, { useRef, useState } from "react";
import {
  Button,
  IconButton,
  Image,
  Modal,
  Box,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Tooltip,
  Text,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import html2canvas from "html2canvas";
import IconSize from "./ViewerToolbar/IconSize";
import { ScreenshotIcon, ScreenshotSelectedIcon } from "./Icons/CustomIcons";
import TooltipLabel from "./AdjustmentBar/ToolTipLabel";

const DownloadImage = ({ setToolSelected }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [img, setImg] = useState();
  const [screenshotHover, setScreenshotHover] = useState(false);
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const modalRef = useRef(null);

  const handleClick = () => {
    html2canvas(document.querySelector(".openseadragon-canvas"), {
      backgroundColor: null,
      logging: true,
      allowTaint: false,
      useCORS: true,
      removeContainer: false,
    }).then((canvas) => {
      setImg(canvas.toDataURL("image/png"));
    });
    onOpen();
    
  };
  return (
    <>
      <Box
        ref={modalRef}
        onClick={() => {
          handleClick();
          setScreenshotHover(!screenshotHover);
        }}
        pt="8px"
        mx="15px"
        w="65px"
        h="100%"
        cursor="pointer"
        // border="1px solid red"
        bg={screenshotHover ? "rgba(157,195,226,0.4)" : ""}
      >
        <IconButton
        height={ifScreenlessthan1536px ? "50%" : "70%"}
        width={ifScreenlessthan1536px ? "100%" : "100%"}
          // border="2px solid red"
          _hover={{ bgColor: "transparent" }}
          icon={<ScreenshotIcon transform="scale(1.2)" color="#3B5D7C" />}
          _active={{
            bgColor: "transparent",
            outline: "none",
          }}
          backgroundColor="transparent"
          borderRadius={0}
          mb="3px"
        />
        <Text align="center" fontFamily="inter" fontSize="10px">Screenshot</Text>
      </Box>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setScreenshotHover(false);
          onClose();
        }}
        finalFocusRef={modalRef}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Download image</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image
              crossOrigin="https://openslide-demo.s3.dualstack.us-east-1.amazonaws.com/info.json"
              src={img}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              as="a"
              mr={3}
              href={img}
              download="my-speculative-annotation"
              fontFamily="ocr-a-std"
              onClick={() => setToolSelected("Downloaded")}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DownloadImage;
