import React from 'react';
import {
    IconButton,
    Tooltip,
    useMediaQuery,
    Box,
    Text,
  } from "@chakra-ui/react";
import {RxCross1 } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';


const Cancel = () => {
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const navigate = useNavigate()
const handleClick=()=>{
navigate("/dashboard/cases")
}
    return (
        <Box
      w="60px"
      h="100%"
      pt="8px"
      ml="10px"
      bg={""}
      cursor="pointer"
      onClick={() => {
        handleClick();
      }}
    >
      <IconButton
        height={ifScreenlessthan1536px ? "50%" : "70%"}
        width={ifScreenlessthan1536px ? "100%" : "100%"}
        // border="2px solid red"
        _hover={{ bgColor: "transparent" }}
        icon={<RxCross1 transform="scale(1.2)" color="red" />}
        _active={{
          bgColor: "transparent",
          outline: "none",
        }}
        backgroundColor="transparent"
        borderRadius={0}
        mb="3px"
      />
      <Text align="center" fontFamily="inter" fontSize="10px" color="red">Close</Text>
    </Box>
    );
};

export default Cancel;