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
import SlidesMenu from "./slidesMenu";
import { useFabricOverlayState } from "../../state/store";

const FunctionsMenu = ({
  caseInfo,
  slides,
  viewerId,
  setIsMultiview,
  setIsNavigatorActive,
  isNavigatorActive,
  isMultiview,
}) => {
  const { getButtonProps, isOpen } = useDisclosure();
  const [ifWidthLessthan1920] = useMediaQuery("(max-width:1920px)");
  const [selectedOption, setSelectedOption] = useState("");
  const { fabricOverlayState } = useFabricOverlayState();
  const { viewerWindow } = fabricOverlayState;
  const { tile } = viewerWindow[viewerId];

  return (
    <Box
      pos="absolute"
      right={0}
      background="rgba(217, 217, 217, 0.3)"
      zIndex={10}
      h={ifWidthLessthan1920 ? "calc(100vh - 92px)" : "calc(100vh - 10.033vh)"}
    >
      <motion.div
        // 383px
        animate={{
          width: isOpen ? (ifWidthLessthan1920 ? "310px" : "35vh") : "70px",
        }}
        style={{
          background: "rgba(217, 217, 217, 0.5)",
          overflow: "hidden",
          whiteSpace: "nowrap",
          position: "absolute",
          right: "0",
          height: "100%",
          top: "0",
        }}
      >
        <Flex>
          <Flex direction="column">
            <Button
              {...getButtonProps()}
              w="70px"
              borderRadius={0}
              background="rgba(246, 246, 246,0.5)"
              box-shadow="0px 4px 7px rgba(0, 0, 0, 0.05)"
              _hover={{ bgColor: "rgba(246, 246, 246,0.5)" }}
            >
              {isOpen ? ">>" : "<<"}
            </Button>
            <Tooltip label="View slides">
              <Button
                height="73px"
                w="73px"
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
                    color={selectedOption === "slides" ? "#3B5D7C" : "fff"}
                  >
                    Slides
                  </Text>
                </VStack>
              </Button>
            </Tooltip>
            <Tooltip label="View timeline">
              <Button
                height="73px"
                w="73px"
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
                    color={selectedOption === "timeline" ? "#3B5D7C" : "fff"}
                  >
                    Timeline
                  </Text>
                </VStack>
              </Button>
            </Tooltip>
            <Tooltip label="View annotations">
              <Button
                height="73px"
                w="73px"
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
                    color={selectedOption === "annotations" ? "#3B5D7C" : "fff"}
                  >
                    Annotations
                  </Text>
                </VStack>
              </Button>
            </Tooltip>
            <Tooltip label="View comments">
              <Button
                height="73px"
                w="73px"
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
                    color={selectedOption === "comments" ? "#3B5D7C" : "fff"}
                  >
                    Comments
                  </Text>
                </VStack>
              </Button>
            </Tooltip>
            <Tooltip label="View slide info">
              <Button
                height="73px"
                w="73px"
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
                    color={selectedOption === "information" ? "#3B5D7C" : "fff"}
                  >
                    Information
                  </Text>
                </VStack>
              </Button>
            </Tooltip>
            <Tooltip label="Report slide">
              <Button
                height="73px"
                w="73px"
                borderRadius={0}
                background="#F6F6F6"
                box-shadow="0px 4px 7px rgba(0, 0, 0, 0.05)"
                onClick={() => setSelectedOption("report")}
              >
                <VStack>
                  {selectedOption === "report" ? (
                    <ReportSelected />
                  ) : (
                    <Report />
                  )}
                  <Text
                    fontFamily="Inter"
                    fontStyle="normal"
                    fontWeight="400"
                    fontSize="10px"
                    lineHeight="12px"
                    letterSpacing="0.0025em"
                    color={selectedOption === "report" ? "#3B5D7C" : "fff"}
                  >
                    Report
                  </Text>
                </VStack>
              </Button>
            </Tooltip>
          </Flex>
          <Flex
            w={ifWidthLessthan1920 ? "310px" : "35vh"}
            h={
              ifWidthLessthan1920
                ? "calc(100vh - 92px)"
                : "calc(100vh - 10.033vh)"
            }
          >
            {selectedOption === "slides" ? (
              <SlidesMenu
                caseInfo={caseInfo}
                slides={slides}
                viewerId={viewerId}
                tile={tile}
                setIsNavigatorActive={setIsNavigatorActive}
              />
            ) : null}
          </Flex>
        </Flex>
      </motion.div>
    </Box>
  );
};

export default FunctionsMenu;
