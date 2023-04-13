import React from 'react';
import { useState } from "react";
import { Box, IconButton, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton } from "@chakra-ui/react";
import { FaHome, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa'; // import your icon components


const SideBarMeanu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);

  const handleIconClick = (icon) => {
    setIsOpen(true);
    setSelectedIcon(icon);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedIcon(null);
  };
  return (
    <Box>
    <Box display="flex" justifyContent="flex-end">
      <IconButton icon={<FaHome />} onClick={() => handleIconClick("icon1")} />
      <IconButton icon={<FaHome />} onClick={() => handleIconClick("icon2")} />
      <IconButton icon={<FaHome />} onClick={() => handleIconClick("icon3")} />
      <IconButton icon={<FaHome />} onClick={() => handleIconClick("icon4")} />
    </Box>
    <Drawer isOpen={isOpen} placement="right" onClose={handleClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        {/* render your drawer content based on the selectedIcon */}
      </DrawerContent>
    </Drawer>
  </Box>
  );
};

export default SideBarMeanu;