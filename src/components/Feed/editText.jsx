import {
  Textarea,
  ButtonGroup,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const EditText = ({
  isOpen,
  onClose,
  textValue,
  annotationObject,
  titleValue,
  handleClose,
  handleSave,
}) => {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [ifBiggerScreen] = useMediaQuery("(min-width:1920px)");

  useEffect(() => {
    setText(textValue);
    setTitle(titleValue);
  }, [textValue, titleValue]);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSaveButton = () => {
    window.location.reload()
    handleSave({ text, title });
    setText("");
    setTitle("");
  };

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
      size="xs"
      isCentered
    >
      <ModalContent left="10px" borderRadius="0px">
        <ModalHeader>Text Annotation</ModalHeader>
        <ModalBody>
          <VStack spacing={1}>
            <Input
              type="text"
              value={title}
              borderRadius="0px"
              placeholder="Add Title"
              mt={1}
              _focus={{ borderColor: "#00153F" }}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              resize="none"
              value={text}
              _focus={{ borderColor: "#00153F" }}
              placeholder="Add description"
              onChange={handleTextChange}
              borderRadius="0px"
            />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup size="sm" color="white">
            <Button
              background="#ECECEC"
              // _hover={{ background: "#00155F" }}
              onClick={handleClose}
              borderRadius="0px"
              border=" 1px solid #00153F"
              color="#00153F"
              fontFamily="inter"
            >
              Cancel
            </Button>
            <Button
              background="#00153F"
              _hover={{ background: "#00155F" }}
              onClick={handleSaveButton}
              borderRadius="0px"
              fontFamily="inter"
              minW="80px"
            >
              Save
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditText;
