import { Flex, Image, Text, Tooltip } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Scrollbars from "react-custom-scrollbars";
import { useFabricOverlayState } from "../../state/store";
import { getSlideUrl, zoomToLevel } from "../../utility/utility";
import { v4 as uuidv4 } from "uuid";
import {
  changeTile,
  updateTool,
  addViewerWindow,
} from "../../state/actions/fabricOverlayActions";

const SlidesMenu = ({
  caseInfo,
  slides,
  viewerId,
  application,
  setSelectedOption,
  setIsOpen,
  editView,
  setSlideName,
  setToolSelected,
  isMultiview,
  setImageFilter,
  setSlideName2,
  setIsMultiview,
  tile,
  setIsNavigatorActive,
}) => {
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { viewerWindow } = fabricOverlayState;
  const { viewer, fabricOverlay } = viewerWindow[viewerId];
  const curIndex = slides?.findIndex(
    (slide) => tile === slide.awsImageBucketUrl
  );

  useEffect(() => {
    const vKeys = Object.keys(viewerWindow);
    // console.log("55555", vKeys);
    if (vKeys.length > 1 && editView) {
      const { fabricOverlay: fo } = viewerWindow[vKeys[1]];
      if (fo && fo.fabricCanvas && editView) {
        setIsOpen(true);
        setSelectedOption("mode")
        const rect = new fabric.Rect({
          left: 1900,
          top: 900,
          width: 500,
          height: 600,
          fill: "",
          stroke: "red",
          strokeWidth: 10,
          selectable: true,
          lockRotation: true,
          lockScalingX: false,
          lockScalingY: false,
          lockSkewingX: true,
          lockSkewingY: true,
          hasControls: true, // Enable controls
          hasBorders: false,
          hoverCursor: "move",
          contextMenu: false,
        });
  

        const canvas = fo.fabricCanvas();
        canvas.add(rect);
        canvas.renderAll();

        const zoomLevel = canvas.getZoom();
        const viewportTransform = canvas.viewportTransform;
        const viewportLeft = viewportTransform[4];
        const viewportTop = viewportTransform[5];

        const annotationLeftInImage = (rect.left - viewportLeft) / zoomLevel;
        const annotationTopInImage = (rect.top - viewportTop) / zoomLevel;
        const annotationWidthInImage = rect.width / zoomLevel;
        const annotationHeightInImage = rect.height / zoomLevel;

        // Placeholder DZI image URL, replace with your actual DZI image URL
        const dziUrl =
          "https://d3fvaqnlz9wyiv.cloudfront.net/hospital/development/outputs/eb6589e8-1def-47d0-8062-81cfef38ad00/output.dzi";

        const zoomLevelString = `&zoom=${zoomLevel}`;
        const regionString = `&rect=${annotationLeftInImage},${annotationTopInImage},${annotationWidthInImage},${annotationHeightInImage}`;
        const imageUrl = `${dziUrl}?${zoomLevelString}${regionString}`;
        console.log(imageUrl);
      }
    }
  }, [viewerWindow]);

  const changeSlide = (slide) => {
    if (isMultiview || editView) {
      // console.log(slide);
      setSlideName2(slide.originalName);
      setImageFilter(false);
      const vKeys = Object.keys(viewerWindow);
      if (vKeys.length > 1) {
        const { viewer: v, fabricOverlay: fo } = viewerWindow[vKeys[1]];

        // clear canvas (remove all annotations)
        fo.fabricCanvas().clear();

        // change tile
        // console.log(slide);
        setFabricOverlayState(
          changeTile({
            id: vKeys[1],
            tile: slide.awsImageBucketUrl,
            slideName: slide.slideName,
            slideId: slide?._id || slide?.slideId,
            originalFileUrl: slide.originalFileUrl,
          })
        );
        v.open(slide.awsImageBucketUrl);
        fo.fabricCanvas().requestRenderAll();
      } else {
        const id = uuidv4();
        setFabricOverlayState(
          addViewerWindow([
            {
              id,
              tile: slide.awsImageBucketUrl,
              slideName: slide.slideName,
              slideId: slide?._id || slide?.slideId,
              originalFileUrl: slide.originalFileUrl,
            },
          ])
        );
      }
      setToolSelected("MultiviewSlideChoosed");
      setIsMultiview(false);
    } else {
      setImageFilter(false);
      if (application === "hospital") {
        setSlideName(slide.slideName);
      } else {
        setSlideName(slide.originalName);
      }
      setFabricOverlayState(
        changeTile({
          id: viewerId,
          tile: slide.awsImageBucketUrl,
          slideName: slide.accessionId,
          slideId: slide?._id || slide?.slideId,
          originalFileUrl: slide.originalFileUrl,
        })
      );
      viewer.open(slide.awsImageBucketUrl);

      // clear canvas (remove all annotations)
      fabricOverlay.fabricCanvas().clear();
      setIsNavigatorActive(false);
    }
    setFabricOverlayState(updateTool({ tool: "Move" }));
  };
  const changeSlideEdit = (slide) => {
    if (editView) {
      // console.log(slide);
      setSlideName2(slide.originalName);
      setImageFilter(false);
      const vKeys = Object.keys(viewerWindow);
      if (vKeys.length > 1) {
        const { viewer: v, fabricOverlay: fo } = viewerWindow[vKeys[1]];

        // clear canvas (remove all annotations)
        fo.fabricCanvas().clear();

        // change tile
        // console.log(slide);
        setFabricOverlayState(
          changeTile({
            id: vKeys[1],
            tile: slide.awsImageBucketUrl,
            slideName: slide.slideName,
            slideId: slide?._id || slide?.slideId,
            originalFileUrl: slide.originalFileUrl,
          })
        );
        v.open(slide.awsImageBucketUrl);
        fo.fabricCanvas().requestRenderAll();
      } else {
        const id = uuidv4();
        setFabricOverlayState(
          addViewerWindow([
            {
              id,
              tile: slide.awsImageBucketUrl,
              slideName: slide.slideName,
              slideId: slide?._id || slide?.slideId,
              originalFileUrl: slide.originalFileUrl,
            },
          ])
        );
      }
    } else {
      setImageFilter(false);
      if (application === "hospital") {
        setSlideName(slide.slideName);
      } else {
        setSlideName(slide.originalName);
      }
      setFabricOverlayState(
        changeTile({
          id: viewerId,
          tile: slide.awsImageBucketUrl,
          slideName: slide.accessionId,
          slideId: slide?._id || slide?.slideId,
          originalFileUrl: slide.originalFileUrl,
        })
      );
      viewer.open(slide.awsImageBucketUrl);

      // clear canvas (remove all annotations)
      fabricOverlay.fabricCanvas().clear();
      setIsNavigatorActive(false);
    }
    setFabricOverlayState(updateTool({ tool: "Move" }));
  };

  return (
    <Flex bgColor="#fff" w="100%" h="100%" direction="column">
      <Text
        fontFamily="Inter"
        fontStyle="normal"
        fontWeight="500"
        fontSize={14}
        letterSpacing=" 0.0025em"
        color=" #3B5D7C"
        mb="1vh"
      >
        Slide Navigation
      </Text>
      <Flex w="100%" h="80vh" alignItems="center" direction="column">
        <Text mb="1vh" fontSize={10}>{`${curIndex + 1} of ${
          slides?.length
        } slides`}</Text>
        <Scrollbars
          style={{ width: "100%", borderWidth: "0px" }}
          renderThumbHorizontal={(props) => (
            <div {...props} className="thumb-hide" />
          )}
          autoHide
        >
          <Flex w="100%" flexWrap="wrap">
            {slides.map((slide, index) => {
              const url = getSlideUrl(slide.awsImageBucketUrl);
              return (
                <Tooltip
                  key={slide._id}
                  bg="#F6F6F6"
                  color="black"
                  w="100px"
                  label={
                    slide.slideName ||
                    slide.originalName?.split(".")?.[0] ||
                    `${caseInfo.caseName}-${index}`
                  }
                >
                  <Flex
                    w="50%"
                    direction="column"
                    // bg="red"
                    p={1}
                    h="fit-content"
                    border="0.5px solid #F2F2F2"
                    boxShadow="0px 0px 2px rgba(0, 0, 0, 0.25)"
                    background={
                      tile === slide.awsImageBucketUrl ? "#F2F2F2" : "#FFFFFF"
                    }
                  >
                    <Image
                      w="100%"
                      h="115px"
                      px="10px"
                      py="10px"
                      src={url}
                      alt="wsi slide"
                      fit="cover"
                      boxShadow="0px 1px 1px rgba(176, 200, 214, 0.05);"
                      onClick={() => {
                        if(isMultiview){
                          changeSlide(slide)
                        }
                        if(editView){
                          changeSlideEdit(slide)
                        }
                      }}
                      cursor="pointer"
                    />
                    <Text
                      px="4px"
                      fontSize="12px"
                      alignSelf="center"
                      whiteSpace="initial"
                      noOfLines={1}
                      textOverflow="ellipsis"
                    >
                      {`${(
                        slide.slideName ||
                        slide.originalName ||
                        `${caseInfo.caseName}-${index}`
                      ).substring(0, 10)}...`}
                    </Text>
                  </Flex>
                </Tooltip>
              );
            })}
          </Flex>
        </Scrollbars>
      </Flex>
    </Flex>
  );
};

export default SlidesMenu;
