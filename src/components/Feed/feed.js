import React from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Flex,
} from "@chakra-ui/react";
import { GrFormClose } from "react-icons/gr";
import KeyPoints from "./KeyPoints";
import { useFabricOverlayState } from "../../state/store";
import ActivityFeed from "./activityFeed";

const SlideFeed = ({
  viewerId,
  handleFeedBarClose,
  showFeedBar,
  showReport,
  feedTab,
}) => {
  const { fabricOverlayState } = useFabricOverlayState();
  const { viewerWindow } = fabricOverlayState;
  const { activityFeed } = viewerWindow[viewerId];
  return (
    <Box
      w="15.88vw"
      minW="250px"
      position="fixed"
      right={showReport ? "33.281vw" : "0"}
      zIndex={2}
      background="#FCFCFC"
    >
      <Flex
        py="0.5px"
        justifyContent="flex-end"
        alignItems="center"
        background="#F6F6F6"
      >
        <GrFormClose
          size={16}
          cursor="pointer"
          onClick={handleFeedBarClose}
          _hover={{ cursor: "pointer" }}
        />
      </Flex>
      <Tabs w="100%" defaultIndex={feedTab} variant="unstyled">
        <TabList
          justifyContent="space-around"
          mb="1.1vh"
          bg="#fff"
          boxShadow="1px 1px 2px rgba(176, 200, 214, 0.25)"
        >
          <Tab
            fontSize="12px"
            _focus={{ outline: "none" }}
            p="0.41vw 0.7vh"
            h="2.962vh"
            minH="32px"
            _selected={{ bg: "#FCFCFC" }}
          >
            Morphometry
          </Tab>
          <Tab
            fontSize="12px"
            _focus={{ outline: "none" }}
            p="0.41vw 0.7vh"
            h="2.962vh"
            minH="32px"
            _selected={{ bg: "#FCFCFC" }}
          >
            Key Points
          </Tab>
          <Tab
            fontSize="12px"
            _focus={{ outline: "none" }}
            p="0.41vw 0.7vh"
            h="2.962vh"
            minH="32px"
            _selected={{ bg: "#FCFCFC" }}
          >
            Annotations
          </Tab>
        </TabList>
        <TabPanels bg="#fff" boxShadow="1px 1px 2px rgba(176, 200, 214, 0.25)">
          <TabPanel h="90vh">
            <p>comming soon</p>
          </TabPanel>
          <TabPanel p="0">
            <KeyPoints activityFeed={activityFeed} />
          </TabPanel>
          <TabPanel p="0">
            <ActivityFeed viewerId={viewerId} showFeedBar={showFeedBar} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default SlideFeed;
