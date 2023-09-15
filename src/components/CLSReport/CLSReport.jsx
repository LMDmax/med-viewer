import React, { useEffect, useState } from "react";

import {
  Flex,
  IconButton,
  useMediaQuery,
  Text,
  Spinner,
  Button,
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
  isUpdating,
  application,
  questionIndex,
  slideId,
  userInfo,
  caseInfo,
  errorMessage,
}) {
  const [ifWidthLessthan1920] = useMediaQuery("(max-width:1920px)");

  return (
    <Flex
      fontSize="12px"
      fontFamily="inter"
      w="100%"
      h={ifWidthLessthan1920 ? "calc(100vh - 90px)" : "90.926vh"}
      top={ifWidthLessthan1920 ? "30px" : "9.999vh"}
      pos="absolute"
      right="0px"
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
          border="1px solid #000"
        >
          <Text fontSize="16px" color="1B75BC">
            {application === "clinical" ? "Questionnaire" : "Questions"}
          </Text>
          {application === "clinical" &&
            userInfo?.role === "Pathologist" &&
            errorMessage?.data?.status !== "400" && (
              <PDFDownloadLink
                document={
                  <DownloadReport
                    report={questionsResponse?.finalQuestionnaireResponse}
                    caseInfo={caseInfo}
                    userInfo={userInfo}
                  />
                }
                fileName="study-report.pdf"
              >
                <Button
                  leftIcon={<GrDownload />}
                  size="sm"
                  fontWeight="400"
                  borderRadius="0px"
                  _active={{ outline: "none" }}
                  _focus={{ outline: "none" }}
                  bg="#fff"
                  _hover={{ bg: "#fff" }}
                >
                  Download
                </Button>
              </PDFDownloadLink>
            )}
        </Flex>

        <Questionnaire
          questions={questions}
          slideQna={slideQna}
          setSlideQna={setSlideQna}
          response={questionsResponse}
          questionIndex={questionIndex}
          slideId={slideId}
          application={application}
        />
      </>
      {/* )} */}
    </Flex>
  );
}

export default CLSReport;
