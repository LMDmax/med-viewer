import React from "react";
import {
  IconButton,
  Tooltip,
  useMediaQuery,
  Flex,
  Box,
  Text,
} from "@chakra-ui/react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };
  return (
    <Box
      w="60px"
      h="100%"
      ml="10px"
      bg={""}
      cursor="pointer"
      onClick={() => {
        handleClick();
      }}
    >
      <Flex
        direction="column"
        mt={ifScreenlessthan1536px ? "1px" : "-2px"}
        justifyContent="center"
        alignItems="center"
        h="100%"
      >
        <IconButton
          height={ifScreenlessthan1536px ? "50%" : "50%"}
          width={ifScreenlessthan1536px ? "100%" : "100%"}
          // border="2px solid red"
          _hover={{ bgColor: "transparent" }}
          icon={<IoIosArrowBack transform="scale(1.2)" color="black" />}
          _active={{
            bgColor: "transparent",
            outline: "none",
          }}
          backgroundColor="transparent"
          borderRadius={0}
        />
        <Text align="center" fontFamily="inter" fontSize="13px" color="black">
          Back
        </Text>
      </Flex>
    </Box>
  );
};

export default Cancel;
