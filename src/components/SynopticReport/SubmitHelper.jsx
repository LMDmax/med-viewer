import React, { useState } from "react";
import {
  Flex,
  HStack,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
} from "@chakra-ui/react";
import { BsQuestionCircleFill } from "react-icons/bs";

const SubmitHelper = ({
  userInfo,
  reportedStatus,
  answeredAll,
  submitReport,
  handleUpdate,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [submitButton, setSubmitButton] = useState(true);
  const [updateButton, setUpdateButton] = useState(true);

  const submitHandler = () => {
    setSubmitButton(false);
    submitReport();
    setTimeout(() => {
      setSubmitButton(true);
    }, 1000);
  };
  const updateHandler = () => {
    setUpdateButton(false);
    handleUpdate();
    setTimeout(() => {
      setUpdateButton(true);
    }, 1000);
  };

  return (
    userInfo?.userType !== "technologist" && (
      <>
        <Flex justifyContent="center" w="350px" mt="20px" alignItems="center"  mr="20px">
          {reportedStatus !== true ? (
            <Flex>
              {!answeredAll ? (
                <Button
                  onClick={onOpen}
                  borderRadius="0"
                  bg="#00153F"
                  color="#fff"
                  size="sm"
                  minW="100px"
                  _focus={{ outline: "none", bg: "#00153F" }}
                  _hover={{ bg: "#00153F" }}
                >
                  Submit
                </Button>
              ) : (
                <Button
                  onClick={() => submitHandler()}
                  borderRadius="0"
                  bg="#00153F"
                  color="#fff"
                  size="sm"
                  minW="100px"
                  _focus={{ outline: "none", bg: "#00153F" }}
                  _hover={{ bg: "#00153F" }}
                  isLoading={!submitButton}
                >
                  Submit
                </Button>
              )}
            </Flex>
          ) : (
            <Flex>
              <Button
                onClick={() => updateHandler()}
                borderRadius="0"
                bg="#00153F"
                color="#fff"
                size="sm"
                minW="100px"
                _focus={{ outline: "none", bg: "#00153F" }}
                variant="solid"
                _hover={{ bg: "#00153F" }}
                isLoading={!updateButton}
              >
                Submit
              </Button>
            </Flex>
          )}
        </Flex>
        <Modal size="6xl" isCentered isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent
            background="light.200"
            w="fit-content"
            borderRadius="0px"
          >
            <ModalBody flexDirection="column" px="2.1vw">
              <HStack mt="2vh">
                <BsQuestionCircleFill color="#3B5D7C" size={20} />
                <Text>
                  <Text>
                    Some fields are not answered. Do you want to proceed?
                  </Text>
                </Text>
              </HStack>
              <HStack justifyContent="flex-end" mt="3.6vh" mb="2vh">
                <Button
                  colorScheme="blue"
                  mr={3}
                  borderRadius="0"
                  bg="#fff"
                  color="#00153F"
                  border="1px solid #00153F"
                  size="sm"
                  minW="100px"
                  fontWeight="400"
                  _hover={{ bg: "#fff" }}
                  onClick={onClose}
                >
                  Close
                </Button>
                <Button
                  onClick={() => submitHandler()}
                  borderRadius="0"
                  bg="#00153F"
                  color="#fff"
                  size="sm"
                  minW="100px"
                  fontWeight="400"
                  _focus={{ outline: "none", bg: "#00153F" }}
                  _hover={{ bg: "#00153F" }}
                  isLoading={!submitButton}
                >
                  Submit
                </Button>
              </HStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    )
  );
};

export default SubmitHelper;
