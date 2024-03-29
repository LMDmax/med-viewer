import React, { useEffect, useState } from "react";
import {
  Radio,
  Flex,
  HStack,
  Input,
  Text,
  Textarea,
  VStack,
  RadioGroup,
  useToast,
} from "@chakra-ui/react";
import SRHelper from "./SRHelper";
import Loading from "../Loading/loading";
import SubmitHelper from "./SubmitHelper";
import { SAVE_SYNOPTIC_REPORT } from "../../graphql/annotaionsQuery";
import { useLazyQuery, useMutation, useSubscription } from "@apollo/client";
const ProstateCancer = ({
  slideId,
  caseId,
  saveSynopticReport,
  getSynopticReport,
  setSynopticType,
  userInfo,
  synopticReportData,
  reportedStatus,
  updateSynopticReport,
}) => {
  const toast = useToast();
  const [onSaveSynopticReport, { data: analysis_data, error: analysis_error }] =
    useMutation(SAVE_SYNOPTIC_REPORT);
  const [newInputData, setNewInputData] = useState("");
  const [inputData, setInputData] = useState({
    isPreviousHistory: "",
    previousBiopsy: "",
    previousTherapy: "",
    clinicalSymptoms: "",
    preBiopsySerumPSA: "",
    clinicalStage: "",
    leftBaseCores: "",
    leftBaseLength: "",
    leftBaseHistologicalTumourType: "",
    coExistentPathology: "",
    leftMidCores: "",
    leftMidLength: "",
    leftMidHistologicalTumourType: "",
    leftMidGleasonScore: "",
    isUpGrade: "",
    gleasonPattern: "",
    leftMidPerineuralInvasion: "",
    leftMidSeminalInvasion: "",
    leftMidLymphovascularInvasion: "",
    leftMidExtraprostateExtension: "",
    leftMidIntraductualProstate: "",
    leftMidCoexistentExtension: "",
    leftApexCores: "",
    leftApexLength: "",
    leftApexPerineuralInvasion: "",
    leftApexSeminalInvasion: "",
    leftApexLymphovascularInvasion: "",
    leftApexExtraprostateExtension: "",
    leftApexIntraductualProstate: "",
    leftApexCoexistentExtension: "",
    rightBaseCores: "",
    rightBaseLength: "",
    rightMidCores: "",
    rightMidLength: "",
    rightApexCores: "",
    rightApexLength: "",
    comments: "",
  });
  const reportData = [
    {
      title: "PREV.HISTORY OF PROSTATE CANCER",
      inputName: "isPreviousHistory",
      options: ["Yes", "No"],
    },
    {
      title: "PREVIOUS BIOPSY",
      inputName: "previousBiopsy",
      options: ["Previous biopsy: Gleason 3+3=6 left mid"],
    },
    {
      title: "PREVIOUS THERAPY",
      inputName: "previousTherapy",
      options: ["Yes", "No", "Nil"],
    },
    {
      title: "CLINICAL SYMPTOMS",
      inputName: "clinicalSymptoms",
      options: ["Yes", "No", "No symptoms"],
    },
    {
      title: "PRE-BIOPSY SERUM PSA",
      inputName: "preBiopsySerumPSA",
      options: ["8.9 ng/ml", "2"],
    },
    {
      title: "CLINICAL STAGE",
      inputName: "clinicalStage",
      options: ["No known metastases"],
    },
    {
      title: "NUMBER OF CORES",
      inputName: "leftBaseCores",
      options: ["1", "2", "3"],
    },
    {
      title: "LENGHTS(S)",
      inputName: "leftBaseLength",
      type: "number",
    },
    {
      title: "HISTOLOGICAL TUMOUR TYPE",
      inputName: "leftBaseHistologicalTumourType",
    },
    {
      title: "COEXISTENT PATHOLOGY",
      inputName: "coExistentPathology",
    },
    {
      title: "NUMBER OF CORES",
      inputName: "leftMidCores",
      options: ["1", "2", "3"],
    },
    {
      title: "LENGHTS(S)",
      inputName: "leftMidLength",
      type: "number",
    },
    {
      title: "HISTOLOGICAL TUMOUR TYPE",
      inputName: "leftMidHistologicalTumourType",
    },
    {
      title: "GLEASON SCORE",
      inputName: "leftMidGleasonScore",
      type: "number",
    },
    {
      title: "ISUP GRADE",
      inputName: "isUpGrade",
      type: "number",
    },
    {
      title: "GLEASON PATTERN",
      inputName: "gleasonPattern",
    },
    {
      title: "PERINEURAL INVASION",
      inputName: "leftMidPerineuralInvasion",
      options: ["Yes", "No", "Present"],
    },
    {
      title: "SEMINAL VESICLE INVASUION",
      inputName: "leftMidSeminalInvasion",
      options: ["Yes", "No", "Not Identified"],
    },
    {
      title: "LYMPHOVASCULAR INVASION",
      inputName: "leftMidLymphovascularInvasion",
      options: ["Yes", "No", "Not Identified"],
    },
    {
      title: "EXTRAPROSTATIC EXTENSIONM",
      inputName: "leftMidExtraprostateExtension",
      options: ["Yes", "No", "Not Identified"],
    },
    {
      title: "INTRADUCTUAL CA.OF PROSTATE",
      inputName: "leftMidIntraductualProstate",
      options: ["Yes", "No", "Not Identified"],
    },
    {
      title: "COEXISTENT EXTENSION",
      inputName: "leftMidCoexistentExtension",
      options: ["Yes", "No", "Not Identified"],
    },
    {
      title: "NUMBER OF CORES",
      inputName: "leftApexCores",
      options: ["1", "2", "3"],
    },
    {
      title: "LENGHTS(S)",
      inputName: "leftApexLength",
      type: "number",
    },
    {
      title: "PERINEURAL INVASION",
      inputName: "leftApexPerineuralInvasion",
      options: ["Yes", "No", "Present"],
    },
    {
      title: "SEMINAL VESICLE INVASUION",
      inputName: "leftApexSeminalInvasion",
      options: ["Yes", "No", "Not Identified"],
    },
    {
      title: "LYMPHOVASCULAR INVASION",
      inputName: "leftApexLymphovascularInvasion",
      options: ["Yes", "No", "Not Identified"],
    },
    {
      title: "EXTRAPROSTATIC EXTENSIONM",
      inputName: "leftApexExtraprostateExtension",
      options: ["Yes", "No", "Not Identified"],
    },
    {
      title: "INTRADUCTUAL CA.OF PROSTATE",
      inputName: "leftApexIntraductualProstate",
      options: ["Yes", "No", "Not Identified"],
    },
    {
      title: "COEXISTENT EXTENSION",
      inputName: "leftApexCoexistentExtension",
      options: ["Yes", "No", "Not Identified"],
    },
    {
      title: "NUMBER OF CORES",
      inputName: "rightBaseCores",
      options: ["1", "2", "3"],
    },
    {
      title: "LENGHTS(S)",
      inputName: "rightBaseLength",
      type: "number",
    },
    {
      title: "NUMBER OF CORES",
      inputName: "rightMidCores",
      options: ["1", "2", "3"],
    },
    {
      title: "LENGHTS(S)",
      inputName: "rightMidLength",
      type: "number",
    },
    {
      title: "NUMBER OF CORES",
      inputName: "rightApexCores",
      options: ["1", "2", "3"],
    },
    {
      title: "LENGHTS(S)",
      inputName: "rightApexLength",
      type: "number",
    },
  ];

  const handleInput = (e) => {
    if (reportedStatus === true) {
      setNewInputData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    } else
      setInputData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
  };

  // const submitReport = async () => {
  //   try {
  //     await saveSynopticReport({
  //       isPreviousHistory: inputData.isPreviousHistory,
  //       previousBiopsy: inputData.previousBiopsy,
  //       previousTherapy: inputData.previousTherapy,
  //       preBiopsySerumPSA: inputData.preBiopsySerumPSA,
  //       clinicalSymptoms: inputData.clinicalSymptoms,
  //       clinicalStage: inputData.clinicalStage,
  //       leftBaseCores: inputData.leftBaseCores,
  //       leftBaseLength: inputData.leftBaseLength,
  //       leftBaseHistologicalTumourType:
  //         inputData.leftBaseHistologicalTumourType,
  //       coExistentPathology: inputData.coExistentPathology,
  //       leftMidCores: inputData.leftMidCores,
  //       leftMidLength: inputData.leftMidLength,
  //       leftMidHistologicalTumourType: inputData.leftMidHistologicalTumourType,
  //       leftMidGleasonScore: inputData.leftMidGleasonScore,
  //       isUpGrade: inputData.isUpGrade,
  //       gleasonPattern: inputData.gleasonPattern,
  //       leftMidPerineuralInvasion: inputData.leftMidPerineuralInvasion,
  //       leftMidSeminalInvasion: inputData.leftMidSeminalInvasion,
  //       leftMidLymphovascularInvasion: inputData.leftMidLymphovascularInvasion,
  //       leftMidExtraprostateExtension: inputData.leftMidExtraprostateExtension,
  //       leftMidIntraductualProstate: inputData.leftMidIntraductualProstate,
  //       leftMidCoexistentExtension: inputData.leftMidCoexistentExtension,
  //       leftApexCores: inputData.leftApexCores,
  //       leftApexLength: inputData.leftApexLength,
  //       leftApexPerineuralInvasion: inputData.leftApexPerineuralInvasion,
  //       leftApexSeminalInvasion: inputData.leftApexSeminalInvasion,
  //       leftApexLymphovascularInvasion:
  //         inputData.leftApexLymphovascularInvasion,
  //       leftApexExtraprostateExtension:
  //         inputData.leftApexExtraprostateExtension,
  //       leftApexIntraductualProstate: inputData.leftApexIntraductualProstate,
  //       leftApexCoexistentExtension: inputData.leftApexCoexistentExtension,
  //       rightBaseCores: inputData.rightBaseCores,
  //       rightBaseLength: inputData.rightBaseLength,
  //       rightMidCores: inputData.rightMidCores,
  //       rightMidLength: inputData.rightMidLength,
  //       rightApexCores: inputData.rightApexCores,
  //       rightApexLength: inputData.rightApexLength,
  //       comments: inputData.comments,
  //       slideId,
  //       caseId,
  //       reportType: "prostate-cancer-report",
  //     }).unwrap();
  //     toast({
  //       description: "Report submitted sucessfully",
  //       status: "success",
  //       duration: 2000,
  //     });
  //     setSynopticType("");
  //   } catch (err) {
  //     toast({
  //       description: err?.data?.message
  //         ? err?.data?.message
  //         : "something went wrong",
  //       status: "error",
  //       duration: 2000,
  //     });
  //   }
  // };

  const submitReport = async () => {
    try {
      const { data } = await onSaveSynopticReport({
        variables: {
          body: {
            caseId,
            data: {
              isPreviousHistory: inputData.isPreviousHistory,
              previousBiopsy: inputData.previousBiopsy,
              previousTherapy: inputData.previousTherapy,
              preBiopsySerumPSA: inputData.preBiopsySerumPSA,
              clinicalSymptoms: inputData.clinicalSymptoms,
              clinicalStage: inputData.clinicalStage,
              leftBaseCores: inputData.leftBaseCores,
              leftBaseLength: inputData.leftBaseLength,
              leftBaseHistologicalTumourType:
                inputData.leftBaseHistologicalTumourType,
              coExistentPathology: inputData.coExistentPathology,
              leftMidCores: inputData.leftMidCores,
              leftMidLength: inputData.leftMidLength,
              leftMidHistologicalTumourType:
                inputData.leftMidHistologicalTumourType,
              leftMidGleasonScore: inputData.leftMidGleasonScore,
              isUpGrade: inputData.isUpGrade,
              gleasonPattern: inputData.gleasonPattern,
              leftMidPerineuralInvasion: inputData.leftMidPerineuralInvasion,
              leftMidSeminalInvasion: inputData.leftMidSeminalInvasion,
              leftMidLymphovascularInvasion:
                inputData.leftMidLymphovascularInvasion,
              leftMidExtraprostateExtension:
                inputData.leftMidExtraprostateExtension,
              leftMidIntraductualProstate:
                inputData.leftMidIntraductualProstate,
              leftMidCoexistentExtension: inputData.leftMidCoexistentExtension,
              leftApexCores: inputData.leftApexCores,
              leftApexLength: inputData.leftApexLength,
              leftApexPerineuralInvasion: inputData.leftApexPerineuralInvasion,
              leftApexSeminalInvasion: inputData.leftApexSeminalInvasion,
              leftApexLymphovascularInvasion:
                inputData.leftApexLymphovascularInvasion,
              leftApexExtraprostateExtension:
                inputData.leftApexExtraprostateExtension,
              leftApexIntraductualProstate:
                inputData.leftApexIntraductualProstate,
              leftApexCoexistentExtension:
                inputData.leftApexCoexistentExtension,
              rightBaseCores: inputData.rightBaseCores,
              rightBaseLength: inputData.rightBaseLength,
              rightMidCores: inputData.rightMidCores,
              rightMidLength: inputData.rightMidLength,
              rightApexCores: inputData.rightApexCores,
              rightApexLength: inputData.rightApexLength,
              comments: inputData.comments,
              reportType: "prostate-cancer-report",
            },
          },
        },
      });

      // send data to hospital DB
      await saveSynopticReport({
        isPreviousHistory: inputData.isPreviousHistory,
        previousBiopsy: inputData.previousBiopsy,
        previousTherapy: inputData.previousTherapy,
        preBiopsySerumPSA: inputData.preBiopsySerumPSA,
        clinicalSymptoms: inputData.clinicalSymptoms,
        clinicalStage: inputData.clinicalStage,
        leftBaseCores: inputData.leftBaseCores,
        leftBaseLength: inputData.leftBaseLength,
        leftBaseHistologicalTumourType:
          inputData.leftBaseHistologicalTumourType,
        coExistentPathology: inputData.coExistentPathology,
        leftMidCores: inputData.leftMidCores,
        leftMidLength: inputData.leftMidLength,
        leftMidHistologicalTumourType: inputData.leftMidHistologicalTumourType,
        leftMidGleasonScore: inputData.leftMidGleasonScore,
        isUpGrade: inputData.isUpGrade,
        gleasonPattern: inputData.gleasonPattern,
        leftMidPerineuralInvasion: inputData.leftMidPerineuralInvasion,
        leftMidSeminalInvasion: inputData.leftMidSeminalInvasion,
        leftMidLymphovascularInvasion: inputData.leftMidLymphovascularInvasion,
        leftMidExtraprostateExtension: inputData.leftMidExtraprostateExtension,
        leftMidIntraductualProstate: inputData.leftMidIntraductualProstate,
        leftMidCoexistentExtension: inputData.leftMidCoexistentExtension,
        leftApexCores: inputData.leftApexCores,
        leftApexLength: inputData.leftApexLength,
        leftApexPerineuralInvasion: inputData.leftApexPerineuralInvasion,
        leftApexSeminalInvasion: inputData.leftApexSeminalInvasion,
        leftApexLymphovascularInvasion:
          inputData.leftApexLymphovascularInvasion,
        leftApexExtraprostateExtension:
          inputData.leftApexExtraprostateExtension,
        leftApexIntraductualProstate: inputData.leftApexIntraductualProstate,
        leftApexCoexistentExtension: inputData.leftApexCoexistentExtension,
        rightBaseCores: inputData.rightBaseCores,
        rightBaseLength: inputData.rightBaseLength,
        rightMidCores: inputData.rightMidCores,
        rightMidLength: inputData.rightMidLength,
        rightApexCores: inputData.rightApexCores,
        rightApexLength: inputData.rightApexLength,
        comments: inputData.comments,
        slideId,
        caseId,
        reportType: "prostate-cancer-report",
      }).unwrap();
      if (data && data.autoSaveSynopticReport.success) {
        toast({
          description: "Report submitted successfully",
          status: "success",
          duration: 2000,
        });
        setSynopticType("");
      } else {
        toast({
          description:
            data.autoSaveSynopticReport.message || "Something went wrong",
          status: "error",
          duration: 2000,
        });
      }
    } catch (error) {
      toast({
        description: error.message || "Something went wrong",
        status: "error",
        duration: 2000,
      });
    }
  };

  // check the values of inputData
  const answeredAll = Object.keys(inputData).every((k) => inputData[k] !== "");

  // handle report update
  const handleUpdate = async () => {
    try {
      if (newInputData === "") {
        toast({
          description: "No fields are changed.Try again updating fields",
          status: "error",
          duration: 2000,
        });
      } else {
        const updatedData = {
          ...newInputData,
          caseId,
          reportType: "prostate-cancer-synoptic-report",
        };
        await updateSynopticReport(updatedData).unwrap();
        toast({
          description: "Report submitted sucessfully",
          status: "success",
          duration: 2000,
        });
        setSynopticType("");
      }
    } catch (err) {
      toast({
        description: err?.data?.message
          ? err?.data?.message
          : "something went wrong",
        status: "error",
        duration: 2000,
      });
    }
  };
  return synopticReportData === "Loading" ? (
    <Flex w="100%" h="100%" justifyContent="center" alignItems="center">
      <Loading />
    </Flex>
  ) : (
    <Flex px="1.6vw" w="100%" fontSize="14px" direction="column">
      <Flex bg="#F7FBFD" h="3vh" minH="30px" w="100%" alignItems="center">
        <Text fontWeight="600" pl="0.3vw">
          CLINICAL
        </Text>
      </Flex>
      <Flex w="100%" flex="1" flexWrap="wrap" justifyContent="space-between">
        {reportData.slice(0, 6).map((inputField, index) => {
          return (
            <SRHelper
              inputField={inputField}
              key={`${index + 1}`}
              handleInput={handleInput}
              inputData={inputData}
              synopticReportData={synopticReportData}
            />
          );
        })}
      </Flex>
      <Flex direction="column">
        <Flex
          bg="#F7FBFD"
          h="3vh"
          minH="30px"
          w="100%"
          alignItems="center"
          px="0.3vw"
          my="1vh"
        >
          <Text fontWeight="600">MACROSCOPIC</Text>
        </Flex>
        <Text fontWeight="600">1.LEFT BASE</Text>
        <Flex w="100%" flex="1" flexWrap="wrap" justifyContent="space-between">
          {reportData.slice(6, 10).map((inputField, index) => {
            return (
              <SRHelper
                inputField={inputField}
                key={`${index + 1}`}
                handleInput={handleInput}
                inputData={inputData}
                synopticReportData={synopticReportData}
              />
            );
          })}
        </Flex>
        <Text fontWeight="600">2.LEFT MID</Text>
        <Flex w="100%" flex="1" flexWrap="wrap" justifyContent="space-between">
          {reportData.slice(10, 22).map((inputField, index) => {
            return (
              <SRHelper
                inputField={inputField}
                key={`${index + 1}`}
                handleInput={handleInput}
                inputData={inputData}
                synopticReportData={synopticReportData}
              />
            );
          })}
        </Flex>
        <Text fontWeight="600">3.LEFT APEX</Text>
        <Flex w="100%" flex="1" flexWrap="wrap" justifyContent="space-between">
          {reportData.slice(22, 30).map((inputField, index) => {
            return (
              <SRHelper
                inputField={inputField}
                key={`${index + 1}`}
                handleInput={handleInput}
                inputData={inputData}
                synopticReportData={synopticReportData}
              />
            );
          })}
        </Flex>

        <Text fontWeight="600">4.RIGHT BASE</Text>
        <HStack
          flex="1"
          flexDirection="column"
          alignItems="flex-start"
          my="1vh"
          mt="-0rem !important"
        >
          <VStack w="50%" alignItems="flex-start">
            <Text fontWeight="600">NUMBER OF CORES</Text>
            {synopticReportData.message === "Report successfully found" ? (
              <Text>{synopticReportData?.data?.rightBaseCores}</Text>
            ) : (
              <HStack mt="-0rem !important" color="#8F8F8F">
                <input
                  type="radio"
                  id="rightBaseCores1"
                  name="rightBaseCores"
                  value="1"
                  onClick={handleInput}
                  // checked={synopticReportData?.data?.rightBaseCores === "1"}
                />
                <label htmlFor="rightBaseCores1">1</label>

                <input
                  type="radio"
                  id="rightBaseCores2"
                  name="rightBaseCores"
                  value="2"
                  onClick={handleInput}
                  // checked={synopticReportData?.data?.rightBaseCores === "2"}
                />
                <label htmlFor="rightBaseCores2">2</label>

                <input
                  type="radio"
                  id="rightBaseCores3"
                  name="rightBaseCores"
                  value="3"
                  onClick={handleInput}
                  // checked={synopticReportData?.data?.rightBaseCores === "3"}
                />
                <label htmlFor="rightBaseCores3">3s</label>
              </HStack>
            )}
          </VStack>
          <VStack w="50%" alignItems="flex-start">
            <Text fontWeight="600">LENGHTS(S)</Text>
            <Input
              size="sm"
              borderRadius="0"
              defaultValue={synopticReportData?.data?.rightBaseLength}
              name="rightBaseLength"
              onChange={handleInput}
              type="number"
              onWheel={(e) => e.target.blur()}
            />
          </VStack>
        </HStack>
        <Text fontWeight="600">5.RIGHT MID</Text>
        {synopticReportData.message === "Report successfully found" ? (
          <Text>{synopticReportData?.data?.rightMidCores}</Text>
        ) : (
          <HStack mt="-0rem !important" color="#8F8F8F">
            <input
              type="radio"
              id="rightMidCores1"
              name="rightMidCores"
              value="1"
              onClick={handleInput}
              style={{ cursor: "pointer" }}
              // checked={synopticReportData?.data?.rightMidCores === "1"}
            />
            <label style={{ cursor: "pointer" }} htmlFor="rightMidCores1">
              1
            </label>

            <input
              type="radio"
              id="rightMidCores2"
              name="rightMidCores"
              value="2"
              onClick={handleInput}
              style={{ cursor: "pointer" }}
              // checked={synopticReportData?.data?.rightMidCores === "2"}
            />
            <label style={{ cursor: "pointer" }} htmlFor="rightMidCores2">
              2
            </label>

            <input
              type="radio"
              id="rightMidCores3"
              name="rightMidCores"
              value="3"
              onClick={handleInput}
              style={{ cursor: "pointer" }}
              // checked={synopticReportData?.data?.rightMidCores === "3"}
            />
            <label style={{ cursor: "pointer" }} htmlFor="rightMidCores3">
              3
            </label>
          </HStack>
        )}
        <Text fontWeight="600">6.RIGHT APEX</Text>
        <HStack
          flex="1"
          flexDirection="column"
          alignItems="flex-start"
          my="1vh"
          mt="-0rem !important"
        >
          <VStack minW="50%" alignItems="flex-start">
            <Text fontWeight="600">NUMBER OF CORES</Text>
            {synopticReportData.message === "Report successfully found" ? (
              <Text>{synopticReportData?.data?.rightApexCores}</Text>
            ) : (
              <HStack mt="-0rem  !important" color="#8F8F8F">
                <input
                  type="radio"
                  id="rightApexCores1"
                  name="rightApexCores"
                  value="1"
                  onClick={handleInput}
                  style={{ cursor: "pointer" }}
                  // checked={synopticReportData?.data?.rightApexCores === "1"}
                  disabled={
                    synopticReportData.message === "Report successfully found"
                  }
                />
                <label style={{ cursor: "pointer" }} htmlFor="rightApexCores1">
                  1
                </label>

                <input
                  type="radio"
                  id="rightApexCores2"
                  name="rightApexCores"
                  value="2"
                  onClick={handleInput}
                  style={{ cursor: "pointer" }}
                  disabled={
                    synopticReportData.message === "Report successfully found"
                  }
                  // checked={synopticReportData?.data?.rightApexCores === "2"}
                />
                <label style={{ cursor: "pointer" }} htmlFor="rightApexCores2">
                  2
                </label>

                <input
                  type="radio"
                  id="rightApexCores3"
                  name="rightApexCores"
                  value="3"
                  onClick={handleInput}
                  style={{ cursor: "pointer" }}
                  disabled={
                    synopticReportData.message === "Report successfully found"
                  }
                  // checked={synopticReportData?.data?.rightApexCores === "3"}
                />
                <label style={{ cursor: "pointer" }} htmlFor="rightApexCores3">
                  3
                </label>
              </HStack>
            )}
          </VStack>
          <VStack minW="50%" alignItems="flex-start">
            <Text fontWeight="600">LENGHTS(S)</Text>
            <Input
              size="sm"
              borderRadius="0"
              defaultValue={
                synopticReportData?.data?.rightApexLength !== ""
                  ? synopticReportData?.data?.rightApexLength
                  : ""
              }
              name="rightApexLength"
              onChange={handleInput}
              type="number"
              onWheel={(e) => e.target.blur()}
              disabled={
                synopticReportData.message === "Report successfully found"
              }
            />
          </VStack>
        </HStack>
        <VStack alignItems="flex-start" pb="2vh">
          <Text fontWeight="600">COMMENT</Text>
          <Textarea
            resize="none"
            w="90%"
            name="comments"
            defaultValue={synopticReportData?.data?.comments}
            onChange={handleInput}
            disabled={
              synopticReportData.message === "Report successfully found"
            }
          />
        </VStack>
      </Flex>
      {userInfo?.userType !== "technologist" &&
      synopticReportData.message === "Report not found" ? (
        <SubmitHelper
          userInfo={userInfo}
          reportedStatus={reportedStatus}
          answeredAll={answeredAll}
          submitReport={submitReport}
          newInputData={newInputData}
          handleUpdate={handleUpdate}
        />
      ) : (
        ""
      )}
    </Flex>
  );
};

export default ProstateCancer;
