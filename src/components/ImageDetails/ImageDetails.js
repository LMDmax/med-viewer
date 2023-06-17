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
} from "@chakra-ui/react";
import React from "react";
import ScrollBar from "../ScrollBar";

const metadata = {
  width: 5465,
  height: 8093,
  bands: 3,
  xoffset: 0,
  yoffset: 0,
  xres: 1,
  yres: 1,
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

const DetailsRow = ({ label, value }) => (
  <Flex w="100%">
    <Text flex="1">{label}: </Text>
    <Text flex="2">{value}</Text>
  </Flex>
);

const ImageDetails = ({ caseInfo, slideInfo, isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalContent borderRadius={0}>
        <ModalHeader
          borderBottom="1px solid rgba(0, 0, 0, 0.25)"
          fontSize="16px"
          fontWeight="400"
        >
          Image Details
        </ModalHeader>
        <ModalCloseButton
          border="none"
          outline="none"
          _focus={{ border: "none" }}
        />
        <ModalBody>
          <ScrollBar>
            <VStack align="flex-start">
              <DetailsRow
                label="Title"
                value={
                  slideInfo?.slideName ||
                  slideInfo?.originalName?.split(".")?.[0]
                }
              />
              <DetailsRow label="Case Title" value={caseInfo?.caseName} />
              <DetailsRow
                label="Type"
                value={slideInfo?.metadata?.type || metadata.type}
              />
              <DetailsRow
                label="WSI Scanner"
                value={slideInfo?.metadata?.scanner || metadata.scanner}
              />
              <DetailsRow
                label="Width"
                value={`${slideInfo?.metadata?.width || metadata.width} px`}
              />
              <DetailsRow
                label="Height"
                value={`${slideInfo?.metadata?.height || metadata.height} px`}
              />
              <DetailsRow
                label="Magification"
                value={slideInfo?.metadata?.appMag || metadata.appMag}
              />
              <DetailsRow
                label="MPP"
                value={<>{slideInfo?.metadata?.mpp || metadata.mpp} &micro;m</>}
              />
              <Flex w="100%" h="2px" bg="#DEDEDE50" />
              <Accordion w="100%" allowToggle>
                <AccordionItem border="none">
                  <AccordionButton
                    _hover={{ bg: "none" }}
                    _focus={{ border: "none" }}
                    px={0}
                  >
                    <Box flex="1" textAlign="left" color="#3B5D7C">
                      Other Details
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel px={0}>
                    <Flex flexDir="column" gap="4px">
                      <Text>Shared With</Text>
                      <Flex p={2} border="2px solid #dedede80">
                        <Text>None</Text>
                      </Flex>
                    </Flex>
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
