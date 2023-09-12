import React, {useState} from 'react';
import { Flex, IconButton, useMediaQuery, Tooltip, Image, Box } from "@chakra-ui/react";
import { RiMicroscopeLine, RiMicroscopeFill } from "react-icons/ri";
import IconSize from '../ViewerToolbar/IconSize';
import TooltipLabel from '../AdjustmentBar/ToolTipLabel';

const Microscope = () => {
    const [isOpen , setIsOpen] = useState(false);
    const handleClick = ()=>{
        setIsOpen(!isOpen);
    }
    return (
        <Tooltip bg="#E4E5E8" color="black" label="Microscope Mode" hasArrow>
            <Box cursor="pointer" onClick={()=>{handleClick()}} label={<TooltipLabel heading="Microscopic Mode" />}>
        {!isOpen ? <RiMicroscopeLine size={IconSize()} /> : <RiMicroscopeFill size={IconSize()} /> }
    </Box>
        </Tooltip>
    );
};

export default Microscope;