import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  useMediaQuery,
  Text,
  Center,
  Image,
  Divider,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

// import ProgressBar from "../Loading/ProgressBar";
import ViewerFactory from "../Viewer/viewerFactory";
import AdjustmentBar from "../AdjustmentBar/adjustmentBar"
import LayoutAppBody from "./body";
import LayoutInnerBody from "./innerbody";
import LayoutOuterBody from "./outerbody";
import { useFabricOverlayState } from "../../state/store";
import Header from "../Header/Header";

const LayoutApp = ({ viewerIds, tile }) => {
  // const { handleEvent } = useKeyboardEvents();
  const { fabricOverlayState } = useFabricOverlayState();
  const { viewerWindow, isAnnotationLoading } = fabricOverlayState;
  const [navigatorCounter, setNavigatorCounter] = useState(0);

  const [ifBiggerScreen] = useMediaQuery("(min-width:1920px)");
  const [currentViewer, setCurrentViewer] = useState(
    viewerIds?.[0]?._id || viewerIds?.[0]?.slideId
  );
  const [bottomZoomValue, setBottomZoomValue] = useState("");


  return (
    <Flex
      h={ifBiggerScreen ? "100vh" : "100vh"}
      direction="column"
    >
          <Header />

      <LayoutOuterBody>
      <AdjustmentBar
          // userInfo={userInfo}
          // caseInfo={caseInfo}
          // slide={viewerIds?.[0]}
          // annotations={annotations}
          // changeCaseHandler={changeCaseHandler}
          // report={report}
          // enableAI={enableAI}
          // application={application}
          // currentViewer={currentViewer}
          // showSidebar={() => showSidebar()}
          // sidebar={sidebar}
          // setTotalCells={setTotalCells}
          // isNavigatorActive={isNavigatorActive}
          // setIsNavigatorActive={setIsNavigatorActive}
          // isMultiview={isMultiview}
          // setIsMultiview={setIsMultiview}
          // onSaveAnnotation={onSaveAnnotation}
          // onDeleteAnnotation={onDeleteAnnotation}
          // handleAnnotationBar={handleAnnotationBar}
          // onVhutViewportAnalysis={onVhutViewportAnalysis}
          // saveReport={saveReport}
          // mediaUpload={mediaUpload}
          // slideInfo={slideInfo}
          // handleFeedBar={handleFeedBar}
          // handleReport={handleReport}
          // showReport={showReport}
          // setShowReport={setShowReport}
          // clinicalStudy={clinicalStudy}
          // questions={questions}
          // responseHandler={responseHandler}
          // questionnaireResponse={questionnaireResponse}
        />
        <LayoutInnerBody>
          <LayoutAppBody>
            <ViewerFactory
              slide={viewerIds?.[0]}
              tile={tile}
              setBottomZoomValue={setBottomZoomValue}
              navigatorCounter={navigatorCounter}
            />
          </LayoutAppBody>
        </LayoutInnerBody>
      </LayoutOuterBody>
    </Flex>
  );
};

LayoutApp.propTypes = {
  finalSubmitHandler: PropTypes.func,
};

export default LayoutApp;
