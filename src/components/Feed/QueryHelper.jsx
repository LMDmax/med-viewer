
import { Button, Flex, Input } from "@chakra-ui/react";
import moment from "moment";
import React, { useState } from "react";
import { AiOutlineSend } from "react-icons/ai";

const QueryHelper = ({
  userInfo,
  chatId,
  client,
  groupMessages,
  setGroupMessages,
  onSendMessage,
  refetch,
}) => {
  const [messageInput, setMessageInput] = useState("");
  const { sendNewMessage } = onSendMessage;
  const sendMessage = async () => {
    setGroupMessages([
      ...groupMessages,
      {
        from: userInfo?._id,
        createdAt: moment(),
        payload: { body: messageInput },
        fromName: `${userInfo.firstName} ${userInfo.lastName}`,
      },
    ]);
    setMessageInput("");
    const { data } = await sendNewMessage({
      variables: {
        body: {
          app: "hospital",
          from: userInfo?._id,
          isDeleted: false,
          payload: {
            body: messageInput,
            types: "message",
          },
          to: chatId,
          toName: "",
          fromImage: "",
          fromName: `${userInfo.firstName} ${userInfo.lastName}`,
          mentionedUsers: [],
        },
      },
    });
    refetch();
  };
  return (
    <Flex w="100%">
      <Input
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        borderRadius="0"
        size="md"
        placeholder="Comment..."
      />
      <Button
        bg="#3b5d7c"
        color="#fff"
        size="md"
        borderRadius="0"
        _hover={{ bg: "#3b5d7c" }}
        onClick={() => sendMessage()}
        isDisabled={!messageInput}
      >
        <AiOutlineSend />
      </Button>
    </Flex>
  );
};

export default QueryHelper;
