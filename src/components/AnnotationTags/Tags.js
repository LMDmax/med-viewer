import React, { useState } from "react";
import { BiTag } from "react-icons/bi";
import { SwatchesPicker } from "react-color";
import {
  Button,
  Menu,
  MenuList,
  MenuItem,
  Text,
  Tooltip,
  IconButton,
  useMediaQuery,
  Portal,
  MenuButton,
  HStack,
  Box,
  Flex,
  Input,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { TagIcon } from "../Icons/CustomIcons";

const DisplayMenu = ({ tagName, tagColour, tags, setTags }) => {
  const [subMenu, setSubMenu] = useState(false);
  return (
    <Menu closeOnSelect={false} isOpen={subMenu}>
      <MenuButton w="100%" onClick={() => setSubMenu(!subMenu)}>
        <HStack>
          <Box h="20px" w="20px" bgColor={tagColour} />
          <Text>{tagName}</Text>
        </HStack>
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
          <MenuItem bgColor="#FFFFFF" _hover={{ bgColor: "#FFFFFF" }} p={0}>
            <Box w={300} h={192}>
              <Flex
                bgColor="#F6F6F6"
                w="100%"
                h={42}
                paddingStart={5}
                alignItems="center"
              >
                Edit
              </Flex>
              <HStack paddingStart={5} paddingTop={5}>
                <Menu>
                  <MenuButton
                    as={Button}
                    w={151}
                    h={42}
                    alignItems="center"
                    bgColor="#F6F6F6"
                    rightIcon={<ChevronDownIcon />}
                    borderRadius={0}
                    _focus={{
                      border: "none",
                    }}
                    _active={{ bgColor: "#F6F6F6" }}
                  >
                    <HStack justifyContent="center">
                      <Box h="20px" w="20px" bgColor={tagColour} />
                      <Text fontSize={14} fontWeight={400}>
                        {tagColour}
                      </Text>
                    </HStack>
                  </MenuButton>
                  <Portal>
                    <MenuList>
                      <MenuItem closeOnSelect={false} p={0} borderRadius={0}>
                        <SwatchesPicker />
                      </MenuItem>
                    </MenuList>
                  </Portal>
                </Menu>
                <Input
                  w={100}
                  borderRadius={0}
                  placeholder={tagName}
                  onClick={(e) => e.stopPropagation()}
                  padding={1}
                />
              </HStack>
              <HStack paddingStart={16} paddingTop={8} spacing={5}>
                <Button
                  borderRadius={0}
                  bgColor="#F6F6F6"
                  _focus={{ outline: "none" }}
                  border="1px solid #2D3047"
                  _hover={{ bgColor: "#F6F6F6" }}
                  fontWeight={400}
                  w={100}
                >
                  Cancel
                </Button>
                <Button
                  borderRadius={0}
                  bgColor="#F6F6F6"
                  _focus={{ outline: "none" }}
                  border="1px solid #2D3047"
                  _hover={{ bgColor: "#F6F6F6" }}
                  fontWeight={400}
                  w={100}
                >
                  Okay
                </Button>
              </HStack>
            </Box>
          </MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  );
};

const Tags = () => {
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const [isOpen, setIsOpen] = useState(false);
  const tags = [
    {
      tag: "Tumor",
      colour: "#C80000",
    },
    {
      tag: "Stroma",
      colour: "#96C896",
    },
    {
      tag: "Immune Cells",
      colour: "#A05AA0",
    },
    {
      tag: "Necrosis",
      colour: "#323232",
    },
    {
      tag: "Other",
      colour: "#FFC800",
    },
  ];
  const [definedTags, setDefinedTags] = useState(tags);
  return (
    <Menu isOpen={isOpen}>
      <Tooltip
        label="Tag Annotations"
        aria-label="Tag Annotations"
        placement="bottom"
        openDelay={0}
        bg="#E4E5E8"
        color="rgba(89, 89, 89, 1)"
        fontSize="14px"
        fontFamily="inter"
        hasArrow
        borderRadius="0px"
        size="20px"
      >
        <MenuButton
          as={IconButton}
          width={ifScreenlessthan1536px ? "30px" : "40px"}
          height={ifScreenlessthan1536px ? "26px" : "34px"}
          _active={{
            bgColor: "rgba(228, 229, 232, 1)",
            outline: "0.5px solid rgba(0, 21, 63, 1)",
          }}
          _focus={{
            border: "none",
          }}
          icon={
            isOpen ? (
              <TagIcon />
            ) : (
              <BiTag style={{ transform: "rotate(180deg)" }} />
            )
          }
          mr="7px"
          borderRadius={0}
          backgroundColor={isOpen ? "#E4E5E8" : "#F8F8F5"}
          outline={isOpen ? " 0.5px solid rgba(0, 21, 63, 1)" : ""}
          label="Annotations"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          boxShadow={
            isOpen
              ? "inset -2px -2px 2px rgba(0, 0, 0, 0.1), inset 2px 2px 2px rgba(0, 0, 0, 0.1)"
              : null
          }
          _hover={{ bgColor: "rgba(228, 229, 232, 1)" }}
        />
      </Tooltip>
      <MenuList
        borderRadius={0}
        bgColor="#FCFCFC"
        p={0}
        boxShadow="0px 2px 4px rgba(0, 0, 0, 0.15)"
      >
        {tags.map((tagItem) => {
          return (
            <MenuItem
              _hover={{ bgColor: "#DEDEDE" }}
              _active={{
                bgColor: "#DEDEDE",
              }}
              alignItems="center"
            >
              <DisplayMenu
                tagName={tagItem.tag}
                tagColour={tagItem.colour}
                tags={definedTags}
                setTags={setDefinedTags}
              />
            </MenuItem>
          );
        })}
        <MenuItem
          _hover={{ bgColor: "#DEDEDE" }}
          _active={{
            bgColor: "#DEDEDE",
          }}
        >
          +Add new Tags
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default Tags;
