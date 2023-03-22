import { useMutation } from "@apollo/client";
import { CloseIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  Spacer,
  Text,
} from "@chakra-ui/react";
import moment from "moment";
import React, { useRef, useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { HiOutlineArrowRight } from "react-icons/hi";
import { Mention, MentionsInput } from "react-mentions";
import { SEND_MESSAGE } from "../../state/graphql/ChatQuery";
import defaultMentionStyle from "../Feed/defaultMentionStyle";
import defaultStyle from "../Feed/defaultStyle";

const AnnotationChat = ({
  isOpen,
  onClose,
  onOpen,
  userInfo,
  client,
  chatId,
  mentionUsers,
}) => {
  console.log(chatId, client, userInfo);
  const [groupMessages, setGroupMessages] = useState([]);
  const [messageInput, setMessageInput] = useState({
    mentionedText: "",
    text: "",
    mentionedUsers: [],
  });
  const messageRef = useRef(null);

  const [sendNewMessage, { error: newMessageError }] = useMutation(
    SEND_MESSAGE,
    { client }
  );

  const sendMessage = async (e) => {
    e.preventDefault();
    const newMessage = messageInput.text.trim();
    if (!newMessage) return;
    setGroupMessages([
      ...groupMessages,
      {
        from: userInfo?._id,
        createdAt: moment(),
        payload: { body: newMessage },
      },
    ]);

    e.target.reset();
    setMessageInput({
      mentionedText: "",
      text: "",
      mentionedUsers: [],
    });
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
          to: chatId,
          toName: "",
          fromImage: "",
          fromName: `${userInfo.firstName}`,
          mentionedUsers: messageInput.mentionedUsers,
        },
      },
    });
    onClose();
  };
  const handleInputChange = (e, mentionedText, text, mentions) => {
    const mentionedUsers = mentions.map((mention) => ({
      toId: mention.id,
      toName: mention.display,
      message: mentionedText,
    }));
    setMessageInput({
      mentionedText,
      text,
      mentionedUsers,
    });
  };
  return (
    <Modal
      onClose={onclose}
      isOpen={isOpen}
      onOpen={onOpen}
      isCentered
      closeOnOverlayClick
    >
      <ModalContent
        className="chakra-modal__content-container"
        borderRadius="0px"
      >
        <ModalBody
          css={{
            "&::-webkit-scrollbar": {
              width: "4px",
            },
            "&::-webkit-scrollbar-track": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#C4C4C4",
            },
          }}
          p="0vh 0vw"
        >
          <Flex w="100%" mb="10px" direction="column">
            <Flex
              alignItems="center"
              justifyContent="space-between"
              borderBottom="1px"
              borderColor="gray.300"
              w="100%"
              px="0.7rem"
            >
              <Box>
                <Text fontSize="16px" py="5px">
                  Queries
                </Text>
              </Box>
              <Spacer />
              <Button bg="none" outline="none" border="none" onClick={onClose}>
                <CloseIcon w={3} h={3} />
              </Button>
            </Flex>
            <Flex p="0.7rem 1rem" bg="#fcfcfc" alignItems="center">
              <Avatar
                size="sm"
                src={userInfo?.profilePicture}
                name={`${userInfo?.firstName} ${userInfo?.lastName}`}
                mr="0.5rem"
              />
              <form
                style={{ display: "flex", width: "100%" }}
                onSubmit={sendMessage}
              >
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
                  <Mention data={mentionUsers} style={defaultMentionStyle} />
                </MentionsInput>
                <Button
                  type="submit"
                  bg="#3b5d7c"
                  size="md"
                  fontSize="16px"
                  color="#fff"
                  // h="100%"
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
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AnnotationChat;
