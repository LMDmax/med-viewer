import React from "react";
import { Text, HStack, VStack, Icon } from "@chakra-ui/react";
import moment from "moment";
import { BsDot } from "react-icons/bs";

const BasicInfo = ({ project }) => {
  return (
    <VStack
      alignItems="flex-start"
      fontFamily="roboto"
      fontSize="14px"
      p="30px 16px 25px 18px"
      bgColor="#ECECEC"
    >
      <HStack>
        <Text fontWeight="500">{project?.slideType}</Text>
        <Text fontWeight="500">{project?.type}</Text>
      </HStack>
      <Text fontSize="16px">{project?.name}</Text>
      <HStack>
        <Text fontSize="12px">
          {moment(project?.createdAt)
            .utcOffset("+05:30")
            .format("MM/DD/YYYY, hh:mm a")}{" "}
          IST
        </Text>
        <Icon as={BsDot} />
        <Text fontSize="12px">
          {`${project?.owner?.firstName} ${project?.owner?.lastName}`}
        </Text>
      </HStack>
      <Text>{project?.description}</Text>
    </VStack>
  );
};

export default BasicInfo;
