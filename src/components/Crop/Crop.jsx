import React from 'react';
import {
    Tooltip,
    Image,
    Box,
    Text,
    VStack,
  } from "@chakra-ui/react";


  import cropIcon from "../../assets/images/CropTool.svg";

const Crop = () => {

    return (
       <Tooltip bg="#E4E5E8" color="black" label="Crop" hasArrow>
         <Box  cursor="pointer">
            <Image src={cropIcon}></Image>
        </Box>
       </Tooltip>
    );
};

export default Crop;