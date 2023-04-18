import React, { useState } from "react";
import { BsFilterSquare } from "react-icons/bs";
import { Box, Text, IconButton, useMediaQuery } from "@chakra-ui/react";
import { rgb, lab } from "color-convert";
import ToolbarButton from "../ViewerToolbar/button";
import "./openseadragon-filtering";
import { useFabricOverlayState } from "../../state/store";
import TooltipLabel from "../AdjustmentBar/ToolTipLabel";
import { useEffect } from "react";
import { IoNavigate } from "react-icons/io5";

const ImageFilter = ({ viewerId, setToolSelected, navigatorCounter }) => {
  const { fabricOverlayState } = useFabricOverlayState();
  const { viewerWindow } = fabricOverlayState;
  const { viewer, fabricOverlay } = viewerWindow[viewerId];
  const [isActive, setIsActive] = useState(false);
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");

  const targetMean = [56.35951712, 55.60842896, -40.15281677];

  const targetSd = [16.75495379, 13.53081669, 10.56340324];

  const getStdev = (l1, l2, l3, imgMean) => {
    let imgSd = [0, 0, 0];
    for (let i = 0; i < l1.length; i++) {
      imgSd[0] += (l1[i] - imgMean[0]) ** 2;
      imgSd[1] += (l2[i] - imgMean[1]) ** 2;
      imgSd[2] += (l3[i] - imgMean[2]) ** 2;
    }
    imgSd = imgSd.map((x) => Math.sqrt(x / l1.length));
    return imgSd;
  };

  const reinhardFilter = (context, callback) => {
    console.log(context);
    const imgData = context.getImageData(
      0,
      0,
      context.canvas.width,
      context.canvas.height
    );
    console.log(imgData);
    const pixels = imgData.data;

    // let perc = []
    // for (let i = 0; i < 3; i++) {
    //   perc.push(percentile(pixels[i]))
    // }
    // const p = percentile(pixels, 0.9);

    // for (let i = 0; i < pixels.length; i++) {
    //   pixels[i] = (pixels[i] * 255) / p;
    // }

    const l1 = [];
    const l2 = [];
    const l3 = [];
    let imgMean = [0, 0, 0];
    for (let i = 0; i < pixels.length; i += 4) {
      const labl = rgb.lab(pixels[i], pixels[i + 1], pixels[i + 2]);

      [pixels[i], pixels[i + 1], pixels[i + 2]] = labl;
      l1.push(labl[0]);
      l2.push(labl[1]);
      l3.push(labl[2]);

      imgMean = imgMean.map((x, k) => x + labl[k]);
    }

    imgMean = imgMean.map((x) => x / l1.length);

    const imgSd = getStdev(l1, l2, l3, imgMean);

    for (let i = 0; i < pixels.length; i += 4) {
      const l =
        (l1[i / 4] - imgMean[0]) * (targetSd[0] / imgSd[0]) + targetMean[0];
      const a =
        (l2[i / 4] - imgMean[1]) * (targetSd[1] / imgSd[1]) + targetMean[1];
      const bl =
        (l3[i / 4] - imgMean[2]) * (targetSd[2] / imgSd[2]) + targetMean[2];

      const [r, g, b] = lab.rgb(l, a, bl);
      pixels[i] = r;
      pixels[i + 1] = g;
      pixels[i + 2] = b;
    }

    context.putImageData(imgData, 0, 0);
    callback();
  };

  const handleClick = () => {
    if (!viewer) return;
    if (isActive) {
      setToolSelected("");
      viewer.setFilterOptions(null);
      viewer.viewport.zoomBy(1.01);
      setIsActive(false);
    } else {
      setToolSelected("Normalisation");
      viewer.setFilterOptions({
        filters: {
          processors: reinhardFilter,
        },
        loadMode: "async",
      });
      setIsActive(true);
    }
  };
  useEffect(() => {
    if (navigatorCounter > 0) {
      setIsActive(false);
      viewer.setFilterOptions(null);
      viewer.viewport.zoomBy(1.01);
    }
  }, [navigatorCounter]);
  return (
    <Box
      w="82px"
      py="5px"
      h="100%"
      cursor="pointer"
      bg={isActive ? "rgba(157,195,226,0.4)" : ""}
      onClick={handleClick}
    >
      <IconButton
        width={ifScreenlessthan1536px ? "100%" : "100%"}
        height={ifScreenlessthan1536px ? "50%" : "70%"}
        
        // border="2px solid red"
        _hover={{ bgColor: "transparent" }}
        icon={<BsFilterSquare transform="scale(1.2)" color="black" />}
        _active={{
          bgColor: "transparent",
          outline: "none",
        }}
        backgroundColor="transparent"
        borderRadius={0}
      />
      <Text>Normalisation</Text>
    </Box>
  );
};

export default ImageFilter;
