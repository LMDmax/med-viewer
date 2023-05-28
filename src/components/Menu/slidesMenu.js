import { Flex, Image, Text, Tooltip } from "@chakra-ui/react";
import React from "react";
import Scrollbars from "react-custom-scrollbars";
import { useFabricOverlayState } from "../../state/store";
import { getSlideUrl } from "../../utility/utility"
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
  setToolSelected,
  isMultiview,
  setImageFilter,
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

  const changeSlide = (slide) => {
    if (isMultiview) {
      setImageFilter(false);
      const vKeys = Object.keys(viewerWindow);
      if (vKeys.length > 1) {
        const { viewer: v, fabricOverlay: fo } = viewerWindow[vKeys[1]];

        // clear canvas (remove all annotations)
        fo.fabricCanvas().clear();

        // change tile
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
      setToolSelected("MultiviewSlideChoosed")
      setIsMultiview(false);
    } else {
      setImageFilter(false);
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
    <Flex bgColor="#fff" w="100%" h="100%"  direction="column">
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
          <Flex w="100%"  flexWrap="wrap">
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
                      onClick={() => changeSlide(slide)}
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
