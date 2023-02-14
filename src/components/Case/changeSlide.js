import React from "react";
import {
  changeTile,
  updateTool,
} from "../../state/actions/fabricOverlayActions";
import { useFabricOverlayState } from "../../state/store";
import "../../styles/viewer.css";
import ChangeHelper from "./changeHelper";

const ChangeSlide = ({ caseInfo, slideUrl, viewerId, ...restProps }) => {
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { viewerWindow, isAnnotationLoading } = fabricOverlayState;
  const { viewer, fabricOverlay } = viewerWindow[viewerId];

  const currentIndex = caseInfo.slides.findIndex(
    (s) => s.awsImageBucketUrl === slideUrl
  );

  const maxIndex = caseInfo?.slides?.length;

  const disabledLeft =
    isAnnotationLoading ||
    currentIndex - 1 < 0 ||
    caseInfo.slides[currentIndex - 1].awsImageBucketUrl === "";

  const disabledRight =
    isAnnotationLoading ||
    currentIndex + 1 === maxIndex ||
    caseInfo?.slides[currentIndex + 1].awsImageBucketUrl === "";

  const title =
    caseInfo?.slides?.[currentIndex]?.slideName ||
    caseInfo?.slides?.[currentIndex]?.originalName?.split(".")?.[0] ||
    `${caseInfo?.caseName}-${currentIndex + 1}`;

  const clickHandler = (position) => {
    const nextSlide = caseInfo.slides[currentIndex + position];
    setFabricOverlayState(updateTool({ tool: "Move" }));
    setFabricOverlayState(
      changeTile({
        id: viewerId,
        tile: nextSlide.awsImageBucketUrl,
        slideName: nextSlide.accessionId,
        slideId: nextSlide._id,
        originalFileUrl: nextSlide.originalFileUrl,
      })
    );
    viewer.open(nextSlide.awsImageBucketUrl);
    fabricOverlay.fabricCanvas().clear();
  };

  return (
    <ChangeHelper
      title={title}
      disabledLeft={disabledLeft}
      disabledRight={disabledRight}
      clickHandler={clickHandler}
      {...restProps}
    />
  );
};

export default ChangeSlide;
