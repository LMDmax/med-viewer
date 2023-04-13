import {
  VStack,
  Box,
  Text,
  Badge,
  Circle,
  Flex,
  Avatar,
} from "@chakra-ui/react";
import React from "react";
import { BsBorderWidth } from "react-icons/bs";
import { MdBorderColor } from "react-icons/md";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
// import "react-vertical-timeline-component/style.min.css";
import ScrollBar from "../ScrollBar";
import dayjs from "dayjs";
import "../../styles/VerticalTimelineElement.css";
import relativeTime from "dayjs/plugin/relativeTime";
import { useFabricOverlayState } from "../../state/store";
dayjs.extend(relativeTime);

const Timeline = ({ timelineData, viewerId }) => {
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { activeTool, viewerWindow } = fabricOverlayState;
  const { fabricOverlay } = viewerWindow[viewerId];
  // console.log(timelineData);
  const handleClick = (data) => {
    const canvas = fabricOverlay.fabricCanvas();
    const object = canvas.getObjectByHash(data.hash);
    if (object && object.selectable) {
      object.selectable = true;
      object.onSelect();
      canvas.setActiveObject(object);
      canvas.renderAll();
    }
  };
  // console.log(timelineData);
  return (
    <ScrollBar>
      <Box w="350px">
        <VerticalTimeline
          layout="1-column-left"
          lineColor="#DEDEDE"
          animate
          style={{
            fontWeight: "normal",
            display: timelineData.length > 0 ? "block" : "none",
          }}
        >
          {timelineData.map((data, index) => {
            return data.createdBy ? (
              <VerticalTimelineElement
                key={index}
                className="vertical-timeline-element"
                style={{
                  fontWeight: "normal",
                }}
                contentStyle={{
                  background: "white",
                  color: "black",
                  fontWeight: "normal",
                  boxShadow: "none ",
                  width: "100%",
                  marginBottom: "0px",
                  fontSize: "4px",
                  overflowY: "scroll",
                  padding: "0px",
                  marginLeft: "40px",
                  height: "fit-content",
                }}
                contentArrowStyle={{ display: "none" }}
                date={
                  <div
                    style={{
                      textAlign: "right",
                      width: "18vw",
                      position: "right",
                      color: "gray",
                    }}
                  >
                    {dayjs(data.createdAt).fromNow()}
                  </div>
                }
                iconStyle={{
                  top: "20px",
                  left: "10px",
                  background: "white",
                  boxShadow: "none",
                  border: "3px solid #DEDEDE",
                  width: "20px",
                  height: "20px",
                }}
                // icon={<WorkIcon />}
              >
                {data?.type === "textbox" && data?.createdBy ? (
                  <Flex flexDirection="column">
                    <Flex justifyContent="flex-start" alignItems="center">
                      <Avatar mt="15px" mr="5px" size="xs" />
                      <Text fontWeight="name-user">Dr. {data.createdBy}</Text>
                    </Flex>
                    <Text className="detail">
                      Added a comment{" "}
                      <span style={{ color: "#3f5f7e" }}>{data.text == "comment" ? "" : `"${data.text}"`}</span>
                    </Text>
                  </Flex>
                ) : (
                  <Flex flexDirection="column">
                    <Flex justifyContent="flex-start" alignItems="center">
                      <Avatar mt="15px" mr="5px" size="xs" />
                      <Text fontWeight="name-user"> Dr. {data.createdBy}</Text>
                    </Flex>
                    <Text className="detail">
                      Marked an {data.type} annotation
                    </Text>
                    <Text
                      className="detail"
                      cursor="pointer"
                      color="#3f5f7e"
                      onClick={() => {
                        handleClick(timelineData[index]);
                      }}
                    >
                      View Annotation
                    </Text>
                  </Flex>
                )}
              </VerticalTimelineElement>
            ) : null;
          })}
        </VerticalTimeline>
      </Box>
    </ScrollBar>
  );
};

export default Timeline;
