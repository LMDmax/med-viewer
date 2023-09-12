import React from "react";
import { Flex, Text, HStack, VStack, useMediaQuery } from "@chakra-ui/react";
import moment from "moment";
import { Scrollbars } from "react-custom-scrollbars";
import Loading from "../Loading/loading";
import DetailsCard from "../Studies/detailsCard";
import "../../styles/scrollBar.css";

const Studies2 = ({ caseInfo, onGetSlideInfo }) => {
  const [ifWidthLessthan1920] = useMediaQuery("(max-width:1920px)");

  const uplodadDate = onGetSlideInfo.updatedAt;
  const CreatedDate = onGetSlideInfo.updatedAt;
  const formattedDate = new Date(uplodadDate)
    .toLocaleDateString()
    .split("/")
    .join("/");
  const formattedDate2 = new Date(CreatedDate)
    .toLocaleDateString()
    .split("/")
    .join("/");
  // console.log(onGetSlideInfo);
  const imageDetails = {
    "Accession Id": onGetSlideInfo?.accessionId,
    Title: onGetSlideInfo?.originalName,
    "Slide Id": `${onGetSlideInfo.slideId}`,
    Location: "My Folder/Cases/203-11-22-22-UHID/SLIDE 1",
    Size: "100 mb",
    Dimension: "1280 x 720 px",
    Resolution: "148 dpi",
    Scanner: "NanoZoomer S360",
    "Uploaded At": formattedDate,
    "Uploaded By": `${caseInfo.firstName}`,
  };

  return caseInfo ? (
    <Scrollbars
      style={{
        width: "450px",
        height: "82vh",
        borderWidth: "0px",
      }}
      renderThumbVertical={(props) => (
        <div {...props} className="thumb-vertical" />
      )}
      autoHide
    >
      <Flex
        background="none"
        direction="column"
        w="88%"
        h="100%"
        pb="12px"
        // pt="5px"
      >
        <HStack
          background="white"
          position="fixed"
          h="2.5em"
          w="340px"
          align="center"
          px="18px"
        >
          <Text
            fontWeight="400"
            fontSize="14px"
            lineHeight="17px"
            letterSpacing="0.0025em"
            color="#3B5D7C"
          >
            Information
          </Text>
        </HStack>
        <DetailsCard
          cardTitle="Image details"
          details={imageDetails}
          mt="2.8em"
          pb="20px"
        />
      </Flex>
    </Scrollbars>
  ) : (
    <Loading />
  );
};

export default Studies2;
