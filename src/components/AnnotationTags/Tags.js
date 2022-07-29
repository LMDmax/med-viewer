import React, { useState } from "react";
import { BiTag } from "react-icons/bi";
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
} from "@chakra-ui/react";
import { TagIcon } from "../Icons/CustomIcons";

const Tags = () => {
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const [isOpen, setIsOpen] = useState(false);
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
        <MenuItem
          _hover={{ bgColor: "#DEDEDE" }}
          _active={{
            bgColor: "#DEDEDE",
          }}
          alignItems="center"
        >
          <HStack>
            <Box h="20px" w="20px" bgColor="#C80000" />
            <Text>Tumor</Text>
          </HStack>
        </MenuItem>
        <MenuItem
          _hover={{ bgColor: "#DEDEDE" }}
          _active={{
            bgColor: "#DEDEDE",
          }}
        >
          <HStack>
            <Box h="20px" w="20px" bgColor="#96C896" />
            <Text>Stroma</Text>
          </HStack>
        </MenuItem>{" "}
        <MenuItem
          _hover={{ bgColor: "#DEDEDE" }}
          _active={{
            bgColor: "#DEDEDE",
          }}
        >
          <HStack>
            <Box h="20px" w="20px" bgColor="#A05AA0" />
            <Text>Immune Cells</Text>
          </HStack>
        </MenuItem>{" "}
        <MenuItem
          _hover={{ bgColor: "#DEDEDE" }}
          _active={{
            bgColor: "#DEDEDE",
          }}
        >
          <HStack>
            <Box h="20px" w="20px" bgColor="#323232" />
            <Text>Necrosis</Text>
          </HStack>
        </MenuItem>
        <MenuItem
          _hover={{ bgColor: "#DEDEDE" }}
          _active={{
            bgColor: "#DEDEDE",
          }}
        >
          <HStack>
            <Box h="20px" w="20px" bgColor="#FFC800" />
            <Text>Other</Text>
          </HStack>
        </MenuItem>
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
