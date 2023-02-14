import React, { useState, useRef, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogContent,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Image,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { BsCheckSquareFill, BsFillXSquareFill } from "react-icons/bs";
import _ from "lodash";
import { getSlideUrl } from "../../utility/utility";

const AnswersPreview = ({
  userInfo,
  project,
  questionnaire,
  viewerIds,
  slideType,
  firstSlideQna,
  secondSlideQna,
  finalSubmitHandler,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const url1 = getSlideUrl(viewerIds?.[0]?.awsImageBucketUrl);
  const url2 =
    project?.type === "multiSlide"
      ? getSlideUrl(viewerIds?.[1]?.awsImageBucketUrl)
      : "";

  return (
    <>
      <Box bgColor="rgba(236, 236, 236, 1)">
        {userInfo?.user?.subClaim !== project?.owner?.subClaim ? (
          <Button
            my={5}
            backgroundColor="#00153F"
            h="32px"
            borderRadius={0}
            width="10em"
            color="white"
            fontWeight="500"
            fontSize="16px"
            fontFamily="inter"
            ml="20px"
            _hover={{ bg: "#2166fc" }}
            onClick={() => {
              setIsOpen(true);
            }}
          >
            Submit
          </Button>
        ) : null}
      </Box>
      <AlertDialog
        motionPreset="slideInBottom"
        size="3xl"
        width="70%"
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogContent borderRadius="10px">
          <AlertDialogHeader
            backgroundColor="rgba(236, 236, 236, 1)"
            color="black"
            padding="5px"
            borderTopRadius="10px"
          >
            <Text marginLeft="1em" size="sm">
              Preview
            </Text>
          </AlertDialogHeader>
          <AlertDialogBody space={2} paddingTop="2em" paddingBottom="1em">
            <HStack>
              <Flex
                direction="column"
                backgroundColor="rgba(236, 236, 236, 1)"
                color="black"
                borderRadius="3px"
                padding="1em"
                textAlign="left"
                fontFamily="inter"
                fontSize="16px"
                width="50%"
              >
                {questionnaire?.questions.map((question, index) => (
                  <Box key={question._id}>
                    {question._id === questionnaire?.questions[1]._id &&
                    firstSlideQna?.qna?.[questionnaire?.questions[0]._id] !==
                      "No" ? (
                      <Text color="grey">{`Q${index + 1} ${
                        question.questionText
                      }`}</Text>
                    ) : question.questionText === "Hepatocellular ballooning" &&
                      question.questionType === "text" ? (
                      ["(1)Few", "(2)Many"].includes(
                        firstSlideQna?.qna?.[questionnaire?.questions[4]._id]
                      ) ? (
                        <Text marginTop="0.5em" marginLeft="2em">
                          <Icon
                            as={
                              firstSlideQna?.qna[question._id]
                                ? BsCheckSquareFill
                                : BsFillXSquareFill
                            }
                            marginRight={1}
                            color={
                              firstSlideQna?.qna[question._id]
                                ? "#3965C6"
                                : "red.400"
                            }
                            w={3}
                            h={3}
                          />
                          {firstSlideQna?.qna[question._id] ?? "Text missing"}
                        </Text>
                      ) : null
                    ) : (
                      <>
                        <Text>{`Q${index + 1} ${question.questionText}`}</Text>
                        <Text marginTop="0.5em" marginLeft="2em">
                          <Icon
                            as={
                              firstSlideQna?.qna[question._id]
                                ? BsCheckSquareFill
                                : BsFillXSquareFill
                            }
                            marginRight={1}
                            color={
                              firstSlideQna?.qna[question._id]
                                ? "#3965C6"
                                : "red.400"
                            }
                            w={3}
                            h={3}
                          />
                          {firstSlideQna?.qna[question._id]
                            ? typeof firstSlideQna?.qna?.[question._id] ===
                              "string"
                              ? firstSlideQna?.qna[question._id]
                              : firstSlideQna?.qna[question._id].join(", ")
                            : "Required Field"}
                        </Text>
                      </>
                    )}
                  </Box>
                ))}
              </Flex>
              <Spacer />
              <Flex width="50%" direction="column">
                <Text
                  fontSize="16px"
                  fontFamily="inter"
                  fontWeight="500"
                  color="black"
                >
                  Are you sure you want to submit the answers?
                </Text>
                <Image
                  marginY="1em"
                  height="10em"
                  width="18em"
                  src={url1}
                  marginTop="10px"
                />
                <Text fontSize="16px" fontFamily="inter" color="black">
                  {project?.slideType} Slide
                </Text>
                <Text fontSize="20px" fontFamily="inter" color="black">
                  {project?.name}
                </Text>
                <Text
                  fontSize="14px"
                  color="rgba(0, 0, 0, 0.4)"
                  marginBottom="1em"
                >
                  {viewerIds?.[0]?._id}
                </Text>
              </Flex>
            </HStack>
            {project?.type === "multiSlide" ? (
              <HStack>
                <Flex
                  direction="column"
                  backgroundColor="rgba(236, 236, 236, 1)"
                  color="black"
                  borderRadius="3px"
                  padding="1em"
                  textAlign="left"
                  fontFamily="inter"
                  fontSize="16px"
                  width="50%"
                >
                  {questionnaire?.questions.map((question, index) => (
                    <Box key={question._id}>
                      {question._id === questionnaire?.questions[1]._id &&
                      secondSlideQna?.qna?.[questionnaire?.questions[0]._id] !==
                        "No" ? (
                        <Text color="grey">{`Q${index + 1} ${
                          question.questionText
                        }`}</Text>
                      ) : question.questionText ===
                          "Hepatocellular ballooning" &&
                        question.questionType === "text" ? (
                        ["(1)Few", "(2)Many"].includes(
                          secondSlideQna?.qna?.[questionnaire?.questions[4]._id]
                        ) ? (
                          <Text marginTop="0.5em" marginLeft="2em">
                            <Icon
                              as={
                                secondSlideQna?.qna[question._id]
                                  ? BsCheckSquareFill
                                  : BsFillXSquareFill
                              }
                              marginRight={1}
                              color={
                                secondSlideQna?.qna[question._id]
                                  ? "#3965C6"
                                  : "red.400"
                              }
                              w={3}
                              h={3}
                            />
                            {secondSlideQna?.qna[question._id] ??
                              "Text missing"}
                          </Text>
                        ) : null
                      ) : (
                        <>
                          <Text>{`Q${index + 1} ${
                            question.questionText
                          }`}</Text>
                          <Text marginTop="0.5em" marginLeft="2em">
                            <Icon
                              as={
                                secondSlideQna?.qna[question._id]
                                  ? BsCheckSquareFill
                                  : BsFillXSquareFill
                              }
                              marginRight={1}
                              color={
                                secondSlideQna?.qna[question._id]
                                  ? "#3965C6"
                                  : "red.400"
                              }
                              w={3}
                              h={3}
                            />
                            {secondSlideQna?.qna[question._id]
                              ? typeof secondSlideQna?.qna?.[question._id] ===
                                "string"
                                ? secondSlideQna?.qna[question._id]
                                : secondSlideQna?.qna[question._id].join(", ")
                              : "Required Field"}
                          </Text>
                        </>
                      )}
                    </Box>
                  ))}
                </Flex>
                <Spacer />
                <Flex width="50%" direction="column">
                  <Image
                    marginY="1em"
                    height="10em"
                    width="18em"
                    src={url2}
                    marginTop="10px"
                  />
                  <Text fontSize="16px" fontFamily="inter" color="black">
                    {project?.slideType} Slide
                  </Text>
                  <Text fontSize="20px" fontFamily="inter" color="black">
                    {project?.name}
                  </Text>
                  <Text
                    fontSize="14px"
                    color="rgba(0, 0, 0, 0.4)"
                    marginBottom="1em"
                  >
                    {viewerIds?.[1]?._id}
                  </Text>
                </Flex>
              </HStack>
            ) : (
              ""
            )}
            <HStack justifyContent="flex-end">
              <Button
                variant="solid"
                width="10em"
                color="#00153F"
                backgroundColor="#ECECEC10"
                border="1px solid #00153F"
                borderRadius={0}
                _hover={{
                  backgroundColor: "#ECECEC30",
                }}
                onClick={() => onClose()}
                fontSize="16px"
                fontFamily="inter"
                fontWeight="bold"
              >
                Cancel
              </Button>
              <Button
                variant="solid"
                width="10em"
                color="white"
                backgroundColor="#00153F"
                borderRadius={0}
                onClick={() =>
                  finalSubmitHandler({
                    firstResponse: firstSlideQna?.response,
                    secondResponse: secondSlideQna?.response,
                    viewerIds,
                  })
                }
                disabled={
                  project?.type === "multiSlide"
                    ? questionnaire?.questions.length * 2 !==
                      _.keys(firstSlideQna?.response).length +
                        _.keys(secondSlideQna?.response).length
                    : questionnaire?.questions.length !==
                      _.keys(firstSlideQna?.response).length
                }
                _hover={{
                  backgroundColor: "#00153F90",
                }}
                fontSize="16px"
                fontFamily="inter"
                fontWeight="bold"
              >
                Save & Next
              </Button>
            </HStack>
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AnswersPreview;
