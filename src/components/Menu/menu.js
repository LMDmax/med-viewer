import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Tooltip,
  useDisclosure,
  useMediaQuery,
  VStack,
  Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  SlidesIcon,
  TimelineIcon,
  TimelineIconSelected,
  Annotations,
  AnnotationsSelected,
  Comments,
  CommentsSelected,
  Information,
  InformationSelected,
  Report,
  ReportSelected,
  SlidesIconSelected,
} from "../Icons/CustomIcons";

const FunctionsMenu = () => {
  const { getButtonProps, isOpen } = useDisclosure();
  const [ifWidthLessthan1920] = useMediaQuery("(max-width:1920px)");
  const [selectedOption, setSelectedOption] = useState("slides");
  return (
    <Box
      pos="absolute"
      right={0}
      background="rgba(217, 217, 217, 0.3)"
      zIndex={10}
      h={ifWidthLessthan1920 ? "calc(100vh - 92px)" : "calc(100vh - 10.033vh)"}
    >
      <motion.div
        animate={{ width: isOpen ? "35vh" : "70px" }}
        style={{
          background: "rgba(217, 217, 217, 0.3)",
          overflow: "hidden",
          whiteSpace: "nowrap",
          position: "absolute",
          right: "0",
          height: "100%",
          top: "0",
        }}
      >
        <Flex direction="column">
          <Button
            {...getButtonProps()}
            w="70px"
            borderRadius={0}
            background="#F6F6F6"
            box-shadow="0px 4px 7px rgba(0, 0, 0, 0.05)"
          >
            {isOpen ? ">>" : "<<"}
          </Button>
          <Tooltip label="View slides">
            <Button
              height="10vh"
              w="70px"
              borderRadius={0}
              background="#F6F6F6"
              box-shadow="0px 4px 7px rgba(0, 0, 0, 0.05)"
              onClick={() => setSelectedOption("slides")}
            >
              <VStack>
                {selectedOption === "slides" ? (
                  <SlidesIconSelected />
                ) : (
                  <SlidesIcon />
                )}
                <Text
                  fontFamily="Inter"
                  fontStyle="normal"
                  fontWeight="400"
                  fontSize="10px"
                  lineHeight="12px"
                  letterSpacing="0.0025em"
                >
                  Slides
                </Text>
              </VStack>
            </Button>
          </Tooltip>
          <Tooltip label="View timeline">
            <Button
              height="10vh"
              w="70px"
              borderRadius={0}
              background="#F6F6F6"
              box-shadow="0px 4px 7px rgba(0, 0, 0, 0.05)"
              onClick={() => setSelectedOption("timeline")}
            >
              <VStack>
                {selectedOption === "timeline" ? (
                  <TimelineIconSelected />
                ) : (
                  <TimelineIcon />
                )}
                <Text
                  fontFamily="Inter"
                  fontStyle="normal"
                  fontWeight="400"
                  fontSize="10px"
                  lineHeight="12px"
                  letterSpacing="0.0025em"
                >
                  Timeline
                </Text>
              </VStack>
            </Button>
          </Tooltip>
          <Tooltip label="View annotations">
            <Button
              height="10vh"
              w="70px"
              borderRadius={0}
              background="#F6F6F6"
              box-shadow="0px 4px 7px rgba(0, 0, 0, 0.05)"
              onClick={() => setSelectedOption("annotations")}
            >
              <VStack>
                {selectedOption === "annotations" ? (
                  <AnnotationsSelected />
                ) : (
                  <Annotations />
                )}
                <Text
                  fontFamily="Inter"
                  fontStyle="normal"
                  fontWeight="400"
                  fontSize="10px"
                  lineHeight="12px"
                  letterSpacing="0.0025em"
                >
                  Annotations
                </Text>
              </VStack>
            </Button>
          </Tooltip>
          <Tooltip label="View comments">
            <Button
              height="10vh"
              w="70px"
              borderRadius={0}
              background="#F6F6F6"
              box-shadow="0px 4px 7px rgba(0, 0, 0, 0.05)"
              onClick={() => setSelectedOption("comments")}
            >
              <VStack>
                {selectedOption === "comments" ? (
                  <CommentsSelected />
                ) : (
                  <Comments />
                )}
                <Text
                  fontFamily="Inter"
                  fontStyle="normal"
                  fontWeight="400"
                  fontSize="10px"
                  lineHeight="12px"
                  letterSpacing="0.0025em"
                >
                  Comments
                </Text>
              </VStack>
            </Button>
          </Tooltip>
          <Tooltip label="View slide info">
            <Button
              height="10vh"
              w="70px"
              borderRadius={0}
              background="#F6F6F6"
              box-shadow="0px 4px 7px rgba(0, 0, 0, 0.05)"
              onClick={() => setSelectedOption("information")}
            >
              <VStack>
                {selectedOption === "information" ? (
                  <InformationSelected />
                ) : (
                  <Information />
                )}
                <Text
                  fontFamily="Inter"
                  fontStyle="normal"
                  fontWeight="400"
                  fontSize="10px"
                  lineHeight="12px"
                  letterSpacing="0.0025em"
                >
                  Information
                </Text>
              </VStack>
            </Button>
          </Tooltip>
          <Tooltip label="Report slide">
            <Button
              height="10vh"
              w="70px"
              borderRadius={0}
              background="#F6F6F6"
              box-shadow="0px 4px 7px rgba(0, 0, 0, 0.05)"
              onClick={() => setSelectedOption("report")}
            >
              <VStack>
                {selectedOption === "report" ? <ReportSelected /> : <Report />}
                <Text
                  fontFamily="Inter"
                  fontStyle="normal"
                  fontWeight="400"
                  fontSize="10px"
                  lineHeight="12px"
                  letterSpacing="0.0025em"
                >
                  Report
                </Text>
              </VStack>
            </Button>
          </Tooltip>
        </Flex>
      </motion.div>
    </Box>
  );
};

export default FunctionsMenu;
