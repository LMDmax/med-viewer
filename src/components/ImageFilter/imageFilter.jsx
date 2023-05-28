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
  base64URL,
  imageFilter,
  setShowRightPanel,
}) => {
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { viewerWindow, activeTool } = fabricOverlayState;
  const { viewer, fabricOverlay } = viewerWindow[viewerId];
  const [isActive, setIsActive] = useState(false);
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const isActiveTool = activeTool === "Normalisation";
  const [isConnected,setIsConnected] = useState();
  const [showDialog, setShowDialog] = useState(false);
  const socketRef = useRef(null);
  const requestQueueRef = useRef([]);
  const connectionCountRef = useRef(0);

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

  // const reinhardFilter = (context, callback) => {
  //   const imgData = context.getImageData(
  //     0,
  //     0,
  //     context.canvas.width,
  //     context.canvas.height
  //   );
  //   const pixelsData = {
  //     data: imgData.data,
  //     width: imgData.width,
  //     height: imgData.height,
  //     colorSpace: "srgb",
  //   };

  //   console.log(pixelsData);

  //   axios.post("https://backup-quantize-vhut.prr.ai/filter", pixelsData).then((resp) => {
  //     const newPixelsData = {
  //       data: new Uint8ClampedArray(resp.data),
  //       width: imgData.width,
  //       height: imgData.height,
  //       colorSpace: "srgb",
  //     };
  //     const imageData = new ImageData(newPixelsData.data, newPixelsData.width, newPixelsData.height);
  //     context.putImageData(imageData, 0, 0);
  //     // const newImgData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
  //     // console.log("Modified image data: ", newImgData);
  //     callback(); // call callback inside the then block
  //   });
  // };

  //working
  
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = new WebSocket(
        "wss://development-morphometry-api.prr.ai/quantize/vahadane"
      );
  
      socketRef.current.onopen = () => {
        connectionCountRef.current++; // Increment connection count
        setIsConnected(true);
      };
  
      socketRef.current.onmessage = (event) => {
        const responseData = event.data;
        let dataArray;
  
        if (responseData !== "Connection established!") {
          dataArray = JSON.parse(responseData);
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
        }
      };
    }
  }, []);

  // console.log("Open Connections:", connectionCountRef.current);
  
  const sendRequest = (pixelsData) => {
  console.log(pixelsData);
    return new Promise((resolve) => {
      const requestCallback = (imageData) => {
        resolve(imageData);
      };
  
      requestQueueRef.current.push(requestCallback);
  
      if (isConnected) {
        socketRef.current.send(JSON.stringify(pixelsData));
        console.log(pixelsData);
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
    // Modify pixels
    const pixelsData = {
      data: imgData.data,
      width: imgData.width,
      height: imgData.height,
      colorSpace: "srgb",
      // targetImage: base64URL ? base64URL : ""
    };

  // console.log(pixelsData);
    const modifiedImageData = await sendRequest(pixelsData);
    console.log("result", modifiedImageData);
    context.putImageData(modifiedImageData, 0, 0);
    callback();
  };
  


  useEffect(() => {
    // console.log(imageFilter);
    if (!viewer) return;
    if (imageFilter) {
      setShowDialog(true);
    } else {
      // console.log("sad");
      setToolSelected("");
      setFabricOverlayState(updateTool({ tool: "Move" }));
      viewer?.setFilterOptions(null);
      viewer?.viewport.zoomBy(1.01);
      setIsActive(false);
    }
  }, [imageFilter]);

  // const handleClick = () => {
  //   if (!viewer) return;
  //   if (isActive) {
  //     console.log("sad");
  //     setToolSelected("");
  //   setFabricOverlayState(updateTool({ tool: "Move" }));
  //     viewer.setFilterOptions(null);
  //     viewer.viewport.zoomBy(1.01);
  //     setIsActive(false);
  //   } else {
  //     console.log("aaaaasad");
  //   setFabricOverlayState(updateTool({ tool: "Normalisation" }));

  //     setToolSelected("Normalisation");
  //     viewer.setFilterOptions({
  //       filters: {
  //         processors: reinhardFilter,
  //       },
  //       loadMode: "async",
  //     });
  //     setIsActive(true);
  //   }
  // };
  useEffect(() => {
    if (navigatorCounter > 0) {
      setIsActive(false);
      viewer.setFilterOptions(null);
      viewer.viewport.zoomBy(1.01);
    }
  }, [navigatorCounter]);

  const handleCancel = () => {
    setShowDialog(false);
    setShowRightPanel(true);

    // Perform other actions when cancel is clicked
  };
  const handleOkay = () => {
    setShowDialog(false);
    setFabricOverlayState(updateTool({ tool: "Normalisation" }));
    setToolSelected("Normalisation");
    viewer.setFilterOptions({
      filters: {
        processors: reinhardFilter,
      },
      loadMode: "async",
    });
    setIsActive(true);
    setShowRightPanel(true);
  };
  return (
    <>
      {showDialog && (
        <Modal isOpen={true} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Normalisation</ModalHeader>
            <ModalBody>
              <p>
                Are you sure you want to apply normalisation with default target
                image?
              </p>
            </ModalBody>
            <ModalFooter>
              <Button mr={3} onClick={handleCancel}>
                Cancel
              </Button>
              <Button bg="#3f5f7e" color="black" onClick={handleOkay}>
                Okay
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default ImageFilter;
