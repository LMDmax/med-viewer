import React, { useEffect, useState } from "react";
import _ from "lodash";
import { Box, Text, Flex } from "@chakra-ui/react";

function RadioType({
  question,
  response,
  handleChange,
  application,
  slideQna,
  clinicalResponse,
}) {
  const [selectedChoice, setSelectedChoice] = useState(clinicalResponse);

  // Update the selected choice when the clinicalResponse changes

  const handleRadioChange = (choice, questionSelected) => {
    setSelectedChoice(choice);
    console.log(choice);
    handleChange({
      questionId: questionSelected?.question_id,
      choice,
    });
  };

  const cleanedClinicalResponse = clinicalResponse
    ?.replace(/[{"]+/g, "")
    ?.replace(/[}"]+/g, "");

  console.log({ cleanedClinicalResponse });
  // console.log({ selectedChoice });

  useEffect(() => {
    if (cleanedClinicalResponse !== undefined) {
      handleChange({
        questionId: question?.question_id,
        choice: cleanedClinicalResponse,
      });
    }
  }, [cleanedClinicalResponse]);

  return (
    <Box w="100%">
      {application === "education"
        ? question?.Question?.choices?.map((choice, index) => (
            <label key={index + 1}>
              <Flex alignItems="center">
                <input
                  type="radio"
                  name={question?.Question?.id}
                  value={choice}
                  checked={
                    !_.isEmpty(response)
                      ? response[question?.Question?.id]?.choiceId === choice
                      : question?.Question?.correctAnswer &&
                        question?.Question?.correctAnswer[0] === choice
                  }
                  onChange={(e) => {
                    handleChange({
                      questionId: question?.Question?.id,
                      choice: e.target.value,
                    });
                  }}
                  disabled={
                    !_.isEmpty(response) || question?.Question?.correctAnswer
                  }
                />
                <Text
                  ml="10px"
                  wordBreak="break-word"
                  whiteSpace="pre-wrap"
                  maxWidth="100%"
                  overflowWrap="break-word"
                  cursor="pointer"
                >
                  {choice}
                </Text>
              </Flex>
            </label>
          ))
        : question?.choices?.map((choice, index) => (
            <label key={index + 1}>
              <Flex alignItems="center" ml="40px">
                <input
                  type="radio"
                  name={question?.question_id}
                  value={choice}
                  onChange={(e) => {
                    console.log("assas");
                    handleChange({
                      questionId: question?.question_id,
                      choice: e.target.value,
                    });
                    setSelectedChoice(choice);
                  }}
                  checked={
                    selectedChoice === undefined
                      ? cleanedClinicalResponse === choice
                      : selectedChoice === choice
                  }
                />
                <Text
                  ml="10px"
                  wordBreak="break-word"
                  whiteSpace="pre-wrap"
                  maxWidth="100%"
                  overflowWrap="break-word"
                  cursor="pointer"
                >
                  {choice}
                </Text>
              </Flex>
            </label>
          ))}
    </Box>
  );
}

export default RadioType;
