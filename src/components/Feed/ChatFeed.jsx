import React, { useEffect, useState } from "react";
import { Box, Flex, Text, Tooltip } from "@chakra-ui/react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  split,
  HttpLink,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { GrFormClose } from "react-icons/gr";
import { useFabricOverlayState } from "../../state/store";
import { BsFillPeopleFill } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import { AiFillLock } from "react-icons/ai";
import { HiOutlineUserGroup } from "react-icons/hi";
import ChatConversationFeed from "./ChatConversationFeed";

const ChatFeed = ({
  viewerId,
  handleFeedBarClose,
  showReport,
  synopticType,
  caseInfo,
  application,
  users,
  mentionUsers,
  Environment,
  userInfo,
}) => {
  const { fabricOverlayState } = useFabricOverlayState();
  const { viewerWindow } = fabricOverlayState;
  const { activityFeed } = viewerWindow[viewerId];
  const [activeGroup, setActiveGroup] = useState();
  const [groupData, setGroupData] = useState();
  console.log(application);
  useEffect(() => {
    setGroupData(caseInfo);
    setActiveGroup(caseInfo?._id);
  });
  const token = localStorage.getItem(Environment?.AUTH0_TOKEN);
  let accessToken;
  if (token) {
    const { body } = JSON.parse(token);
    if (body && typeof body === "object") {
      accessToken = body?.access_token;
    }
  }
  const httpLink = new HttpLink({
    uri: "https://development-api.chat.prr.ai",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const wsLink = new GraphQLWsLink(
    createClient({
      url: "wss://development-api.chat.prr.ai",
    })
  );

  // The split function takes three parameters:
  //
  // * A function that's called for each operation to execute
  // * The Link to use for an operation if the function returns a "truthy" value
  // * The Link to use for an operation if the function returns a "falsy" value

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink
  );
  const apolloClient = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });
  const caseNo = caseInfo._id.slice(0, 5);
  return (
    <Box
      w="25.88vw"
      minW="300px"
      position="fixed"
      right={showReport ? "33.281vw" : synopticType !== "" ? "40vw" : "0"}
      zIndex={2}
      background="#FCFCFC"
      height="90%"
    >
      <Flex
        py="0.5px"
        justifyContent="space-between"
        alignItems="center"
        background="#F6F6F6"
        // background="red"
        height="50px"
        borderBottom="1px solid #DEDEDE"
      >
        <Tooltip hasArrow label={caseInfo?._id}>
          <Text
            fontSize="14px"
            css={{
              fontWeight: "900",
            }}
          >
            Chat- Case No- {caseNo}..... -UHID
          </Text>
        </Tooltip>
        <Flex w="30%" justifyContent="space-between" alignItems="center">
          <BsFillPeopleFill size="23px" cursor="pointer"></BsFillPeopleFill>
          <BiSearch size="23px" cursor="pointer"></BiSearch>
          <GrFormClose
            size="23px"
            cursor="pointer"
            onClick={handleFeedBarClose}
            _hover={{ cursor: "pointer" }}
          />
        </Flex>
      </Flex>
      {/* <Tabs w="100%" defaultIndex={feedTab} variant="unstyled">
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
          <TabPanel p="0">
            <KeyPoints activityFeed={activityFeed} />
          </TabPanel>
          <TabPanel p="0">
            <ActivityFeed viewerId={viewerId} showFeedBar={showFeedBar} />
          </TabPanel>
        </TabPanels>
      </Tabs> */}
      <Box w="100%" h="90%">
        <ApolloProvider client={apolloClient}>
          <Flex
            bg="#fff"
            margin="0 0 0 5px"
            flexDir="column"
            pos="relative"
            w="100%"
            h="100%"
          >
            {groupData?._id ? (
              <>
                {/* <ConversationHeader groupName={groupData?.caseName} /> */}
                <ChatConversationFeed
                  userInfo={userInfo}
                  application={application}
                  app={application}
                  users={users}
                  groupChatId={groupData?._id}
                  mentionUsers={mentionUsers}
                />
              </>
            ) : (
              <Flex
                w="100%"
                h="100%"
                justifyContent="center"
                alignItems="center"
                flexDir="column"
                pos="relative"
              >
                <HiOutlineUserGroup fontSize="22px" />
                <Text fontSize="24px" fontWeight="500">
                  Group Chat
                </Text>
                <Text fontSize="14px" color="#52585D">
                  Send and receive messages
                </Text>
                <Text
                  textAlign="center"
                  pos="absolute"
                  bottom="20px"
                  display="flex"
                  alignItems="center"
                  gap="0.5rem"
                  color="#52585D"
                  fontSize="14px"
                >
                  <AiFillLock /> Encrypted
                </Text>
              </Flex>
            )}
          </Flex>
        </ApolloProvider>
      </Box>
    </Box>
  );
};

export default ChatFeed;
