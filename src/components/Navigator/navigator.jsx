import React, { useRef, useState } from "react";
import {
  Flex,
  HStack,
  IconButton,
  Image,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { Scrollbars } from "react-custom-scrollbars";
import { getSlideUrl } from "../../utility/utility";
import { useFabricOverlayState } from "../../state/store";
import {
  addViewerWindow,
  changeTile,
  updateTool,
} from "../../state/actions/fabricOverlayActions";
import "../../styles/scrollBar.css";
import { v4 as uuidv4 } from "uuid";

const SideNavigationButton = (props) => (
  <IconButton
    h="100%"
    variant="unstyled"
    background="none"
    _focus={{ background: "none" }}
    _hover={{ background: "none" }}
    {...props}
  />
);

const Navigator = ({
  caseInfo,
  slides,
  isActive,
  isMultiview,
  setToolSelected,
  clickHandler,
  viewerId,
  setIsMultiview,
  setIsNavigatorActive,
  ...restProps
}) => {
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { viewerWindow } = fabricOverlayState;
  const { tile, viewer, fabricOverlay } = viewerWindow[viewerId];

  const scrollbarRef = useRef(null);
  const [lines, setLines] = useState(1);
  const curIndex = slides?.findIndex(
    (slide) => tile === slide.awsImageBucketUrl
  );

  const changeSlide = (slide) => {
    if (isMultiview) {
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

  const handleScroll = (scrollDir) => {
    const leftValue = scrollbarRef.current.getScrollLeft();
    const scrollValue = scrollDir === "right" ? 120 : -120;
    scrollbarRef.current.scrollLeft(leftValue + scrollValue);
  };

  return isActive ? (
    <VStack
      w="100%"
      background="#FCFCFC"
      boxShadow="0px 1px 2px rgba(176, 200, 214, 0.1)"
      align="center"
      py="12px"
    >
       <Text fontSize="14px">{`${curIndex + 1} of ${
        slides?.length
      } slides`}</Text>
      <VStack w="100%" align="center" justify="space-between">
        <Scrollbars
          ref={scrollbarRef}
          style={{ width: "100%", borderWidth: "0px" }}
          autoHeight
          autoHeightMin="111px"
          renderThumbHorizontal={(props) => (
            <div {...props} className="thumb-hide" />
          )}
          autoHide
        >
          <VStack spacing="20px" px="12px" justify="center">
            {slides?.map((slide, index) => {
              const url = getSlideUrl(slide.awsImageBucketUrl);
              return (
                <Tooltip
                  key={slide._id}
                  bg="#F6F6F6"
                  color="black"
                  w="150px"
                  label={
                    slide.slideName ||
                    slide.originalName?.split(".")?.[0] ||
                    `${caseInfo.caseName}-${index}`
                  }
                >
                  <Flex
                    w="150px"
                    direction="column"
                    bg="#FFFFFF"
                    p={1}
                    border="0.5px solid #F2F2F2"
                    boxShadow="0px 0px 2px rgba(0, 0, 0, 0.25)"
                    background={
                      tile === slide.awsImageBucketUrl ? "#F2F2F2" : "#FFFFFF"
                    }
                  >
                    <Image
                      w="100%"
                      h="110px"
                      px="8px"
                      py="26px"
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
                      noOfLines={1}
                    >
                      {`${(
                        slide.slideName ||
                        slide.originalName ||
                        `${caseInfo.caseName}-${index}`
                      ).substring(0, 10)}...`}
                    </Text>
                    {isMultiview && tile === slide.awsImageBucketUrl ? (
                      <Flex
                        w="28px"
                        h="28px"
                        background="#FFFFFF"
                        justify="center"
                        align="center"
                        position="absolute"
                      >
                        1.
                      </Flex>
                    ) : null}
                  </Flex>
                </Tooltip>
              );
            })}
          </VStack>
        </Scrollbars>
      </VStack>
    </VStack>
  ) : null;
};

export default Navigator;
