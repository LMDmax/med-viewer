import React from 'react';
import { Box, Flex, Text, Tooltip } from "@chakra-ui/react";
import { GrFormClose } from "react-icons/gr";

const TILFeedBar = ({
    viewerId,
    handleFeedBarClose,
    showReport,
    synopticType,
    caseInfo,
    application,
    users,
    mentionUsers,
    Environment,
    userInfo,
    client2,
  }) => {
    console.log(caseInfo);
    return (
        <Box
      w="15.88vw"
      minW="300px"
      position="fixed"
      right={showReport ? "33.281vw" : synopticType !== "" ? "40vw" : "0"}
      zIndex={2}
      background="#FCFCFC"
      height="90%"
    >
      <Flex
        py="0.5px"
        justifyContent="space-between"
        alignItems="center"
        background="#F6F6F6"
        // background="red"
        height="50px"
        borderBottom="1px solid #DEDEDE"
      >
        <Tooltip hasArrow label="sss">
          <Text
            fontSize="14px"
            css={{
              fontWeight: "900",
            }}
          >
            Slide Id : {caseInfo._id}
          </Text>
        </Tooltip>
        <Flex
        py="0.5px"
        justifyContent="flex-end"
        alignItems="center"
        background="#F6F6F6"
      >
        <GrFormClose
          size={16}
          cursor="pointer"
          onClick={handleFeedBarClose}
          _hover={{ cursor: "pointer" }}
        />
        </Flex>
      </Flex>
      </Box>
    );
};

export default TILFeedBar;