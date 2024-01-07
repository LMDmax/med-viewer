import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
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
  set_Is_PreviewButton_Disable,
  showPreviewModal,
  setShowPreviewModal,
  submitAdditionalResponse,
  permission,
  ...restProps
}) {
  const [isPreviewModalOpen, setPreviewModalOpen] = useState(false);
  const [isSecondModalOpen, setSecondModalOpen] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { viewerWindow, isAnnotationLoading } = fabricOverlayState;
  const [newQuestions, setNewQuestions] = useState([]);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newAnswerText, setNewAnswerText] = useState("");
  const [showInputFields, setShowInputFields] = useState(false);
  const [isConditionMet, setIsConditionMet] = useState(false);
  // const { viewer, fabricOverlay, slideType } = viewerWindow[viewerId];
  // const { viewer, fabricOverlay, slideId } = viewerWindow[viewerId];

  const current_slide = slides.find((slide) => slide._id === slideId);

  console.log({ permission });
  console.log(userInfo?.data[0]?.signatureFile);

  const handlePreviewModalClose = () => {
    setPreviewModalOpen(false);
    setShowPreviewModal(false);
  };
  // ################### HANDLE PREVIEW MODAL HERE ##################
  useEffect(() => {
    if (showPreviewModal) {
      setPreviewModalOpen(true);
    } else {
      setPreviewModalOpen(false);
    }
  }, [showPreviewModal]);
  //###############################################################

  // ################### ADD MANUAL QUESTIONS HERE ##################
  const handleAddQuestion = () => {
    // Check if both question and answer are filled
    if (newQuestionText.trim() !== "" && newAnswerText.trim() !== "") {
      const newQuestionId = uuidv4();
      // Create a new object with question_id, Q, and response
      const newQuestion = {
        questionId: `${newQuestionId}`,
        question_text: newQuestionText.trim(),
        response: newAnswerText.trim(),
        question_type: "remark",
      };

      // Add the new question to the state
      setNewQuestions((prevQuestions) => [...prevQuestions, newQuestion]);

      // Clear the input fields for the next question
      setNewQuestionText("");
      setNewAnswerText("");
    }
    setShowInputFields(true);
  };

  const handleDelete = (questionId) => {
    // Create a new array without the question with the specified question_id
    const updatedQuestions = newQuestions.filter(
      (question) => question.question_id !== questionId
    );

    // Update the state with the new array
    setNewQuestions(updatedQuestions);
  };

  // console.log({ caseInfo });
  const handlePostAdditionalQuestions = async () => {
    try {
      // Create the body object
      const body = {
        case_id: caseInfo.caseId,
        slide_id: slideId,
        questions: newQuestions,
      };
      const response = await submitAdditionalResponse(body);

      // Handle the response as needed
      const responseData = await response.json();
      // console.log(responseData);

      // Optionally, you can update state or perform other actions based on the response
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };

  //###############################################################

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

        console.log({ questionArray });

        // Check if the specified questionId exists in questionArray[3]
        const masterQuestionId = questionArray[2]?.question_id;
        const masterQuestionId_HAndE = questionArray[0]?.question_id;

        if (currentSlide.slideType === "HAndE" && isLinked) {
          if (
            masterQuestionId_HAndE &&
            newQna[masterQuestionId_HAndE] &&
            (newQna[masterQuestionId_HAndE].choice[0] === "(2)No" ||
              newQna[masterQuestionId_HAndE].choice[0] === "No")
          ) {
            // If the choice is "No," delete all question IDs from newQna
            console.log("a");
            questionArray[3]?.section_questions?.forEach((sectionQuestion) => {
              delete newQna[sectionQuestion.question_id];
            });
            delete newQna[questionArray[4]?.question_id];
            setIsConditionMet(false);
          }
          if (
            masterQuestionId_HAndE &&
            newQna[masterQuestionId_HAndE] &&
            (newQna[masterQuestionId_HAndE].choice[0] === "(1)Yes" ||
              newQna[masterQuestionId_HAndE].choice[0] === "Yes")
          ) {
            // console.log("b");
            // If the choice is "No," delete all question IDs from newQna
            delete newQna[questionArray[1]?.question_id];
            delete newQna[questionArray[2]?.question_id];
            const isConditionMet = Object.values(newQna).some(
              (item) =>
                item.questionText === "(c) Hepatocellular ballooning" &&
                (item.choice[0] === "2:  (Many)" ||
                  item.choice[0] === "1:  (Few)")
            );
            setIsConditionMet(isConditionMet);
          }
        } else if (isLinked && currentSlide.slideType === "Trichrome") {
          if (
            masterQuestionId &&
            newQna[masterQuestionId] &&
            (newQna[masterQuestionId].choice[0] === "(2)No" ||
              newQna[masterQuestionId].choice[0] === "No")
          ) {
            // If the choice is "No," delete specific question IDs from newQna
            questionArray[5]?.section_questions?.forEach((sectionQuestion) => {
              delete newQna[sectionQuestion.question_id];
            });
            delete newQna[questionArray[6]?.question_id];
            setIsConditionMet(false);
          }
          if (
            masterQuestionId &&
            newQna[masterQuestionId] &&
            (newQna[masterQuestionId].choice[0] === "(1)Yes" ||
              newQna[masterQuestionId].choice[0] === "Yes")
          ) {
            // If the choice is "Yes," delete specific question IDs from newQna
            delete newQna[questionArray[3]?.question_id];
            delete newQna[questionArray[4]?.question_id];
            const isConditionMet = Object.values(newQna).some(
              (item) =>
                item.questionText === "Fibrosis Stage - NASH CRN" &&
                (item.choice[0] === "2:  Zone 3 and periportal" ||
                  item.choice[0] === "3:  Bridging")
            );
            setIsConditionMet(isConditionMet);
          }
        }

        const qnaArray = Object.values(newQna);

        // setSelectedAnswers({ qnaArray: qnaArray });
        return { qna: newQna };
      });
      const qnaArray = Object.values(newQna);

      // setSelectedAnswers({ qnaArray: qnaArray });
      return { qna: newQna };
    });
  };

  // console.log("asd", Object.keys(selectedAnswers).length === 0);

  const questionArray = questions
    ? questions?.data?.[current_slide?.slideType]
    : [];
  const questionLinked_with_section = questionArray
    ? questionArray[questionArray?.length - 1]
    : [];

  // useEffect(() => {
  //   if (
  //     current_slide.slideType === "HAndE" &&
  //     selectedAnswers &&
  //     selectedAnswers.qnaArray &&
  //     Array.isArray(selectedAnswers.qnaArray) &&
  //     selectedAnswers.qnaArray.length > 0
  //   ) {
  //     // Check if the condition is met
  //     const conditionMet = selectedAnswers.qnaArray.some((item) => {
  //       // console.log(item.questionText);
  //       return (
  //         item.questionText === "(c) Hepatocellular ballooning" &&
  //         (item.choice[0] === "2:  (Many)" || item.choice[0] === "1:  (Few)")
  //       );
  //     });
  //     // console.log({ conditionMet });
  //     // Update the state accordingly
  //     setIsConditionMet(conditionMet);
  //   } else {
  //     // If qnaArray is not present or is an empty array, set condition to false
  //     setIsConditionMet(false);
  //   }
  // }, [selectedAnswers, current_slide]);

  // console.log({ isConditionMet });

  useEffect(() => {
    setSelectedAnswers({});
  }, [slideId]);

  useEffect(() => {
    if (
      current_slide &&
      current_slide.slideType === "HAndE" &&
      Object.keys(slideQna.qna).length >= 2
    ) {
      set_Is_PreviewButton_Disable(false);
    } else if (
      current_slide &&
      current_slide.slideType === "Trichrome" &&
      Object.keys(slideQna.qna).length >= 4
    ) {
      set_Is_PreviewButton_Disable(false);
    } else {
      set_Is_PreviewButton_Disable(true);
    }
  }, [slideQna]);
  const handleSecondModalClose = () => {
    setSecondModalOpen(false);
  };
  const handleSave_Modal = () => {
    handlePreviewModalClose();
    setSecondModalOpen(true);
    // changeSlide()
  };

  const changeSlide = () => {
    submitQnaReport();
    handlePostAdditionalQuestions();
    // console.log({
    //   caseInfo,
    // });
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
  console.log({ All_Reader_Responses });

  const currentSlide = slides.find((slide) => slide?._id === slideId);
  // console.log({ response });

  const sortedResponses = All_Reader_Responses?.data?.finalResponseArray
    .slice()
    .sort((a, b) => a.first_name.localeCompare(b.first_name));

  console.log({ userInfo });
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
        permission.data[0].permissions.includes("viewReport") &&
        All_Reader_Responses?.data?.finalResponseArray.length > 0 ? (
        <Accordion w="100%" allowToggle>
          {sortedResponses.map((elem, index) => (
            <AccordionItem key={index}>
              <h2>
                <AccordionButton>
                  <Flex flex="1" textAlign="left" ml="2">
                    <Text mr="10px">Reader :</Text>
                    <Text>
                      Dr. {elem?.first_name} {elem?.last_name}
                    </Text>
                  </Flex>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel>
                <Box w="100%" px="5px">
                  {elem.reportsResponses.some(
                    (response) =>
                      response.accession_id === currentSlide.accessionId
                  ) ? (
                    elem.reportsResponses.map((response, responseIndex) => {
                      if (
                        response.accession_id === currentSlide.accessionId &&
                        currentSlide.slideType === "HAndE"
                      ) {
                        return (
                          <Box key={responseIndex} mb="20px">
                            {/* Render accession ID information */}
                            {/* Render questions and answers for the current accession ID */}
                            {response.slideResponses.map(
                              (slideResponse, slideIndex) => {
                                if (slideIndex < 3) {
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

                                if (slideIndex === 3) {
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
                                                sectionQuestion?.response ===
                                                null
                                                  ? "gray"
                                                  : "inherit"
                                              }
                                              style={{ marginBottom: "5px" }}
                                            >
                                              Q:{" "}
                                              {sectionQuestion?.question_text}
                                            </Text>
                                            <Text
                                              color={
                                                sectionQuestion?.response ===
                                                null
                                                  ? "gray"
                                                  : "inherit"
                                              }
                                            >
                                              A:{" "}
                                              {sectionQuestion?.response !==
                                              null
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
                      } else if (
                        response.accession_id === currentSlide.accessionId &&
                        currentSlide.slideType === "Trichrome"
                      ) {
                        return (
                          <Box key={responseIndex} mb="20px">
                            {/* Render accession ID information */}
                            {/* Render questions and answers for the current accession ID */}
                            {response.slideResponses.map(
                              (slideResponse, slideIndex) => {
                                if (slideIndex) {
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

                                // if (slideIndex === 3) {
                                //   // Check if slideIndex is 5
                                //   return (
                                //     <Box key={slideIndex} mt="20px">
                                //       {/* Render section heading */}
                                //       {/* Map and render section questions and answers */}
                                //       <Text>
                                //         Q: {slideResponse?.section_heading}{" "}
                                //       </Text>
                                //       {slideResponse.section_questions.map(
                                //         (sectionQuestion, sectionIndex) => (
                                //           <Box key={sectionIndex} mt="10px">
                                //             <Text
                                //               color={
                                //                 sectionQuestion?.response ===
                                //                 null
                                //                   ? "gray"
                                //                   : "inherit"
                                //               }
                                //               style={{ marginBottom: "5px" }}
                                //             >
                                //               Q:{" "}
                                //               {sectionQuestion?.question_text}
                                //             </Text>
                                //             <Text
                                //               color={
                                //                 sectionQuestion?.response ===
                                //                 null
                                //                   ? "gray"
                                //                   : "inherit"
                                //               }
                                //             >
                                //               A:{" "}
                                //               {sectionQuestion?.response !==
                                //               null
                                //                 ? sectionQuestion?.response?.replace(
                                //                     /["{}]/g,
                                //                     ""
                                //                   )
                                //                 : "Not Applicable"}
                                //             </Text>
                                //           </Box>
                                //         )
                                //       )}
                                //     </Box>
                                //   );
                                // }

                                // For slideIndex > 5, render questions and answers normally
                                // return (
                                //   <Box key={slideIndex} mt="20px">
                                //     <p style={{ marginBottom: "10px" }}>
                                //       Q: {slideResponse?.question_text}
                                //     </p>
                                //     <p>
                                //       A:{" "}
                                //       {slideResponse?.response?.replace(
                                //         /["{}]/g,
                                //         ""
                                //       )}
                                //     </p>
                                //   </Box>
                                // );
                              }
                            )}
                          </Box>
                        );
                      }
                    })
                  ) : (
                    <Box>
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
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        questions && (
          <>
            <Box w="100%" borderBottom="1px solid #DEDEDE" pb="5px">
              <Text>
                PI: DR.{" "}
                {caseInfo?.firstName?.charAt(0).toUpperCase() +
                  caseInfo?.firstName?.slice(1)}{" "}
                {caseInfo?.lastName?.charAt(0).toUpperCase() +
                  caseInfo?.lastName?.slice(1)}
              </Text>
            </Box>

            {questions?.data?.[current_slide?.slideType]?.map(
              (question, index) => {
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
                    // border="2px solid black"
                    maxW="100%"
                    // pb="10px"
                    display={
                      questionResponse
                        ? "block"
                        : question?.question_link_id &&
                          !responsesToSubmit?.find(
                            (element) =>
                              element?.questionId ===
                                question?.question_link_id &&
                              element?.choice?.includes(
                                question?.conditional_value
                              )
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
                      color={
                        questionResponse?.response === null ? "gray" : "inherit"
                      }
                    >
                      <span style={{ fontWeight: "bold" }}>{`Q`}</span>
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
                                ? `Q ${toRoman(i)}  ${
                                    sectionQuestion?.question_text
                                  }`
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
                                maxW="100%"
                                whiteSpace="pre-wrap" // or whiteSpace="break-word"
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
                        maxW="100%"
                        whiteSpace="pre-wrap" // or whiteSpace="break-word"
                        color={
                          questionResponse?.response === null
                            ? "gray"
                            : "inherit"
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
              }
            )}
            {isConditionMet && questionLinked_with_section && (
              <Box px="0.6rem">
                <Text
                  wordBreak="break-word"
                  whiteSpace="pre-wrap"
                  maxWidth="100%"
                  overflowWrap="break-word"
                  mb="0.2rem"
                  ml="34px"
                >
                  {`Q  ${questionLinked_with_section?.question_text}`}
                </Text>
                {/* Render the question type component for the last questionLinked_with_section */}
                <QuestionType
                  question={questionLinked_with_section}
                  direction={direction}
                  application={application}
                  response={response}
                  setQnaResponse={setQnaResponse}
                  projectQnaType={projectQnaType}
                  slideQna={slideQna}
                />
              </Box>
            )}
            {response && application === "clinical" && (
              <Box>
                {response.finalQuestionnaireResponse
                  .filter((question) => question.question_type === "remark")
                  .map((question, index) => (
                    <>
                      <Text key={index}>
                        <span style={{ fontWeight: "bold" }}>Q:</span>{" "}
                        {question.question_text}
                      </Text>
                      <br />
                      <Text>
                        Your response:
                        {question.response}
                      </Text>
                    </>
                  ))}
              </Box>
            )}

            {newQuestions.map((question, index) => (
              <Stack
                key={index}
                w="100%"
                direction={direction}
                spacing={4}
                mt="10px"
              >
                {/* Display the dynamically added questions and answers */}
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                >
                  <Flex direction="column" width="70%">
                    <Flex
                      w="100%"
                      mb="15px"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text fontWeight="bold">Q</Text>
                      <textarea
                        value={` ${question.question_text}`}
                        disabled={true}
                        style={{
                          backgroundColor: "#f6f6f6",
                          outline: "none",
                          border: "none",
                          verticalAlign: "middle",
                          width: "100%",
                          padding: "10px",
                        }}
                      />
                    </Flex>

                    <Flex w="100%" justifyContent="center" alignItems="center">
                      <Text fontWeight="bold">A</Text>
                      <textarea
                        value={`${question.response}`}
                        disabled={true}
                        style={{
                          backgroundColor: "#f6f6f6",
                          outline: "none",
                          border: "none",
                          verticalAlign: "middle",
                          width: "100%",
                          padding: "10px",
                        }}
                      />
                    </Flex>
                  </Flex>
                  <Button
                    width="20%"
                    onClick={() => handleDelete(question.question_id)}
                  >
                    Delete
                  </Button>
                </Flex>
              </Stack>
            ))}

            {/* Input fields for adding new question and answer */}
            {showInputFields && (
              <Stack direction={direction} spacing={4} mt="10px" width="100%">
                <Flex justifyContent="flex-start" alignItems="center">
                  <Text marginRight="5px">Q:</Text>
                  <textarea
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    style={{
                      backgroundColor: "#f6f6f6",
                      outline: "none",
                      border: "none",
                      verticalAlign: "middle",
                      width: "70%",
                      padding: "3px",
                    }}
                  />
                </Flex>
                <Flex justifyContent="flex-start" alignItems="center">
                  <Text marginRight="5px" fontWeight="bold">
                    A:
                  </Text>
                  <textarea
                    value={newAnswerText}
                    onChange={(e) => setNewAnswerText(e.target.value)}
                    style={{
                      backgroundColor: "#f6f6f6",
                      outline: "none",
                      border: "none",
                      verticalAlign: "middle",
                      width: "70%",
                      padding: "10px",
                    }}
                  />
                </Flex>
              </Stack>
            )}
            {!questionResponse && application === "clinical" && (
              <Button onClick={handleAddQuestion}>Add Question</Button>
            )}
          </>
        )
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
      {/* {!questionResponse &&
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
              (current_slide.slideType === "Trichrome" &&
                Object.keys(slideQna.qna).length < 4) ||
              (current_slide.slideType === "HAndE" &&
                Object.keys(slideQna.qna).length < 2) ||
              Object.keys(slideQna.qna).length === 0
            }
            bg="#C4DAEC"
            onClick={() => changeSlide()}
          >
            Save
          </Button>
        </Flex>
      ) : null}{" "} */}
      {/* Render Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={handlePreviewModalClose}
        closeOnOverlayClick={false}
      >
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
              {selectedAnswers?.qnaArray?.map((answerResponse, index) => (
                <React.Fragment key={index}>
                  <Text
                    fontWeight="bold"
                    wordBreak="break-word"
                    whiteSpace="pre-wrap"
                  >
                    Q: {answerResponse.questionText}
                  </Text>
                  <Text
                    fontWeight="bold"
                    mb="5px"
                    wordBreak="break-word"
                    whiteSpace="pre-wrap"
                  >
                    A: {answerResponse?.choice[0]}
                  </Text>
                  {/* Render choices based on question type */}
                </React.Fragment>
              ))}

              {newQuestions?.map((answerResponse, index) => (
                <React.Fragment key={index}>
                  <Text
                    fontWeight="bold"
                    wordBreak="break-word"
                    whiteSpace="pre-wrap"
                  >
                    Q: {answerResponse.question_text}
                  </Text>
                  <Text
                    fontWeight="bold"
                    mb="5px"
                    wordBreak="break-word"
                    whiteSpace="pre-wrap"
                  >
                    A: {answerResponse?.response}
                  </Text>
                  {/* Render choices based on question type */}
                </React.Fragment>
              ))}
            </Flex>
          </ModalBody>
          <Flex
            justifyContent="center"
            alignItems="center"
            gap="20px"
            my="25px"
          >
            <Button
              onClick={() => {
                setPreviewModalOpen(!isPreviewModalOpen);
                setShowPreviewModal(false);
              }}
              bg="none"
              border="1px solid #CFE2F1"
              mr="20px"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleSave_Modal();
                // changeSlide();
              }}
              bg="#C4DAEC"
            >
              {" "}
              Continue
            </Button>
          </Flex>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isSecondModalOpen}
        onClose={handleSecondModalClose}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="#F0F2FF">Confirmation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to submit the response for this slide?
            </Text>
          </ModalBody>
          <Flex
            justifyContent="center"
            alignItems="center"
            gap="20px"
            my="25px"
          >
            <Button
              onClick={() => {
                setSecondModalOpen(false);
              }}
              bg="none"
              border="1px solid #CFE2F1"
              mr="20px"
            >
              Cancel
            </Button>
            <Button
              disabled={userInfo?.data[0].role === "PI"}
              onClick={() => {
                changeSlide();
              }}
              bg="#C4DAEC"
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
