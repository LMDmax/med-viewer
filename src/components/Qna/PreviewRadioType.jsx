import React from "react";
import _ from "lodash";
import { Box, Text, Flex } from "@chakra-ui/react";

function PreviewRadioType({
  question,
  selectedAnswers,
}) {
 

  const answersChoosed = selectedAnswers?.qnaArray.find(
    (answer) => answer?.questionId === question?.question_id
  );

  return (
    <Box w="100%">
      {question?.choices?.map((choice, index) => (
        <label key={index + 1}>
          <Flex alignItems="center" ml="40px">
            <input
              type="radio"
              name={question?.question_id}
              checked={answersChoosed?.choice[0] === choice}
              disabled={true}
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

export default PreviewRadioType;
