import React, { useEffect, useRef, useState } from "react";
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
  Flex,
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
import { useFabricOverlayState } from "../state/store";
import { updateTool } from "../state/actions/fabricOverlayActions";

const DownloadImage = ({ setToolSelected }) => {
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { activeTool } = fabricOverlayState;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [img, setImg] = useState();
  const [screenshotHover, setScreenshotHover] = useState(false);
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const modalRef = useRef(null);
  const isActive = activeTool === "Screenshot";
  const handleClick = () => {
    const targetImage = document.body;
    html2canvas(targetImage, {
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
  useEffect(() => {
    if (screenshotHover) {
      setFabricOverlayState(updateTool({ tool: "Screenshot" }));
    } else {
      setFabricOverlayState(updateTool({ tool: "Move" }));
    }
  }, [screenshotHover]);
  return (
    <>
      <Box
        ref={modalRef}
        onClick={() => {
          handleClick();
          setScreenshotHover(!screenshotHover);
        }}
        mx="15px"
        w="65px"
        h="100%"
        cursor="pointer"
        // border="1px solid red"
        bg={screenshotHover ? "rgba(157,195,226,0.4)" : ""}
      >
        <Flex
          direction="column"
          mt={ifScreenlessthan1536px ? "1px" : "-2px"}
          justifyContent="center"
          alignItems="center"
          h="100%"
        >
          <IconButton
            height={ifScreenlessthan1536px ? "50%" : "50%"}
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
          />
          <Text align="center" fontFamily="inter" fontSize="10px">
            Screenshot
          </Text>
        </Flex>
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
        <ModalContent
          style={{
            right: 0,
            left: "auto",
            marginRight: "105px",
            marginTop: "125px",
            marginLeft: "auto",
            maxWidth: "320px",
            width: "100%",
          }}
        >
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
