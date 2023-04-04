import React from "react";
import { Flex, Text, VStack } from "@chakra-ui/react";

const DetailsCard = ({ cardTitle, details = [], ...restProps }) => {

  // console.log(details);
  return (
    <Flex
      bg="#FFFFFF"
      direction="column"
      pl="18px"
      pr="16px"
      pt="12px"
      pb="18px"
      {...restProps}
    >
      <Text
        fontWeight="600"
        fontSize="14px"
        lineHeight="17px"
        letterSpacing="0.0025em"
      >
        {cardTitle}
      </Text>
      <VStack align="flex-start" mt="20px">
        {Object.keys(details).map((title) => (
          <Flex
            key={title}
            fontWeight="400"
            fontSize="14px"
            lineHeight="17px"
            letterSpacing="0.0025em"
            w="100%"
            pb="8px"
            borderBottom="1px solid #DEDEDE"
          >
            <Text flex={1}>{title}:</Text>
            <Text textTransform="capitalize" flex={1}>{details[title]}</Text>
          </Flex>
        ))}
      </VStack>
    </Flex>
  );
};

export default DetailsCard;
