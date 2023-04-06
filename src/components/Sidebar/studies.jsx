import React from "react";
import { Flex, Text, HStack, VStack, useMediaQuery } from "@chakra-ui/react";
import moment from "moment";
import { Scrollbars } from "react-custom-scrollbars";
import Loading from "../Loading/loading";
import DetailsCard from "../Studies/detailsCard";
import "../../styles/scrollBar.css";

const Studies = ({ caseInfo, slideInfo }) => {
  const [ifWidthLessthan1920] = useMediaQuery("(max-width:1920px)");
  console.log(slideInfo.metadata);
  const caseDetails = {
    Department: caseInfo?.departmentTo,
    Organ: caseInfo?.organs[0].organName,
    "Specimen Size": caseInfo?.organs[1].organSize,
    Hospital: caseInfo?.treatingHospitalDetails?.hospitalName,
    Clinician: `Dr. ${caseInfo?.treatingDoctor}`,
    "Clinician's No.": caseInfo?.patient?.contactNumber
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

  const imageDetails = {
    Title: slideInfo?.slideName || slideInfo?.originalName?.split(".")?.[0],
    "Case Title": caseInfo?.caseName,
    Location: "My Folder/Cases/203-11-22-22-UHID/SLIDE 1",
    Type: slideInfo?.originalName?.split(".")?.[1],
    Size: "100 mb",
    Dimension: "1280 x 720 px",
    Resolution: "148 dpi",
    Scanner: "NanoZoomer S360",
    "Shared with": slideInfo?.metadata?.doctor || "Dr. Sharma",
  };

  return caseInfo ? (
    <Scrollbars
      style={{
        width: "100%",
        height: "100%",
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
        h="100%"
        pb="12px"
        pt="5px"
      >
        <HStack
          background="#FCFCFC"
          boxShadow="0px 1px 2px rgba(176, 200, 214, 0.25)"
          h="2.5em"
          align="center"
          px="18px"
        >
          <Text
            fontWeight="400"
            fontSize="14px"
            lineHeight="17px"
            letterSpacing="0.0025em"
            color="#3B5D7C"
          >
            Information
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
            fontWeight="400"
            fontSize="16px"
            lineHeight="19px"
            letterSpacing="0.0025em"
          >
            {caseInfo.caseName}
          </Text>
          <Text
            fontWeight="300"
            fontSize="12px"
            lineHeight="15px"
            letterSpacing="0.0025em"
            whiteSpace="initial"
          >
            {`Created on ${moment(caseInfo.caseCreationDate).format(
              "ddd DD/MM/YYYY hh:mm a"
            )}`}
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
        <DetailsCard
          cardTitle="Image details"
          details={imageDetails}
          mt="0.8em"
          pb="20px"
        />
      </Flex>
    </Scrollbars>
  ) : (
    <Loading />
  );
};

export default Studies;