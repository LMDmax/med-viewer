import { HStack, VStack, Text, Icon, Box } from "@chakra-ui/react";
import React from "react";
import { RiCheckboxBlankFill } from "react-icons/ri";

const KeyPoints = ({ activityFeed }) => {
  return (
    <Box h="90vh" bg="#fcfcfc" pb="1.1vh">
      <Text pb="1.4523vh" fontSize="14px" py="1.1vh" bg="#fff" px="0.923vw">
        Key Points
      </Text>

      <Box mt="0.9vh">
        {activityFeed?.map((feed) => {
          return feed?.object ? (
            <VStack
              key={feed.object?.hash}
              alignItems="flex-start"
              fontSize="14px"
              bg="#fff"
              px="0.923vw"
            >
              <HStack
                borderBottom="1px solid #DEDEDE"
                py="0.1vh"
                alignItems="center"
              >
                {feed.object?.text ? (
                  <Icon as={RiCheckboxBlankFill} w="1vw" />
                ) : (
                  ""
                )}

                <Text>{feed.object?.text}</Text>
              </HStack>
            </VStack>
          ) : null;
        })}
      </Box>
    </Box>
  );
};

export default KeyPoints;
