import React from "react";
import {
  IconButton,
  Tooltip,
  useMediaQuery,
  Flex,
  Box,
  Text,
} from "@chakra-ui/react";
import { GrRedo } from "react-icons/gr";

const Redo = ({
  setUndoRedoCounter,
  undoRedoCounter,
  gleasonScoringData,
  showGleason,
}) => {
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
    };
    // console.log(gleasonScoringData.hilLength);
  return (
    <Box w="60px" h="100%" bg={""} cursor="pointer">
      <Flex
        direction="column"
        mt={ifScreenlessthan1536px ? "1px" : "-2px"}
        justifyContent="center"
        alignItems="center"
        h="100%"
      >
        <IconButton
          height={ifScreenlessthan1536px ? "50%" : "50%"}
          width={ifScreenlessthan1536px ? "100%" : "100%"}
          _hover={{ bgColor: "transparent" }}
          icon={<GrRedo transform="scale(1.2)" color="black" />}
          _active={{
            bgColor: "transparent",
            outline: "none",
          }}
          backgroundColor="transparent"
          borderRadius={0}
          isDisabled={
            undoRedoCounter === gleasonScoringData.hilLength ||
            isEmpty(gleasonScoringData) ||
            !showGleason || gleasonScoringData.hilLength == undefined
          } // Disable if undoRedoCounter is 0
          onClick={() => {
            // Only perform the redo action if it's not disabled
            setUndoRedoCounter(undoRedoCounter + 1);
          }}
        />
        <Text align="center" fontFamily="inter" fontSize="13px" color="black">
          Redo
        </Text>
      </Flex>
    </Box>
  );
};

export default Redo;
