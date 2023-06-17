import React from "react";

import { Box, Icon, Text, HStack, VStack, Spacer } from "@chakra-ui/react";
// import ProgressBar from "@ramonak/react-progress-bar";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

import Loading from "../Loading/loading";

function StudyAction({ projects }) {
	return (
		<>
			{!projects ? (
				<Loading />
			) : (
				<Box backgroundColor="#ECECEC" p="0px">
					{/* <VStack alignItems="flex-start" ml="16px">
            <HStack fontFamily="roboto" fontSize="14px" mt="20px" mb="10px">
              <Text>Projects</Text>
              <Icon as={MdOutlineKeyboardArrowRight} />
              <Text fontWeight="500">Projects titles</Text>
            </HStack>
            <Box overflow="auto" minW="95%">
              {projects?.map((project) => {
                return (
                  <HStack
                    py="10px"
                    px="5px"
                    minW="100%"
                    borderBottom="1px solid #000"
                    _hover={{ bg: "#F8F8F5" }}
                  >
                    <Text fontFamily="roboto" fontSize="14px">
                      {project.name}
                    </Text>
                    <Spacer />
                    <ProgressBar
                      completed={project.totalResponses}
                      maxCompleted={
                        project.cases.length * (project.members.length + 1)
                      }
                      customLabel={`${project.totalResponses}/${
                        project.cases.length * (project.members.length + 1)
                      }`}
                      isLabelVisible={project.totalResponses > 0}
                      bgColor="#0784E4"
                      baseBgColor="#7ABCEF"
                      labelSize="12px"
                      width="162px"
                      height="24px"
                      className="dashboard__project__progressbar"
                    />
                  </HStack>
                );
              })}
            </Box>
          </VStack> */}
				</Box>
			)}
		</>
	);
}

export default StudyAction;
