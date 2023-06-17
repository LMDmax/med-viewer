import React, { useRef, useState } from "react";
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

const DownloadImage = () => {
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
      <Tooltip
        ref={modalRef}
        label={<TooltipLabel heading="Screenshot" />}
        aria-label="Screenshot"
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
            screenshotHover ? (
              <ScreenshotSelectedIcon size={IconSize()} color="#151C25" />
            ) : (
              <ScreenshotIcon size={IconSize()} color="#151C25" />
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
            handleClick();
            setScreenshotHover(true);
          }}
          backgroundColor="#F8F8F5"
          _hover={{ bgColor: "rgba(228, 229, 232, 1)" }}
        />
      </Tooltip>

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
