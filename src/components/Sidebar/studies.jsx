import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Flex,
  Text,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import moment from "moment";
import { Scrollbars } from "react-custom-scrollbars";
import BasicInfo from "../Studies/basicInfo";
import StudyAction from "../Studies/studyAction";
import ImageAction from "../Studies/imageAction";
import Loading from "../Loading/loading";
import DetailsCard from "../Studies/detailsCard";
import "../../styles/scrollBar.css";

const Studies = ({ project, caseInfo }) => {
  const caseDetails = {
    Department: caseInfo?.departmentTo,
    Organ: caseInfo?.organs[0].organName,
    "Specimen Size": caseInfo?.organs[1].organSize,
    Hospital: caseInfo?.treatingHospitalDetails?.hospitalName,
    Clinician: `Dr. ${caseInfo?.treatingDoctor}`,
    "Helpline No.": caseInfo?.patient?.contactNumber
      ? `+91-${caseInfo?.patient?.contactNumber}`
      : "-",
  };

  const patientDetails = {
    UHID: `${caseInfo?.patient?.uhid}`,
    "Patient Name": `${caseInfo?.patient?.patientName.firstName} ${caseInfo?.patient?.patientName.lastName}`,
    Gender: caseInfo?.patient?.gender ?? "-",
    Age: caseInfo?.patient?.age?.years ?? "-",
    "Contact No.": caseInfo?.patient?.contactNumber
      ? `+91-${caseInfo?.patient?.contactNumber}`
      : "-",
    Address: caseInfo?.patient?.patientAddress
      ? caseInfo?.patient?.patientAddress
      : "-",
  };

  return caseInfo ? (
    <Scrollbars
      style={{
        width: "100%",
        height: "80vh",
        borderWidth: "0px",
      }}
      renderThumbVertical={(props) => (
        <div {...props} className="thumb-vertical" />
      )}
      autoHide
    >
      <Flex
        background="none"
        direction="column"
        w="100%"
        bg="#FCFCFC"
        pb="12px"
      >
        <HStack
          background="#FCFCFC"
          boxShadow="0px 1px 2px rgba(176, 200, 214, 0.25)"
          h="2.5em"
          align="center"
          px="15px"
        >
          <AiOutlineExclamationCircle size={18} />
          <Text
            fontWeight="400"
            fontSize="14px"
            lineHeight="17px"
            letterSpacing="0.0025em"
          >
            Case Information
          </Text>
        </HStack>
        <VStack
          background="#FFFFFF"
          align="flex-start"
          justify="center"
          pl="18px"
          pr="16px"
          py="18px"
          h="4.4em"
          mt="0.8em"
        >
          <Text
            fontWeight="300"
            fontSize="12px"
            lineHeight="15px"
            letterSpacing="0.0025em"
          >
            {moment(caseInfo.caseCreationDate).format(
              "ddd DD/MM/YYYY hh:mm:ss a"
            )}
          </Text>
          <Text
            fontWeight="400"
            fontSize="16px"
            lineHeight="19px"
            letterSpacing="0.0025em"
          >
            {caseInfo.caseName}
          </Text>
        </VStack>
        <DetailsCard
          cardTitle="Case details"
          details={caseDetails}
          mt="0.8em"
        />
        <DetailsCard
          cardTitle="Patient details"
          details={patientDetails}
          mt="0.8em"
        />
      </Flex>
    </Scrollbars>
  ) : (
    <Loading />
  );
};

export default Studies;
