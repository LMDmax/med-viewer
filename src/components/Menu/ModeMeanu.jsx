import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { AiOutlineClose } from "react-icons/ai";
import Normalisation from "../Normalisation/Normalisation";
import { useFabricOverlayState } from "../../state/store";
import { removeViewerWindow } from "../../state/actions/fabricOverlayActions";

const ModeMeanu = ({
  setShowRightPanel,
  setIsNavigatorActive,
  setBase64URL,
  slide,
  setCurrentViewer,
  setOriginalPixels,
  setEditView,
  originalPixels,
  viewerIds,
  setShowNormalisation,
  application,
  targetAnnotation,
  setNormalizeDefault,
  editView,
  showNormalisation,
  viewerId,
  setSlideName2,
  setSlideName,
  setIsMultiview,
  tile,
}) => {
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { viewerWindow } = fabricOverlayState;
  // console.log(viewerId);
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
              setEditView(false);
              localStorage.removeItem("mode");
              setShowNormalisation(false);
              window.location.reload()
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
          showNormalisation={showNormalisation}
          viewerId={viewerId}
          application={application}
          setNormalizeDefault={setNormalizeDefault}
          targetAnnotation={targetAnnotation}
          setEditView={setEditView}
          viewerIds={viewerIds}
          editView={editView}
          setOriginalPixels={setOriginalPixels}
          setShowNormalisation={setShowNormalisation}
          originalPixels={originalPixels}
          tile={tile}
          setShowRightPanel={setShowRightPanel}
          setIsNavigatorActive={setIsNavigatorActive}
          setBase64URL={setBase64URL}
        />
      </Box>
    </Box>
  );
};

export default ModeMeanu;
