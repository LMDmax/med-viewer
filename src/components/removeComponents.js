import React, { useState, useEffect } from "react";
import { IconButton, useToast } from "@chakra-ui/react";
import IconSize from "./ViewerToolbar/IconSize";
import { useFabricOverlayState } from "../state/store";
import { removeFromActivityFeed } from "../state/actions/fabricOverlayActions";
import { EraseIcons, EraseIconsFilled } from "./Icons/CustomIcons";
import { deleteAnnotationFromDB } from "../utility";

const RemoveObject = ({ viewerId, onDeleteAnnotation }) => {
  const toast = useToast();
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { fabricOverlay, slideId } = fabricOverlayState.viewerWindow[viewerId];
  const [isActiveObject, setIsActiveObject] = useState();

  useEffect(() => {
    if (!fabricOverlay) return;

    const canvas = fabricOverlay.fabricCanvas();

    const handleSelectionCleared = () => {
      setIsActiveObject(false);
    };
    const handleSelectionCreated = () => {
      setIsActiveObject(true);
    };

    setIsActiveObject(canvas.getActiveObject());

    canvas.on("selection:created", handleSelectionCreated);
    canvas.on("selection:cleared", handleSelectionCleared);

    return () => {
      canvas.off("selection:created", handleSelectionCreated);
      canvas.off("selection:cleared", handleSelectionCleared);
    };
  }, [fabricOverlay]);

  const handleRemoveObject = async () => {
    if (!fabricOverlay) return;
    const canvas = fabricOverlay.fabricCanvas();
    const activeObject = canvas.getActiveObject();

    // // Object has children (ie. arrow has children objects triangle and line)
    // if (activeObject.getObjects) {
    //   const objs = activeObject.getObjects();
    //   Object.values(objs).forEach((obj) => {
    //     canvas.remove(obj);
    //   });
    // }

    if (
      await deleteAnnotationFromDB({
        slideId,
        hash: activeObject?.hash,
        onDeleteAnnotation,
      })
    ) {
      setFabricOverlayState(
        removeFromActivityFeed({ id: viewerId, hash: activeObject?.hash })
      );

      canvas.remove(activeObject);
      canvas.renderAll();
      toast({
        title: "Annotation deleted",
        status: "success",
        duration: 1000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Annotation could not be deleted",
        description: "server error",
        status: "error",
        duration: 1000,
        isClosable: true,
      });
    }

    // socket.emit(
    //   "send_annotations",
    //   JSON.stringify({
    //     roomName,
    //     username,
    //     content: canvas,
    //     feed: [...activityFeed, message],
    //   })
    // );
  };

  return (
    <IconButton
      icon={<EraseIcons />}
      onClick={handleRemoveObject}
      borderRadius={0}
      bg="#F6F6F6"
      disabled={!isActiveObject}
      title="Remove Item"
      _focus={{ border: "none", background: "#DEDEDE" }}
      _hover={{ bgColor: "rgba(228, 229, 232, 1)" }}
    />
  );
};

export default RemoveObject;
