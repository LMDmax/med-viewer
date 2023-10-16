import React from "react";
import Undo from "../Undo/Undo";
import { Flex } from "@chakra-ui/react";
import Redo from "../Redo/Redo";

const HITLControls = ({
  setUndoRedoCounter,
  undoRedoCounter,
  gleasonScoringData,
  showGleason,
  
}) => {
  return (
    <Flex justifyContent="flex-start" alignItems="center" w="120px" h="100%">
      <Undo
        setUndoRedoCounter={setUndoRedoCounter}
        undoRedoCounter={undoRedoCounter}
        gleasonScoringData={gleasonScoringData}
        showGleason={showGleason}
      />
      <Redo
        setUndoRedoCounter={setUndoRedoCounter}
        undoRedoCounter={undoRedoCounter}
        gleasonScoringData={gleasonScoringData}
        showGleason={showGleason}
      />
    </Flex>
  );
};

export default HITLControls;
