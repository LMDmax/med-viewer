import { Flex, Input, Radio, RadioGroup, Text, Box } from "@chakra-ui/react";
import _ from "lodash";
import React from "react";

const SRHelper = ({ inputField, handleInput, synopticReportData }) => {
  const isReportFound =
    synopticReportData.message === "Report successfully found";

  return (
    <Flex
      alignItems="flex-start"
      minW="54%"
      overflow="hidden"
      overflowX="auto"
      flexDirection="column"
      mt="1vh"
    >
      <Text fontWeight="600" maxW="200px">
        {inputField.title}
      </Text>
      <Flex
        color="#8F8F8F"
        w="340px"
        overflowX="auto"
        mt="12px !important"
        // ml="-16px !important"
        direction="column"
      >
        {inputField?.options ? (
          isReportFound ? (
            <Text
              ml="10px"
              wordBreak="break-word"
              whiteSpace="pre-wrap"
              maxWidth="100%"
              overflowWrap="break-word"
              cursor="default"
              color="black"
            >
              {synopticReportData?.data?.[inputField?.inputName] !== ""
                ? synopticReportData?.data?.[inputField?.inputName]
                : "No Response"}
            </Text>
          ) : (
            <RadioGroup
              pl="-16px"
              // border="1px solid red"
              defaultValue={synopticReportData.data?.[inputField?.inputName]}
              style={{
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
                alignItems: "flex-start",
              }}
            >
              {inputField?.options?.map((option, i) => {
                return (
                  <label>
                    <Flex alignItems="center">
                      <input
                        type="radio"
                        key={`${i + 1}`}
                        value={option}
                        style={{ marginLeft: "16px" }}
                        name={inputField?.inputName}
                        onChange={(e) => handleInput(e)}
                      />
                      <Text
                        ml="10px"
                        wordBreak="break-word"
                        whiteSpace="pre-wrap"
                        maxWidth="100%"
                        overflowWrap="break-word"
                        cursor="pointer"
                        color="black"
                      >
                        {option}
                      </Text>
                    </Flex>
                  </label>
                );
              })}
            </RadioGroup>
          )
        ) : (
          <Box w="300px">
            <Input
              color="#000"
              w="100%"
              size="sm"
              ml="25px"
              borderRadius="0"
              name={inputField?.inputName}
              defaultValue={
                synopticReportData?.data?.[inputField?.inputName]
                  ? synopticReportData?.data?.[inputField?.inputName]
                  : ""
              }
              // readOnly={synopticReportData?.[inputField?.inputName]}
              type={inputField?.type === "number" ? "number" : "text"}
              onWheel={(e) => e.target.blur()}
              onChange={handleInput}
              disabled={
                synopticReportData.message === "Report successfully found"
              }
            />
          </Box>
        )}
      </Flex>
    </Flex>
  );
};

export default SRHelper;
