import React, { useEffect, useRef, useState } from "react";

import {
  Box,
  Flex,
  Image,
  Stack,
  Text,
  VStack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  background,
} from "@chakra-ui/react";
import _ from "lodash";

import QuestionType from "./questionType";
import { changeTile } from "../../state/actions/fabricOverlayActions";
import { useFabricOverlayState } from "../../state/store";

function Questionnaire({
  direction,
  questions,
  response,
  slideQna,
  setSlideQna,
  projectQnaType,
  questionIndex,
  showResponseRefetch,
  application,
  slideInfo,
  userInfo,
  submitQnaReport,
  setChangeSlide,
  viewerId,
  slideId,
  slideName,
  caseInfo,
  slides,
  All_Reader_Responses,
  ...restProps
}) {
  const [isPreviewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { viewerWindow, isAnnotationLoading } = fabricOverlayState;
  // const { viewer, fabricOverlay, slideType } = viewerWindow[viewerId];
  // const { viewer, fabricOverlay, slideId } = viewerWindow[viewerId];

  const current_slide = slides.find((slide) => slide._id === slideId);

  // console.log({ current_slide });
  // console.log({ slideInfo });
  // console.log({ slideId });

  const handlePreviewModalClose = () => {
    setPreviewModalOpen(false);
  };
  const scrollRef = useRef(questionIndex);
  const setQnaResponse = ({
    questionId = null,
    choice = null,
    questionText,
  }) => {
    const questionArray = questions?.data?.[current_slide?.slideType];
    // console.log({ questionArray });

    const isLinked = questionArray.some((elem) => elem.question_link_id);
    // console.log({ isLinked });

    setSlideQna((state) => {
      // console.log(question);
      const { qna } = state;
      const newQna = {
        ...qna,
        [questionId]: { questionId, choice, questionText },
      };

      setSlideQna((state) => {
        const { qna } = state;
        const newQna = {
          ...qna,
          [questionId]: { questionId, choice, questionText },
        };

        // Check if the specified questionId exists in questionArray[3]
        const masterQuestionId = questionArray[2]?.question_id;

        if (isLinked) {
          if (
            masterQuestionId &&
            newQna[masterQuestionId] &&
            newQna[masterQuestionId].choice[0] === "No"
          ) {
            // If the choice is "No," delete all question IDs from newQna
            questionArray[5]?.section_questions?.forEach((sectionQuestion) => {
              delete newQna[sectionQuestion.question_id];
            });
          }
          if (
            masterQuestionId &&
            newQna[masterQuestionId] &&
            newQna[masterQuestionId].choice[0] === "Yes"
          ) {
            // If the choice is "No," delete all question IDs from newQna
            delete newQna[questionArray[3]?.question_id];
            delete newQna[questionArray[4]?.question_id];
          }
        }

        const qnaArray = Object.values(newQna);

        setSelectedAnswers({ qnaArray: qnaArray });
        return { qna: newQna };
      });
      const qnaArray = Object.values(newQna);

      setSelectedAnswers({ qnaArray: qnaArray });
      return { qna: newQna };
    });
  };

  // console.log({ selectedAnswers });
  // console.log("asd", Object.keys(selectedAnswers).length === 0);

  useEffect(() => {
    setSelectedAnswers({});
  }, [slideId]);

  const changeSlide = () => {
    submitQnaReport();
    if (application === "clinical" && caseInfo?.slides?.length > 1) {
      // console.log("aaa");
      const totalSlides = caseInfo?.slides;
      const currentSlideId = slideId;

      // Find the index of the current slideId in the array
      const currentIndex = totalSlides.findIndex(
        (s) => s._id === currentSlideId
      );

      // Log the current slide object
      // console.log(totalSlides[currentIndex]);
      // Update the index for the next click
      const nextIndex = (currentIndex + 1) % totalSlides.length;

      // Check if the next index is 0 (last element)
      if (nextIndex === 0) {
        // Log all elements
        // console.log("1");
        // totalSlides.forEach((slide) => console.log("All Reached"));
      } else {
        // Update the slideId with the next slide's _id
        // Set the next slideId in your state or wherever you are storing it
        // Assuming you have a function to set the slideId, for example:
        // submitQnaReport();
        setChangeSlide(true);
      }
    }
    // submitQnaReport();
  };

  const questionResponse = response
    ? response.finalQuestionnaireResponse[0]
    : null;

  // console.log({ userInfo});
  // console.log({ slideQna });

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
  // console.log({ slideName });
  // console.log({ slideInfo });
  // console.log({ All_Reader_Responses });

  const currentSlide = slides.find((slide) => slide?._id === slideId);
  // console.log({ response });
  return (
    <VStack
      spacing={6}
      // m="10px"
      mt="0px"
      align="flex-start"
      {...restProps}
      bgColor="#fcfcfc"
      overflowY="scroll"
      // pb="120px"
      // border="2px solid red"
      h="80%"
      w="100%"
      fontFamily="inter"
      fontSize="14px"
      px="10px"
    >
      {application === "education" ? (
        questions &&
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
      ) : userInfo?.data[0].role === "PI" &&
        All_Reader_Responses?.data?.finalResponseArray.length > 0 ? (
        <Box w="100%" px="5px">
          {All_Reader_Responses?.data?.finalResponseArray.map((elem, index) => {
            console.log({ All_Reader_Responses });
            return (
              <Box w="100%" maxW="100%" h="auto" mb="30px">
                <Flex
                  w="100%"
                  justifyContent="flex-start"
                  alignItems="center"
                  borderTop="3px solid #DEDEDE"
                  borderRight="3px solid #DEDEDE"
                  borderLeft="3px solid #DEDEDE"
                  h="50px"
                >
                  <Box w="100%" mx="10px">
                    <Text
                      wordBreak="break-word"
                      whiteSpace="pre-wrap"
                      maxWidth="100%"
                      overflowWrap="break-word"
                    >
                      {" "}
                      Accession ID: {currentSlide.accessionId}
                    </Text>
                  </Box>
                </Flex>
                <Flex
                  w="100%"
                  justifyContent="flex-start"
                  alignItems="center"
                  border="3px solid #DEDEDE"
                  h="50px"
                  mb="20px"
                >
                  <Box w="100%" mx="10px">
                    <Text
                      wordBreak="break-word"
                      whiteSpace="pre-wrap"
                      maxWidth="100%"
                      overflowWrap="break-word"
                    >
                      Reader : Dr. {elem?.first_name} {elem?.last_name}
                    </Text>
                  </Box>
                </Flex>

                {elem.reportsResponses.some(
                  (response) =>
                    response.accession_id === currentSlide.accessionId
                ) ? (
                  elem.reportsResponses.map((response, responseIndex) => {
                    if (response.accession_id === currentSlide.accessionId) {
                      return (
                        <Box key={responseIndex} mb="20px">
                          {/* Render accession ID information */}
                          {/* Render questions and answers for the current accession ID */}
                          {response.slideResponses.map(
                            (slideResponse, slideIndex) => {
                              if (slideIndex < 5) {
                                // Check if slideIndex is between 0 and 4
                                return (
                                  <Box key={slideIndex} mt="20px">
                                    <Text
                                      style={{ marginBottom: "10px" }}
                                      color={
                                        slideResponse?.response === null
                                          ? "gray"
                                          : "inherit"
                                      }
                                    >
                                      Q: {slideResponse?.question_text}
                                    </Text>
                                    <Text
                                      color={
                                        slideResponse?.response === null
                                          ? "gray"
                                          : "inherit"
                                      }
                                    >
                                      A:{" "}
                                      {slideResponse?.response !== null
                                        ? slideResponse?.response?.replace(
                                            /["{}]/g,
                                            ""
                                          )
                                        : "Not Applicable"}
                                    </Text>
                                  </Box>
                                );
                              }

                              if (slideIndex === 5) {
                                // Check if slideIndex is 5
                                return (
                                  <Box key={slideIndex} mt="20px">
                                    {/* Render section heading */}
                                    {/* Map and render section questions and answers */}
                                    <Text>
                                      Q: {slideResponse?.section_heading}{" "}
                                    </Text>
                                    {slideResponse.section_questions.map(
                                      (sectionQuestion, sectionIndex) => (
                                        <Box key={sectionIndex} mt="10px">
                                          <Text
                                            color={
                                              sectionQuestion?.response === null
                                                ? "gray"
                                                : "inherit"
                                            }
                                            style={{ marginBottom: "5px" }}
                                          >
                                            Q: {sectionQuestion?.question_text}
                                          </Text>
                                          <Text
                                            color={
                                              sectionQuestion?.response === null
                                                ? "gray"
                                                : "inherit"
                                            }
                                          >
                                            A:{" "}
                                            {sectionQuestion?.response !== null
                                              ? sectionQuestion?.response?.replace(
                                                  /["{}]/g,
                                                  ""
                                                )
                                              : "Not Applicable"}
                                          </Text>
                                        </Box>
                                      )
                                    )}
                                  </Box>
                                );
                              }

                              // For slideIndex > 5, render questions and answers normally
                              return (
                                <Box key={slideIndex} mt="20px">
                                  <p style={{ marginBottom: "10px" }}>
                                    Q: {slideResponse?.question_text}
                                  </p>
                                  <p>
                                    A:{" "}
                                    {slideResponse?.response?.replace(
                                      /["{}]/g,
                                      ""
                                    )}
                                  </p>
                                </Box>
                              );
                            }
                          )}
                        </Box>
                      );
                    }
                  })
                ) : (
                  <Box>
                    {console.log("sadsadsadsadsadsad")}
                    <Text>No Response Submitted</Text>
                  </Box>
                )}
                {elem.reportsResponses.some(
                  (response) =>
                    response.accession_id === currentSlide.accessionId
                ) ? (
                  <Flex direction="column" mt="40px" mb="80px">
                    <Image
                      w="10vw"
                      h="10vh"
                      src={elem.signature_file}
                      alt="signature"
                    />
                    <Text color="#3B5D7C">{`${elem?.first_name} ${elem?.last_name}`}</Text>
                    <Text>{elem?.highest_qualification}</Text>
                  </Flex>
                ) : // Render something else or leave it empty based on your requirements
                null}
              </Box>
            );
          })}
        </Box>
      ) : (
        questions &&
        questions?.data?.[current_slide?.slideType]?.map((question, index) => {
          const questionResponse = response
            ? response.finalQuestionnaireResponse[index]
            : null;
          // console.log({ questionResponse });
          return (
            <Stack
              key={index}
              direction={direction}
              spacing={4}
              mt="10px"
              ref={scrollRef}
              w="100%"
              // border="2px solid black"
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
              <Text
                wordBreak="break-word"
                whiteSpace="pre-wrap"
                maxWidth="100%"
                overflowWrap="break-word"
                color={questionResponse?.response === null ? "gray" : "inherit"}
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
                        {questionResponse?.section_questions?.find(
                          (sectionQuestion) =>
                            sectionQuestion?.response !== null
                        ) || !questionResponse
                          ? `Q ${toRoman(i)}  ${sectionQuestion?.question_text}`
                          : null}
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
                      ) : questionResponse?.section_questions?.find(
                          (sectionQuestion) =>
                            sectionQuestion?.response !== null
                        ) || !questionResponse ? (
                        <Text
                          color={
                            questionResponse?.response === null
                              ? "gray"
                              : "inherit"
                          }
                        >
                          {`Your response:
              ${
                questionResponse?.section_questions[i]?.response
                  ?.replace(/[{"]+/g, "")
                  ?.replace(/[}"]+/g, "") || "Not Applicable"
              }`}
                        </Text>
                      ) : (
                        ""
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
                <Text
                  color={
                    questionResponse?.response === null ? "gray" : "inherit"
                  }
                >
                  Your response:{" "}
                  {questionResponse?.response
                    ?.replace(/[{"]+/g, "")
                    ?.replace(/[}"]+/g, "") || "Not Applicable"}
                </Text>
              )}
            </Stack>
          );
        })
      )}
      {application === "clinical" && questionResponse && (
        <Flex direction="column">
          <Image
            w="11vw"
            h="10vh"
            src={userInfo?.data[0]?.signatureFile}
            alt="signature"
          />
          <Text color="#3B5D7C">{`${response?.first_name} ${response?.last_name}`}</Text>
          <Text>{response?.highest_qualification}</Text>
          <Text>{response?.Institute}</Text>
        </Flex>
      )}
      {!questionResponse &&
      application === "clinical" &&
      userInfo.data[0].role !== "PI" ? (
        <Flex
          w="100%"
          h="fit-content"
          flexDir="row"
          justifyContent="center"
          alignItems="center"
          py="20px"
          gap="50px"
          // border="2px solid red"
        >
          <Button
            bg="none"
            onClick={() => setPreviewModalOpen(!isPreviewModalOpen)}
            border="1px solid #CFE2F1"
            mr="20px"
          >
            Preview
          </Button>
          <Button
            disabled={
              selectedAnswers?.qnaArray?.length < 4 ||
              Object.keys(selectedAnswers).length === 0
            }
            bg="#C4DAEC"
            onClick={() => changeSlide()}
          >
            Save
          </Button>
        </Flex>
      ) : null}{" "}
      {/* Render Modal */}
      <Modal isOpen={isPreviewModalOpen} onClose={handlePreviewModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="#F0F2FF">Preview</ModalHeader>
          <ModalCloseButton />
          <ModalBody style={{ maxHeight: "520px", overflowY: "auto" }}>
            <Text style={{ fontWeight: "bold" }} my="10px">
              These are the following answers filled by you. Click save to
              submit and continue
            </Text>

            <Flex direction="column" gap="20px">
              {selectedAnswers?.qnaArray?.map((answerResponse, index) => {
                return (
                  <React.Fragment key={index}>
                    <Text
                      wordBreak="break-word"
                      whiteSpace="pre-wrap"
                      maxWidth="100%"
                      overflowWrap="break-word"
                    >
                      <span style={{ fontWeight: "bold" }}>{`Q `}</span>
                      {answerResponse.questionText}
                    </Text>
                    <Text mb="5px">
                      <span style={{ fontWeight: "bold" }}>{`A `}</span>
                      {answerResponse?.choice[0]}
                    </Text>
                    {/* Render choices based on question type */}
                  </React.Fragment>
                );
              })}
            </Flex>
          </ModalBody>
          <Flex
            justifyContent="center"
            alignItems="center"
            gap="20px"
            my="25px"
          >
            <Button
              onClick={() => setPreviewModalOpen(!isPreviewModalOpen)}
              bg="none"
              border="1px solid #CFE2F1"
              mr="20px"
            >
              Cancel
            </Button>
            <Button
              onClick={() => changeSlide()}
              bg="#C4DAEC"
              disabled={
                selectedAnswers?.qnaArray?.length < 4 ||
                Object.keys(selectedAnswers).length === 0
              }
            >
              {" "}
              Save
            </Button>
          </Flex>
        </ModalContent>
      </Modal>
    </VStack>
  );
}

export default Questionnaire;
