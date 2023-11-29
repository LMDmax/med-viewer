import React, { useState, useRef } from "react";
import { BsFilterSquare } from "react-icons/bs";
import {
  Box,
  Text,
  IconButton,
  useMediaQuery,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import { rgb, lab } from "color-convert";
import ToolbarButton from "../ViewerToolbar/button";
import "./openseadragon-filtering";
import { useFabricOverlayState } from "../../state/store";
import TooltipLabel from "../AdjustmentBar/ToolTipLabel";
import { useEffect } from "react";
import { IoNavigate } from "react-icons/io5";
import axios from "axios";
import { updateTool } from "../../state/actions/fabricOverlayActions";

const ImageFilter = ({
  viewerId,
  setToolSelected,
  navigatorCounter,
  setLoadUI,
  imageFilter,
  setOriginalPixels,
  normalizeDefault,
  base64URL,
  socketRef,
}) => {
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { viewerWindow, activeTool } = fabricOverlayState;
  const { viewer, fabricOverlay } = viewerWindow[viewerId];
  const [isActive, setIsActive] = useState(false);
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const isActiveTool = activeTool === "Normalisation";
  const [isConnected, setIsConnected] = useState();
  const requestQueueRef = useRef([]);
  const [array, setArray] = useState([]);

  useEffect(() => {
    if (socketRef.current !== null) {
      setIsConnected(true);
      socketRef.current.onmessage = (event) => {
        const responseData = event.data;
        // console.log("result--->", responseData);
        let dataArray;

        if (!responseData.startsWith("C")) {
          if (responseData !== "Target Image Intialized") {
            dataArray = JSON.parse(responseData);
          } else {
            dataArray = undefined;
          }
        } else {
          dataArray = undefined;
        }

        if (dataArray) {
          const convertedData = {
            data: new Uint8ClampedArray(dataArray.data),
            width: dataArray.width,
            height: dataArray.height,
            colorSpace: "srgb",
          };
          const imageData = new ImageData(
            convertedData.data,
            convertedData.width,
            convertedData.height
          );
          const requestCallback = requestQueueRef.current.shift();
          if (requestCallback) {
            requestCallback(imageData);
          }
          setLoadUI(true);
          localStorage.removeItem("ModelName");
          setToolSelected("Normalisation");
        }
      };
      socketRef.current.onclose = () => {
        console.log("Socket closed");
      };
    }
  }, [socketRef.current]);

  useEffect(() => {
    if (base64URL && socketRef.current !== null) {
      const timeout = setTimeout(() => {
        handleOkay();
        // console.log("2nd open");
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [base64URL]);
  // console.log("Open Connections:", connectionCountRef.current);

  const sendRequest = (pixelsData) => {
    // console.log(pixelsData);
    return new Promise((resolve) => {
      const requestCallback = (imageData) => {
        resolve(imageData);
      };

      requestQueueRef.current.push(requestCallback);
      // console.log(isConnected);
      if (array.length > 0) {
        // console.log("sending");
        setLoadUI(false);
        socketRef.current.send(JSON.stringify(pixelsData));
      }
    });
  };
  const reinhardFilter = async (context, callback) => {
    const imgData = context.getImageData(
      0,
      0,
      context.canvas.width,
      context.canvas.height
    );

    // console.log(imgData)

    // Modify pixels
    const pixelsData = {
      data: imgData.data,
      width: imgData.width,
      height: imgData.height,
      colorSpace: "srgb",
    };
    // console.log("PIXEL", pixelsData)

    setOriginalPixels((prevArray)=> [...prevArray, pixelsData])

    setArray((prevArray) => [...prevArray, pixelsData]);
    // console.log(array);

    const modifiedImageData = await sendRequest(pixelsData);
    // console.log("result", modifiedImageData);
    context.putImageData(modifiedImageData, 0, 0);
    callback();
    // console.log(array);
  };

  useEffect(() => {
    // console.log(array.length);
    if (array.length > 0) {
      const interval = setInterval(() => {
        const object = array.shift();
        // console.log(object);
        const modifiedImageData = sendRequest(object);

        if (array.length === 0) {
          clearInterval(interval); // Clear the interval when all objects have been logged
        }
      }, 5000); // Log each object with a 5-second interval

      return () => {
        clearInterval(interval); // Clear the interval on component unmount (optional)
      };
    }
  }, [array]);

  // console.log("00length",array.length);
  useEffect(() => {
    // console.log(imageFilter);
    if (!viewer) return;
    if (!imageFilter) {
      // console.log("sad");
      // window.location.reload();
      // setToolSelected("");
      setFabricOverlayState(updateTool({ tool: "Move" }));
      // viewer?.setFilterOptions(null);
      viewer?.viewport.zoomBy(1.01);
    }
  }, [imageFilter]);

  useEffect(() => {
    if (normalizeDefault) {
      handleOkay();
    }
  }, [normalizeDefault]);

  useEffect(() => {
    if (navigatorCounter > 0) {
      setIsActive(false);
      viewer?.setFilterOptions(null);
      viewer?.viewport.zoomBy(1.01);
      localStorage.removeItem("mode");
    }
  }, [navigatorCounter]);

  const handleOkay = () => {
    setLoadUI(false);
    localStorage.setItem("ModelName", "Normalisation");
    setFabricOverlayState(updateTool({ tool: "Normalisation" }));
    viewer.setFilterOptions({
      filters: {
        processors: reinhardFilter,
      },
      loadMode: "async",
    });
    setIsActive(true);
  };
  return <></>;
};

export default ImageFilter;