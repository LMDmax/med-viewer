import React from "react";
import { Box, Divider, HStack } from "@chakra-ui/react";
import ActivityFeed from "../Feed/activityFeed";
import "../../styles/viewer.css";
import SaveAnnotations from "../Annotations/saveAnnotations";
import LoadAnnotations from "../Annotations/loadAnnotations";

const Annotations = ({
  userInfo,
  currentViewer,
  saveAnnotationsHandler,
  loadAnnotationsHandler,
  handlePopup,
  popup,
}) => {
  return (
    <Box className="annotations_box">
      <Divider />
      <Box w="100%">
        <Box h="75vh" mt="5px" mb="10px" backgroundColor="#E5E5E550">
          <ActivityFeed userInfo={userInfo} viewerId={currentViewer} />
          <HStack
            my={6}
            justify="center"
            spacing={10}
            alignContent="flex-start"
            ml="-20px"
          >
            <SaveAnnotations
              viewerId={currentViewer}
              saveAnnotationsHandler={saveAnnotationsHandler}
            />
            {loadAnnotationsHandler ? (
              <LoadAnnotations
                viewerId={currentViewer}
                userInfo={userInfo}
                loadAnnotationsHandler={loadAnnotationsHandler}
              />
            ) : null}
          </HStack>
        </Box>
      </Box>
    </Box>
  );
};

export default Annotations;
