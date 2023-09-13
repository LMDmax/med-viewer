import React, { useEffect, useRef, useState } from "react";
import { Mention, MentionsInput } from "react-mentions";
import {
  Flex,
  Text,
  Button,
  Box,
  Avatar,
  Input,
  Spinner,
} from "@chakra-ui/react";
import moment from "moment";
import { AiOutlineSend, AiOutlineUser } from "react-icons/ai";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import { RiAttachment2 } from "react-icons/ri";
import { v4 as uuidv4 } from "uuid";
import defaultStyle from "./defaultStyle";
import defaultMentionStyle from "./defaultMentionStyle";
import ScrollBar from "../others/ScrollBar";
import QueryChat from "./QueryChat";
import { useFabricOverlayState } from "../../state/store";


const formats = {
  sameDay: "[Today]",
  nextDay: "[Tomorrow]",
  nextWeek: "dddd",
  lastDay: "[Yesterday]",
  lastWeek: "[Last] dddd",
  sameElse: "DD/MM/YYYY",
};

const DateSeperatorComponent = ({ messageSepratorDate }) => {
  return (
    <Text
      my="10px"
      alignSelf="center"
      fontSize="12px"
      fontWeight="500"
      color="#52585D"
    >
      {moment(messageSepratorDate).calendar(new Date(), formats)}
    </Text>
  );
};
const RightMessageComponent = ({ data, setQueryChat, zoomIntoAnnotation }) => {
  console.log("DATA", data)
  return data?.mentionedUsers?.length > 0 ? (
    <Box
      key={uuidv4()}
      p="0.7rem"
      bg="rgba(176, 200, 214, 0.15)"
      onClick={() => setQueryChat(data)}
      cursor="pointer"
      alignSelf="flex-end"
      maxW="506px"
      minW="220px"
      borderRadius="0"
    >
      <Flex color="#3B5D7C" fontSize="12px" justifyContent="space-between">
        <Text color="#3B5D7C" fontSize="12px">
          QUERY
        </Text>
        <Flex>
          <Text>{`Dr.${data.mentionedUsers[0].toName}`}</Text>
          {data.mentionedUsers.length > 1 && (
            <Text ml="0.3rem">{`  +${data.mentionedUsers.length - 1}`}</Text>
          )}
        </Flex>
      </Flex>

      <Text color="#52585D" fontSize="12px" fontWeight="bold">
        {data.payload.body}
      </Text>
      <Flex alignItems="Center" justifyContent="space-between" w="100%">
        {data?.annotation && (
          <Button
            size="xs"
            _hover={{ bg: "rgba(176, 200, 214, 0.15)" }}
            _focus={{ bg: "rgba(176, 200, 214, 0.15)" }}
            color="#3B5D7C"
            borderRadius="0"
            textDecoration="underline"
            fontSize="12px"
            fontWeight="400"
            zIndex="1"
            onClick={(e) => {
              e.stopPropagation();
              zoomIntoAnnotation(data?.annotation);
            }}
          >
            View region in slide
          </Button>
        )}
        <Text
          color="#212224"
          fontSize="10px"
          textAlign="right"
          w={data?.annotation ? "" : "100%"}
        >
          {/* {data.sendAt.fromNow()} */}
          {moment(data.createdAt).format("HH:mm")}
        </Text>
      </Flex>
    </Box>
  ) : (
    <Box
      key={uuidv4()}
      p="14px 19px"
      bg="#D9D9D9"
      alignSelf="flex-end"
      maxW="506px"
      borderRadius="14px 0px 14px 14px"
    >
      <Text color="#52585D" fontSize="12px">
        {data.payload.body}
      </Text>
      <Text color="#212224" fontSize="10px" textAlign="right">
        {/* {data.sendAt.fromNow()} */}
        {moment(data.createdAt).format("HH:mm")}
      </Text>
    </Box>
  );
};

