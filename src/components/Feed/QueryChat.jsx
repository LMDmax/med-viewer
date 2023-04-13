import React, { useEffect, useRef, useState } from "react";
import {
  Flex,
  Text,
  Button,
  Box,
  Input,
  Spacer,
  Avatar,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import moment from "moment";
import { useLazyQuery, useSubscription } from "@apollo/client";
import {
  CHAT_SUBSCRIPTION,
  FETCH_CONVERSATION,
} from "../../state/graphql/ChatQuery";
import QueryHelper from "./QueryHelper";

const QueryChat = ({ setQueryChat, queryChat, userInfo, client }) => {
  const [groupMessages, setGroupMessages] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [
    fetchMessages,
    { loading: isConversationLoading, refetch, data: msgData, error },
  ] = useLazyQuery(FETCH_CONVERSATION, { client });

  useEffect(() => {
    if (msgData && msgData.readChat.success) {
      const totalPages = msgData.readChat?.meta?.totalPages;
      if (totalPages) {
        setTotalPage(totalPages);
      }

      if (pageNumber === 1) setGroupMessages(msgData.readChat.data.reverse());
      else {
        const newData = [...msgData.readChat.data];
        setGroupMessages(newData.reverse().concat(groupMessages));
      }
    }
  }, [msgData]);

  useEffect(() => {
    if (pageNumber > 1) {
      fetchMessages({
        variables: {
          query: {
            filter: {
              toId: queryChat?._id,
            },
            paginate: {
              limit: 25,
              pageNumber,
            },
          },
        },
      });
    }
  }, [pageNumber]);

  useEffect(() => {
    setGroupMessages([]);

    fetchMessages({
      variables: {
        query: {
          filter: {
            toId: queryChat?._id,
          },
          paginate: {
            limit: 25,
            pageNumber: 1,
          },
        },
      },
      fetchPolicy: "no-cache",
    });
    setPageNumber(1);
    setTotalPage(1);
  }, [queryChat?._id]);

  const { data: subscribedMessageData } = useSubscription(CHAT_SUBSCRIPTION, {
    variables: {
      toId: queryChat?._id,
      fromId: userInfo?._id,
    },
  });

  useEffect(() => {
    if (subscribedMessageData) {
      const newMessages = [
        ...groupMessages,
        subscribedMessageData.newChat.data,
      ];

      setGroupMessages(newMessages);
    }
  }, [subscribedMessageData]);

  return (
    <Flex
      maxW="23vw"
      minW="350px"
      mb="10px"
      direction="column"
      position="absolute"
      right="0"
      top="25%"
      zIndex="1"
      fontSize="12px"
      border="1px solid gray"
    >
      <Flex
        alignItems="center"
        justifyContent="space-between"
        borderBottom="1px"
        borderColor="gray.300"
        w="100%"
        px="0.7rem"
        bg="#fcfcfc"
      >
        <Box>
          <Text fontSize="16px" py="5px">
            Queries
          </Text>
        </Box>
        <Spacer />
        <Button
          bg="none"
          outline="none"
          border="none"
          onClick={() => setQueryChat("")}
        >
          <CloseIcon w={3} h={3} />
        </Button>
      </Flex>
      <Flex p="0.7rem 1rem" bg="#fcfcfc" direction="column">
        <Text>{`Created by: Dr.${queryChat?.fromName}`}</Text>
        <Flex w="100%" flexWrap="wrap">
          <Text isTruncated>Assigned to: </Text>
          {queryChat?.mentionedUsers?.map((user) => {
            return <Text key={user?.integrity}>{`Dr.${user.toName}`}</Text>;
          })}
        </Flex>

        <Flex py="0.4rem" alignItems="center">
          <Avatar
            size="sm"
            src={queryChat?.fromImage}
            name={`${queryChat?.fromName}`}
          />
          <Text ml="0.5rem">
            {queryChat?.payload?.body
              ? queryChat?.payload?.body
              : queryChat?.mentionedUsers[0].message}
          </Text>
        </Flex>
        {/* {isConversationLoading ? (
          <Text my="0.3vh">fetching conversation...</Text>
        ) : ( */}
        <Flex
          w="100%"
          flexWrap="wrap"
          maxH="25vh"
          overflowY="auto"
          overflowX="hidden"
        >
          {groupMessages?.map((userMessage) => {
            return (
              <Flex
                key={userMessage?._id}
                w="100%"
                mb="0.6rem"
                alignItems="center"
              >
                <Avatar
                  size="sm"
                  src={userMessage?.fromImage}
                  name={`${userMessage?.fromName}`}
                />
                <Text ml="0.5rem">{userMessage.payload.body}</Text>
              </Flex>
            );
          })}
        </Flex>
        {/* )} */}
        <Flex alignItems="center">
          <Avatar
            size="sm"
            name={`${userInfo?.firstName} ${userInfo?.lastName}`}
            src={userInfo?.ProfilePicture}
            mr="0.5rem"
          />

          <QueryHelper
            userInfo={userInfo}
            chatId={queryChat?._id}
            client={client}
            groupMessages={groupMessages}
            setGroupMessages={setGroupMessages}
            refetch={refetch}
          />
        </Flex>
        {/* <Button
          size="xs"
          bg="none"
          color="#3B5D7C"
          borderRadius="0"
          justifyContent="flex-start"
          _hover={{ bg: "#fcfcfc" }}
          _focus={{ bg: "#fcfcfc" }}
          mt="0.6rem"
          maxW="9vw"
        >
          Mark as resolved
        </Button> */}
      </Flex>
    </Flex>
  );
};
export default QueryChat;
