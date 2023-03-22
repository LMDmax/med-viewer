import { useMutation } from "@apollo/client";
import { Button, Flex, Input } from "@chakra-ui/react";
import React, { useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { SEND_MESSAGE } from "../../state/graphql/ChatQuery";

const QueryHelper = ({ userInfo, chatId, client, setSubmitData }) => {
  const [messageInput, setMessageInput] = useState("");
  const [sendNewMessage, { error: newMessageError }] = useMutation(
    SEND_MESSAGE,
    { client }
  );
  const sendMessage = async () => {
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
    setSubmitData(data);
    setMessageInput("");
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
