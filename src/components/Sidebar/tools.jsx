import React from "react";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import "../../styles/styles.css";
import Studies from "./studies";
import Annotations from "./annotations";
import Questions from "./questions";
import "../../styles/viewer.css";
import Report from "../Case/report";
import { GrFormClose } from "react-icons/gr";

const SidebarTools = ({
  project,
  caseInfo,
  questionnaire,
  viewerIds,
  annotations,
  userInfo,
  response,
  currentViewer,
  report,
  finalSubmitHandler,
  setSidebar,
  saveAnnotationsHandler,
  loadAnnotationsHandler,
}) => {
  return (
    <Flex
      bg="#fcfcfc"
      minwidth="306px"
      padding="0px"
      margin="0px"
      direction="column"
    >
      <Tabs isFitted size="10px">
        <TabList
          backgroundColor="#F8F8F5"
          fontSize="14px"
          fontWeight="500"
          fontFamily="inter"
          border="none"
        >
          <Tab
            _focus={{ border: "none", background: "#fcfcfc" }}
            color="#00153F"
            py="0.5px"
            border="none"
            fontFamily="inter"
            justifyContent="end"
          >
            <GrFormClose size={16} onClick={() => setSidebar(false)} />
          </Tab>
          {questionnaire ? (
            <Tab
              _focus={{ border: "none" }}
              _selected={{
                bg: "#E4E5E8",
                border: "0.5px solid #000000",
                borderLeft: "none",
              }}
              color="#00153F"
              py={2}
              border="0.5px solid #000"
              borderLeft="none"
              fontFamily="inter"
            >
              Questions
            </Tab>
          ) : null}
          {/* {report ? (
            <Tab
              _focus={{ border: "none" }}
              _selected={{
                bg: "#E4E5E8",
                border: "0.5px solid #000000",
                borderLeft: "none",
              }}
              color="#00153F"
              py={2}
              border="0.5px solid #000"
              borderLeft="none"
              fontFamily="inter"
            >
              Report
            </Tab>
          ) : null}
          {annotations ? (
            <Tab
              _focus={{ border: "none" }}
              _selected={{
                bg: "#E4E5E8",
                border: "0.5px solid #000000",
                borderLeft: "none",
              }}
              color="#00153F"
              py={2}
              border="0.5px solid #000000"
              borderLeft="none"
              fontFamily="inter"
            >
              Annotations
            </Tab> 
          ) : null} */}
          {/* <Tab
            _focus={{ border: "none" }}
            _selected={{ bg: "#3965C5" }}
            fontSize="xs"
            py={2}
            px={1}
          >
            Annotations
          </Tab>
          <Tab
            _focus={{ border: "none" }}
            _selected={{ bg: "#3965C5" }}
            fontSize="xs"
            py={2}
          >
            Analysis
          </Tab> */}
        </TabList>
        <TabPanels>
          <TabPanel p="0px">
            <Studies caseInfo={caseInfo} />
          </TabPanel>
          {questionnaire ? (
            <TabPanel p="0px">
              <Questions
                project={project}
                questionnaire={questionnaire}
                viewerIds={viewerIds}
                userInfo={userInfo}
                response={response}
                finalSubmitHandler={finalSubmitHandler}
              />
            </TabPanel>
          ) : null}
          {/* {report ? (
            <TabPanel p="0px">
              <Report finalSubmitHandler={finalSubmitHandler} />
            </TabPanel>
          ) : null} */}
          {/* {annotations ? (
            <TabPanel p="0px">
              <Annotations
                userInfo={userInfo}
                currentViewer={currentViewer}
                saveAnnotationsHandler={saveAnnotationsHandler}
                loadAnnotationsHandler={loadAnnotationsHandler}
              />
            </TabPanel>
          ) : null} */}
          {/* <TabPanel>
            <Analysis />
          </TabPanel> */}
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default SidebarTools;
