import React from "react";
import {
  IconButton,
  Tooltip,
  useMediaQuery,
  Flex,
  Box,
  Text,
} from "@chakra-ui/react";
import { GrUndo } from "react-icons/gr";
const Undo = ({
  setUndoRedoCounter,
  undoRedoCounter,
  gleasonScoringData,
    showGleason,
  
}) => {
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
  };

//   console.log(
//     "ASD",
//     Math.abs(gleasonScoringData?.hilLength) == Math.abs(undoRedoCounter)
//   );
//   console.log("undoRedoCounter", undoRedoCounter);
//   console.log("hilLength", gleasonScoringData?.hilLength);
  return (
    <Box
      w="60px"
      h="100%"
      bg={""}
      cursor="pointer"
      //   onClick={() => {
      //     handleClick();
      //   }}
    >
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
          // border="2px solid red"
          _hover={{ bgColor: "transparent" }}
          icon={<GrUndo transform="scale(1.2)" color="black" />}
          _active={{
            bgColor: "transparent",
            outline: "none",
          }}
          backgroundColor="transparent"
          borderRadius={0}
          isDisabled={
            gleasonScoringData?.hilLength < 0 ||
            isEmpty(gleasonScoringData) ||
            undoRedoCounter === 0 ||
            !showGleason
          }
          onClick={() => {
            // Only perform the redo action if it's not disabled
            setUndoRedoCounter(undoRedoCounter - 1);
          }}
        />
        <Text align="center" fontFamily="inter" fontSize="13px" color="black">
          Undo
        </Text>
      </Flex>
    </Box>
  );
};

export default Undo;
