import React, { useState, useEffect } from "react";
import { Button, Tooltip, useToast } from "@chakra-ui/react";
import { useFabricOverlayState } from "../../state/store";
import CLSReport from "./CLSReport";
import _ from "lodash";

const CLSReportHelper = ({
  restProps,
  caseInfo,
  viewerId,
  questions,
  userInfo,
  responseHandler,
  questionnaireResponse,
}) => {
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { viewerWindow } = fabricOverlayState;
  const { slideId } = viewerWindow[viewerId];
  const [showCLSreport, setShowCLSReport] = useState(false);
  const [questionsResponse, setQuestionsResponse] = useState();
  const [slideQuestions, setSlideQuestions] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [slideQna, setSlideQna] = useState({
    qna: {},
  });
  //get questions and response
  useEffect(() => {
    async function fetchResponse() {
      const response = await questionnaireResponse({
        slide_id: slideId,
        case_id: caseInfo?.caseId,
      });
      setQuestionsResponse(response?.data?.data?.finalQuestionnaireResponse);
    }
    fetchResponse();
    async function fetchQuestions() {
      const response = await questions({ studyId: caseInfo?.caseId });
      setSlideQuestions(response?.data?.data?.desiredQuestionsInfo);
    }
    fetchQuestions();
  }, [slideId, caseInfo?.caseId, showCLSreport]);

  const handleCLSReport = () => {
    setShowCLSReport(!showCLSreport);
    setSlideQna({ qna: {} });
  };
  const response = Object.values(slideQna?.qna);
  const submitQnaReport = async () => {
    try {
      setLoading(true);
      await responseHandler({
        slide_id: slideId,
        response: response,
        case_id: caseInfo?.caseId,
      });
      setShowCLSReport(!showCLSreport);
      setLoading(false);
      toast({
        status: "success",
        title: "Successfully Reported",
        duration: 1500,
        isClosable: true,
      });
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
  return (
    <>
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
      ) : !questionsResponse ? (
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
            disabled={questions?.length !== response?.length}
          >
            Submit Report
          </Button>
        </Tooltip>
      ) : null}
      {showCLSreport && (
        <CLSReport
          questions={slideQuestions}
          caseInfo={caseInfo}
          userInfo={userInfo}
          responseHandler={responseHandler}
          handleCLSReport={handleCLSReport}
          slideQna={slideQna}
          setSlideQna={setSlideQna}
          questionsResponse={questionsResponse}
          slideId={slideId}
          loading={loading}
        />
      )}
    </>
  );
};

export default CLSReportHelper;