const LeftMessageComponent = ({ data, setQueryChat, zoomIntoAnnotation }) => {
  return (
    <Flex>
      <Avatar
        h="36px"
        w="36px"
        size="sm"
        // name={data?.fromName}
        // color="#fff"
        // src="https://wallpapers.com/images/hd/cool-profile-pictures-red-anime-fw4wgkj905tjeujb.jpg"
        bg="#3B5D7C"
        marginTop="-3px"
        // icon={<AiOutlineUser fontSize="1.5rem" />}
      />
      {data?.mentionedUsers?.length > 0 ? (
        <Box
          key={uuidv4()}
          p="0.7rem"
          bg="rgba(176, 200, 214, 0.15)"
          onClick={() => setQueryChat(data)}
          cursor="pointer"
          alignSelf="flex-end"
          maxW="506px"
          minW="220px"
          borderRadius="0"
          ml="0.3rem"
        >
          <Flex color="#3B5D7C" fontSize="12px" justifyContent="space-between">
            <Text color="#3B5D7C" fontSize="12px">
              QUERY
            </Text>
            <Text>{`${data.fromName}`}</Text>
          </Flex>
          <Text color="#52585D" fontSize="12px" fontWeight="bold">
            {data.payload.body}
          </Text>
          <Flex alignItems="Center" justifyContent="space-between" w="100%">
            {data?.annotation && (
              <Button
                size="xs"
                _hover={{ bg: "rgba(176, 200, 214, 0.15)" }}
                _focus={{ bg: "rgba(176, 200, 214, 0.15)" }}
                color="#3B5D7C"
                borderRadius="0"
                textDecoration="underline"
                fontSize="12px"
                fontWeight="400"
                zIndex="1"
                onClick={(e) => {
                  e.stopPropagation();
                  zoomIntoAnnotation(data?.annotation);
                }}
              >
                View region in slide
              </Button>
            )}
            <Text
              color="#212224"
              fontSize="10px"
              textAlign="right"
              w={data?.annotation ? "" : "100%"}
            >
              {/* {data.sendAt.fromNow()} */}
              {moment(data.createdAt).format("HH:mm")}
            </Text>
          </Flex>
        </Box>
      ) : (
        <Box
          key={uuidv4()}
          p="14px 19px"
          bg="rgba(140, 179, 255, 0.1)"
          alignSelf="flex-start"
          maxW="506px"
          borderRadius=" 0px 14px 14px 14px"
          ml="0.3rem"
        >
          {/* {index === 0 && <Text marginTop="-10px">user </Text>} */}
          <Text marginTop="-10px" fontSize="14px" textTransform="capitalize">
            {data.fromName}{" "}
          </Text>
          <Text color="#52585D" fontSize="12px">
            {data.payload.body}
          </Text>

          <Text textAlign="right" fontSize="10px" color="#6588DE">
            {moment(data.createdAt).format("HH:mm")}
          </Text>
        </Box>
      )}
    </Flex>
  );
};

