import React, { useState } from "react";
import { BsFilterSquare } from "react-icons/bs";
import { Box, Text, IconButton, useMediaQuery, Flex } from "@chakra-ui/react";
import { rgb, lab } from "color-convert";
import ToolbarButton from "../ViewerToolbar/button";
import "./openseadragon-filtering";
import { useFabricOverlayState } from "../../state/store";
import TooltipLabel from "../AdjustmentBar/ToolTipLabel";
import { useEffect } from "react";
import { IoNavigate } from "react-icons/io5";
import axios from "axios";
import { updateTool } from "../../state/actions/fabricOverlayActions";


const ImageFilter = ({ viewerId, setToolSelected, navigatorCounter, imageFilter }) => {
  const { fabricOverlayState,setFabricOverlayState } = useFabricOverlayState();
  const { viewerWindow, activeTool } = fabricOverlayState;
  const { viewer, fabricOverlay } = viewerWindow[viewerId];
  const [isActive, setIsActive] = useState(false);
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const isActiveTool=activeTool === "Normalisation"
  const [concatArray, setConcatArray] = useState({});

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
  const reinhardFilter = (context, callback) => {
    // console.log(callback);
    const imgData = context.getImageData(
      0,
      0,
      context.canvas.width,
      context.canvas.height
    );
    const pixels = imgData.data;
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

    const pixelsData = {
          data: imgData.data,
          width: imgData.width,
          height: imgData.height,
          colorSpace: "srgb",
        };

        console.log(pixelsData);

    const socket = new WebSocket('wss://development-morphometry-api.prr.ai/quantize/vahadane');

    socket.onopen = () => {
          // Send the sendMessage object as JSON through the WebSocket
          socket.send(JSON.stringify(pixelsData));
        };

        socket.onmessage = (event) => {
          // Retrieve the response data from the WebSocket
          const responseData = event.data;
          // console.log(responseData);
        
          let dataArray;
          
          // Check if responseData is an array
          if (responseData !== "Connection established!") {
            // If responseData is an array, use it directly
            dataArray = JSON.parse(responseData);
          } else {
            // If responseData is not an array, set dataArray to undefined
            dataArray = undefined;
          }
        
          // Perform conversion only if dataArray is defined
          if (dataArray) {
            // Convert the array to a Uint8ClampedArray
            const convertedData = {
              data: new Uint8ClampedArray(dataArray),
              width: imgData.width,
              height: imgData.height,
              colorSpace: "srgb"
            };
            const imageData = new ImageData(convertedData.data, convertedData.width, convertedData.height);
            console.log(imageData);
            context.putImageData(imageData, 0, 0);
            callback();
          }
        };
        
        
    // context.putImageData(imgData, 0, 0);
    // callback();
  };

  // const reinhardFilter = (context, callback) => {
  //   // console.log(callback);
  //   const imgData = context.getImageData(
  //     0,
  //     0,
  //     context.canvas.width,
  //     context.canvas.height
  //   );
  
  // const pixelsData = {
  //   data: imgData.data,
  //   width: imgData.width,
  //   height: imgData.height,
  //   colorSpace: "srgb",
  // };
  // //   console.log(sendMessage);
  //   const socket = new WebSocket('wss://development-morphometry-api.prr.ai/quantize/vahadane');

  //   socket.onopen = () => {
  //     // Send the sendMessage object as JSON through the WebSocket
  //     socket.send(JSON.stringify(pixelsData));
  //   };

  //   console.log("original",imgData);

  
  //   socket.onmessage = (event) => {
  //     // Retrieve the response data from the WebSocket
  //     const responseData = event.data;
  //     // console.log(responseData);
    
  //     // Convert the received array to Uint8ClampedArray
  //     const responseArray = Array.from(responseData);
    
  //     // Calculate the expected length of the data array based on image dimensions
  //     const expectedDataLength = 4 * imgData.width * imgData.height;
    
  //     // Pad the responseArray with zeros or trim if necessary to match the expected length
  //     let paddedArray;
  //     if (responseArray.length < expectedDataLength) {
  //       paddedArray = responseArray.concat(Array(expectedDataLength - responseArray.length).fill(0));
  //     } else if (responseArray.length > expectedDataLength) {
  //       paddedArray = responseArray.slice(0, expectedDataLength);
  //     } else {
  //       paddedArray = responseArray;
  //     }
    
  //     const responsePixels = new Uint8ClampedArray(paddedArray);
      
  //     const newPixelsData = {
  //       data: responsePixels,
  //       width: imgData.width,
  //       height: imgData.height,
  //       colorSpace: "srgb",
  //     };
  //     console.log("newData",newPixelsData);
  //     const imageData = new ImageData(newPixelsData.data, newPixelsData.width, newPixelsData.height);
  //     context.putImageData(imageData, 0, 0);
    
  //     callback(); // Call the callback function
  //   };
    
  //   // Add an error event handler to log any errors
  //   socket.onerror = (error) => {
  //     console.error('WebSocket error:', error);
  //   };
  
  // };


  useEffect(()=>{
    // console.log(imageFilter);
    if (!viewer) return;
    if(imageFilter){
      setFabricOverlayState(updateTool({ tool: "Normalisation" }));
      setToolSelected("Normalisation");
      viewer.setFilterOptions({
        filters: {
          processors: reinhardFilter,
        },
        loadMode: "async",
      });
      setIsActive(true);
    }
    else{
      // console.log("sad");
      setToolSelected("");
    setFabricOverlayState(updateTool({ tool: "Move" }));
      viewer?.setFilterOptions(null);
      viewer?.viewport.zoomBy(1.01);
      setIsActive(false);
    }
  },[imageFilter])

  

  const handleClick = () => {
    if (!viewer) return;
    if (isActive) {
      console.log("sad");
      setToolSelected("");
    setFabricOverlayState(updateTool({ tool: "Move" }));
      viewer.setFilterOptions(null);
      viewer.viewport.zoomBy(1.01);
      setIsActive(false);
    } else {
      console.log("aaaaasad");
    setFabricOverlayState(updateTool({ tool: "Normalisation" }));

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
      h="100%"
      cursor="pointer"
      bg={isActive ? "rgba(157,195,226,0.4)" : ""}
      onClick={handleClick}
    >
     <Flex direction="column" mt={ifScreenlessthan1536px? "1px" : "-2px"} justifyContent="center" alignItems="center" h="100%">
     <IconButton
        width={ifScreenlessthan1536px ? "100%" : "100%"}
        height={ifScreenlessthan1536px ? "50%" : "50%"}
        
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
      <Text align="center" fontFamily="inter" fontSize="10px">Normalisation</Text>
     </Flex>
    </Box>
  );
};

export default ImageFilter;