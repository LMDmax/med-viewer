import React from "react";

import { useMutation } from "@apollo/client";
import { Flex, SimpleGrid, useToast } from "@chakra-ui/react";
import { fabric } from "openseadragon-fabricjs-overlay";
import Draggable from "react-draggable";
import { MdOutlineDragIndicator } from "react-icons/md";
import {
  DELETE_ANNOTATION,
  SAVE_ANNOTATION,
} from "../../graphql/annotaionsQuery";
import { useFabricOverlayState } from "../../state/store";
import Draw from "../Draw/draw";
import RemoveObject from "../removeComponents";
import Circle from "../Shape/circle";
import Line from "../Shape/line";
import Polygon from "../Shape/polygon";
import Square from "../Shape/square";
import MagicWandTool from "../Tools/magicWandTool";

const TypeTools = ({
  enableAI,
  userInfo,
  viewerId,
  setToolSelected,
  setTotalCells,
  lessonId,
  toolSelected,
  caseInfo,
  application,
}) => {
  // save annotation in db
  // console.log("====================================");
  // console.log("application", application);
  // console.log("====================================");

  const { fabricOverlayState } = useFabricOverlayState();
  const { fabricOverlay } = fabricOverlayState.viewerWindow[viewerId];
  const toast = useToast();

  fabric.IText.prototype.onKeyDown = (e) => {
    if (e.ctrlKey === true && e.key === "Enter") {
      fabricOverlay.fabricCanvas().discardActiveObject();
    }
  };

  const [removeAnnotation, { data: deletedData, error: deleteError }] =
    useMutation(DELETE_ANNOTATION);
  if (deleteError)
    toast({
      title: "Annotation could not be deleted",
      description: "server error",
      status: "error",
      duration: 1000,
      isClosable: true,
    });

  // delete Annotation from db
  const onDeleteAnnotation = (data) => {
    removeAnnotation({ variables: { body: data } });
  };
  const caseData = JSON.parse(localStorage.getItem("caseData"));
  const caseId = caseInfo?._id;
  const onSaveAnnotation = (data) => {
    createAnnotation({
      variables: {
        body: {
          ...data,
          app: application,
          createdBy: `${userInfo?.firstName} ${userInfo?.lastName}`,
          ...(application === "hospital" ? { caseId } : { lessonId }),
        },
      },
    });
  };
  const [createAnnotation, { data, error, loading }] =
    useMutation(SAVE_ANNOTATION);

  if (error)
    toast({
      title: "Annotation could not be created",
      description: "server error",
      status: "error",
      duration: 1000,
      isClosable: true,
    });

  return (
    <Draggable
      bounds={{
        top: 0,
        left: 0,
        right: 90 * (window.screen.width / 100),
        bottom: 60 * (window.screen.height / 100),
      }}
      handle=".drag-handle"
    >
      <Flex
        direction="column"
        pos="fixed"
        zIndex="999"
        boxShadow="1px 1px 2px rgba(176, 200, 214, 0.5)"
      >
        <Flex
          className="drag-handle"
          // borderTop="5px solid black"
          // borderBottom="5px solid black"
          bg="whitesmoke"
          h="15px"  
          // border="1px solid red"
          cursor="move"
          alignItems="center"
          justifyContent="center"
        >
                        <MdOutlineDragIndicator  style={{ transform: 'rotate(90deg)'  , color:"darkgrey" }}  />
                        </Flex>
        <SimpleGrid columns={2} px="8px" bgColor="#FCFCFC" py="8px" spacing={2}>
          <Line
            setToolSelected={setToolSelected}
            viewerId={viewerId}
            onSaveAnnotation={onSaveAnnotation}
          />
          {enableAI ? (
            <MagicWandTool
              userInfo={userInfo}
              toolSelected={toolSelected}
              viewerId={viewerId}
              setToolSelected={setToolSelected}
              setTotalCells={setTotalCells}
              onSaveAnnotation={onSaveAnnotation}
            />
          ) : null}
          <Square
            setToolSelected={setToolSelected}
            viewerId={viewerId}
            onSaveAnnotation={onSaveAnnotation}
          />
          <Circle
            setToolSelected={setToolSelected}
            viewerId={viewerId}
            onSaveAnnotation={onSaveAnnotation}
          />
          <Polygon
            setToolSelected={setToolSelected}
            viewerId={viewerId}
            onSaveAnnotation={onSaveAnnotation}
          />
          <Draw
            setToolSelected={setToolSelected}
            viewerId={viewerId}
            onSaveAnnotation={onSaveAnnotation}
          />
          <RemoveObject
            viewerId={viewerId}
            onDeleteAnnotation={onDeleteAnnotation}
          />
        </SimpleGrid>
      </Flex>
    </Draggable>
  );
};

export default TypeTools;
