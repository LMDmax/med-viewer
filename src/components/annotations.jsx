import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { FaSave } from "react-icons/fa";
import { useParams } from "react-router-dom";
import AltButton from "./altButton";
import { useFabricOverlayState } from "../state/store";
import { updateOverlay } from "../state/actions/fabricOverlayActions";

const MyAnnotationsSave = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const params = useParams;
  const [title, setTitle] = useState("");

  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { activeUserCanvas, fabricOverlay, userCanvases } = fabricOverlayState;

  useEffect(() => {
    setTitle(activeUserCanvas);
  }, [activeUserCanvas]);

  const handleSaveCanvas = () => {
    const newCanvases = {
      ...userCanvases,
      [title]: {
        locWorkId: params.id,
        fabricCanvas: fabricOverlay._fabricCanvas.toObject(),
      },
    };

    setFabricOverlayState(
      updateOverlay({
        userCanvases: newCanvases,
        activeUserCanvas: title,
      })
    );

    onClose();
  };

  return (
    <>
      <AltButton disabled={false} onClick={onOpen} leftIcon={<FaSave />}>
        Save
      </AltButton>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Save annotation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl
              id="user-canvas-name"
              isRequired
              isInvalid={title === ""}
            >
              <FormLabel>Save as</FormLabel>
            </FormControl>
            <Input
              placeholder="Name your work"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <FormErrorMessage>Value can not be empty</FormErrorMessage>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={handleSaveCanvas} isDisabled={title === ""}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MyAnnotationsSave;
