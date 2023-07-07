import React, { useEffect, useState } from "react";
import { Box, Flex, Text, Tooltip, HStack, Button } from "@chakra-ui/react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { MdOutlineUpload, MdOutlineModeEditOutline } from "react-icons/md";
import { sendRequest } from "../../Socket/Socket";
import { useFabricOverlayState } from "../../state/store";
import { removeViewerWindow } from "../../state/actions/fabricOverlayActions";

const Normalisation = ({
  setBase64URL,
  editView,
  setShowRightPanel,
  setEditView,
  setNormalizeDefault,
  targetAnnotation,
  showNormalisation,
  setShowNormalisation,
  viewerId,
}) => {
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { viewerWindow } = fabricOverlayState;
  const { viewer, fabricOverlay } = viewerWindow[viewerId];
  const [isChecked, setIsChecked] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [normalisationTab, setNormalisationTab] = useState(true);
  const [showButtonsGroup, setShowButtonGroup] = useState(false);


  // console.log(tile);
  const handleUpload = () => {
    // Create base64URL url
    if(selectedImage){
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
          sendRequest(JSON.stringify(sendBase64Data));
        };
        reader.readAsDataURL(blob);
      })
      .catch((error) => {
        // console.log("Error fetching image data:", error);
      });
    }
    if(editView){
      const sendAnnotationData = {
        targetAnnotation
      }
      // sendRequest(JSON.stringify(sendAnnotationData));
      setBase64URL(true);
      // console.log(sendAnnotationData);
    }

    setShowButtonGroup(false);
    setShowRightPanel(false)
  };

  const handleFileUpload = (event) => {
    // setFabricOverlayState(removeViewerWindow({ id: vKeys[1] }));
    const file = event.target.files[0];
    if (
      file &&
      (file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png")
    ) {
      setShowButtonGroup(true);
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
          onClick={() => setNormalisationTab(!normalisationTab)}
          cursor="pointer"
          mr="5px"
        >
          {normalisationTab ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
        </Box>
      </Flex>
      {normalisationTab ? showNormalisation ? (
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
              w={showButtonsGroup ? "80%" : "50%"}
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
                    : editView
                    ? "Annotation Marked"
                    : "No image selected"}
                </Text>
              </Tooltip>
            </Flex>
            {!showButtonsGroup && !editView ? (
              <Flex w="25%" ml="2px" justifyContent="space-evenly">
                <MdOutlineModeEditOutline
                  onClick={() => {
                    setShowButtonGroup(true);
                    setEditView(true);
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
            ) : null}
          </Flex>
          {showButtonsGroup || editView ? (
            <Flex w="100%" justifyContent="space-between" mt="10px" h="35px">
              <Button
                onClick={() => {
                  setShowButtonGroup(false);
                  setSelectedImage(null);
                  setShowNormalisation(true);
                  setEditView(false)
                }}
                w="50%"
                mr="12px"
                h="100%"
                borderRadius="0"
                borderColor="#1B75BC40"
                color="black "
                variant="outline"
              >
                Cancels
              </Button>
              <Button
                w="50%"
                h="100%"
                color="#3987c5"
                borderRadius="0"
                borderColor="#c6dcee"
                bg="#c6dcee"
                variant="solid"
                onClick={() =>{
                  handleUpload()
                }}
              >
                Upload
              </Button>
            </Flex>
          ) : null}
        </Box>
      ) : (
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
              w="80%"
              ml="5px"
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
          </Flex>

          <Flex w="100%" justifyContent="space-between" mt="10px" h="35px">
            <Button
              onClick={() => {
                setShowNormalisation(true);
                setNormalizeDefault(false);
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
              onClick={() => {
                setNormalizeDefault(true);
                setShowRightPanel(false);
              }}
            >
              Normalize
            </Button>
          </Flex>
        </Box>
      ) : null}
    </Box>
  );
};

export default Normalisation;
