import { Flex, Input, Radio, RadioGroup, Text, VStack } from "@chakra-ui/react";
import _ from "lodash";
import React from "react";

const SRHelper = ({ inputField, handleInput, synopticReportData }) => {
  return (
    <VStack alignItems="flex-start" minW="49%" mt="1vh">
      <Text fontWeight="600">{inputField.title}</Text>
      <Flex
        color="#8F8F8F"
        mt="-0rem !important"
        flexWrap="wrap"
        ml="-16px !important"
      >
        {inputField?.options ? (
          <RadioGroup
            pl="-16px"
            defaultValue={synopticReportData?.[inputField?.inputName]}
          >
            {inputField?.options?.map((option, i) => {
              return (
                <Radio
                  key={`${i + 1}`}
                  value={option}
                  ml="16px"
                  name={inputField?.inputName}
                  onChange={(e) => handleInput(e)}
                >
                  {option}
                </Radio>
              );
            })}
          </RadioGroup>
        ) : (
          <Input
            color="#000"
            ml="16px"
            size="sm"
            borderRadius="0"
            name={inputField?.inputName}
            defaultValue={
              synopticReportData?.[inputField?.inputName]
                ? synopticReportData?.[inputField?.inputName]
                : ""
            }
            // readOnly={synopticReportData?.[inputField?.inputName]}
            type={inputField?.type === "number" ? "number" : "text"}
            onWheel={(e) => e.target.blur()}
            onChange={handleInput}
          />
        )}
      </Flex>
    </VStack>
  );
};

export default SRHelper;
