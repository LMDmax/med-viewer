import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { MdArrowForwardIos } from "react-icons/md";
import Report from "./Report";
import { useFabricOverlayState } from "../../state/store";
import TooltipLabel from "../AdjustmentBar/ToolTipLabel";
import BreastCancer from "../SynopticReport/BreastCancer";
import ProstateCancer from "../SynopticReport/ProstateCancer";
import Lymphoma from "../SynopticReport/Lymphoma";
import SynopticReport from "../SynopticReport/SynopticReport";
import { BsChevronCompactDown } from "react-icons/bs";

const ShowReport = ({ showReport, openReport }) => {
  return showReport ? (
    ""
  ) : (
    <Tooltip
      label={<TooltipLabel heading="View Report" />}
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
        onClick={openReport}
      >
        View Report
      </Button>
    </Tooltip>
  );
};

const OpenReportButton = ({ openReport }) => {
  return (
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
        h="25px"
        ml="15px"
        border="1px solid #8F8F8F"
        borderRadius={0}
        backgroundColor="#FCFCFC"
        _hover={{}}
        _focus={{
          border: "none",
        }}
        color="#000"
        fontFamily="inter"
        fontSize="12px"
        fontWeight="500"
        onClick={() => openReport()}
      >
        Report Type
      </Button>
    </Tooltip>
  );
};

const SubmitReportButton = ({ userInfo, reportData, handleReportsubmit }) => {
  return (
   <Box>
     <Tooltip
      label="Submit Report"
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
        // mr="15px"
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
        disabled={
          userInfo.userType !== "pathologist" ||
          (!reportData?.clinicalStudy &&
            !reportData?.grossDescription &&
            !reportData?.microscopicDescription &&
            !reportData?.impression &&
            !reportData?.advice &&
            !reportData?.annotedSlides)
        }
        onClick={handleReportsubmit}
      >
        Submit Report
      </Button>
    </Tooltip>
   </Box>
  );
};

const ReportHelper = ({
  caseInfo,
  saveReport,
  saveSynopticReport,
  viewerId,
  mediaUpload,
  slideInfo,
  showReport,
  setShowReport,
  userInfo,
  synopticType,
  setSynopticType,
  getSynopticReport,
  updateSynopticReport,
  reportData,
  setReportData,
  handleReportData,
  handleUpload,
  annotedSlideImages,
  setAnnotedSlideImages,
  slideData,
  setSlideData,
}) => {
  const { fabricOverlayState } = useFabricOverlayState();
  const { viewerWindow } = fabricOverlayState;
  const { slideId } = viewerWindow[viewerId];
  const toast = useToast();



  const openReport = () => {
    setSynopticType("");
    setShowReport(true);
    // console.log("clicked");
  };
  // form
  const annotedSlidesForm = new FormData();

  // clear values of textarea and file upload
  const clearValues = () => {
    Array.from(document.querySelectorAll("Textarea")).forEach((input) => {
      input.value = "";
    });
    setReportData({
      clinicalStudy: "",
      grossDescription: "",
      microscopicDescription: "",
      impression: "",
      advice: "",
      annotedSlides: "",
    });
    Array.from(document.querySelectorAll("input")).forEach((input) => {
      input.value = "";
    });
    setAnnotedSlideImages([]);
  };
  const handleReport = () => {
    setShowReport(!showReport);
    clearValues();
  };

  const handleReportsubmit = async () => {
    annotedSlideImages.forEach((element, i) => {
      annotedSlidesForm.append("files", annotedSlideImages[i]);
    });
    const { data } = await mediaUpload(annotedSlidesForm);
    try {
      const resp = await saveReport({
        caseId: caseInfo._id,
        subClaim: userInfo?.subClaim,
        clinicalStudy: reportData?.clinicalStudy,
        grossDescription: reportData?.grossDescription,
        microscopicDescription: reportData?.microscopicDescription,
        impression: reportData?.impression,
        advise: reportData?.advice,
        annotatedSlides: reportData?.annotedSlides,
        mediaURLs: data?.urls,
      }).unwrap();
      clearValues();
      setSlideData(resp);
      setShowReport(!showReport);

      toast({
        status: "success",
        title: "Successfully Reported",
        duration: 1500,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
      toast({
        status: "error",
        title: "Reporting Failed",
        description: "Something went wrong, try again!",
        duration: 1500,
        isClosable: true,
      });
    }
  };

  // if (slideData) {
  //   return
  // }

  // console.log(showReport);

  return (
    <Box ml="-82px">
      {!showReport ? (
        <Menu autoSelect={false}>
          <MenuButton>
            <OpenReportButton openReport={openReport} />
          </MenuButton>
          <MenuList
            borderRadius="0"
            px="1.2vw"
            fontSize="14px"
            fontFamily="inter"
          >
            <MenuItem
              onClick={() => openReport()}
              borderBottom="1px solid #DEDEDE"
              _hover={{ bg: "#f6f6f6" }}
            >
              Standard Report
            </MenuItem>
            <Accordion allowToggle>
            <AccordionItem>
              <AccordionButton
                _focus={{ outline: "none" }}
                justifyContent="space-between"
                alignItems="center"
                borderBottom="1px solid #DEDEDE"
              >
                <Text fontSize="14px">Synoptic Report</Text>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4} px="0">
                <MenuItemOption
                  value="breast-cancer"
                  minH="32px"
                  onClick={() => setSynopticType("breast-cancer")}
                  _hover={{ bg: "#f6f6f6" }}
                  isDisabled={!caseInfo?.organs[0].organName.includes("breast")}
                  color={caseInfo?.organs[0].organName.includes("breast") ? "black" : "gray"}
                  cursor={caseInfo?.organs[0].organName.includes("breast") ? "pointer" : "not-allowed"}
                >
                  Breast cancer
                </MenuItemOption>
                <MenuItemOption
                  value="prostate-cancer"
                  minH="32px"
                  onClick={() => setSynopticType("prostate-cancer")}
                  _hover={{ bg: "#f6f6f6" }}
                  isDisabled={!caseInfo?.organs[0].organName.includes("prostate")}
                  color={caseInfo?.organs[0].organName.includes("prostate") ? "black" : "gray"}
                  cursor={caseInfo?.organs[0].organName.includes("prostate") ? "pointer" : "not-allowed"}
                >
                  Prostate cancer
                </MenuItemOption>
                <MenuItemOption
                  value="lymphoma"
                  minH="32px"
                  onClick={() => setSynopticType("lymphoma")}
                  _hover={{ bg: "#f6f6f6" }}
                  isDisabled={!caseInfo?.organs[0].organName.includes("lymph")}
                  color={caseInfo?.organs[0].organName.includes("lymph") ? "black" : "gray"}
                  cursor={caseInfo?.organs[0].organName.includes("lymph") ? "pointer" : "not-allowed"}
                >
                  Lymphoma
                </MenuItemOption>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
          </MenuList>
        </Menu>
      ) : (
        <SubmitReportButton
          userInfo={userInfo}
          reportData={reportData}
          handleReportsubmit={handleReportsubmit}
        />
      )}
    </Box>
  );
};

export default ReportHelper;