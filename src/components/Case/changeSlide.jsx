import React, { useEffect } from "react";

import {
  changeTile,
  updateTool,
} from "../../state/actions/fabricOverlayActions";
import { useFabricOverlayState } from "../../state/store";
import "../../styles/viewer.css";
import ChangeHelper from "./changeHelper";
import ChangeHelper2 from "./changeHelper2";

const ChangeSlide = ({
  caseInfo,
  slides,
  loadUI,
  slideName,
  setSlideName,
  slideName2,
  slideUrl,
  viewerId,
  setIsMultiview,
  setSelectedOption,
  slide,
  setNavigatorCounter,
  changeSlide,
  setIsNavigatorActive,
  setChangeSlide,
  isNavigatorActive,
  ...restProps
}) => {
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { viewerWindow, isAnnotationLoading } = fabricOverlayState;
  const { viewer, fabricOverlay, slideId } = viewerWindow[viewerId];
  // console.log(slideId)
  var vKeys = Object.keys(viewerWindow);
  const currentIndex = slides?.findIndex(
    (s) => s.awsImageBucketUrl === slideUrl
  );

  const maxIndex = slides?.length;

  // console.log(viewerId)

  const disabledLeft =
    isAnnotationLoading ||
    currentIndex - 1 < 0 ||
    slides?.[currentIndex - 1]?.awsImageBucketUrl === "";

  const disabledRight =
    isAnnotationLoading ||
    currentIndex + 1 === maxIndex ||
    slides?.[currentIndex + 1]?.awsImageBucketUrl === "";

  const title = `${caseInfo?.caseName}-${currentIndex + 1}`;

  const clickHandler = (position) => {
    const nextSlide = slides?.[currentIndex + position];
    // console.log(nextSlide);
    setSlideName(nextSlide?.slideName);
    setNavigatorCounter((prev) => prev + 1);
    setFabricOverlayState(updateTool({ tool: "Move" }));
    setFabricOverlayState(
      changeTile({
        id: viewerId,
        tile: nextSlide?.awsImageBucketUrl,
        slideName: nextSlide?.accessionId,
        slideId: nextSlide?._id || nextSlide?.slideId,
        originalFileUrl: nextSlide?.originalFileUrl,
      })
    );
    viewer?.open(nextSlide.awsImageBucketUrl);
    // fabricOverlay.fabricCanvas().clear();
  };

  useEffect(() => {
    if (changeSlide === true) {
      clickHandler(1);
      setChangeSlide(false);
    }
  }, [changeSlide]);

  return (
    <>
      {viewerId === vKeys[0] && (
        <ChangeHelper
          title={title}
          disabledLeft={disabledLeft}
          disabledRight={disabledRight}
          clickHandler={clickHandler}
          setIsMultiview={setIsMultiview}
          loadUI={loadUI}
          setSelectedOption={setSelectedOption}
          slide={slide}
          viewerId={viewerId}
          slideName={slideName}
          setIsNavigatorActive={setIsNavigatorActive}
          isNavigatorActive={isNavigatorActive}
          isAnnotationLoading={isAnnotationLoading}
        />
      )}
      {viewerId === vKeys[1] && (
        <ChangeHelper2
          title={title}
          disabledLeft={disabledLeft}
          disabledRight={disabledRight}
          clickHandler={clickHandler}
          setIsMultiview={setIsMultiview}
          loadUI={loadUI}
          slide={slide}
          slideName2={slideName2}
          slideName={slideName}
          setIsNavigatorActive={setIsNavigatorActive}
          isNavigatorActive={isNavigatorActive}
          isAnnotationLoading={isAnnotationLoading}
        />
      )}
    </>
  );
};

export default ChangeSlide;
