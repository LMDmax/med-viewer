import React from "react";
import { BsArrowRepeat } from "react-icons/bs";
import {
  Box,
  Flex,
  HStack,
  Text,
  Icon,
  useDisclosure,
  useMediaQuery,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  Tooltip,
  TabPanel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Circle,
  IconButton,
  useToast,
  Collapse,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  AiFillCaretRight,
  AiFillCaretDown,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { BiRectangle, BiText } from "react-icons/bi";
import {
  BsEye,
  BsEyeSlash,
  BsCircle,
  BsSlash,
  BsPlusLg,
  BsArrowUpLeft,
} from "react-icons/bs";
import { FaDrawPolygon } from "react-icons/fa";
import { GrFormClose } from "react-icons/gr";
import {
  MdModeEditOutline,
  MdDelete,
  MdTextsms,
  MdOutlineFontDownload,
  MdOutlineFontDownloadOff,
} from "react-icons/md";
import { RiCheckboxBlankLine, RiCheckboxBlankFill } from "react-icons/ri";
import { v4 as uuidv4 } from "uuid";

const TILFeedBar = ({
  isTILBoxVisible,
  GroupTil,
  selectedItemIndex,
  setIsTilBoxVisible,
  selectedPattern,
  lymphocyteColor,
  tumorColor,
  stromaColor,
  tumorArea,
  stromaArea,
  lymphocyteCount,
  setSelectedPattern,
}) => {
  const MotionBox = motion(Box);
  return (
    <Box my="10px" cursor="pointer">
      <Flex
        w="40%"
        onClick={() => setIsTilBoxVisible(!isTILBoxVisible)}
        justifyContent="flex-start"
        alignItems="center"
      >
        <Box mr="6px">
          {isTILBoxVisible ? (
            <AiFillCaretDown color="#3B5D7C" />
          ) : (
            <AiFillCaretRight color="gray" />
          )}
        </Box>
        <Box ml="18px">
          <GroupTil />
        </Box>
        <Text
          ml="0.8vw"
          style={{
            fontWeight: selectedItemIndex === "til" ? "bold" : "normal",
          }}
        >
          TIL Analysis
        </Text>
      </Flex>
      {isTILBoxVisible && (
        <MotionBox
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          h="fit-content"
          w="100%"
          mt={2}
          //   onClick={handleBoxClick}
        >
          <Flex
            borderBottom="1px solid lightgray"
            my="0"
            ml="40px"
            alignItems="center"
            bg={selectedPattern === "Tumor" ? "#DEDEDE" : null}
            onClick={() => {
              if (selectedPattern === "Tumor") {
                setSelectedPattern("");
              } else {
                setSelectedPattern("Tumor");
              }
            }}
            py="8px"
          >
            <RiCheckboxBlankFill
              color={
                tumorColor.color
                  ? `rgba(${tumorColor.color.r}, ${tumorColor.color.g}, ${tumorColor.color.b}, ${tumorColor.color.a})`
                  : "yellow"
              }
            />
            <Text ml="5px">Tumor</Text>
            <Flex
              alignItems="flex-end"
              justifyContent="flex-end"
              w="100%"
            ></Flex>
          </Flex>
          <Flex
            borderBottom="1px solid lightgray"
            my="0"
            ml="40px"
            alignItems="center"
            bg={selectedPattern === "Stroma" ? "#DEDEDE" : null}
            onClick={() => {
              if (selectedPattern === "Stroma") {
                setSelectedPattern("");
              } else {
                setSelectedPattern("Stroma");
              }
            }}
            py="8px"
          >
            <RiCheckboxBlankFill
              color={
                stromaColor.color
                  ? `rgba(${stromaColor.color.r}, ${stromaColor.color.g}, ${stromaColor.color.b}, ${stromaColor.color.a})`
                  : "#4682B4"
              }
            />
            <Text ml="5px">Stroma</Text>
            <Flex
              alignItems="flex-end"
              justifyContent="flex-end"
              w="100%"
            ></Flex>
          </Flex>
          <Flex
            my="0"
            ml="40px"
            alignItems="center"
            bg={selectedPattern === "Lymphocytes" ? "#DEDEDE" : null}
            // onClick={() => {
            //   if (selectedPattern === "Lymphocytes") {
            //     setSelectedPattern("");
            //
            // }}
            onClick={() => {
              console.log("object", selectedPattern);
              if (selectedPattern === "Lymphocytes") {
                setSelectedPattern("");
              } else {
                setSelectedPattern("Lymphocytes");
              }
            }}
            py="8px"
          >
            <RiCheckboxBlankLine
              color={
                lymphocyteColor?.color
                  ? `rgba(${lymphocyteColor.color.r}, ${lymphocyteColor.color.g}, ${lymphocyteColor.color.b}, ${lymphocyteColor.color.a})`
                  : "red"
              }
            />
            <Text ml="5px">Lymphocytes</Text>
            <Flex
              alignItems="flex-end"
              justifyContent="flex-end"
              w="100%"
            ></Flex>
          </Flex>
          <Box w="100%" mx="25px" my="10px" textAlign="left">
            <Text color="#3B5D7C">TIL Values</Text>
          </Box>
          <Box px="25px">
            {/* <Text mb="10px" borderBottom="1px solid lightgray">
            TIL Score : {tilScore}
          </Text> */}
            {/* <Text mb="10px">
            TIL Formula : <br /> (Lymphocyte Area / Stroma Area) *
            100
          </Text> */}
            <Text
              mb="10px"
              borderTop="1px solid lightgray"
              borderBottom="1px solid lightgray"
            >
              Tumor Area : {tumorArea}
            </Text>
            <Text mb="10px" borderBottom="1px solid lightgray">
              Intra-Tumoral Stroma Area: : {stromaArea}
            </Text>
            <Text borderBottom="1px solid lightgray">
              Lymphocytes Count : {lymphocyteCount}
            </Text>
          </Box>
        </MotionBox>
      )}
    </Box>
  );
};

export default TILFeedBar;
