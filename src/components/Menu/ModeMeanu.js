import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { AiOutlineClose } from 'react-icons/ai';

const ModeMeanu = () => {
  return (
    <Box w="100%" bg="white" h="100%" px="5px">
      <Flex justifyContent="space-between" alignItems="center" w="100%" h="38px" px="5px">
        <Box >
        <Text color="#1B75BC" fontWeight="600" fontFamily="inter">
        Mode Settings
        </Text>
        </Box>
        <Box cursor="pointer">
            <AiOutlineClose size={24} color="gray" style={{ fontWeight: 'bold' }} />
        </Box>
      </Flex>
    </Box>
  );
};

export default ModeMeanu;
