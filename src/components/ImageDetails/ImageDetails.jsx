import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Text,
  VStack,
  Box,
  AccordionPanel,
  Link,
} from "@chakra-ui/react";
import React from "react";
import ScrollBar from "../ScrollBar";

const metadata = {
  width: 5465,
  height: 8093,
  location: "My Folder/Cases/203-11-22-22-UHID/SLIDE 1",
  bands: 3,
  xoffset: 0,
  yoffset: 0,
  xres: 1,
  yres: 1,
  size: "100 mb",
  dimension: "1280 x 720 px",
  resulation: "148 dpi",
  scanner: "NanoZoomer S360",
  doctor: "Dr. Sharma",
  "vips-loader": "tiffload",
  "n-pages": 3,
  "image-description":
    "Aperio Image Library v10.2.24\n" +
    "\n" +
    "5465x8093 [0,0 5465x8093] [256x256] JPEG/YCbCr Q = 75|AppMag = 40|MPP = 0.482315",
  orientation: 1,
  scanner: "Aperio Image Library v10.2.24",
  appMag: "40",
  mpp: "0.25",
  type: ".svs",
  additional: "5465x8093 [0,0 5465x8093] [256x256] JPEG/YCbCr Q = 75",
};

const DetailsRow = ({ label, value, isLink }) => (
  <Flex w="100%">
    <Text flex="1" fontSize="14px" p={0}>
      {label}:{" "}
    </Text>
    <Text flex="2" fontSize="14px" p={0}>
      {isLink ? <Link color="#3B5D7C">{value}</Link> : value}
    </Text>
  </Flex>
);

const ImageDetails = ({ caseInfo, onGetSlideInfo, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalContent borderRadius={0}>
        <ModalHeader
          borderBottom="1px solid rgba(0, 0, 0, 0.25)"
          fontSize="14px"
          fontWeight="400"
          pt="12px"
          pb="4px"
          pl="26px"
        >
          Image Details
        </ModalHeader>
        <ModalCloseButton
          border="none"
          outline="none"
          _focus={{ border: "none" }}
        />
        <ModalBody pt="34.67px" pl="26.33px" pb="23px">
          <ScrollBar>
            <VStack align="flex-start">
              <DetailsRow
                label="Title"
                value={
                  onGetSlideInfo?.slideName ||
                  onGetSlideInfo?.originalName?.split(".")?.[0]
                }
              />
              <Box flex={1} height="12px" />
              <DetailsRow label="Case Title" value={caseInfo?.caseName} />
              <Box flex={1} height="8px" />
              <DetailsRow
                label="Location"
                value={onGetSlideInfo?.metadata?.location || metadata.location}
                isLink="true"
              />
              <Box flex={1} height="8px" />
              <DetailsRow
                label="Type"
                value={`.${onGetSlideInfo?.originalName?.split(".")?.[1]}`}
              />
              <Box flex={1} height="8px" />
              <DetailsRow
                label="Size"
                value={onGetSlideInfo?.metadata?.size || metadata.size}
              />
              <Box flex={1} height="10.67px" />
              <Flex w="100%" h="2px" bg="#DEDEDE50" />
              <Box flex={1} height="14.33px" />
              <DetailsRow
                label="WSI Scanner"
                value={onGetSlideInfo?.metadata?.scanner || metadata.scanner}
              />
              <Box flex={1} height="26.33px" />
              <Flex w="100%" h="2px" bg="#DEDEDE50" />
              <Box flex={1} height="14.67px" />
              <Accordion w="100%" allowToggle>
                <AccordionItem border="none">
                  <AccordionButton
                    _hover={{ bg: "none" }}
                    _focus={{ border: "none" }}
                    p={0}
                  >
                    <Box
                      flex="1"
                      textAlign="left"
                      color="#3B5D7C"
                      fontSize="14px"
                    >
                      Other Details
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel p={0}>
                    <Flex flexDir="column" p={0}>
                      <Text mb="2px" mt="13.69px" fontSize="14px">
                        Shared With
                      </Text>
                      <Flex p={2} border="2px solid #dedede80">
                        <Text fontSize="14px">
                          SYSTEM
                          <br />
                          {onGetSlideInfo?.metadata?.doctor || metadata.doctor}
                        </Text>
                      </Flex>
                    </Flex>
                    <Flex w="100%" h="2px" bg="#DEDEDE50" my="15px" />
                    <DetailsRow
                      label="Dimension"
                      value={
                        onGetSlideInfo?.metadata?.dimension || metadata.dimension
                      }
                    />
                    <Box flex={1} height="8px" />
                    <DetailsRow
                      label="Resolution"
                      value={
                        onGetSlideInfo?.metadata?.resulation || metadata.resulation
                      }
                    />
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </VStack>
          </ScrollBar>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ImageDetails;
