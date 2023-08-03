import React, { useEffect, useRef } from "react";

import { Box, Flex, Stack, Text, VStack } from "@chakra-ui/react";
import _ from "lodash";

import QuestionType from "./questionType";

function Questionnaire({
	direction,
	questions,
	slidetype,
	response,
	slideQna,
	setSlideQna,
	projectQnaType,
	questionIndex,
	slideId,
	...restProps
}) {
	// console.log("agjhhgsjhasj", questionIndex);
	const scrollRef = useRef(questionIndex);
	const setQnaResponse = ({ questionId = null, choice = null, choiceType }) => {
		setSlideQna((state) => {
			const { qna } = state;
			const newQna = { ...qna, [questionId]: { questionId, choice } };
			return { qna: newQna };
		});
	};
	useEffect(() => {
		if (questionIndex >= 0) {
			scrollRef.current.scrollIntoView({
				behavior: "smooth",
				block: "nearest",
				inline: "start",
			});
		}
	}, [questionIndex]);
	return (
		<VStack
			spacing={6}
			m="10px"
			mt="0px"
			align="flex-start"
			{...restProps}
			bgColor="#fcfcfc"
			overflowY="scroll"
			h="100%"
			w="100%"
			fontFamily="inter"
			fontSize="14px"
			px="10px"
			pb="20px"
		>
			{questions &&
				questions[0]?.LessonQuestions?.map((question, index) => {
					return (
						<Stack
							key={index}
							direction={direction}
							spacing={4}
							mt="15px"
							ref={scrollRef}
							w="100%"
							maxW="100%"
							pb="10px"
						>
							<Text
								wordBreak="break-word"
								whiteSpace="pre-wrap"
								maxWidth="100%"
								overflowWrap="break-word"
							>
								<span
								// style={{
								// 	border: index === questionIndex && "1px solid #000",
								// 	padding: index === questionIndex && "0.3rem 1rem",
								// 	borderRadius: index === questionIndex && "0% 50% 50% 0%",
								// }}
								>{`Q${index + 1}:`}</span>
								{` ${question?.Question?.questionText}`}
							</Text>
							{question?.Question?.referenceToSlides[0]?.slideData && (
								<Flex
									w="100%"
									maxW="100%"
									justifyContent="flex-end"
									mt="-0.5rem !important"
								>
									{question?.Question?.referenceToSlides[0]?.slideData
										?.toString()
										?.slice(
											1,
											question?.Question?.referenceToSlides[0]?.slideData?.lastIndexOf(
												"-"
											) - 1
										) === slideId ? (
										<Text color="#3B5D7C">Related to this slide</Text>
									) : (
										<Text color="#3B5D7C">
											{`Refer to slide ${question?.Question?.referenceToSlides[0]?.slideData
												?.toString()
												?.substring(
													question?.Question?.referenceToSlides[0]?.slideData?.lastIndexOf(
														"-"
													) + 1
												)}`}
										</Text>
									)}
								</Flex>
							)}
							{response ? null : (
								<Box>
									<QuestionType
										question={question}
										direction={direction}
										response={response}
										setQnaResponse={setQnaResponse}
										projectQnaType={projectQnaType}
										slideQna={slideQna}
									/>
								</Box>
							)}
							{response && (
								<Text>
									Your response:{" "}
									{response?.responses[index + 1]?.response
										? response?.responses[index + 1]?.response
										: "-"}
								</Text>
							)}
						</Stack>
					);
				})}
			{/* {questions[0].LessonQuestions?.map((question, index) => (
				
				
			))} */}
		</VStack>
	);
}

export default Questionnaire;
