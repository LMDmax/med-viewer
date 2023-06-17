import {
  Tooltip,
  Image,
  Box,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

import TooltipLabel from "../AdjustmentBar/ToolTipLabel";
import measureIcon from "../../assets/images/MeasureIcon.svg";

const Measuremnet = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    // console.log(`Option ${option} selected`);
    setIsOpen(false);
  };

  return (
    <Box
      mr="8px"
      w="28px"
      h="26px"
      style={{ position: "relative", display: "inline-block" }}
    >
      <Tooltip bg="#E4E5E8" color="black" label="Measurement" hasArrow>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="100%"
          h="100%"
          pl="5px"
          cursor="pointer"
          _hover={{ bgColor: "rgba(228, 229, 232, 1)" }}
        outline={isOpen ? "0.5px solid rgba(0, 21, 63, 1)" : ""}
          bg={isOpen ? "#D9D9D9" : "transparent"}
          boxShadow={
            isOpen
              ? "inset -2px -2px 2px rgba(0, 0, 0, 0.1), inset 2px 2px 2px rgba(0, 0, 0, 0.1)"
              : null
          }
          onClick={() => handleClick()}
        >
          <img
            src={measureIcon}
            alt="Measurement Icon"
            style={{ width: "30px", height: "30px", marginRight: "5px" }}
          />
        </Box>
      </Tooltip>
      {isOpen && (
        <Box
          style={{
            position: "absolute",
            top: "170%",
            left: 0,
            width: "120px",
            backgroundColor: "#F5F5F5",
            borderTop: "none",
            padding: "5px 0",
          }}
        >
          <ul style={{ listStyleType: "none", margin: 0, padding: 0 }}>
            <li
              style={{
                padding: "5px",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.target.style.fontWeight = "bold";
              }}
              onMouseLeave={(e) => {
                e.target.style.fontWeight = "normal";
              }}
              onClick={() => handleOptionClick("A")}
            >
              Distance
            </li>
            <li
              style={{
                padding: "5px",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.target.style.fontWeight = "bold";
              }}
              onMouseLeave={(e) => {
                e.target.style.fontWeight = "normal";
              }}
              onClick={() => handleOptionClick("B")}
            >
              Arc
            </li>
            <li
              style={{
                padding: "5px",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.target.style.fontWeight = "bold";
              }}
              onMouseLeave={(e) => {
                e.target.style.fontWeight = "normal";
              }}
              onClick={() => handleOptionClick("B")}
            >
              Circumference
            </li>
            <li
              style={{
                padding: "5px",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.target.style.fontWeight = "bold";
              }}
              onMouseLeave={(e) => {
                e.target.style.fontWeight = "normal";
              }}
              onClick={() => handleOptionClick("B")}
            >
              Area
            </li>
          </ul>
        </Box>
      )}
    </Box>
  );
};

export default Measuremnet;
