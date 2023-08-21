import React from "react";
import _ from "lodash";
import { Box, Text, Flex } from "@chakra-ui/react";

function RadioType({ question, response, handleChange, application }) {
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
              <Flex alignItems="center">
                <input
                  type="radio"
                  name={question?.question_id}
                  value={choice}
                  checked={
                    !_.isEmpty(response)
                      ? response[question?.question_id]?.choiceId === choice
                      : question?.Question?.correctAnswer &&
                        question?.Question?.correctAnswer[0] === choice
                  }
                  onChange={(e) => {
                    handleChange({
                      questionId: question?.question_id,
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
          ))}
    </Box>
  );
}

export default RadioType;
