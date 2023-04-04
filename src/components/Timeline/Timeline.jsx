import { VStack, Box, Text, Badge, Circle, Flex, Avatar } from "@chakra-ui/react";
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
import "../../styles/VerticalTimelineElement.css"
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const Timeline = ({ timelineData }) => {
  console.log(timelineData);
  return (
    <ScrollBar>
      <Box>
        <VerticalTimeline
          layout="1-column-left"
          lineColor="#DEDEDE"
          animate={true}
          style={{
            fontWeight:"normal"
        }}
        >
          {timelineData.map((data, index) => {
            return data.type || data.type === "" ? (
              <VerticalTimelineElement
                key={index}
                className="vertical-timeline-element"
                style={{
                    fontWeight:"normal"
                }}
                contentStyle={{
                  background: "white",
                  color: "black",
                  fontWeight:"normal",
                  boxShadow: "none ",
                  width: "100%",
                  marginBottom:"0px",
                  fontSize:"4px",
                  overflowY: "scroll",
                  padding: "0px",
                  marginLeft: "40px",
                  height: "115px",
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
                {data?.type === "textbox" ? (
                 <Flex flexDirection="column">
                 <Flex justifyContent="flex-start" alignItems="center">
                 <Avatar mt="15px" mr="5px" size="xs" />
                 <Text fontWeight="name-user">{data.createdBy}</Text>
                 </Flex>
                  <Text className="detail">Added a comment</Text>
                </Flex>
                ) : (
                  <Flex flexDirection="column">
                   <Flex justifyContent="flex-start" alignItems="center">
                   <Avatar mt="15px" mr="5px" size="xs" />
                   <Text fontWeight="name-user"> Dr. {data.createdBy}</Text>
                   </Flex>
                    <Text className="detail">Marked an annotation</Text>
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
