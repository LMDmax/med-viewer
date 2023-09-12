import React, { useState, useEffect } from "react";

import {
  Button,
  Tooltip,
  useToast,
  Flex,
  IconButton,
  Text,
} from "@chakra-ui/react";
import _ from "lodash";
import { AiOutlineClose } from "react-icons/ai";

import { useFabricOverlayState } from "../../state/store";
import CLSReport from "./CLSReport";

function CLSReportHelper({
  restProps,
  caseInfo,
  viewerId,
  questions,
  userInfo,
  app,
  setSlideId,
  responseHandler,
  questionnaireResponse,
  questionIndex,
  application,
}) {
  const { fabricOverlayState } = useFabricOverlayState();
  const { viewerWindow } = fabricOverlayState;
  const { slideId } = viewerWindow[viewerId];
  const [showCLSreport, setShowCLSReport] = useState(false);
  const [questionsResponse, setQuestionsResponse] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [slideQuestions, setSlideQuestions] = useState();
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const toast = useToast();
  const [slideQna, setSlideQna] = useState({
    qna: {},
  });

  // console.log("slideQNA", slideQna)
  // get questions and response
  const lessonId = caseInfo?.id || caseInfo.caseId;
  const key = application === "education" ? "lessonId" : "case_id"; // key as payload
  const value = application === "education" ? lessonId : caseInfo.caseId; // value as payload
  async function fetchResponse() {
    const response = await questionnaireResponse({
      [key]: value,
      slide_id : slideId,
    });
    console.log(response);
    setQuestionsResponse(response?.data?.data);
    setErrorMessage(response?.error?.response?.data?.message);
  }
  useEffect(() => {
    setIsUpdating(true);
    if (app === "education") setSlideId(slideId);

    fetchResponse();
  }, [showCLSreport]);

  const handleCLSReport = () => {
    setShowCLSReport(!showCLSreport);
    setSlideQna({ qna: {} });
  };
  const response = Object.values(slideQna?.qna);
  const submitQnaReport = async () => {
    console.log("SUBMIT", response);
    try {
      setLoading(true);
      await responseHandler({
        [key]: value,
        response,
        slide_id: slideId,
      });
      fetchResponse();
      setShowCLSReport(false);
      setLoading(false);
    } catch (err) {
      toast({
        status: "error",
        title: "Reporting Failed",
        description: "Something went wrong, try again!",
        duration: 1500,
        isClosable: true,
      });
    }
  };
  // open report if navigated through questions
  useEffect(() => {
    if (questionIndex >= 0) {
      setShowCLSReport(true);
    }
  }, [questionIndex]);
  return (
    <Flex direction="column">
      {!showCLSreport ? (
        <Tooltip
          label="Report"
          placement="bottom"
          openDelay={0}
          bg="#E4E5E8"
          color="rgba(89, 89, 89, 1)"
          fontSize="14px"
          fontFamily="inter"
          hasArrow
          borderRadius="0px"
          size="20px"
        >
          <Button
            variant="solid"
            h="32px"
            ml="15px"
            borderRadius="0px"
            backgroundColor="#00153F"
            _hover={{}}
            _focus={{
              border: "none",
            }}
            color="#fff"
            fontFamily="inter"
            fontSize="14px"
            fontWeight="500"
            {...restProps}
            onClick={handleCLSReport}
          >
            Report
          </Button>
        </Tooltip>
      ) : !questionsResponse &&
        userInfo?.userType !== "professor" &&
        errorMessage !== "Result  is not publish yet" ? (
        <Tooltip
          label="Submit-Report"
          placement="bottom"
          openDelay={0}
          bg="#E4E5E8"
          color="rgba(89, 89, 89, 1)"
          fontSize="14px"
          fontFamily="inter"
          hasArrow
          borderRadius="0px"
          size="20px"
        >
          <Button
            variant="solid"
            h="32px"
            ml="15px"
            borderRadius="0px"
            backgroundColor="#00153F"
            _hover={{}}
            _focus={{
              border: "none",
            }}
            color="#fff"
            fontFamily="inter"
            fontSize="14px"
            fontWeight="500"
            {...restProps}
            onClick={submitQnaReport}
            disabled={
              (application === "education"
                ? questions &&
                  questions[0]?.LessonQuestions?.length !== response?.length
                : questions &&
                  questions?.data?.desiredQuestionsInfo?.length !==
                    response?.length) ||
              (application === "clinical" && userInfo.role === "PI")
            }
          >
            Submit Reports
          </Button>
        </Tooltip>
      ) : showCLSreport ? (
        <Flex w="100%" justifyContent="flex-end">
          <IconButton
            icon={<AiOutlineClose />}
            onClick={handleCLSReport}
            borderRadius="0"
            background="#fcfcfc"
            size="sm"
            _focus={{}}
          />
        </Flex>
      ) : null}
      <Flex>
        {showCLSreport && errorMessage !== "Result  is not publish yet" && (
          <CLSReport
            isUpdating={isUpdating}
            questions={questions}
            caseInfo={caseInfo}
            userInfo={userInfo}
            responseHandler={responseHandler}
            handleCLSReport={handleCLSReport}
            slideQna={slideQna}
            setSlideQna={setSlideQna}
            questionsResponse={questionsResponse}
            slideId={slideId}
            loading={loading}
            application={application}
            questionIndex={questionIndex}
          />
        )}
      </Flex>
    </Flex>
  );
}

export default CLSReportHelper;
