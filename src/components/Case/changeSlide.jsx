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
  application,
  ...restProps
}) => {
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { viewerWindow, isAnnotationLoading } = fabricOverlayState;
  const { viewer, fabricOverlay, slideId } = viewerWindow[viewerId];
  const all_slides =
    application === "clinical"
      ? slides.filter((e) => e.slideType === slide.slideType)
      : slides;
  var vKeys = Object.keys(viewerWindow);
  const currentIndex = all_slides?.findIndex(
    (s) => s.awsImageBucketUrl === slideUrl
  );

  const maxIndex = all_slides?.length;

  // console.log({ slideId });
  console.log({ all_slides });
  // console.log(all_slides.length);

  const disabledLeft =
    isAnnotationLoading ||
    currentIndex - 1 < 0 ||
    all_slides?.[currentIndex - 1]?.awsImageBucketUrl === "";

  const disabledRight =
    isAnnotationLoading ||
    currentIndex + 1 === maxIndex ||
    all_slides?.[currentIndex + 1]?.awsImageBucketUrl === "";

  const title = `${caseInfo?.caseName}-${currentIndex + 1}`;

  const clickHandler = (position) => {
    const nextSlide = all_slides?.[currentIndex + position];
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

  const circularClickHandler = (direction) => {
    const currentIndex = all_slides.findIndex((slide) => slide._id === slideId);
    let nextIndex;

    if (direction === 1) {
      // Move to the next slide
      nextIndex = currentIndex + 1;
      if (nextIndex  === all_slides.length) {
        // If reached the last slide, start from the first one
        nextIndex = 0;
      }
    }

    console.log({nextIndex});
    console.log({currentIndex});
    
    const nextSlide = all_slides[nextIndex];
    console.log({nextSlide});

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
    viewer?.open(nextSlide?.awsImageBucketUrl);
  };
  useEffect(() => {
    if (changeSlide === true) {
      circularClickHandler(1);
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
