import React from "react";
import { Flex, Text } from "@chakra-ui/react";

function TooltipLabel({ heading, paragraph }) {
	return (
		<Flex direction="column" color="#000" fontSize="12px" maxW="160px">
			<Text fontSize="12px" fontWeight="600">
				{heading}
			</Text>
			<Text mt="5px">{paragraph}</Text>
		</Flex>
	);
}

export default TooltipLabel;
