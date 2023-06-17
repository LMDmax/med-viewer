import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { AiOutlineClose } from "react-icons/ai";
import Normalisation from "../Normalisation/Normalisation";
import { useFabricOverlayState } from "../../state/store";
import { removeViewerWindow } from "../../state/actions/fabricOverlayActions";

const ModeMeanu = ({
  setShowRightPanel,
  setImageFilter,
  setIsNavigatorActive,
  setBase64URL,
  slide,
  setEditView,
  application,
  editView,
  viewerId,
  setSlideName2,
  setSlideName,
  setIsMultiview,
  tile,
}) => {
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { viewerWindow } = fabricOverlayState;
  console.log(viewerId);
  const vKeys = Object.keys(viewerWindow);
  // console.log(vKeys[1]);
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
              setEditView(false);
              // setFabricOverlayState(removeViewerWindow({ id: vKeys[1] }));
            }}
            size={24}
            color="gray"
            style={{ fontWeight: "bold" }}
          />
        </Box>
      </Flex>
      <Box mt="5px" w="100%">
        <Normalisation
          setSlideName2={setSlideName2}
          setSlideName={setSlideName}
          slide={slide}
          setIsMultiview={setIsMultiview}
          viewerId={viewerId}
          application={application}
          setEditView={setEditView}
          editView={editView}
          tile={tile}
          setIsNavigatorActive={setIsNavigatorActive}
          setImageFilter={setImageFilter}
          setBase64URL={setBase64URL}
        />
      </Box>
    </Box>
  );
};

export default ModeMeanu;
