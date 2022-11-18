import React from "react";
import { Flex, SimpleGrid } from "@chakra-ui/react";
import { fabric } from "openseadragon-fabricjs-overlay";
import Draggable from "react-draggable";
import Draw from "../Draw/draw";
import Square from "../Shape/square";
import Line from "../Shape/line";
import Circle from "../Shape/circle";
import Polygon from "../Shape/polygon";
import RemoveObject from "../removeComponents";
import { useFabricOverlayState } from "../../state/store";
import MagicWandTool from "../Tools/magicWandTool";
import { useMutation } from "@apollo/client";
import { SAVE_ANNOTATION } from "../../graphql/annotaionsQuery";

const TypeTools = ({
  enableAI,
  userInfo,
  viewerId,
  // onSaveAnnotation,
  onDeleteAnnotation,
  setTotalCells,
  onVhutViewportAnalysis,
  application,
}) => {
  // save annotation in db
  console.log("====================================");
  console.log("application", application);
  console.log("====================================");
  const onSaveAnnotation = (data) => {
    createAnnotation({ variables: { body: { ...data, app: application } } });
  };
  const [createAnnotation, { data, error, loading }] =
    useMutation(SAVE_ANNOTATION);

  const { fabricOverlayState } = useFabricOverlayState();
  const { fabricOverlay } = fabricOverlayState.viewerWindow[viewerId];

  fabric.IText.prototype.onKeyDown = (e) => {
    if (e.ctrlKey === true && e.key === "Enter") {
      fabricOverlay.fabricCanvas().discardActiveObject();
    }
  };

  return (
    <Draggable
      bounds={{
        top: 0,
        left: 0,
        right: 90 * (window.screen.width / 100),
        bottom: 60 * (window.screen.height / 100),
      }}
    >
      <Flex
        direction="column"
        pos="fixed"
        boxShadow="1px 1px 2px rgba(176, 200, 214, 0.5)"
        bgColor="#FCFCFC"
      >
        <Flex h="12px" bgColor="rgba(236, 236, 236, 1)" cursor="crosshair" />
        <SimpleGrid columns={2} px="8px" bgColor="#fff" py="8px" spacing={2}>
          <Line viewerId={viewerId} onSaveAnnotation={onSaveAnnotation} />
          {enableAI ? (
            <MagicWandTool
              userInfo={userInfo}
              viewerId={viewerId}
              setTotalCells={setTotalCells}
              onSaveAnnotation={onSaveAnnotation}
              onVhutViewportAnalysis={onVhutViewportAnalysis}
            />
          ) : null}
          <Square viewerId={viewerId} onSaveAnnotation={onSaveAnnotation} />
          <Circle viewerId={viewerId} onSaveAnnotation={onSaveAnnotation} />
          <Polygon viewerId={viewerId} onSaveAnnotation={onSaveAnnotation} />
          <Draw viewerId={viewerId} onSaveAnnotation={onSaveAnnotation} />
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
