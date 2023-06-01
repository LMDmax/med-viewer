import React, { useEffect } from "react";

import { Flex } from "@chakra-ui/react";

import { useFabricOverlayState } from "../../state/store";
import ViewerContainer from "./container";
import ViewerHeader from "./viewerHeader";

function ViewerFactory({
  enableAI,
  caseInfo,
  runAiModel,
  navigatorCounter,
  userInfo,
  setToolSelected,
  bottomZoomValue,
  slide,
  slideName,
  slides,
  setBottomZoomValue,
  setCurrentViewer,
  application,
  viewerIds,
  setLoadUI,
  setZoomValue,
  zoomValue,
  client2,
  mentionUsers,
  addUsersToCase,
  setModelname,
  Environment,
  accessToken,
  setIsXmlAnnotations,
  handleAnnotationClick,
}) {
  const { fabricOverlayState } = useFabricOverlayState();
  const { viewerWindow, sync } = fabricOverlayState;

  // console.log(viewerWindow);

  const vKeys = Object.keys(viewerWindow);
  // console.log("vkey", vKeys);

  useEffect(() => {
    if (!sync) return;

    let isLeading1 = false;
    let isLeading2 = false;

    const vKeys = Object.keys(viewerWindow);
    // console.log("vkey", vKeys);
    const { viewer: viewer1 } = viewerWindow[vKeys[0]];
    const { viewer: viewer2 } = viewerWindow[vKeys[1]];

    const handler1 = () => {
      if (isLeading2) return;

      isLeading1 = true;
      viewer2.viewport.zoomTo(viewer1.viewport.getZoom());
      viewer2.viewport.panTo(viewer1.viewport.getCenter());
      isLeading1 = false;
    };

    const handler2 = () => {
      if (isLeading1) return;

      isLeading2 = true;
      viewer1.viewport.zoomTo(viewer2.viewport.getZoom());
      viewer1.viewport.panTo(viewer2.viewport.getCenter());
      isLeading2 = false;
    };

    viewer1.addHandler("zoom", handler1);
    viewer2.addHandler("zoom", handler2);
    viewer1.addHandler("pan", handler1);
    viewer2.addHandler("pan", handler2);

    return () => {
      viewer1.removeHandler("zoom", handler1);
      viewer2.removeHandler("zoom", handler2);
      viewer1.removeHandler("pan", handler1);
      viewer2.removeHandler("pan", handler2);
    };
  }, [sync]);

  return (
    <>
      {Object.keys(viewerWindow).map((viewer, index) => (
        <Flex w="100%" h="100%" direction="column" key={viewer}>
          {Object.keys(viewerWindow).length > 1 ? (
            <ViewerHeader
              caseInfo={caseInfo}
              slide={slide}
              slides={slides}
              viewerId={viewer}
              slideName={slideName}
              slideUrl={viewerWindow?.[viewer]?.tile}
              setCurrentViewer={setCurrentViewer}
            />
          ) : null}
          <ViewerContainer
            application={application}
            viewerId={viewer}
            userInfo={userInfo}
            enableAI={enableAI}
            slide={slide}
            setToolSelected={setToolSelected}
            setZoomValue={setZoomValue}
            zoomValue={zoomValue}
            setLoadUI={setLoadUI}
            bottomZoomValue={bottomZoomValue}
            viewerIds={viewerIds}
            client2={client2}
            navigatorCounter={navigatorCounter}
            setBottomZoomValue={setBottomZoomValue}
            mentionUsers={mentionUsers}
            caseInfo={caseInfo}
            runAiModel={runAiModel}
            addUsersToCase={addUsersToCase}
            Environment={Environment}
            setModelname={setModelname}
            accessToken={accessToken}
            setIsXmlAnnotations={setIsXmlAnnotations}
            handleAnnotationClick={handleAnnotationClick}
          />
        </Flex>
      ))}
    </>
  );
}

export default ViewerFactory;
