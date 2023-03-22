import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  useMediaQuery,
  IconButton,
  Text,
  Tooltip,
  useToast,
  Button,
} from "@chakra-ui/react";
import { GrFormClose } from "react-icons/gr";
import { BsEye } from "react-icons/bs";
import { BsEyeSlash } from "react-icons/bs";
import { BsFillCircleFill } from "react-icons/bs";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import IconSize from "../ViewerToolbar/IconSize";
import { useFabricOverlayState } from "../../state/store";
import { widths } from "../Draw/width";
import {
  createAnnotationMessage,
  getFileBucketFolder,
  getScaleFactor,
  saveAnnotationToDB,
} from "../../utility";
import {
  addToActivityFeed,
  updateTool,
} from "../../state/actions/fabricOverlayActions";
import axios from "axios";

const getDrawCursor = (brushSize, brushColor) => {
  brushSize = brushSize < 4 ? 8 : brushSize * 3;
  const circle = `
		<svg
			height="${brushSize}"
			fill="${brushColor}"
			viewBox="0 0 ${brushSize * 2} ${brushSize * 2}"
			width="${brushSize}"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle
				cx="50%"
				cy="50%"
				r="${brushSize}" 
			/>
		</svg>
	`;

  return `data:image/svg+xml;base64,${window.btoa(circle)}`;
};

const createFreeDrawingCursor = (brushWidth, brushColor) => {
  return `url(${getDrawCursor(brushWidth, brushColor)}) ${brushWidth / 2} ${
    brushWidth / 2
  }, crosshair`;
};

