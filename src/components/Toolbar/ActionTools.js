import React from "react";
import { Flex, Spacer } from "@chakra-ui/react";
import UndoRedo from "../UndoRedo/undoredo";
import ToggleAnnotations from "../Annotations/ToggleAnnotations";

const ActionsToolbar = ({ viewerId }) => {
  return (
    <Flex
      borderX="2px solid #E4E5E8"
      height="18px"
      alignItems="center"
      flex="1"
    >
      {/* <UndoRedo viewerId={viewerId} /> */}
      <ToggleAnnotations viewerId={viewerId} />
      <Spacer />
    </Flex>
  );
};

export default ActionsToolbar;
