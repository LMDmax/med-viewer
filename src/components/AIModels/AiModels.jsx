import React, { useEffect, useState, useRef } from "react";
import {
  IconButton,
  Text,
  Tooltip,
  Box,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import TooltipLabel from "../AdjustmentBar/ToolTipLabel";
import { BiTargetLock } from "react-icons/bi";
import { ImTarget } from "react-icons/im";
import IconSize from "../ViewerToolbar/IconSize";

const AiModels = ({ slide, setToolSelected, setModelname, zoomValue }) => {
  const [ifScreenlessthan1536px] = useMediaQuery("(max-width:1536px)");
  const [TilHover, setTilHover] = useState(false);
  const [TilActiveState, setTilActiveState] = useState(0);
  

  useEffect(()=>{
    if(!TilHover){
      setModelname("")
    }
  })

  const handleKI67 = () => {
    if (slide?.isIHC && zoomValue === 40) {
      // console.log("1");

      setModelname("KI67");
    }
    if(!slide?.isIHC){
        setToolSelected("KI67Error");
    }
    if(zoomValue < 40){
    setToolSelected("ZoomError");

    }
  };

  const handleMorphometry = () => {
    // console.log("2");
if(!slide?.isIHC && zoomValue === 40){
    setModelname("Morphometry");
}
if(slide?.isIHC){
  setToolSelected("MorphometrySlideIssue");
}
if(zoomValue < 40){
  setToolSelected("ZoomError");

  }
  };

// console.log(slide);
  useEffect(()=>{
    if(slide.isBreastCancer){
        if(TilActiveState / 2 !== 0){
            setModelname("TIL")
        }
        else{
            setModelname("TILClear")
        }
        // console.log("object");
    }
    else{
        setToolSelected("TILError");
        // console.log("object2");

    }
  },[TilActiveState])

  return (
    <Box
      mr="8px"
      w="28px"
      h="26px"
      style={{ position: "relative", display: "inline-block", }}
    >
      <Tooltip
        label={<TooltipLabel heading="AI Models" />}
        aria-label="TIL"
        placement="bottom"
        openDelay={0}
        bg="#E4E5E8"
        color="rgba(89, 89, 89, 1)"
        fontSize="14px"
        fontFamily="inter"
        hasArrow
        borderRadius="0px"
        size="20px"
      >
        <IconButton
          width={ifScreenlessthan1536px ? "30px" : "30px"}
          size={ifScreenlessthan1536px ? 60 : 0}
          height={ifScreenlessthan1536px ? "26px" : "27px"}
          icon={
            !TilHover ? (
              <BiTargetLock size={IconSize()} color="#151C25" />
            ) : (
              <ImTarget size={IconSize()} color="#3b5d7c" />
            )
          }
          _active={{
            bgColor: "rgba(228, 229, 232, 1)",
            outline: "0.5px solid rgba(0, 21, 63, 1)",
          }}
          outline={TilHover ? " 0.5px solid rgba(0, 21, 63, 1)" : ""}
          _focus={{
            border: "none",
          }}
          backgroundColor={!TilHover ? "#F8F8F5" : "#E4E5E8"}
          mr="7px"
          borderRadius={0}
          onClick={() => setTilHover(!TilHover)}
          _hover={{ bgColor: "rgba(228, 229, 232, 1)" }}
        />
      </Tooltip>
      {TilHover && (
        <Box
          style={{
            position: "absolute",
            top: "170%",
            left: 0,
            width: "120px",
            backgroundColor: "#F5F5F5",
            borderTop: "none",
            padding: "5px 0",
          }}
        >
          <ul style={{ listStyleType: "none", margin: 0, padding: 0 }}>
            <li
              style={{
                padding: "5px",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "#3b5d7c";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "black";
              }}
              onClick={() => handleMorphometry()}
            >
              Morphometry
            </li>
            <li
              style={{
                padding: "5px",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "#3b5d7c";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "black";
              }}
              onClick={() => {
                setTilActiveState(TilActiveState + 1);
              }}
            >
              TILS
            </li>
            <li
              style={{
                padding: "5px",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "#3b5d7c";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "black";
              }}
              onClick={() => handleKI67()}
            >
              KI-67
            </li>
          </ul>
        </Box>
      )}
    </Box>
  );
};

export default AiModels;
