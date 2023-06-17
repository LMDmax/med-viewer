import React from "react";
import { Flex, Spacer, Box } from "@chakra-ui/react";
import UndoRedo from "../UndoRedo/undoredo";
import ToggleAnnotations from "../Annotations/ToggleAnnotations";
import Lock from "../Lock/Lock";
import Microscope from "../Microscope/Microscope";

const ActionsToolbar = ({ viewerId, setToolSelected }) => {
  return (
    <Box w="200px" display="flex">
      <Flex alignItems="center" borderRight="2px solid #E4E5E8">
        {/* <UndoRedo viewerId={viewerId} /> */}
        {/* <ToggleAnnotations
        viewerId={viewerId}
        setToolSelected={setToolSelected}
      /> */}
        {/* <Spacer /> */}
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" w="75px" px="12px" borderRight="2px solid #E4E5E8">
      {/* <Lock  /> */}
      {/* <Microscope /> */}
      </Flex>
    </Box>
  );
};

export default ActionsToolbar;
