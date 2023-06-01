import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { AiOutlineClose } from "react-icons/ai";
import Normalisation from "../Normalisation/Normalisation";

const ModeMeanu = ({
  setShowRightPanel,
  setImageFilter,
  setBase64URL,
  slide,
  viewerId,
  setIsMultiview,
  tile,
}) => {
  return (
    <Box w="100%" bg="white" h="82vh" px="5px">
      <Flex
        borderBottom="2px solid rgba(0, 0, 0, 0.2)"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        h="38px"
        px="5px"
      >
        <Box>
          <Text color="#1B75BC" fontWeight="600" fontFamily="inter">
            Mode Settings
          </Text>
        </Box>
        <Box cursor="pointer">
          <AiOutlineClose
            onClick={() => {
              setShowRightPanel(false);
              setImageFilter(false);
            }}
            size={24}
            color="gray"
            style={{ fontWeight: "bold" }}
          />
        </Box>
      </Flex>
      <Box mt="5px" w="100%">
        <Normalisation slide={slide} setIsMultiview={setIsMultiview} viewerId={viewerId} tile={tile} setBase64URL={setBase64URL} />
      </Box>
    </Box>
  );
};

export default ModeMeanu;