const ChatConversationFeed = ({
  userInfo,
  groupChatId,
  application,
  app,
  users,
  onMentionUsers,
  client2,
  onAddUsersToCase,
  viewerId,
  getMessagesFromDB,
  onSendMessage,
  useGetMessageSubcription
}) => {
  let lastDate = "1999-01-01";
  const [groupMessages, setGroupMessages] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [messageInput, setMessageInput] = useState({
    mentionedText: "",
    text: "",
    mentionedUsers: [],
  });
  const [queryChat, setQueryChat] = useState("");
  const messageRef = useRef(null);
  const bottomRef = useRef(null);

  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { activeTool, viewerWindow } = fabricOverlayState;
  const { fabricOverlay, viewer } = viewerWindow[viewerId];
  const zoomIntoAnnotation = (annotationDimension) => {
    // change position to annotation object location
    const { left, width, top, height, zoomLevel } = annotationDimension;
    const vpoint = viewer.viewport.imageToViewportRectangle(
      left + width / 2,
      top + height / 2
    );
    viewer.viewport.zoomTo(zoomLevel * 2);
    viewer.viewport.panTo(vpoint);
  };
  // const users = [
  //   {
  //     id: "ASck",
  //     display: "ack",
  //   },
  //   {
  //     id: "jack",
  //     display: "Jack",
  //   },
  //   {
  //     id: "john",
  //     display: "Dr. test test",
  //   },
  // ];

  const { fetchMessages, isConversationLoading, msgData, refetch, error } =
    getMessagesFromDB;

  useEffect(() => {
    if (msgData && msgData.readChat.success) {
      const totalPages = msgData.readChat?.meta?.totalPages;
      if (totalPages) {
        setTotalPage(totalPages);
      }
      // const receivedData = msgData.readChat.data.map((obj: any) => {
      // 	return { ...obj };
      // });
      // const sortedDesc: any = receivedData.sort(
      // 	(objA: any, objB: any) =>
      // 		objA.createdAt.getTime() - objB.createdAt.getTime()
      // );

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
              toId: groupChatId,
              fromId: userInfo?._id,
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
            toId: groupChatId,
            fromId: userInfo?._id,
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
  }, [groupChatId]);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    if (pageNumber === 1) bottomRef.current?.scrollIntoView();
  }, [groupMessages]);
  const { sendNewMessage } = onSendMessage;

  const sendMessage = async (e) => {
    e.preventDefault();
    const ids = messageInput?.mentionedUsers?.map((item) => item.toId);
    const newIds = [...new Set(ids)];
    const userIds = onMentionUsers
      ?.filter((user) => newIds.includes(user?.id))
      .map((user) => user.userId);
    const newMessage = messageInput.text.trim();
    if (!newMessage) return;
    setGroupMessages([...groupMessages]);

    const { data } = await sendNewMessage({
      variables: {
        body: {
          app: "hospital",
          from: userInfo?._id,
          isDeleted: false,
          payload: {
            body: newMessage,
            types: "message",
          },
          to: groupChatId,
          toName: "",
          fromImage: "",
          fromName: `${userInfo.firstName} ${userInfo.lastName}`,
          mentionedUsers: messageInput.mentionedUsers,
        },
      },
    });
    if (messageInput?.mentionedUsers?.length > 0) {
      onAddUsersToCase({
        caseId: groupChatId,
        userIds,
      });
    }
    e.target.reset();
    setMessageInput({
      mentionedText: "",
      text: "",
      mentionedUsers: [],
    });
    refetch();
  };

  // const handleScroll: any = (e: any) => {
  // 	if (isConversationLoading) return;
  // 	const element = e.target;
  // 	if (element.scrollTop === 0) {
  // 		// setIsMessageLoading(true);
  // 		setPageNumber(pageNumber + 1);
  // 	}
  // 	// else if (
  // 	// 	element.scrollTop + element.clientHeight >=
  // 	// 	element.scrollHeight
  // 	// ) {
  // 	// 	setPageNumber(1);
  // 	// }

  // 	// const height = element.scrollHeight - element.clientHeight;
  // 	// const percent = (element.scrollTop / height) * 100;
  // 	// console.log("percent", percent);
  // 	// if (percent <= 30) setIsMessageLoading(true);
  // 	// console.log(
  // 	// 	"percent Processing",
  // 	// 	element.scrollHeight,
  // 	// 	element.clientHeight,
  // 	// 	element.scrollTop + element.clientHeight
  // 	// );
  // };

  // const { data: subscribedMessageData } = useSubscription(CHAT_SUBSCRIPTION, {
  //   variables: {
  //     toId: groupChatId,
  //     fromId: userInfo?._id,
  //   },
  // });


  const { subscribedMessageData } = useGetMessageSubcription(groupChatId,userInfo?._id)
  // console.log(client2);
  useEffect(() => {
    if (subscribedMessageData) {
      const newMessages = [
        ...groupMessages,
        subscribedMessageData.newChat.data,
      ];

      setGroupMessages(newMessages);
    }
  }, [subscribedMessageData]);
  if (isConversationLoading)
    return (
      <Spinner
        pos="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%,-50%)"
      />
    );

  // const fetchUsers = (query, callback) => {
  //   if (!query) return;

  //   setTimeout(() => {
  //     const filteredUsers = users.filter((user) =>
  //       user.display.toLowerCase().includes(query)
  //     );
  //     callback(filteredUsers);
  //   }, 2000);
  // };

  const handleInputChange = (e, mentionedText, text, mentions) => {
    const mentionedUsers = mentions.map((mention) => ({
      toId: mention.id,
      toName: mention.display,
      message: messageInput?.text,
    }));
    setMessageInput({
      mentionedText,
      text,
      mentionedUsers,
    });
  };

  return (
    <>
      <ScrollBar>
        <Box id="message" h="72vh" paddingTop="40px" px="22px">
          {isConversationLoading && pageNumber > 1 ? (
            <Spinner />
          ) : (
            pageNumber < totalPage && (
              <Flex
                justifyContent="center"
                marginTop="-30px"
                marginBottom="10px"
              >
                <Text
                  cursor="pointer"
                  fontSize="12px"
                  onClick={() => setPageNumber(pageNumber + 1)}
                >
                  Click to load more
                </Text>
              </Flex>
            )
          )}
          {groupMessages.length === 0 && (
            <Flex
              h="100%"
              alignItems="center"
              justifyContent="center"
              flexDir="column"
              gap="0.5rem"
            >
              <Text fontSize="20px" fontWeight="700">
                You&apos;re starting a new conversation
              </Text>
              <Text fontSize="14px">Type your first message below</Text>
            </Flex>
          )}
          <Flex flexDir="column" gap="1rem">
            {/* {groupMessages.length > 0 && (
						<Text
							my="10px"
							alignSelf="center"
							fontSize="12px"
							fontWeight="500"
							color="#52585D"
						>
							{moment().calendar(new Date(), formats)}
						</Text>
					)} */}

            {groupMessages.map((data) => {
              if (lastDate !== moment(data.createdAt).format("MM-DD-YYYY")) {
                lastDate = moment(data.createdAt).format("MM-DD-YYYY");

                return (
                  <>
                    <DateSeperatorComponent
                      messageSepratorDate={data.createdAt}
                    />
                    {data.from === userInfo._id ? (
                      <RightMessageComponent
                        data={data}
                        key={uuidv4()}
                        queryChat={queryChat}
                        setQueryChat={setQueryChat}
                        zoomIntoAnnotation={zoomIntoAnnotation}
                      />
                    ) : (
                      <LeftMessageComponent
                        data={data}
                        key={uuidv4()}
                        queryChat={queryChat}
                        setQueryChat={setQueryChat}
                        zoomIntoAnnotation={zoomIntoAnnotation}
                      />
                    )}
                  </>
                );
              }

              return data.from === userInfo._id ? (
                <RightMessageComponent
                  data={data}
                  key={uuidv4()}
                  queryChat={queryChat}
                  setQueryChat={setQueryChat}
                  zoomIntoAnnotation={zoomIntoAnnotation}
                />
              ) : (
                <LeftMessageComponent
                  data={data}
                  key={uuidv4()}
                  queryChat={queryChat}
                  setQueryChat={setQueryChat}
                  zoomIntoAnnotation={zoomIntoAnnotation}
                />
              );
            })}

            <Box ref={bottomRef} />
          </Flex>
        </Box>
      </ScrollBar>

      <Box
        marginTop="auto"
        display="flex"
        h="40px"
        // border="1px solid rgba(150, 169, 186, 0.7)"
        marginLeft="0px!important"
        mr="10px"
        paddingLeft="12px"
        marginBottom="12px"
      >
        {/* <Flex
					gap="1rem"
					alignItems="center"
					fontSize="20px"
					h="100%"
					color="#3b5d7c"
				>
					<RiAttachment2 />
					<MdOutlineKeyboardVoice />
				</Flex> */}
        <form style={{ display: "flex", width: "100%" }} onSubmit={sendMessage}>
          {/* <Input
            ref={messageRef}
            type="text"
            placeholder="Type message here"
            outline="none"
            border="none"
            h="100%"
            onChange={(e) => setValue(e.target.value)}
          /> */}
          <MentionsInput
            singleLine
            forceSuggestionsAboveCursor
            allowSuggestionsAboveCursor
            appendSpaceOnAdd
            inputRef={messageRef}
            value={messageInput.mentionedText}
            onChange={handleInputChange}
            // placeholder={"Mention people using '@'"}
            a11ySuggestionsListLabel="Suggested mentions"
            style={defaultStyle}
          >
            <Mention data={onMentionUsers} style={defaultMentionStyle} />
          </MentionsInput>
          <Button
            type="submit"
            bg="#3b5d7c"
            fontSize="16px"
            color="#fff"
            h="100%"
            borderRadius="0"
            _hover={{ bg: "#3b5d7c" }}
            isDisabled={!messageInput.text.trim()}
          >
            Send &nbsp;&nbsp;{" "}
            <span>
              <AiOutlineSend />
            </span>
          </Button>
        </form>
        {queryChat && (
          <QueryChat
            setQueryChat={setQueryChat}
            queryChat={queryChat}
            userInfo={userInfo}
            client={client2}
            getMessagesFromDB={getMessagesFromDB}
            onSendMessage={onSendMessage}
            useGetMessageSubcription={useGetMessageSubcription}
          />
        )}
      </Box>
      {/* <Box h="5px" /> */}
    </>
  );
};

export default ChatConversationFeed;
