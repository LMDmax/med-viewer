import React from "react";
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
import { ChevronRightIcon } from "@chakra-ui/icons";

const DisplayMenu = ({ setZoom }) => (
  <Menu closeOnSelect={false}>
    <MenuButton w="100%">
      <Flex justifyContent="space-between" alignItems="center">
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
        bgColor="#FCFCFC"
        p={0}
      >
        <MenuGroup title="Zoom level" fontWeight={400}>
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

export const CustomMenu = ({
  isMenuOpen,
  closeMenu,
  left,
  top,
  setZoom,
  onHandleVhutAnalysis,
  onHandleShowAnalysis,
  isMorphometryDisabled,
  isAnalysed,
  handleDeleteAnnotation,
  isAnnotationSelected,
  handleEditOpen,
}) => {
  return isMenuOpen ? (
    <Box>
      <Menu isOpen={isMenuOpen} onClose={closeMenu}>
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
          boxShadow="0px 2px 4px rgba(0, 0, 0, 0.15)"
        >
          <MenuItem _hover={{ bgColor: "#DEDEDE" }}>
            <DisplayMenu setZoom={setZoom} />
          </MenuItem>
          {!isAnalysed ? (
            <MenuItem
              _hover={{ bgColor: "#DEDEDE" }}
              onClick={() => {
                onHandleVhutAnalysis();
                closeMenu();
              }}
              closeOnSelect
              isDisabled={isMorphometryDisabled}
            >
              Run Morphometry
            </MenuItem>
          ) : (
            <MenuItem
              _hover={{ bgColor: "#DEDEDE" }}
              onClick={() => {
                onHandleShowAnalysis();
                closeMenu();
              }}
              closeOnSelect
            >
              Show Analysis
            </MenuItem>
          )}
          <MenuItem
            _hover={{ bgColor: "#DEDEDE" }}
            onClick={handleEditOpen}
            isDisabled={!isAnnotationSelected}
          >
            Edit
          </MenuItem>
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
};
