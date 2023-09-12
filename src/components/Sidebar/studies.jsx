import React from "react";
import { Flex, Text, HStack, VStack, useMediaQuery } from "@chakra-ui/react";
import moment from "moment";
import { Scrollbars } from "react-custom-scrollbars";
import Loading from "../Loading/loading";
import DetailsCard from "../Studies/detailsCard";
import "../../styles/scrollBar.css";
import { useFabricOverlayState } from "../../state/store";

const Studies = ({ caseInfo, onGetSlideInfo, viewerId }) => {
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { viewerWindow, isAnnotationLoading,  } = fabricOverlayState;
  const { slideName } = viewerWindow[viewerId];
  const [ifWidthLessthan1920] = useMediaQuery("(max-width:1920px)");
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

  // console.log(onGetSlideInfo);
  // console.log("case",caseInfo);

  const full = caseInfo?.caseId;
const lastSlashIndex = full.lastIndexOf('/');
const result = full.substring(lastSlashIndex + 1);

// console.log(result); // Output: e43sl

const searchBySlidename = onGetSlideInfo?.slideName;
const index = caseInfo?.slides.findIndex(obj => obj.slideName === searchBySlidename);

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

  const date = onGetSlideInfo?.uploadedAt
  const localDate = new Date(date).toLocaleDateString("en-GB")

  const imageDetails = {
    "Accession Id" : onGetSlideInfo?.accessionId,
    Title: onGetSlideInfo?.slideName || onGetSlideInfo?.originalName?.split(".")?.[0],
    // "Case Title": caseInfo?.caseName,
    "Case Id" : caseInfo?.caseId,
    "Slide Id":`${result}/${onGetSlideInfo.grossId}/${onGetSlideInfo.blockId}/${index + 1}`,
    Location: "My Folder/Cases/203-11-22-22-UHID/SLIDE 1",
    Type: onGetSlideInfo?.originalName?.split(".")?.[1]?.toUpperCase(),
    "Orgininal Slide Name": onGetSlideInfo?.originalName,
    Size: "100 mb",
    "Stain Type": onGetSlideInfo?.stainType,
    "Marker Type" : onGetSlideInfo.bioMarkerType !== null? onGetSlideInfo.bioMarkerType : "-",
    // "Gross Id" : "G1",
    // "Block Id" : "B1",
    // "Slide Id" : "A125/G1/B1/S1",
    Dimension: "1280 x 720 px",
    Resolution: "148 dpi",
    Scanner: "NanoZoomer S360",
    "Uploaded At": localDate ,
    "Uploaded By": `Dr. ${onGetSlideInfo?.metadata.find(m => m.Key === 'uploaded by')?.Value}`,
    "Shared With": onGetSlideInfo?.metadata?.doctor || "Dr. Sharma",
  };

  return caseInfo ? (
    <Scrollbars
      style={{
        width: "450px",
        height: "82vh",
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
        w="82%"
        h="100%"
        pb="12px"
        // pt="5px"
      >
        <HStack
          background="white"
          position="fixed"
          h="2.5em"
          w="340px"
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
          mt="2.8em"
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