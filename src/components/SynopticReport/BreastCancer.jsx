import {
  Flex,
  HStack,
  Input,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import _ from "lodash";
import React, { useState, useEffect } from "react";
import Loading from "../Loading/loading";
import SRHelper from "./SRHelper";
import SubmitHelper from "./SubmitHelper";

const BreastCancer = ({
  saveSynopticReport,
  slideId,
  caseId,
  getSynopticReport,
  setSynopticType,
  userInfo,
  updateSynopticReport,
}) => {
  const toast = useToast();
  const [synopticReportData, setSynopticReportData] = useState("");
  const [newInputData, setNewInputData] = useState("");
  const [reportedStatus, setReportedStatus] = useState(false);

  useEffect(() => {
    setSynopticReportData("Loading");
    async function getData() {
      const response = await getSynopticReport({
        reportType: "breast-cancer",
        caseId,
      });
      setSynopticReportData(response?.data?.data);
      if (response?.status === "fulfilled") {
        setReportedStatus(true);
      }
    }
    getData();
  }, [caseId]);
  const [inputData, setInputData] = useState({
    dataRecieved: "",
    specimenType: "",
    specimenRadiographProvided: "",
    radiologyAbnormalitySeen: "",
    rGrade: "",
    radiologyLesion: "",
    specimenWeight: "",
    ellipseOfSkin: "",
    nipple: "",
    histologicalClassificationPresent: "",
    fibrofattyTissue: "",
    lesionMeasures: "",
    site: "",
    macroscopicDistance: "",
    comments: "",
    invasiveTumourSize: "",
    wholeTumourSize: "",
    invasiveGrade: "",
    tumourExtent: "",
    type: "",
    typeForComponents: "",
    grade: "",
    associatedDcis: "",
    dcisGrade: "",
    isSituLobularNeoplasia: "",
    isPagetDisease: "",
    pureDcisSize: "",
    pureDcisGrade: "",
    dcisArchitecture: "",
    dcisNecrosis: "",
    isLcis: "",
    microInvasion: "",
    pagetDisease: "",
  });
  const reportData = [
    {
      title: "DATA RECEIVED",
      inputName: "dataRecieved",
      options: ["Left", "Right"],
    },
    {
      title: "SPECIMEN TYPE",
      inputName: "specimenType",
      options: [
        "Diagnostic marker",
        "Radical mastectomy",
        "Wide local excision",
        "Therapeutic marker",
        "Simple mastectomy",
        "Subcutaneous",
        "Re-excision",
        "Others",
      ],
    },
    {
      title: "SPECIMEN RADIOGRAPHY PROVIDED",
      inputName: "specimenRadiographProvided",
      options: ["Yes", "No"],
    },
    {
      title: "RADIOLOGICAL ABNORMALITY SEEN",
      inputName: "radiologyAbnormalitySeen",
      options: ["Yes", "No", "Unsure"],
    },
    {
      title: "R GRADE",
      inputName: "rGrade",
      options: ["1", "2", "3", "4", "5"],
    },
    {
      title: "RADIOLOGICAL LESION",
      inputName: "radiologyLesion",
      options: [
        "Circumscribed mass",
        "Parenchymal deformity",
        "Stellate lesion",
        "Calcification",
        "Other",
      ],
    },
    {
      title: "SPECIMEN WEIGHT",
      inputName: "specimenWeight",
      type: "number",
    },
    {
      title: "ELLIPSE OF SKIN",
      inputName: "ellipseOfSkin",
    },
    {
      title: "NIPPLE",
      inputName: "nipple",
      options: ["Normal", "Indrawn", "Not assessable"],
    },
    {
      title: "HISTOLOGICAL CLASIFICATION PRESENT",
      inputName: "histologicalClassificationPresent",
      options: ["Benign", "Benign and malignant", "Malignant", "absent"],
    },
    {
      title: " FIBROFATTY TISSUE",
      inputName: "fibrofattyTissue",
    },
    {
      title: "LESION MEASURES",
      inputName: "lesionMeasures",
    },
    {
      title: "SITE",
      inputName: "site",
      options: ["OUQ", "OLQ", "IUQ", "LLQ", "Retroareolar", "Not know"],
    },
    {
      title: "GRADE",
      inputName: "invasiveGrade",
      options: ["1", "2", "3", "4", "N/A"],
    },
    {
      title: "TUMOUR EXTENT",
      inputName: "tumourExtent",
      options: ["Localised", "Multiple, evasive foc"],
    },
    {
      title: "TYPE",
      inputName: "type",
      options: [
        "No special type (ductal NST)",
        "Pure special type (90% purity, specify components present below)",
        "Mixed tumour type (50–90% special type component, specify components present below)",
        "IUQ",
        "Other malignant tumour (please specify)",
        "Not know",
      ],
    },
    {
      title:
        "SPECIFY TYPE COMPONENT(S) PRESENT FOR PURE SPECIAL TYPE AND MIXED TUMOUR TYPES:",
      inputName: "typeForComponents",
      options: [
        "Tubular/cribriform",
        "Lobular",
        "Ductal/no special type",
        "Mucinous",
        "Medullary like",
      ],
    },
    {
      title: "GRADE",
      inputName: "grade",
      options: ["Not seen", "Possible"],
    },
    {
      title: "ASSOCIATED DCIS",
      inputName: "associatedDcis",
      options: ["None", "Minimal", "Extensive"],
    },
    {
      title: "DCIS GRADE",
      inputName: "dcisGrade",
      options: ["Low", "High", "Intermediate"],
    },
    {
      title: "IN SITU LOBULAR NEOPLASIA PRESENT",
      inputName: "isSituLobularNeoplasia",
      options: ["Yes", "No"],
    },
    {
      title: "PAGET'S DISEASE PRESENT",
      inputName: "isPagetDisease",
      options: ["Yes", "No"],
    },
    {
      title: "DCIS GRADE",
      inputName: "pureDcisGrade",
      options: ["Low", "High", "Intermediate"],
    },
    {
      title: "DCIS ARCHITECTURE",
      inputName: "dcisArchitecture",
      options: ["Solid", "Cribriform", "Micropapillary", "Papillary", "Other"],
    },
    {
      title: "DCIS NERCROSIS",
      inputName: "dcisNecrosis",
      options: ["Yes", "No"],
    },
    {
      title: "LCIS PRESENT",
      inputName: "isLcis",
      options: ["Yes", "No"],
    },
    {
      title: "MICROINVASIVE",
      inputName: "microInvasion",
      options: ["Yes", "No"],
    },
    {
      title: "PAGET'S DISEASE",
      inputName: "pagetDisease",
      options: ["Yes", "No"],
    },
  ];
  // check the values of inputData
  const answeredAll = Object.keys(inputData).every((k) => inputData[k] !== "");

  // handle input onChange
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
  // submit report handler
  const submitReport = async () => {
    try {
      await saveSynopticReport({
        dataRecieved: inputData.dataRecieved,
        specimenType: inputData.specimenType,
        specimenRadiographProvided: inputData.specimenRadiographProvided,
        radiologyAbnormalitySeen: inputData.radiologyAbnormalitySeen,
        rGrade: inputData.rGrade,
        radiologyLesion: inputData.radiologyLesion,
        specimenWeight: inputData.specimenWeight,
        ellipseOfSkin: inputData.ellipseOfSkin,
        nipple: inputData.nipple,
        histologicalClassificationPresent:
          inputData.histologicalClassificationPresent,
        fibrofattyTissue: inputData.fibrofattyTissue,
        lesionMeasures: inputData.lesionMeasures,
        site: inputData.site,
        macroscopicDistanceToMargin: inputData.macroscopicDistance,
        comments: inputData.comments,
        invasiveTumourSize: inputData.invasiveTumourSize,
        wholeTumourSize: inputData.wholeTumourSize,
        invasiveGrade: inputData.invasiveGrade,
        tumourExtent: inputData.tumourExtent,
        type: inputData.type,
        typeForComponents: inputData.typeForComponents,
        grade: inputData.grade,
        associatedDcis: inputData.associatedDcis,
        isSituLobularNeoplasia: inputData.isSituLobularNeoplasia,
        dcisGrade: inputData.dcisGrade,
        isPagetDisease: inputData.isPagetDisease,
        isLcis: inputData.isLcis,
        pureDcisSize: inputData.pureDcisSize,
        pureDcisGrade: inputData.pureDcisGrade,
        dcisArchitecture: inputData.dcisArchitecture,
        dcisNecrosis: inputData.dcisNecrosis,
        microInvasion: inputData.microInvasion,
        pagetDisease: inputData.pagetDisease,
        slideId,
        caseId,
        reportType: "breast-cancer-report",
      }).unwrap();
      toast({
        description: "Report submitted sucessfully",
        status: "success",
        duration: 2000,
      });
      setSynopticType("");
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
          reportType: "breast-cancer-synoptic-report",
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
          MACROSCOPY
        </Text>
      </Flex>
      <Flex w="100%" flex="1" flexWrap="wrap" justifyContent="space-between">
        {reportData.slice(0, 13).map((inputField, index) => {
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
        <HStack flex="1" py="1vh" />
        <Text fontWeight="600" py="1vh">
          MACROSCOPIC DISTANCE TO NEAREST{" "}
          <Input
            w="4vw"
            size="sm"
            defaultValue={
              synopticReportData !== ""
                ? synopticReportData?.macroscopicDistanceToMargin
                : inputData.macroscopicDistance
            }
            name="macroscopicDistance"
            type="number"
            onWheel={(e) => e.target.blur()}
            onChange={handleInput}
          />{" "}
          MARGIN
        </Text>
        <VStack flex="1" alignItems="flex-start">
          <Text fontWeight="600">COMMENTS</Text>
          <Textarea
            borderRadius="0"
            name="comments"
            onChange={handleInput}
            defaultValue={
              synopticReportData !== ""
                ? synopticReportData?.comments
                : inputData.comments
            }
          />
        </VStack>
        <Flex
          bg="#F7FBFD"
          h="3vh"
          minH="30px"
          w="100%"
          alignItems="center"
          px="0.3vw"
          my="1vh"
        >
          <Text fontWeight="600">INVASIVE CARCINOMA</Text>
        </Flex>
        <HStack flex="1" alignItems="flex-start">
          <Text fontWeight="600" minW="49%">
            INVASIVE TUMOUR SIZE{" "}
            <Input
              w="4vw"
              size="sm"
              name="invasiveTumourSize"
              defaultValue={
                synopticReportData?.invasiveTumourSize ||
                inputData.invasiveTumourSize
              }
              type="number"
              onWheel={(e) => e.target.blur()}
              onChange={handleInput}
            />
            MM
          </Text>
          <Text fontWeight="600" minW="49%">
            WHOLE TUMOUR (DCIS + INVASIVE) SIZE{" "}
            <Input
              w="4vw"
              size="sm"
              name="wholeTumourSize"
              defaultValue={
                synopticReportData?.wholeTumourSize || inputData.wholeTumourSize
              }
              type="number"
              onWheel={(e) => e.target.blur()}
              onChange={handleInput}
            />{" "}
            MM
          </Text>
        </HStack>
        <Flex w="100%" flex="1" flexWrap="wrap" justifyContent="space-between">
          {reportData.slice(13, 22).map((inputField, index) => {
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
        <Flex
          bg="#F7FBFD"
          h="3vh"
          minH="30px"
          w="100%"
          alignItems="center"
          px="0.3vw"
          my="1vh"
        >
          <Text fontWeight="600">FINAL PATHOLOGY DCIS</Text>
        </Flex>
        <Text fontWeight="600">
          PURE DCIS SIZE{" "}
          <Input
            w="4vw"
            size="sm"
            name="pureDcisSize"
            onChange={handleInput}
            defaultValue={
              synopticReportData?.pureDcisSize || inputData.pureDcisSize
            }
            type="number"
            onWheel={(e) => e.target.blur()}
          />{" "}
          MM IN MAXIMUM EXTENT
        </Text>
        <Flex w="100%" flex="1" flexWrap="wrap" justifyContent="space-between">
          {reportData.slice(22, 29).map((inputField, index) => {
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
      </Flex>
      {userInfo?.userType !== "technologist" && (
        <SubmitHelper
          userInfo={userInfo}
          reportedStatus={reportedStatus}
          answeredAll={answeredAll}
          submitReport={submitReport}
          newInputData={newInputData}
          handleUpdate={handleUpdate}
        />
      )}
    </Flex>
  );
};

export default BreastCancer;
