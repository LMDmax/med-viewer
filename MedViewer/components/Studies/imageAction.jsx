import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button,
  Box,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { AiOutlineProject, AiOutlinePicture } from "react-icons/ai";

const ImageAction = () => {
  return (
    <Accordion defaultIndex={[0]} allowMultiple marginLeft="0px">
      <AccordionItem border="0px" variant="unstyled">
        <AccordionButton
          size="sm"
          _focus={{ border: "none" }}
          paddingLeft="0px"
        >
          <AccordionIcon />
          <Icon as={AiOutlineProject} mr={1} ml={2} w={5} h={4} />
          <Box flex="1" textAlign="left" fontSize="xs">
            Project - 2
          </Box>
        </AccordionButton>
        <AccordionPanel padding="0px">
          <VStack>
            <Box fontSize="xs" width="100%" paddingLeft="25px">
              <Icon as={AiOutlinePicture} mr={1} ml={2} w={4} h={4} />
              AF123456
            </Box>
            <Box fontSize="xs" width="100%" paddingLeft="25px">
              <Icon as={AiOutlinePicture} mr={1} ml={2} w={4} h={4} />
              AF123456
            </Box>
            <Box fontSize="xs" width="100%" paddingLeft="25px">
              <Icon as={AiOutlinePicture} mr={1} ml={2} w={4} h={4} />
              AF123456
            </Box>
          </VStack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default ImageAction;
