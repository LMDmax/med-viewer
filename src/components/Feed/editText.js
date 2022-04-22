import {
  Textarea,
  ButtonGroup,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useState } from "react";

const EditText = ({ isOpen, onClose, handleClose, handleSave }) => {
  const [text, setText] = useState("");
  const [ifBiggerScreen] = useMediaQuery("(min-width:1920px)");

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSaveButton = () => {
    handleSave(text);
    setText("");
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
          <Textarea
            resize="none"
            value={text}
            _focus={{ borderColor: "#00153F" }}
            onChange={handleTextChange}
            borderRadius="0px"
          />
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
