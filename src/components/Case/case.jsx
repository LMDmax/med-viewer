import React, { useState } from "react";
import { Box, Text, VStack } from "@chakra-ui/react";

import { CloseIcon } from "@chakra-ui/icons";

const Case = (props) => {
  const [closeButton, setCloseButton] = useState(true);
  const handleCloseButtonClick = () => {
    setCloseButton(false);
    props.changeCount(false);
  };

  return (
    <>
      {closeButton ? (
        <Box
          width="100%"
          height="6em"
          borderRight="0.5px solid black"
          boxSizing="border-box"
          borderRadius="3px"
          paddingLeft="10px"
          paddingRight="10px"
        >
          <CloseIcon
            onClick={handleCloseButtonClick}
            color="black"
            transform="scale(0.5)"
            cursor="pointer"
            marginInline="calc(100% - 12px)"
            marginTop="-8px"
          />

          <VStack
            marginTop="-7px"
            marginLeft="4px"
            marginRight="4px"
            color="black"
            p="1em"
            borderRadius="5px"
            backgroundColor="rgba(248, 248, 245, 1)"
            fontSize="xs"
            fontWeight="100"
            align="left"
            spacing={-1}
            className="case_toolbar_box"
          >
            <Text>Slide Info/Case</Text>
            <Text>History</Text>
            <Text>Patient information</Text>
          </VStack>
        </Box>
      ) : (
        ""
      )}
    </>
  );
};

export default Case;
