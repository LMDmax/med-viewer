import React from "react";
import PropTypes from "prop-types";
import {
  Link,
  Heading,
  VStack,
  Wrap,
  WrapItem,
  useColorModeValue,
} from "@chakra-ui/react";
import FontFaceObserver from "fontfaceobserver";
import { useFabricOverlayState } from "../../state/store";

export const fonts = [
  {
    id: "timesNewRoman",
    fontFamily: "Times New Roman",
  },
  {
    id: "verdana",
    fontFamily: "Verdana",
  },
  {
    id: "georgia",
    fontFamily: "Georgia",
  },
  {
    id: "courierNew",
    fontFamily: "Courier New",
  },
  {
    id: "brushScript",
    fontFamily: "Brush Script MT",
  },
  {
    id: "garamond",
    fontFamily: "Garamond",
  },
];

const TypeTextFontPicker = ({ viewerId, activeFont, handleFontChange }) => {
  const { fabricOverlayState } = useFabricOverlayState();
  const { fabricOverlay } = fabricOverlayState?.viewerWindow[viewerId];

  const activeClasses = {
    borderColor: useColorModeValue("gray.300", "white"),
    borderWidth: "2px",
  };

  const handleFontClick = (font) => {
    handleFontChange(font);
  };

  const loadAndUse = (font) => {
    const canvas = fabricOverlay.fabricCanvas();
    const activeObject = canvas.getActiveObject();

    if (!activeObject) {
      return;
    }

    const myfont = new FontFaceObserver(font);
    myfont
      .load()
      .then(function () {
        // when font is loaded, use it.
        canvas.getActiveObject().set("fontFamily", font);
        canvas.requestRenderAll();
      })
      .catch(function (e) {
        console.error(e);
      });
  };

  return (
    <>
      <Heading as="h2" size="sm" mb={3}>
        Fonts
      </Heading>
      <VStack spacing={3}>
        <Wrap direction="column" justify="flex-start">
          {fonts.map((font) => (
            <WrapItem key={font.id}>
              <Link
                fontFamily={font.fontFamily}
                id={font.id}
                onClick={() => handleFontClick(font)}
                fontSize="15px"
                w="250px"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                borderWidth="1px"
                p={3}
                borderRadius={8}
                {...(activeFont &&
                  activeFont.id === font.id && { ...activeClasses })}
              >
                {font.fontFamily}
              </Link>
            </WrapItem>
          ))}
        </Wrap>
      </VStack>
    </>
  );
};

TypeTextFontPicker.propTypes = {
  activeFont: PropTypes.object,
  handleFontChange: PropTypes.func,
};

export default TypeTextFontPicker;
