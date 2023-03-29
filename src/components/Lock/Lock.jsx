import React, {useState} from 'react';
import { Flex, IconButton, useMediaQuery, Tooltip, Image, Box } from "@chakra-ui/react";
import { IoLockClosedOutline } from "react-icons/io5";
import { HiLockClosed } from "react-icons/hi";
import IconSize from '../ViewerToolbar/IconSize';


const Lock = () => {
    const [isOpen , setIsOpen] = useState(false);
    const handleClick = ()=>{
        setIsOpen(!isOpen);
    }
    return (
        <Tooltip bg="#E4E5E8" color="black" label="Lock Mode" hasArrow>
        <Box cursor="pointer" onClick={()=>{handleClick()}}>
            {!isOpen ? <IoLockClosedOutline size={IconSize()} /> : <HiLockClosed size={IconSize()} /> }
        </Box>
        </Tooltip>
    );
};

export default Lock;