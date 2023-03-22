import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  Button,
} from "@chakra-ui/react";

const DeleteConfirmation = ({ isOpen, onClose, handleConfirmation }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalContent borderRadius={0}>
        <ModalHeader borderBottom="1px solid rgba(0, 0, 0, 0.25)" py={1}>
          Confirmation
        </ModalHeader>
        <ModalBody>
          <Text>Are you sure you want to delete all annotations?</Text>
        </ModalBody>
        <ModalFooter>
          <Button
            h="32px"
            ml="15px"
            borderRadius="0px"
            bg="none"
            border="2px solid #00153F"
            color="#00153F"
            _hover={{ border: "2px solid #00153F" }}
            _focus={{
              border: "2px solid #00153F",
            }}
            _active={{ background: "none" }}
            fontFamily="inter"
            fontSize="14px"
            fontWeight="bold"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="solid"
            h="32px"
            ml="15px"
            borderRadius="0px"
            backgroundColor="#00153F"
            _hover={{ border: "none" }}
            _focus={{
              border: "none",
            }}
            color="#fff"
            fontFamily="inter"
            fontSize="14px"
            fontWeight="bold"
            onClick={handleConfirmation}
          >
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmation;
