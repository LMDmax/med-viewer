import React, { useEffect, useState } from "react";

import {
	Flex,
	IconButton,
	useMediaQuery,
	Text,
	Spinner,
} from "@chakra-ui/react";
import { AiOutlineClose } from "react-icons/ai";

import Questionnaire from "../Qna/questionnaire";

function CLSReport({
	questions,
	handleCLSReport,
	slideQna,
	setSlideQna,
	questionsResponse,
	loading,
	isUpdating,
	questionIndex,
	slideId,
}) {
	const [ifWidthLessthan1920] = useMediaQuery("(max-width:1920px)");

	return (
		<Flex
			fontSize="12px"
			fontFamily="inter"
			w="100%"
			h={ifWidthLessthan1920 ? "calc(100vh - 90px)" : "90.926vh"}
			top={ifWidthLessthan1920 ? "30px" : "9.999vh"}
			pos="absolute"
			right="0px"
			bg="#FCFCFC"
			flexDirection="column"
		>
			<>
				<Flex
					w="100%"
					justifyContent="center"
					alignItems="center"
					// h="4vh"
					minH="5vh"
					border="1px solid #000"
				>
					<Text fontSize="16px">Questions</Text>
				</Flex>

				<Questionnaire
					questions={questions}
					slideQna={slideQna}
					setSlideQna={setSlideQna}
					response={questionsResponse}
					questionIndex={questionIndex}
					slideId={slideId}
				/>
			</>
			{/* )} */}
		</Flex>
	);
}

export default CLSReport;
