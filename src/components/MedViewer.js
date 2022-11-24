import React, { useState, useEffect, useReducer } from "react";
import _ from "lodash";
import axios from "axios";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import LayoutApp from "./Layout/app";
import Loading from "./Loading/loading";
import { StoreProvider } from "../state/store";
import { addViewerWindow } from "../state/actions/fabricOverlayActions";
import fabricOverlayReducer from "../state/reducers/fabricOverlayReducer";
import { brandColors } from "../styles/brandPalette";
import { getFileBucketFolder } from "../utility/utility";

const theme = extendTheme({
  components: {
    Checkbox: {
      baseStyle: {
        control: {
          _focus: {
            boxShadow: "none",
          },
        },
      },
    },
  },
  breakpoints: {
    sm: "768px",
    md: "1200px",
    lg: "1440px",
    xl: "1920px",
    "2xl": "2560px",
  },
  colors: {
    light: {
      100: "#FFF",
      200: "#FAFAFA",
      300: "#ECECEC",
      400: "#00153F",
      500: "#F5F5F5",
      600: "#B00020",
      700: "#3B5D7C",
      800: "#F6F6F6",
      900: "#DEDEDE",
      1000: "#FCFCFC",
      1001: "#E5E5E5",
      1002: "#AEAEAE",
    },
  },
  fonts: {
    body: "Inter, sans-serif",
  },
  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "3.75rem",
    "7xl": "4.5rem",
    "8xl": "6rem",
    "9xl": "8rem",
    paragraph: "14px",
    caseHeader: "14px",
    caseInfo: "12px",
  },
  styles: {
    global: {
      body: {
        bg: "light",
        color: "black",
      },
    },
  },
});

const MedViewer = ({ viewerIds, ...props }) => {
  const [isReady, setIsReady] = useState(false);
  const [fabricOverlayState, setFabricOverlayState] = useReducer(
    fabricOverlayReducer,
    {
      activeTool: "Move",
      color: brandColors[0],
      viewerWindow: {},
      username: "",
      roomName: "",
      sync: false,
      isAnnotationLoading: false,
      isViewportAnalysing: false,
    }
  );

  useEffect(() => {
    if (
      !fabricOverlayState?.viewerWindow ||
      _.keys(fabricOverlayState?.viewerWindow).length !== 0
    )
      return;
    const viewerWindows = [];
    viewerIds.forEach((slide) => {
      viewerWindows.push({
        id: slide?._id || slide?.slideId,
        tile: slide?.awsImageBucketUrl,
        slideName: slide?.slideName,
        slideId: slide?._id || slide?.slideId,
        originalFileUrl: slide?.originalFileUrl,
      });
    });
    setFabricOverlayState(addViewerWindow(viewerWindows));
    const key = getFileBucketFolder(viewerIds[0].originalFileUrl);
    axios.post("https://development-morphometry-api.prr.ai/vhut/download", {
      key,
      bucket_name: "med-ai-image-processor",
    });
    setIsReady(true);
  }, [fabricOverlayState, viewerIds]);

  // useEffect(() => {
  //   return () => {
  //     setFabricOverlayState(resetFabricOverlay());
  //   };
  // }, []);

  return isReady && _.keys(fabricOverlayState?.viewerWindow).length > 0 ? (
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <StoreProvider value={{ fabricOverlayState, setFabricOverlayState }}>
          <LayoutApp viewerIds={viewerIds} {...props} />
        </StoreProvider>
      </ChakraProvider>
    </React.StrictMode>
  ) : (
    <Loading />
  );
};

export default MedViewer;
