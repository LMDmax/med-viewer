import React, { useEffect, useRef } from "react";

import { Box, Flex, Image, Stack, Text, VStack } from "@chakra-ui/react";
import _ from "lodash";

import QuestionType from "./questionType";

function Questionnaire({
  direction,
  questions,
  slidetype,
  response,
  slideQna,
  setSlideQna,
  projectQnaType,
  questionIndex,
  showResponseRefetch,
  slideId,
  application,
  ...restProps
}) {
  const scrollRef = useRef(questionIndex);
  const setQnaResponse = ({ questionId = null, choice = null, choiceType }) => {
    setSlideQna((state) => {
      const { qna } = state;
      const newQna = { ...qna, [questionId]: { questionId, choice } };
      return { qna: newQna };
    });
  };

  const toRoman = (num) => {
    const romanNumerals = [
      "i",
      "ii",
      "iii",
      "iv",
      "v",
      "vi",
      "vii",
      "viii",
      "ix",
      "x",
      "xi",
      "xii",
      "xiii",
      "xiv",
      "xv",
      "xvi",
      "xvii",
      "xviii",
      "xix",
      "xx",
    ];
    return romanNumerals[num] || num;
  };

  useEffect(() => {
    if (questionIndex >= 0) {
      scrollRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, [questionIndex]);
  const responsesToSubmit = Object.values(slideQna?.qna);
  // console.log("RESPONSE", response)
  return (
    <VStack
      spacing={6}
      m="10px"
      mt="0px"
      align="flex-start"
      {...restProps}
      bgColor="#fcfcfc"
      overflowY="scroll"
      h="80%"
      w="100%"
      fontFamily="inter"
      fontSize="14px"
      px="10px"
    >
      {application === "education"
        ? questions &&
          questions[0]?.LessonQuestions?.map((question, index) => {
            return (
              <Stack
                key={index}
                direction={direction}
                spacing={4}
                mt="15px"
                ref={scrollRef}
                w="100%"
                maxW="100%"
                pb="10px"
              >
                <Text
                  wordBreak="break-word"
                  whiteSpace="pre-wrap"
                  maxWidth="100%"
                  overflowWrap="break-word"
                >
                  <span
                  // style={{
                  // 	border: index === questionIndex && "1px solid #000",
                  // 	padding: index === questionIndex && "0.3rem 1rem",
                  // 	borderRadius: index === questionIndex && "0% 50% 50% 0%",
                  // }}
                  >{`Q ${index + 1}:`}</span>
                  {` ${question?.Question?.questionText}`}
                </Text>
                {question?.Question?.referenceToSlides[0]?.slideData && (
                  <Flex
                    w="100%"
                    maxW="100%"
                    justifyContent="flex-end"
                    mt="-0.5rem !important"
                  >
                    {question?.Question?.referenceToSlides[0]?.slideData
                      ?.toString()
                      ?.slice(
                        1,
                        question?.Question?.referenceToSlides[0]?.slideData?.lastIndexOf(
                          "-"
                        ) - 1
                      ) === slideId ? (
                      <Text
                        wordBreak="break-word"
                        whiteSpace="pre-wrap"
                        maxWidth="80%"
                        overflowWrap="break-word"
                        color="#3B5D7C"
                      >
                        Related to this slide
                      </Text>
                    ) : (
                      <Text
                        wordBreak="break-word"
                        whiteSpace="pre-wrap"
                        maxWidth="100%"
                        overflowWrap="break-word"
                        color="#3B5D7C"
                      >
                        {`Refer to slide ${question?.Question?.referenceToSlides[0]?.slideData
                          ?.toString()
                          ?.substring(
                            question?.Question?.referenceToSlides[0]?.slideData?.lastIndexOf(
                              "-"
                            ) + 1
                          )}`}
                      </Text>
                    )}
                  </Flex>
                )}
                {response ? null : (
                  <Box>
                    <QuestionType
                      question={question}
                      direction={direction}
                      response={response}
                      application={application}
                      setQnaResponse={setQnaResponse}
                      projectQnaType={projectQnaType}
                      slideQna={slideQna}
                    />
                  </Box>
                )}
                {response && (
                  <Text>
                    Your response:{" "}
                    {response?.responses[index + 1]?.response
                      ? response?.responses[index + 1]?.response
                      : "-"}
                  </Text>
                )}
              </Stack>
            );
          })
        : questions &&
          questions?.data?.desiredQuestionsInfo?.map((question, index) => {
            const questionResponse = response
              ? response.finalQuestionnaireResponse[index]
              : null;

            return (
              <Stack
                key={index}
                direction={direction}
                spacing={4}
                mt="10px"
                ref={scrollRef}
                w="100%"
                maxW="100%"
                // pb="10px"
                display={
                  questionResponse
                    ? "block"
                    : question?.question_link_id &&
                      !responsesToSubmit?.find(
                        (element) =>
                          element?.questionId === question?.question_link_id &&
                          element?.choice?.includes(question?.conditional_value)
                      )
                    ? "none"
                    : "block"
                }
              >
                {question?.is_section && <Text fontWeight="600">Section</Text>}
                <Text
                  wordBreak="break-word"
                  whiteSpace="pre-wrap"
                  maxWidth="100%"
                  overflowWrap="break-word"
                >
                  <span style={{ fontWeight: "bold" }}>{`Q ${index + 1}`}</span>
                  {`     ${
                    question?.question_text
                      ? question?.question_text
                      : question?.section_heading
                  }`}
                </Text>
                {question?.is_section ? (
                  question?.section_questions?.map((sectionQuestion, i) => {
                    return (
                      <Box px="0.6rem">
                        <Text
                          wordBreak="break-word"
                          whiteSpace="pre-wrap"
                          maxWidth="100%"
                          overflowWrap="break-word"
                          mb="0.2rem"
                          // border="1px solid red"
                          ml="34px"
                        >
                          {`Q ${toRoman(i)}   ${sectionQuestion?.question_text}`}
                        </Text>
                        {!questionResponse ? (
                          <QuestionType
                            question={sectionQuestion}
                            direction={direction}
                            application={application}
                            response={response}
                            setQnaResponse={setQnaResponse}
                            projectQnaType={projectQnaType}
                            slideQna={slideQna}
                          />
                        ) : (
                          <Text>
                            {`Your response:
                    ${
                      questionResponse?.section_questions[i]?.response
                        ?.replace(/[{"]+/g, "")
                        ?.replace(/[}"]+/g, "") || "-"
                    }`}
                          </Text>
                        )}
                      </Box>
                    );
                  })
                ) : !questionResponse ? (
                  <Box>
                    <QuestionType
                      question={question}
                      direction={direction}
                      application={application}
                      response={response}
                      setQnaResponse={setQnaResponse}
                      projectQnaType={projectQnaType}
                      slideQna={slideQna}
                    />
                  </Box>
                ) : (
                  <Text>
                    Your response:{" "}
                    {questionResponse?.response
                      ?.replace(/[{"]+/g, "")
                      ?.replace(/[}"]+/g, "") || "-"}
                  </Text>
                )}
              </Stack>
            );
          })}
      {application === "clinical" && response?.signature_file && (
        <Flex direction="column">
          <Image w="11vw" h="10vh" src={response?.signature_file} />
          <Text color="#3B5D7C">{`${response?.first_name} ${response?.last_name}`}</Text>
          <Text>{response?.highest_qualification}</Text>
          <Text>{response?.Institute}</Text>
        </Flex>
      )}
      {/* {questions[0].LessonQuestions?.map((question, index) => (
				
				
			))} */}
    </VStack>
  );
}

export default Questionnaire;