const TILFeedBar = ({
  viewerId,
  handleFeedBarClose,
  showReport,
  hideTumor,
  Environment,
  synopticType,
  newHilData,
  setRefreshHil,
  refreshHil,
  setLoadUI,
  caseInfo,
  setHideTumor,
  setPathStroma,
  hideModification,
  setHideModification,
  lymphocyteCount,
  tumorArea,
  stromaArea,
  tilScore,
  pathStroma,
  setHideLymphocyte,
  hideLymphocyte,
  setHideStroma,
  hideStroma,
}) => {
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const [visibleTumor, setVisibleTumor] = useState(true);
  const [visibleStroma, setVisibleStroma] = useState(true);
  const [visibleLymphocyte, setVisibleLymphocyte] = useState(true);
  const [editTumor, setEditTumor] = useState(true);
  const toast = useToast();
  const [editStroma, setEditStroma] = useState(true);
  const [editLymphocyte, setEditLymphocyte] = useState(true);
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { viewerWindow, isViewportAnalysing, color, activeTool } =
    fabricOverlayState;
  const { viewer, fabricOverlay, slideId, originalFileUrl } =
    viewerWindow[viewerId];
  const isActive = activeTool === "TILDRAW";

  const [myState, setState] = useState({
    width: widths[0],
    isActive: false,
  });
  const myStateRef = useRef(myState.isActive);
  const setMyState = (data) => {
    myStateRef.current = data;
    setState((state) => ({ ...state, isActive: data }));
  };

  useEffect(() => {
    setMyState(isActive);
  }, [isActive]);

  useEffect(() => {
    if (!fabricOverlay || !isActive) return;
    const canvas = fabricOverlay.fabricCanvas();
    const pathCreated = (event) => {
      canvas.selection = false;
      // console.log("event",event.path);
      setPathStroma(event.path);
    };
    function handleMouseDown(event) {
      canvas.selection = false;
      viewer.setMouseNavEnabled(false);
      viewer.outerTracker.setTracking(false);
    }
    const brushWidth = myState.width.pixelWidth;
    const scaleFactor = getScaleFactor(viewer);
    canvas.isDrawingMode = true;
    canvas.selection = true;
    canvas.freeDrawingBrush.color = "yellow";
    canvas.freeDrawingBrush.width = brushWidth / scaleFactor;
    canvas.renderAll();
    canvas.freeDrawingCursor = createFreeDrawingCursor(brushWidth, "yellow");
    canvas.on("mouse:down", handleMouseDown);
    canvas.on("path:created", pathCreated);

    // Remove handler
    return () => {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("path:created", pathCreated);
      viewer.setMouseNavEnabled(true);
      viewer.outerTracker.setTracking(true);
      canvas.isDrawingMode = false;
      canvas.freeDrawingCursor = "";
    };
  }, [isActive]);

  useEffect(() => {
    // Update brush color and size with Fabric
    if (!fabricOverlay || !isActive) return;
    const canvas = fabricOverlay.fabricCanvas();
    const brushWidth = myState.width.pixelWidth;
    const scaleFactor = getScaleFactor(viewer);
    canvas.freeDrawingBrush.color = "yellow";
    canvas.freeDrawingBrush.width = brushWidth / scaleFactor;
    canvas.freeDrawingCursor = createFreeDrawingCursor(brushWidth, "yellow");
  }, [color, myState.width]);

  useEffect(() => {
    viewer.setMouseNavEnabled(true);
    viewer.outerTracker.setTracking(true);
    if (pathStroma) {
      // console.log( typeof pathStroma.path);
      pathStroma.fill = "yellow";
      pathStroma.opacity = "0.5";
      pathStroma.selectable = false;
      pathStroma.hoverCursor = "default";
      if(pathStroma?.path.length >2){
        const message = createAnnotationMessage({
          slideId,
          shape: pathStroma,
          viewer,
          maskType: "stroma",
          type: "path",
        });
          const key = getFileBucketFolder(originalFileUrl);
      const newObject = {
        hash: message?.object?.hash,
        path: message?.object?.path,
        top: message?.object?.top,
        width: message?.object?.width,
        height: message?.object?.height,
        left: message?.object?.left,
        maskType: message?.object?.maskType,
        slideId: message?.object?.slide,
        type: message?.object?.type,
	bucket_name: "med-ai-image-processor",
        notifyHook: `${Environment.VIEWER_URL}/notify_hil`,
        key,
      };
      const resp = axios.post(
        "https://backup-quantize-vhut.prr.ai/TILS/HIL",
        newObject
      );
      console.log(resp);
      if ((resp.status = "Accepted")) {
        setLoadUI(false);
        handleDrawStroma();
        toast({
          title: "HIL is Processing ",
          status: "success",
          duration: 500,
          isClosable: true,
        });
      }
       }
       else if (pathStroma?.path?.length <= 2){
        // console.log("object23");
        toast({
              title: "Please Draw Again",
              status: "error",
              duration: 500,
              isClosable: true,
            });
       }
     
    }

   
  }, [pathStroma]);

  const handleDrawStroma = () => {
    setEditStroma(!editStroma);
    if (editStroma === true) {
      setFabricOverlayState(updateTool({ tool: "TILDRAW" }));
      toast({
        title: "Stroma Tool Selected ",
        status: "success",
        duration: 500,
        isClosable: true,
      });
    } else {
      setFabricOverlayState(updateTool({ tool: "Move" }));
    }
  };

  return (
    <Box
      w="15.88vw"
      minW="300px"
      position="fixed"
      right={showReport ? "33.281vw" : synopticType !== "" ? "40vw" : "0"}
      zIndex={2}
      borderLeft="1px solid black"
      background="#FCFCFC"
      height="90%"
    >
      <Flex
        py="0.5px"
        justifyContent="space-between"
        alignItems="center"
        background="#F6F6F6"
        // background="red"
        height="50px"
        borderBottom="1px solid #DEDEDE"
      >
        <Tooltip hasArrow label="sss">
          <Text
            fontSize="14px"
            css={{
              fontWeight: "900",
            }}
          >
            Slide Id : {caseInfo._id}
          </Text>
        </Tooltip>
        <Flex
          py="0.5px"
          justifyContent="flex-end"
          alignItems="center"
          background="#F6F6F6"
        >
          <GrFormClose
            size={16}
            cursor="pointer"
            onClick={() => {
              handleFeedBarClose();
              setEditLymphocyte(false);
              setEditTumor(false);
              setEditStroma(false);
              setHideStroma(false);
              setHideLymphocyte(false);
              setHideTumor(false);
            }}
            _hover={{ cursor: "pointer" }}
          />
        </Flex>
      </Flex>
      <Box>
        <Text mb="25px" w="100%" textAlign="center" bg="gray.100">
          TIL Details
        </Text>
        <Flex
          py="5px"
          px="5px"
          justifyContent="space-between"
          alignItems="center"
          borderBottom="1px solid black"
        >
          <Flex justifyContent="center" alignItems="center">
            <BsFillCircleFill size="10px" color="#9f9"></BsFillCircleFill>
            <Text marginLeft="5px">Tumor</Text>
          </Flex>
          <Flex>
            <IconButton
              width={ifScreenlessthan1536px ? "30px" : "40px"}
              size={ifScreenlessthan1536px ? 60 : 0}
              height={ifScreenlessthan1536px ? "26px" : "34px"}
              icon={
                !visibleTumor ? (
                  <BsEyeSlash size={IconSize()} color="#151C25" />
                ) : (
                  <BsEye size={IconSize()} color="#3b5d7c" />
                )
              }
              _active={{
                bgColor: "none",
                outline: "none",
              }}
              _focus={{
                border: "none",
              }}
              _hover={{ bgColor: "none" }}
              backgroundColor="white"
              mr="7px"
              borderRadius={0}
              onClick={() => {
                setHideTumor(!hideTumor);
                setHideStroma(false);
                setHideLymphocyte(false);
                // console.log(hideTumor);
                setVisibleTumor(!visibleTumor);
                setVisibleStroma(true);
                setVisibleLymphocyte(true);
              }}
            />
            <IconButton
              width={ifScreenlessthan1536px ? "30px" : "40px"}
              size={ifScreenlessthan1536px ? 60 : 0}
              height={ifScreenlessthan1536px ? "26px" : "34px"}
              icon={
                !editTumor ? (
                  <MdEdit size={IconSize()} color="#151C25" />
                ) : (
                  <MdOutlineModeEditOutline size={IconSize()} color="#3b5d7c" />
                )
              }
              _active={{
                bgColor: "none",
                outline: "none",
              }}
              outline="none"
              _focus={{
                border: "none",
              }}
              backgroundColor="white"
              mr="7px"
              borderRadius={0}
              onClick={() => {
                // handleTIL();
                setEditTumor(!editTumor);
                setEditStroma(true);
                setEditLymphocyte(true);
              }}
              _hover={{ bgColor: "none" }}
            />
          </Flex>
        </Flex>
        {/* stroma */}
        <Flex
          py="5px"
          px="5px"
          justifyContent="space-between"
          alignItems="center"
          borderBottom="1px solid black"
        >
          <Flex justifyContent="center" alignItems="center">
            <BsFillCircleFill size="10px" color="yellow"></BsFillCircleFill>
            <Text marginLeft="5px">Stroma</Text>
          </Flex>
          <Flex>
            <IconButton
              width={ifScreenlessthan1536px ? "30px" : "40px"}
              size={ifScreenlessthan1536px ? 60 : 0}
              height={ifScreenlessthan1536px ? "26px" : "34px"}
              icon={
                !visibleStroma ? (
                  <BsEyeSlash size={IconSize()} color="#151C25" />
                ) : (
                  <BsEye size={IconSize()} color="#3b5d7c" />
                )
              }
              _active={{
                bgColor: "none",
                outline: "none",
              }}
              _focus={{
                border: "none",
              }}
              _hover={{ bgColor: "none" }}
              backgroundColor="white"
              mr="7px"
              borderRadius={0}
              onClick={() => {
                setHideStroma(!hideStroma);
                setHideLymphocyte(false);
                setHideTumor(false);
                setVisibleStroma(!visibleStroma);
                setVisibleLymphocyte(true);
                setVisibleTumor(true);
              }}
            />
            <IconButton
              width={ifScreenlessthan1536px ? "30px" : "40px"}
              size={ifScreenlessthan1536px ? 60 : 0}
              height={ifScreenlessthan1536px ? "26px" : "34px"}
              icon={
                !editStroma ? (
                  <MdEdit size={IconSize()} color="#151C25" />
                ) : (
                  <MdOutlineModeEditOutline size={IconSize()} color="#3b5d7c" />
                )
              }
              _active={{
                bgColor: "none",
                outline: "none",
              }}
              outline="none"
              _focus={{
                border: "none",
              }}
              backgroundColor="white"
              mr="7px"
              borderRadius={0}
              onClick={() => {
                // handleTIL();
                handleDrawStroma();
                setEditLymphocyte(true);
                setEditTumor(true);
              }}
              _hover={{ bgColor: "none" }}
            />
          </Flex>
        </Flex>
        {/* lymphocyte */}
        <Flex
          py="5px"
          px="5px"
          justifyContent="space-between"
          alignItems="center"
          borderBottom="1px solid black"
        >
          <Flex justifyContent="center" alignItems="center">
            <BsFillCircleFill size="10px" color="red"></BsFillCircleFill>
            <Text marginLeft="5px">Lymphocyte</Text>
          </Flex>
          <Flex>
            <IconButton
              width={ifScreenlessthan1536px ? "30px" : "40px"}
              size={ifScreenlessthan1536px ? 60 : 0}
              height={ifScreenlessthan1536px ? "26px" : "34px"}
              icon={
                !visibleLymphocyte ? (
                  <BsEyeSlash size={IconSize()} color="#151C25" />
                ) : (
                  <BsEye size={IconSize()} color="#3b5d7c" />
                )
              }
              _active={{
                bgColor: "none",
                outline: "none",
              }}
              _focus={{
                border: "none",
              }}
              _hover={{ bgColor: "none" }}
              backgroundColor="white"
              mr="7px"
              borderRadius={0}
              onClick={() => {
                setHideLymphocyte(!hideLymphocyte);
                setHideStroma(false);
                setHideTumor(false);
                setVisibleLymphocyte(!visibleLymphocyte);
                setVisibleTumor(true);
                setVisibleStroma(true);
              }}
            />
            <IconButton
              width={ifScreenlessthan1536px ? "30px" : "40px"}
              size={ifScreenlessthan1536px ? 60 : 0}
              height={ifScreenlessthan1536px ? "26px" : "34px"}
              icon={
                !editLymphocyte ? (
                  <MdEdit size={IconSize()} color="#151C25" />
                ) : (
                  <MdOutlineModeEditOutline size={IconSize()} color="#3b5d7c" />
                )
              }
              _active={{
                bgColor: "none",
                outline: "none",
              }}
              outline="none"
              _focus={{
                border: "none",
              }}
              backgroundColor="white"
              mr="7px"
              borderRadius={0}
              onClick={() => {
                // handleTIL();
                setEditLymphocyte(!editLymphocyte);
                setEditStroma(true);
                setEditTumor(true);
              }}
              _hover={{ bgColor: "none" }}
            />
          </Flex>
        </Flex>
      </Box>

      <Box mt="45px" w="100%">
        <Text bg="gray.100" mb="15px" w="100%" textAlign="center">
          TIL Values
        </Text>
        <Flex
          px="5px"
          mb="15px"
          w="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            bgColor="white"
            _hover="none"
            color="#00153f"
            w="48%"
            fontWeight="normal"
            letterSpacing="wide"
            _active="bg:red"
            border="1px solid"
            borderColor="#00153f"
            borderRadius="none"
            size="sm"
            disabled={newHilData? false : true}
            onClick={()=>{
              setRefreshHil(refreshHil+1);
            }}
          >
            Refresh
          </Button>
          <Button
            bgColor="white"
            _hover="none"
            color="#00153f"
            w="48%"
            fontWeight="normal"
            letterSpacing="wide"
            _active="bg:red"
            border="1px solid"
            borderColor="#00153f"
            borderRadius="none"
            size="sm"
            disabled={newHilData? false : true}
            onClick={()=>{
              setHideModification(!hideModification);
            }}
          >
           {hideModification  === true ? "Show Modification" : "Hide Modification"}
          </Button>
        </Flex>
        <Box borderBottom="1px solid gray" px="5px" mb="10px" py="3px">
          <Text fontSize="15px">
            TIL Score : {tilScore}
          </Text>
        </Box>
        <Box borderBottom="1px solid gray" px="5px" mb="10px" py="3px">
          <Text fontSize="15px">TIL Formula :</Text>
          <Text as="span" fontSize="15px">
            (lymphocyte area / stroma area) * 100{" "}
          </Text>
        </Box>
        <Box borderBottom="1px solid gray" px="5px" mb="10px" py="3px">
          <Text fontSize="15px">
            Tumor Area : {tumorArea}
          </Text>
        </Box>
        <Box borderBottom="1px solid gray" px="5px" mb="10px" py="3px">
          <Text fontSize="15px">
            Stroma Area : {stromaArea}
          </Text>
        </Box>
        <Box borderBottom="1px solid gray" px="5px" mb="10px" py="3px">
          <Text fontSize="15px">
            Lymphocytes Count: {lymphocyteCount}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default TILFeedBar;
