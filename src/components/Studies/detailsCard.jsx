import React from "react";
import {
  Flex,
  Text,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  Tooltip,
  AccordionPanel,
  AccordionIcon,
  Box,
  useMediaQuery,
} from "@chakra-ui/react";

const DetailsCard = ({ cardTitle, details = [], ...restProps }) => {
  const [ifWidthLessthan1920] = useMediaQuery("(max-width:1920px)");
  return (
    <Accordion
      defaultIndex={[0, 1]}
      allowMultiple
      direction="column"
      pl="4px"
      pr="16px"
      pt="5px"
      pb="5px"
      {...restProps}
      fontFamily="Inter"
    >
      <AccordionItem border="none">
        <h2>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left" fontWeight={500}>
              {cardTitle}
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <VStack align="flex-start" mt="10px">
            {Object.keys(details).map((title) => (
              <Flex
                key={title}
                fontWeight="400"
                fontSize={ifWidthLessthan1920 ? "12px" : "14px"}
                lineHeight="17px"
                letterSpacing="0.0025em"
                w="100%"
                pb="8px"
                borderBottom="1px solid #DEDEDE"
              >
                <Text flex={1}>{title}:</Text>
                {title === "Title" ? (
                  <Tooltip placement="left" hasArrow label={details[title]}>
                    <Text textTransform="capitalize" flex={1} whiteSpace="initial" overflowWrap="break-word">
                      {details[title]}
                    </Text>
                  </Tooltip>
                ) : (
                  <Text textTransform="capitalize" flex={1} whiteSpace="initial">
                    {details[title]}
                  </Text>
                )}
              </Flex>
            ))}
          </VStack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default DetailsCard;