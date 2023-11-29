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
  All_Reader_Responses,
  ...restProps
}) {
  const [isPreviewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState();
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { viewerWindow, isAnnotationLoading } = fabricOverlayState;
  // const { viewer, fabricOverlay, slideType } = viewerWindow[viewerId];
  // const { viewer, fabricOverlay, slideId } = viewerWindow[viewerId];

  // console.log({ All_Reader_Responses });
  const handlePreviewModalClose = () => {
    setPreviewModalOpen(false);
  };
  const scrollRef = useRef(questionIndex);
  const setQnaResponse = ({ questionId = null, choice = null, choiceType }) => {
    setSlideQna((state) => {
      const { qna } = state;
      const newQna = { ...qna, [questionId]: { questionId, choice } };
      const qnaArray = Object.values(newQna);
      setSelectedAnswers({ qnaArray });
      return { qna: newQna };
    });
  };
  // console.log({ userInfo });

  const changeSlide = () => {
    if (application === "clinical" && caseInfo?.slides?.length > 1) {
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
        submitQnaReport();
        totalSlides.forEach((slide) => console.log("All Reached"));
      } else {
        // Update the slideId with the next slide's _id
        const nextSlideId = totalSlides[nextIndex]._id;

        // Set the next slideId in your state or wherever you are storing it
        // Assuming you have a function to set the slideId, for example:
        submitQnaReport();
        setChangeSlide(true);
      }
    }
  };

  const questionResponse = response
    ? response.finalQuestionnaireResponse[0]
    : null;

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
  return (
    <VStack
      spacing={6}
      // m="10px"
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
            return (
              <Box
                w="100%"
                maxW="100%"
                h="auto"
                mb="30px"
                borderTop="2px solid #DEDEDE"
              >
                <Flex
                  w="100%"
                  justifyContent="flex-start"
                  alignItems="center"
                  borderBottom="1px solid #DEDEDE"
                  h="50px"
                >
                  <Box w="50%" mr="20px" borderRight="1px solid #DEDEDE">
                    <Text>Study No : {caseInfo?.name}</Text>
                  </Box>
                  <Box>
                    <Text wordBreak="break-word" whiteSpace="break-spaces">
                      {" "}
                      PI : {caseInfo?.firstName} {caseInfo?.lastName}
                    </Text>
                  </Box>
                </Flex>
                <Flex
                  w="100%"
                  justifyContent="flex-start"
                  alignItems="center"
                  borderBottom="1px solid #DEDEDE"
                  h="50px"
                >
                  <Box w="50%" mr="20px" borderRight="1px solid #DEDEDE">
                    <Text>Accession ID: {slideName}</Text>
                  </Box>
                  <Box>
                    <Text wordBreak="break-word" whiteSpace="break-spaces">
                      {" "}
                      Reader : Dr. {elem?.first_name} {elem?.last_name}
                    </Text>
                  </Box>
                </Flex>

                {elem.reportsResponses.map((response, responseIndex) => {
                  if (response.accession_id === slideName) {
                    return (
                      <Box key={responseIndex} mb="20px">
                        {/* Render accession ID information */}
                        {/* Render questions and answers for the current accession ID */}
                        {response.slideResponses.map(
                          (slideResponse, slideIndex) => (
                            <Box key={slideIndex} mt="20px">
                              <p style={{marginBottom:"10px"}}>Q: {slideResponse?.question_text}</p>
                              <p>
                                A:{" "}
                                {slideResponse?.response?.replace(/["{}]/g, "")}
                              </p>
                            </Box>
                          )
                        )}
                      </Box>
                    );
                  }
                })}
                <img style={{marginTop:"30px"}} src={elem.signature_file}></img>
              </Box>
            );
          })}
        </Box>
      ) : (
        questions &&
        questions?.data?.[slideInfo?.slideType]?.map((question, index) => {
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
        })
      )}
      {application === "clinical" && response?.signature_file && (
        <Flex direction="column">
          <Image w="11vw" h="10vh" src={response?.signature_file} />
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
              selectedAnswers?.qnaArray?.length !==
              questions?.data?.[slideInfo.slideType]?.length
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
              {questions?.data?.[slideInfo.slideType]?.map(
                (question, index) => {
                  const selectedAnswer = selectedAnswers?.qnaArray?.find(
                    (answer) => answer.questionId === question.question_id
                  );
                  return (
                    <React.Fragment key={index}>
                      <Text
                        wordBreak="break-word"
                        whiteSpace="pre-wrap"
                        maxWidth="100%"
                        overflowWrap="break-word"
                      >
                        <span style={{ fontWeight: "bold" }}>{`Q ${
                          index + 1
                        }`}</span>
                        {`  ${
                          question?.question_text
                            ? question?.question_text
                            : question?.section_heading
                        }`}
                      </Text>

                      {/* Render choices based on question type */}
                      {question.question_type === "Multiple Choice" && (
                        <Box ml="30px">
                          {question.choices.map((choice, choiceIndex) => (
                            <div key={choiceIndex}>
                              <input
                                type="radio"
                                name={`question_${index}`}
                                value={choice}
                                style={{ marginRight: "5px" }}
                                disabled={true}
                                checked={selectedAnswer?.choice.includes(
                                  choice
                                )}
                              />
                              <label>{choice}</label>
                            </div>
                          ))}
                        </Box>
                      )}

                      {question.question_type === "Checkbox" && (
                        <Box ml="30px">
                          {question.choices.map((choice, choiceIndex) => (
                            <div key={choiceIndex}>
                              <input
                                type="checkbox"
                                id={`choice_${choiceIndex}`}
                                value={choice}
                                style={{ marginRight: "5px" }}
                                disabled={true}
                                checked={selectedAnswer?.choice.includes(
                                  choice
                                )}
                              />
                              <label htmlFor={`choice_${choiceIndex}`}>
                                {choice}
                              </label>
                            </div>
                          ))}
                        </Box>
                      )}
                    </React.Fragment>
                  );
                }
              )}
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
                selectedAnswers?.qnaArray?.length !==
                questions?.data?.[slideInfo.slideType]?.length
              }
            >
              {" "}
              Saves
            </Button>
          </Flex>
        </ModalContent>
      </Modal>
    </VStack>
  );
}

export default Questionnaire;
