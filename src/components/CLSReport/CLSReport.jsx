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
	errorResponse,
}) {
	const [ifWidthLessthan1920] = useMediaQuery("(max-width:1920px)");
	console.log(questions);
	return (
		<Flex
			fontSize="12px"
			fontFamily="inter"
			w="100%"
			h={ifWidthLessthan1920 ? "calc(100vh - 90px)" : "90.926vh"}
			top={ifWidthLessthan1920 ? "90px" : "9.999vh"}
			pos="absolute"
			right="0px"
			bg="#FCFCFC"
			flexDirection="column"
			css={{
				"&::-webkit-scrollbar": {
					width: "0px",
				},
				"&::-webkit-scrollbar-track": {
					width: "0px",
					border: "1px solid #DEDEDE",
				},
				"&::-webkit-scrollbar-thumb": {
					background: "#DEDEDE",
				},
			}}
		>
			{/* {loading || isUpdating ? (
				<Flex
					w="100%"
					height="100%"
					alignItems="center"
					justifyContent="center"
				>
					<Spinner color="#3965C5" size="xl" thickness="4px" speed="0.65s" />
				</Flex>
			) : ( */}
			<>
				{questions === undefined ? (
					<Flex w="100%" h="100%" alignItems="center" justifyContent="center">
						{"No questions added"}
					</Flex>
				) : questions && errorResponse?.message?.includes("not publish yet") ? (
					<Flex w="100%" h="100%" alignItems="center" justifyContent="center">
						{"Result is not yet published"}
					</Flex>
				) : (
					<>
						<Flex w="100%" justifyContent="flex-end">
							<IconButton
								icon={<AiOutlineClose />}
								onClick={handleCLSReport}
								borderRadius="0"
								background="#fcfcfc"
								size="sm"
								_focus={{}}
							/>
						</Flex>
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
							errorResponse={errorResponse}
						/>
					</>
				)}
			</>
			{/* )} */}
		</Flex>
	);
}

export default CLSReport;
