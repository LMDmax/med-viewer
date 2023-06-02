import {
  Flex,
  IconButton,
  Menu,
  Text,
  MenuButton,
  Box,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { BiDotsVertical } from "react-icons/bi";
import { AiOutlineLink, AiOutlineCloseCircle } from "react-icons/ai";
import { useFabricOverlayState } from "../../state/store";
import ChangeSlide from "../Case/changeSlide";
import {
  removeViewerWindow,
  toggleSync,
} from "../../state/actions/fabricOverlayActions";

const MenuItemCustom = ({ title, ...restProps }) => (
  <MenuItem _hover={{ background: "#DEDEDE" }} py="12px" {...restProps}>
    {title}
  </MenuItem>
);

const ViewerHeader = ({
  caseInfo,
  slides,
  slideName2,
  viewerId,
  slide,
  slideName,
  slideUrl,
  setCurrentViewer,
}) => {
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { viewerWindow, sync } = fabricOverlayState;
  var vKeys = Object.keys(viewerWindow);

  const handleClose = () => {
    const vKeys = Object.keys(viewerWindow);
    if (viewerId === vKeys[0]) {
      setCurrentViewer(vKeys[1]);
    }
    if (sync) setFabricOverlayState(toggleSync());
    setFabricOverlayState(removeViewerWindow({ id: viewerId }));
  };

  const handleSync = () => {
    setFabricOverlayState(toggleSync());
  };

  return (
    <Flex
      align="center"
      py="1px"
      justify="space-between"
      // zIndex="2"
    >
      <ChangeSlide
        caseInfo={caseInfo}
        slides={slides}
        slideName={slideName}
        viewerId={viewerId}
        slideName2={slideName2}
        slideUrl={slideUrl}
      />

      <Flex w="100%" justifyContent="center" alignItems="center">
        {viewerId === vKeys[0] && <Text color="gray">Current Viewer</Text>}
      </Flex>
      <Box>
        <Menu placement="bottom-end" autoSelect={false}>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<BiDotsVertical />}
            variant="unstyled"
            _focus={{ border: "none" }}
            mr="85px"
          />

          <MenuList
            fontWeight="400"
            fontSize="14px"
            lineHeight="17px"
            letterSpacing="0.005em"
            fontFamily="Inter"
            borderRadius={0}
            py={0}
          >
            <MenuItemCustom
              title={sync ? "Detach" : "Link to second WSI"}
              icon={<AiOutlineLink size={18} color="#212224" />}
              onClick={handleSync}
            />
            <MenuItemCustom
              title="Close"
              icon={<AiOutlineCloseCircle size={18} color="#212224" />}
              onClick={handleClose}
            />
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );
};

export default ViewerHeader;
