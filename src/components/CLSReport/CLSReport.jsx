import React, { useEffect, useState } from "react";

import {
  Flex,
  IconButton,
  useMediaQuery,
  Text,
  Spinner,
  Button,
  Image,
  Box,
} from "@chakra-ui/react";
import { AiOutlineClose } from "react-icons/ai";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { GrDownload } from "react-icons/gr";
import DownloadReport from "./DownloadReport";
import Questionnaire from "../Qna/questionnaire";

function CLSReport({
  questions,
  handleCLSReport,
  slideQna,
  setSlideQna,
  questionsResponse,
  loading,
  setChangeSlide,
  slideName,
  isUpdating,
  application,
  questionIndex,
  slideInfo,
  slideId,
  userInfo,
  caseInfo,
  errorMessage,
  slides,
  submitQnaReport,
  All_Reader_Responses,
}) {
  const [ifWidthLessthan1920] = useMediaQuery("(max-width:1920px)");
  return (
    <Flex
      fontSize="12px"
      fontFamily="inter"
      w="100%"
      h={ifWidthLessthan1920 ? "calc(100vh - 80px)" : "90.926vh"}
      top={ifWidthLessthan1920 ? "30px" : "9.999vh"}
      pos="absolute"
      left="0px"
      bg="#FCFCFC"
      flexDirection="column"
    >
      <>
        <Flex
          w="100%"
          justifyContent="space-between"
          alignItems="center"
          // h="4vh"
          minH="5vh"
          px="1vw"
        >
          <Box w="95%" borderBottom="1px solid #DEDEDE" pb="5px">
            {application === "clinical" ? (
              <Text fontWeight="400" fontFamily="inter">
                PI : Dr. {caseInfo?.firstName} {caseInfo?.lastName}
              </Text>
            ) : null}
          </Box>
          {application === "clinical" &&
            userInfo?.role === "Pathologist" &&
            errorMessage?.data?.status !== "400" &&
            questionsResponse?.finalQuestionnaireResponse?.length > 0 && (
              <DownloadReport
                report={questionsResponse}
                caseInfo={caseInfo}
                userInfo={userInfo}
              />
            )}
        </Flex>

        <Questionnaire
          questions={questions}
          slideQna={slideQna}
          setSlideQna={setSlideQna}
          response={questionsResponse}
          questionIndex={questionIndex}
          slideId={slideId}
          setChangeSlide={setChangeSlide}
          submitQnaReport={submitQnaReport}
          application={application}
          userInfo={userInfo}
          caseInfo={caseInfo}
          slideInfo={slideInfo}
          slideName={slideName}
          slides={slides}
          All_Reader_Responses={All_Reader_Responses}
        />
      </>
      {/* )} */}
    </Flex>
  );
}

export default CLSReport;
