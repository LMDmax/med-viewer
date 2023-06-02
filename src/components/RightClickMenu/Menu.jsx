import React,{useEffect, useState} from "react";

import { ChevronRightIcon } from "@chakra-ui/icons";
import { useFabricOverlayState } from "../../state/store";

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Button,
  Portal,
  Flex,
  Text,
  Box,
  forwardRef,
} from "@chakra-ui/react";
import { getZoomValue } from "../../utility";

function DisplayMenu({ setZoom }) {
  return (
    <Menu closeOnSelect={true}>
      <MenuButton w="100%">
        <Flex justifyContent="space-between"  alignItems="center">
          <Text>Display</Text>
          <ChevronRightIcon />
        </Flex>
      </MenuButton>
      <Portal>
        <MenuList
          pos="relative"
          left="210px"
          bottom="39px"
          borderRadius={0}
          zIndex="199"
          p={0}
        >
          <MenuGroup title="Zoom level"  zIndex="199" fontWeight={400}>
            <MenuItem
              _hover={{ bgColor: "#DEDEDE" }}
              value="40"
              onClick={() => setZoom(40)}
            >
              40x
            </MenuItem>
            <MenuItem
              _hover={{ bgColor: "#DEDEDE" }}
              value="20"
              onClick={() => setZoom(20)}
            >
              20x
            </MenuItem>
            <MenuItem
              _hover={{ bgColor: "#DEDEDE" }}
              value="10"
              onClick={() => setZoom(10)}
            >
              10x
            </MenuItem>
            <MenuItem
              _hover={{ bgColor: "#DEDEDE" }}
              value="4"
              onClick={() => setZoom(4)}
            >
              4x
            </MenuItem>
            <MenuItem
              _hover={{ bgColor: "#DEDEDE" }}
              value="1"
              onClick={() => setZoom(1)}
            >
              1x
            </MenuItem>
          </MenuGroup>
        </MenuList>
      </Portal>
    </Menu>
  );
}

const SetTagMenu = forwardRef((props, ref) => (
  <Menu>
    <MenuButton ref={ref} {...props}>
      <Flex justifyContent="space-between" alignItems="center">
        <Text>Set Tag</Text>
        <ChevronRightIcon />
      </Flex>
    </MenuButton>
    <Portal>
      <MenuList
        pos="relative"
        left="222px"
        bottom="46px"
        borderRadius={0}
        bgColor="#FCFCFC"
        p={0}
      >
        <MenuOptionGroup fontWeight={400} type="checkbox">
          <MenuItemOption
            _hover={{ bgColor: "#DEDEDE" }}
            value="none"
            closeOnSelect={false}
          >
            None
          </MenuItemOption>
          <MenuItemOption
            _hover={{ bgColor: "#DEDEDE" }}
            value="tumor"
            closeOnSelect={false}
          >
            Tumor
          </MenuItemOption>
          <MenuItemOption
            _hover={{ bgColor: "#DEDEDE" }}
            value="stroma"
            closeOnSelect={false}
          >
            Stroma
          </MenuItemOption>
          <MenuItemOption
            _hover={{ bgColor: "#DEDEDE" }}
            value="immunecells"
            closeOnSelect={false}
          >
            Immune cells
          </MenuItemOption>
          <MenuItemOption
            _hover={{ bgColor: "#DEDEDE" }}
            value="necrosis"
            closeOnSelect={false}
          >
            Necrosis
          </MenuItemOption>
          <MenuItemOption
            _hover={{ bgColor: "#DEDEDE" }}
            value="other"
            closeOnSelect={false}
          >
            Other
          </MenuItemOption>
          <MenuItemOption
            _hover={{ bgColor: "#DEDEDE" }}
            value="addnewtags"
            closeOnSelect={false}
          >
            Add new Tags
          </MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Portal>
  </Menu>
));

export function CustomMenu({
  isMenuOpen,
  closeMenu,
  left,
  top,
  setZoom,
  viewer,
  enableAI,
  viewerId,
  runKI67,
  setModelname,
  onHandleVhutAnalysis,
  slide,
  onHandleShowAnalysis,
  isMorphometryDisabled,
  isAnalysed,
  handleDeleteAnnotation,
  isAnnotationSelected,
  handleEditOpen,
  handleAnnotationChat,
  application,
  isKI67Analysed,
}) {
  const value = getZoomValue(viewer);
  // console.log(isAnnotationSelected?.isClosed);
  return isMenuOpen ? (
    <Box>
      <Menu isOpen={isMenuOpen}>
        <MenuButton
          as={Button}
          pos="absolute"
          left={left}
          top={top}
          w={0}
          h={0}
        />

        <MenuList
          borderRadius={0}
          bgColor="#FCFCFC"
          p={0}
          zIndex="99"
          boxShadow="0px 2px 4px rgba(0, 0, 0, 0.15)"
        >
          <MenuItem _hover={{ bgColor: "#DEDEDE" }}>
            <DisplayMenu setZoom={setZoom} />
          </MenuItem>
          {enableAI && slide?.stainType !== "IHC" || application === "education" ? (
            <MenuItem
              _hover={{ bgColor: "#DEDEDE" }}
              onClick={() => {
                setModelname("Morphometry");
                // console.log("ki67 not runnnnn");
                closeMenu();
              }}
              closeOnSelect
              isDisabled={isMorphometryDisabled || slide?.stainType === "IHC" || value <39 || !isAnnotationSelected?.isClosed}
            >
              Run Morphometry
            </MenuItem>
          ) : null}
          {enableAI && slide?.stainType === "IHC" && slide.bioMarkerType==="kI67" || application === "education" ? (
            !isKI67Analysed ? (
              <MenuItem
                _hover={{ bgColor: "#DEDEDE" }}
                onClick={() => {
                  // runKI67();
                setModelname("KI67");
                  // console.log("ki67 runnnnn");
                  closeMenu();
                }}
                closeOnSelect
                isDisabled={isMorphometryDisabled || value <39 || !isAnnotationSelected?.isClosed}
              >
                Run KI-67
              </MenuItem>
            ) : (
              <MenuItem
                _hover={{ bgColor: "transparent" }}
                disabled={true}
                style={{ cursor: isAnalysed ? "not-allowed" : "default" }}
                closeOnSelect
                color="gray.500"
              >
                KI-67 Analysed
              </MenuItem>
            )
          ) : null}
          <MenuItem
            _hover={{ bgColor: "#DEDEDE" }}
            onClick={handleEditOpen}
            isDisabled={!isAnnotationSelected}
          >
            Edit
          </MenuItem>
          {application === "hospital" && (
            <MenuItem
              _hover={{ bgColor: "#DEDEDE" }}
              onClick={handleAnnotationChat}
              isDisabled={!isAnnotationSelected}
            >
              Create Query
            </MenuItem>
          )}
          <MenuDivider />

          {/* <MenuItem
            _hover={{ bgColor: "#DEDEDE" }}
            onClick={() => setIsOpen(false)}
            isDisabled={!isAnnotationSelected}
          >
            Lock
          </MenuItem> */}
          <MenuItem
            _hover={{ bgColor: "#DEDEDE" }}
            onClick={handleDeleteAnnotation}
            isDisabled={!isAnnotationSelected}
          >
            Delete
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  ) : null;
}
