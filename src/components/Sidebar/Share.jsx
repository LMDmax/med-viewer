import React, { useState } from 'react';
import {
    Tooltip,
    Flex,
    Image,
    Box,
    Text,
    VStack,
  } from "@chakra-ui/react";
  import { RiShareForwardLine, RiShareForwardFill } from "react-icons/ri";
import IconSize from '../ViewerToolbar/IconSize';

const Share = () => {
    const [isOpen , setIsOpen] = useState(false);

    const handleClick =()=>{
        setIsOpen(!isOpen);
        // console.log("sadsasd");
    }
    return (
        <Tooltip bg="#E4E5E8" color="black" label="Share" hasArrow>
        <Flex justifyContent="center" alignItems="center" ml="5px" w="30px" h="27px" onClick={()=>{handleClick()}} cursor="pointer">
          {!isOpen ? <RiShareForwardLine  size={IconSize()} style={{ transform: "scale(1.2)" }} /> : <RiShareForwardFill size={IconSize()} style={{ transform: "scale(1.2)" }} /> }
       </Flex>
      </Tooltip>
    );
};

export default Share;