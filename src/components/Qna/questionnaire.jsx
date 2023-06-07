import { Box, Flex, Stack, Text, VStack } from "@chakra-ui/react";
import _ from "lodash";
import React from "react";
import QuestionType from "./questionType";

function Questionnaire({
	direction,
	questions,
	slidetype,
	response,
	slideQna,
	setSlideQna,
	projectQnaType,
	...restProps
}) {
	const setQnaResponse = ({ questionId = null, choice = null, choiceType }) => {
		setSlideQna((state) => {
			const { qna } = state;
			const newQna = { ...qna, [questionId]: { questionId, choice } };
			return { qna: newQna };
		});
	};
	return (
		<VStack
			spacing={6}
			m="10px"
			mt="0px"
			align="flex-start"
			{...restProps}
			bgColor="#fff"
			h="100%"
			fontFamily="inter"
			fontSize="14px"
			px="10px"
		>
			{questions[0].LessonQuestions?.map((question, index) => {
				// console.log(response?.responses[index + 1]?.Question?.correctAnswer[0]);
				return (
					<Stack
						key={question?.Question?.id ? question?.Question?.id : index}
						direction={direction}
						spacing={4}
						mt="15px"
					>
						<Text
							// whiteSpace="nowrap"
							// fontSize="14px"
							color={question?.Question?.id === questions[1]?.questionId}
						>{`Q${index + 1}: ${question?.Question?.questionText}`}</Text>
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
								{response?.responses[index + 1]?.Question?.correctAnswer[0]}
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
