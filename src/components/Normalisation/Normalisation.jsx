import React, { useEffect, useState } from "react";
import { Box, Flex, Text, Tooltip, HStack, Button } from "@chakra-ui/react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { MdOutlineUpload, MdOutlineModeEditOutline } from "react-icons/md";
import { sendRequest } from "../../Socket/Socket";
import { useFabricOverlayState } from "../../state/store";
import { v4 as uuidv4 } from "uuid";
import {
  changeTile,
  updateTool,
  addViewerWindow,
} from "../../state/actions/fabricOverlayActions";

const Normalisation = ({
  setBase64URL,
  tile,
  viewerId,
  setIsMultiview,
  slide,
}) => {
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { viewerWindow } = fabricOverlayState;
  const { viewer, fabricOverlay } = viewerWindow[viewerId];
  const [isChecked, setIsChecked] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showButtonsGroup, setShowButtonGroup] = useState(false);
  const [showNormalisation, setShowNormalisation] = useState(true);

  const handleUpload = () => {
    // Create base64URL url
    fetch(selectedImage.url)
      .then((response) => response.blob())
      .then((blob) => {
        // Read the Blob contents as Base64 data
        const reader = new FileReader();
        reader.onloadend = () => {
          // Retrieve the Base64 data
          const base64Data = reader.result;
          setBase64URL(true);

          const sendBase64Data = {
            targetImage: base64Data,
          };
          // console.log(JSON.stringify(sendBase64Data));
          // Send the Base64 data to the server
          sendRequest(sendBase64Data);
        };
        reader.readAsDataURL(blob);
      })
      .catch((error) => {
        // console.log("Error fetching image data:", error);
      });

    setShowButtonGroup(false);
  };

  useEffect(() => {
    if (selectedImage) {
      setShowButtonGroup(true);

      //create blob url
    } else {
      setShowButtonGroup(false);
    }
  }, [selectedImage]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (
      file &&
      (file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png")
    ) {
      setSelectedImage({
        name: file.name,
        url: URL.createObjectURL(file),
      });
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const radioStyle = {
    width: "15px",
    height: "15px",
    border: "2px solid black",
    borderRadius: "0px",
    marginRight: "3px",
    cursor: "pointer",
    backgroundColor: "#eaeaea",
    backgroundClip: "content-box", // Add backgroundClip property to create a gap from all four sides
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const handelCancel = (slide) => {
    const vKeys = Object.keys(viewerWindow);
    if (vKeys.length > 1) {
      const { viewer: v, fabricOverlay: fo } = viewerWindow[vKeys[1]];
      // clear canvas (remove all annotations)
      fo.fabricCanvas().clear();
  
      // change tile
      setFabricOverlayState(
        changeTile({
          id: vKeys[1],
          tile: tile,
          slideName: slide.slideName,
          slideId: slide?._id || slide?.slideId,
          originalFileUrl: slide.originalFileUrl,
        })
      );
      v.open(slide.awsImageBucketUrl);
    } else {
      const id = uuidv4();
      setFabricOverlayState(
        addViewerWindow([
          {
            id,
            tile: tile,
            slideName: slide.slideName,
            slideId: slide?._id || slide?.slideId,
            originalFileUrl: slide.originalFileUrl,
          },
        ])
      );
    }
  };
  
  useEffect(() => {
    const vKeys = Object.keys(viewerWindow);
    // console.log("55555", vKeys);
    if (vKeys.length > 1) {
      const { fabricOverlay: fo } = viewerWindow[vKeys[1]];
      // console.log(fo);
      if (fo && fo.fabricCanvas) {
        const rect = new fabric.Rect({
          left: 1900,
          top: 900,
          width: 500,
          height: 600,
          fill: "",
          stroke: "black",
          strokeWidth: 10,
          selectable: true,
          lockRotation: true,
          lockScalingX: true,
          lockScalingY: true,
          lockSkewingX: true,
          lockSkewingY: true,
          hasControls: false,
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
        const dziUrl = "https://d3fvaqnlz9wyiv.cloudfront.net/hospital/development/outputs/eb6589e8-1def-47d0-8062-81cfef38ad00/output.dzi";
  
        const zoomLevelString = `&zoom=${zoomLevel}`;
        const regionString = `&rect=${annotationLeftInImage},${annotationTopInImage},${annotationWidthInImage},${annotationHeightInImage}`;
        const imageUrl = `${dziUrl}?${zoomLevelString}${regionString}`;
        // console.log(imageUrl);
        // Create a fabric.Image object
        const image = new fabric.Image();
  
        // Set the source of the image to the desired URL
        image.setSrc(imageUrl, () => {
          // Get the base64 encoded image URL
          const base64ImageUrl = image.toDataURL();
          // console.log(base64ImageUrl);
        });
      }
    }
  }, [viewerWindow]);
  
  
  
  
  

  return (
    <Box>
      <Flex
        px="5px"
        w="100%"
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex alignItems="center">
          <label style={radioStyle}>
            {isChecked && (
              <span
                style={{
                  width: "58%",
                  height: "60%",
                  backgroundColor: "#2a7cbd",
                }}
              ></span>
            )}
          </label>
          <Text cursor="pointer" ml={2}>
            Normalisation
          </Text>
        </Flex>
        <Box
          onClick={() => setShowNormalisation(!showNormalisation)}
          cursor="pointer"
          mr="5px"
        >
          {showNormalisation ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
        </Box>
      </Flex>
      {showNormalisation ? (
        <Box
          mt="5px"
          w="83%"
          h="72px"
          borderRadius="5px"
          border="1px solid #C4C4C4"
          mx="32px"
        >
          <Flex p="5px" justifyContent="space-between">
            <HStack
              backgroundColor={selectedImage ? "" : "rgb(214,214,215,0.5)"}
              w="20%"
              h="60px"
              border="1px solid rgb(214,214,215,0.5)"
              style={{ overflow: "hidden" }}
            >
              {selectedImage && (
                <img
                  src={selectedImage.url}
                  alt={selectedImage.name}
                  style={{ width: "100%", height: "auto" }}
                />
              )}
            </HStack>
            <Flex
              alignItems="center"
              justifyContent="flex-start"
              css={{ whiteSpace: "normal", wordBreak: "break-word" }}
              w="50%"
              ml="2px"
              textOverflow="ellipsis"
            >
              <Tooltip
                label={selectedImage ? selectedImage.name : ""}
                aria-label="A tooltip"
              >
                <Text>
                  {selectedImage
                    ? truncateText(selectedImage.name, 25)
                    : "No image selected"}
                </Text>
              </Tooltip>
            </Flex>
            <Flex w="25%" ml="2px" justifyContent="space-evenly">
              <MdOutlineModeEditOutline
                onClick={() => {
                  handelCancel(slide);
                }}
                color="black"
                size="20px"
              />
              <label>
                <MdOutlineUpload cursor="Pointer" size="23px" />
                <input
                  type="file"
                  style={{ display: "none" }}
                  accept=".jpeg,.jpg,.png"
                  onChange={handleFileUpload}
                />
              </label>
            </Flex>
          </Flex>
          {showButtonsGroup ? (
            <Flex w="100%" justifyContent="space-between" mt="10px" h="35px">
              <Button
                onClick={() => {
                  setShowButtonGroup(false);
                  setSelectedImage(null);
                }}
                w="50%"
                mr="12px"
                h="100%"
                borderRadius="0"
                borderColor="#1B75BC40"
                color="black "
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                w="50%"
                h="100%"
                color="#3987c5"
                borderRadius="0"
                borderColor="#c6dcee"
                bg="#c6dcee"
                variant="solid"
                onClick={() => handleUpload()}
              >
                Upload
              </Button>
            </Flex>
          ) : null}
        </Box>
      ) : null}
    </Box>
  );
};

export default Normalisation;