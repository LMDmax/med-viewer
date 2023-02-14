import { Box, Stack, Text, VStack } from "@chakra-ui/react";
import _ from "lodash";
import React from "react";
import QuestionType from "./questionType";

const Questionnaire = ({
  direction,
  questions,
  slidetype,
  response,
  slideQna,
  setSlideQna,
  projectQnaType,
  ...restProps
}) => {
  const setQnaResponse = ({
    question_id = null,
    choice = null,
    choiceType = null,
  }) => {
    setSlideQna((state) => {
      const { qna } = state;
      const newQna = { ...qna, [question_id]: { question_id, choice } };
      return { qna: newQna };
    });
  };
  return (
    <VStack
      spacing={6}
      m="10px"
      mt="0px"
      align="flex-start"
      {...restProps}
      bgColor="#fff"
      h="100%"
      fontFamily="inter"
      fontSize="14px"
      px="10px"
    >
      {questions?.map((question, index) => (
        <Stack
          key={question?.question_id ? question?.question_id : index}
          direction={direction}
          spacing={4}
          mt="15px"
        >
          <Text
            // whiteSpace="nowrap"
            // fontSize="14px"
            color={question?.question_id === questions[1]?.question_id}
          >{`Q${index + 1}: ${question?.question_text}`}</Text>
          {response ? null : (
            <Box>
              <QuestionType
                question={question}
                direction={direction}
                response={response}
                setQnaResponse={setQnaResponse}
                projectQnaType={projectQnaType}
                slideQna={slideQna}
              />
            </Box>
          )}
          {response && (
            <Text>
              Response:{" "}
              {response[question?.question_id]
                ? response[question?.question_id]?.choice
                : response[index]?.choice}
            </Text>
          )}
        </Stack>
      ))}
    </VStack>
  );
};

export default Questionnaire;
