import {
  Flex,
  IconButton,
  useMediaQuery,
  Tooltip,
  Image,
  Box,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import modeImg from "../../assets/images/modeIcon.svg";
import modeImgSelect from "../../assets/images/modeIconSelect.svg";

const Mode = () => {
  const [isOpen, setIsOpen] = useState();
  const handleModeClick = () => {
    setIsOpen(!isOpen);
  };
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
      <Tooltip bg="#E4E5E8" color="black" label="Mode" hasArrow>
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
          onClick={() => handleModeClick()}
        >
          <img
            src={ !isOpen ? modeImg : modeImgSelect}
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
              Show Grid
            </li>
          </ul>
        </Box>
      )}
    </Box>
  );
};

export default Mode;
