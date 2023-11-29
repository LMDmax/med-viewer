import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import {
  Divider,
  Flex,
  SimpleGrid,
  useToast,
  Box,
  Button,
  Text,
} from "@chakra-ui/react";
import { fabric } from "openseadragon-fabricjs-overlay";
import Draggable from "react-draggable";
import { MdOutlineDragIndicator } from "react-icons/md";
import {
  DELETE_ANNOTATION,
  SAVE_ANNOTATION,
} from "../../graphql/annotaionsQuery";
import { useFabricOverlayState } from "../../state/store";
import Draw from "../Draw/draw";
import RemoveObject from "../removeComponents";
import Circle from "../Shape/circle";
import Line from "../Shape/line";
import Polygon from "../Shape/polygon";
import Square from "../Shape/square";
import MagicWandTool from "../Tools/magicWandTool";
import AddPath from "../../HILTools/AddPath";
import RemovePath from "../../HILTools/RemovePath";
import { RgbaColorPicker } from "react-colorful";

const TypeTools = ({
  enableAI,
  userInfo,
  viewerId,
  setToolSelected,
  lessonId,
  setTotalCells,
  setPattern3Color,
  toolSelected,
  caseInfo,
  application,
  selectedPattern,
  setNewToolSettings,
  newToolSettings,
  setPattern5Color,
  setPattern4Color,
  SetBenignColor,
  setTumorColor,
  setStromaColor,
  setLymphocyteColor,
  setMaskAnnotationData,
  addLocalRegion,
}) => {
  const { fabricOverlayState } = useFabricOverlayState();
  const toast = useToast();
  const [color, setColor] = useState({ r: 217, g: 217, b: 217, a: 1 });
  const [gleasonPatternColor, setGleasonPatternColor] = useState([]);
  const [isHILToolEnabled, setIsHILToolEnabled] = useState(false);
  const [strokeColor, setStrokeColor] = useState("black"); // State to store the selected color
  const [selectedStrokeType, setSelectedStrokeType] = useState("solid");

  const fabricOverlay =
    fabricOverlayState.viewerWindow[viewerId]?.fabricOverlay;
  // console.log(viewerId);
  fabric.IText.prototype.onKeyDown = (e) => {
    if (e.ctrlKey === true && e.key === "Enter") {
      fabricOverlay?.fabricCanvas().discardActiveObject();
    }
  };
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);

  // console.log("color", isColorPickerVisible);

  const [removeAnnotation, { error: deleteError }] =
    useMutation(DELETE_ANNOTATION);
  if (deleteError) {
    toast({
      title: "Annotation could not be deleted",
      description: "server error",
      status: "error",
      duration: 1000,
      isClosable: true,
    });
  }

  const onDeleteAnnotation = (data) => {
    removeAnnotation({ variables: { body: data } });
  };

  const caseData = JSON.parse(localStorage.getItem("caseData"));
  const caseId = caseInfo?._id;

  const onSaveAnnotation = (data) => {
    createAnnotation({
      variables: {
        body: {
          ...data,
          app: application,
          createdBy: `${userInfo?.firstName} ${userInfo?.lastName}`,
          // caseId: caseId? caseId : lessonId
          addLocalRegion: addLocalRegion ? true : false,
          caseId:
            application === "hospital"
              ? caseId
              : application === "education"
              ? lessonId
              : application === "clinical"
              ? caseInfo.caseId
              : "",
        },
      },
    });
  };

  const [createAnnotation, { error, loading }] = useMutation(SAVE_ANNOTATION);
  if (error) {
    toast({
      title: "Annotation could not be created",
      description: "server error",
      status: "error",
      duration: 1000,
      isClosable: true,
    });
  }

  // console.log(selectedStrokeType);
  // ############################### enable HITL  TOOL ################################

  useEffect(() => {
    if (selectedPattern !== "") {
      setIsHILToolEnabled(true);
      if (selectedPattern === "Pattern 3") {
        setColor({ r: 255, g: 255, b: 0, a: 1 });
      }
      if (selectedPattern === "Pattern 4") {
        setColor({ r: 255, g: 165, b: 0, a: 1 });
      }
      if (selectedPattern === "Pattern 5") {
        setColor({ r: 255, g: 0, b: 0, a: 1 });
      }
      if (selectedPattern === "Benign") {
        setColor({ r: 0, g: 255, b: 0, a: 1 });
      }
    }
  }, [selectedPattern]);

  const strokeColorOptions = [
    "red",
    "green",
    "blue",
    "yellow",
    "orange",
    "purple",
    "pink",
    "brown",
    "gray",
    "black",
  ];
  const strokeStyles = ["solid", "dashed"];

  const handleColorChange = (event) => {
    setStrokeColor(event.target.value);
  };

  const handleStrokeTypeChange = (event) => {
    setSelectedStrokeType(event.target.value);
  };

  // Define a function to generate the CSS for the preview
  const getDashes = (style) => {
    switch (style) {
      case "solid":
        return "–––––––";
      case "dashed":
        return "- - - - - - -";
      default:
        return "";
    }
  };

  const handleCancel = () => {
    if (selectedPattern !== "") {
      if (selectedPattern === "Pattern 3") {
        setColor({ r: 255, g: 255, b: 0, a: 1 });
      }
      if (selectedPattern === "Pattern 4") {
        setColor({ r: 255, g: 165, b: 0, a: 1 });
      }
      if (selectedPattern === "Pattern 5") {
        setColor({ r: 255, g: 0, b: 0, a: 1 });
      }
      if (selectedPattern === "Benign") {
        setColor({ r: 0, g: 255, b: 0, a: 1 });
      }
    } else {
      setSelectedStrokeType("solid");
      setStrokeColor("black");
      setColor({ r: 217, g: 217, b: 217, a: 1 });
    }

    setIsColorPickerVisible(false); //
  };

  const handleSave = () => {
    const updatedToolSettings = {
      strokeColor,
      strokeType: selectedStrokeType,
      fillColor: {
        r: color.r,
        g: color.g,
        b: color.b,
        a: color.a,
      },
    };
    setNewToolSettings(updatedToolSettings);
    setIsColorPickerVisible(false); //
    if (selectedPattern === "Pattern 3") {
      // console.log("ABCD", selectedPattern);
      const pattern3ColorSet = gleasonPatternColor.find(
        (pattern) => pattern.patternName === "Pattern3"
      );
      if (pattern3ColorSet) {
        setPattern3Color(pattern3ColorSet);
      }
    }
    if (selectedPattern === "Pattern 4") {
      // console.log("ABCD", selectedPattern);
      const pattern4ColorSet = gleasonPatternColor.find(
        (pattern) => pattern.patternName === "Pattern4"
      );
      if (pattern4ColorSet) {
        setPattern4Color(pattern4ColorSet);
      }
    }
    if (selectedPattern === "Pattern 5") {
      // console.log("ABCD", selectedPattern);
      const pattern5ColorSet = gleasonPatternColor.find(
        (pattern) => pattern.patternName === "Pattern5"
      );
      if (pattern5ColorSet) {
        setPattern5Color(pattern5ColorSet);
      }
    }
    if (selectedPattern === "Benign") {
      const BenignColorSet = gleasonPatternColor.find(
        (pattern) => pattern.patternName === "Benign"
      );
      if (BenignColorSet) {
        SetBenignColor(BenignColorSet);
      }
    }
    if (selectedPattern === "Tumor") {
      const TumorColorSet = gleasonPatternColor.find(
        (pattern) => pattern.patternName === "Tumor"
      );
      if (TumorColorSet) {
        // SetBenignColor(BenignColorSet);
        setTumorColor(TumorColorSet);
      }
    }
    if (selectedPattern === "Stroma") {
      const StromaColorSet = gleasonPatternColor.find(
        (pattern) => pattern.patternName === "Stroma"
      );
      if (StromaColorSet) {
        // SetBenignColor(BenignColorSet);
        setStromaColor(StromaColorSet);
      }
    }
    if (selectedPattern === "Lymphocytes") {
      const lymphocyteColorSet = gleasonPatternColor.find(
        (pattern) => pattern.patternName === "Lymphocytes"
      );
      if (lymphocyteColorSet) {
        // SetBenignColor(BenignColorSet);
        setLymphocyteColor(lymphocyteColorSet);
      }
    }
  };

  return (
    <Draggable
      bounds={{
        top: 0,
        left: 0,
        right: 90 * (window.screen.width / 100),
        bottom: 60 * (window.screen.height / 100),
      }}
      handle=".drag-handle"
    >
      <Flex
        direction="column"
        pos="fixed"
        bg="#FCFCFC"
        zIndex="999"
        boxShadow="1px 1px 2px rgba(176, 200, 214, 0.5)"
      >
        <Flex
          className="drag-handle"
          bg="whitesmoke"
          h="15px"
          cursor="move"
          alignItems="center"
          justifyContent="center"
        >
          <MdOutlineDragIndicator
            style={{ transform: "rotate(90deg)", color: "darkgrey" }}
          />
        </Flex>
        <SimpleGrid columns={2} px="8px" bgColor="#FCFCFC" py="8px" spacing={2}>
          <Line
            setToolSelected={setToolSelected}
            viewerId={viewerId}
            onSaveAnnotation={onSaveAnnotation}
            setNewToolSettings={setNewToolSettings}
            newToolSettings={newToolSettings}
            addLocalRegion={addLocalRegion}
          />
          {enableAI && (
            <MagicWandTool
              userInfo={userInfo}
              toolSelected={toolSelected}
              viewerId={viewerId}
              setToolSelected={setToolSelected}
              setTotalCells={setTotalCells}
              onSaveAnnotation={onSaveAnnotation}
            />
          )}
          <Square
            setToolSelected={setToolSelected}
            viewerId={viewerId}
            onSaveAnnotation={onSaveAnnotation}
            setNewToolSettings={setNewToolSettings}
            newToolSettings={newToolSettings}
            addLocalRegion={addLocalRegion}
          />
          <Circle
            setToolSelected={setToolSelected}
            viewerId={viewerId}
            onSaveAnnotation={onSaveAnnotation}
            setNewToolSettings={setNewToolSettings}
            newToolSettings={newToolSettings}
            addLocalRegion={addLocalRegion}
          />
          <Polygon
            setToolSelected={setToolSelected}
            viewerId={viewerId}
            onSaveAnnotation={onSaveAnnotation}
            setNewToolSettings={setNewToolSettings}
            newToolSettings={newToolSettings}
            addLocalRegion={addLocalRegion}
          />
          <Draw
            setToolSelected={setToolSelected}
            viewerId={viewerId}
            onSaveAnnotation={onSaveAnnotation}
            setNewToolSettings={setNewToolSettings}
            newToolSettings={newToolSettings}
            addLocalRegion={addLocalRegion}
          />
          <RemoveObject
            viewerId={viewerId}
            onDeleteAnnotation={onDeleteAnnotation}
          />
        </SimpleGrid>
        <Divider borderColor={"#EEEEEE"} />
        {/* HITL TOOLS */}
        <SimpleGrid columns={2} px="8px" bgColor="#FCFCFC" py="8px" spacing={2}>
          <AddPath
            setToolSelected={setToolSelected}
            viewerId={viewerId}
            isHILToolEnabled={isHILToolEnabled}
            onSaveAnnotation={onSaveAnnotation}
            newToolSettings={newToolSettings}
            selectedPattern={selectedPattern}
            setMaskAnnotationData={setMaskAnnotationData}
          />
          <RemovePath
            setToolSelected={setToolSelected}
            viewerId={viewerId}
            isHILToolEnabled={isHILToolEnabled}
            onSaveAnnotation={onSaveAnnotation}
            newToolSettings={newToolSettings}
            selectedPattern={selectedPattern}
            setMaskAnnotationData={setMaskAnnotationData}
          />
        </SimpleGrid>
        <Divider mb="5px" borderColor={"#EEEEEE"} />
        <Flex
          w="100%"
          mb="12px"
          h="80px"
          justifyContent="center"
          alignItems="center"
          cursor="pointer"
          onClick={() => {
            setIsColorPickerVisible(true);
          }}
          position="relative"
        >
          {/* Filled Box */}
          <Box
            bg={`rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`}
            w="45px"
            h="45px"
            mr="15px"
            position="absolute"
          ></Box>

          {/* Overlapping Box */}
          <Box
            position="absolute"
            border={`5px solid ${strokeColor}`}
            w="45px"
            h="45px"
            mt="25px"
            ml="25px"
            zIndex="1"
          ></Box>

          {/* Color Picker */}
          {isColorPickerVisible && (
            <Box
              style={{
                width: "250px",
                height: "420px",
                position: "absolute",
                bottom: "-72px",
                left: "100%",
                marginLeft: "10px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Add a box shadow
                // border: "1px solid red",
                padding: "10px",
              }}
              bg="white"
            >
              <Flex
                w="100%"
                justifyContent="space-between"
                alignItems="flex-start"
                h="85px"
                direction="column"
                // border="1px solid red"
                mb="12px"
              >
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  w="100%"
                  // h="15px"
                  // border="1px solid red"
                >
                  <Text fontFamily="inter">Stroke Color</Text>
                  <Box w="25px" h="25px" mr="-20px" bg={strokeColor}></Box>
                  <select
                    value={strokeColor}
                    onChange={handleColorChange}
                    style={{
                      width: "80px", // Set the width here
                      height: "30px", // Set the height here
                      border: "2px solid black",
                      background: `linear-gradient(to right, ${strokeColor} 50%, transparent 30%)`,
                      color: "black", // Set text color to red for better visibility
                    }}
                  >
                    {strokeColorOptions.map((color) => (
                      <option
                        key={color}
                        value={color}
                        style={{
                          backgroundColor: color,
                        }}
                      >
                        {/* You can add an empty space as content */}
                        &nbsp;
                      </option>
                    ))}
                  </select>
                </Flex>
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  w="100%"
                  // h="15px"
                  // border="1px solid red"
                >
                  <Text fontFamily="inter">Stroke Type</Text>
                  <select
                    value={selectedStrokeType}
                    onChange={handleStrokeTypeChange}
                    style={{
                      width: "80px", // Adjust the width to fit the preview
                      height: "30px",
                    }}
                  >
                    <option value=""></option>
                    {strokeStyles.map((style) => (
                      <option key={style} value={style}>
                        {getDashes(style)}
                      </option>
                    ))}
                  </select>
                </Flex>
              </Flex>
              <Text fontFamily="inter" fontWeight="bold" mb="5px">
                Fill
              </Text>
              <Box
                w="100%"
                p="10px"
                bg="#F6F6F6"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <RgbaColorPicker
                  color={color}
                  onChange={(value) => {
                    setColor(value);

                    let patternName;

                    if (selectedPattern === "Pattern 3") {
                      patternName = "Pattern3";
                    } else if (selectedPattern === "Pattern 4") {
                      patternName = "Pattern4";
                    } else if (selectedPattern === "Pattern 5") {
                      patternName = "Pattern5";
                    } else if (selectedPattern === "Benign") {
                      patternName = "Benign";
                    } else if (selectedPattern === "Tumor") {
                      patternName = "Tumor";
                    } else if (selectedPattern === "Stroma") {
                      patternName = "Stroma";
                    } else if (selectedPattern === "Lymphocytes") {
                      patternName = "Lymphocytes";
                    }

                    if (patternName) {
                      const pattern = {
                        color: value,
                        patternName,
                      };

                      // Find the index of the existing pattern with the same patternName
                      const index = gleasonPatternColor.findIndex(
                        (p) => p.patternName === patternName
                      );

                      if (index !== -1) {
                        // Replace the existing pattern with the new one
                        setGleasonPatternColor((prevGleasonPatternColor) => [
                          ...prevGleasonPatternColor.slice(0, index),
                          pattern,
                          ...prevGleasonPatternColor.slice(index + 1),
                        ]);
                      } else {
                        // If the pattern doesn't exist, add it to the array
                        setGleasonPatternColor((prevGleasonPatternColor) => [
                          ...prevGleasonPatternColor,
                          pattern,
                        ]);
                      }
                    }
                  }}
                />
              </Box>
              <Flex
                w="100%"
                mt="10px"
                justifyContent="flex-end"
                alignItems="center"
              ></Flex>
            </Box>
          )}
        </Flex>
        {isColorPickerVisible && (
          <Flex
            style={{
              width: "250px",
              height: "50px",
              position: "absolute",
              top: "380px",
              left: "100%",
              marginLeft: "10px",
              // border: "1px solid red",
              // padding: "10px",
            }}
            bg="white"
            w="100%"
            h="100%"
            justifyContent="flex-end"
            alignItems="center"
          >
            <Button
              fontFamily="inter"
              bg="none"
              border="1px solid black"
              borderRadius="0"
              mr="18px"
              onClick={() => {
                handleCancel();
              }}
            >
              Cancel
            </Button>
            <Button
              fontFamily="inter"
              bg="none"
              border="1px solid black"
              borderRadius="0"
              mr="18px"
              onClick={() => {
                handleSave();
              }}
            >
              Save
            </Button>
          </Flex>
        )}
      </Flex>
    </Draggable>
  );
};

export default TypeTools;
