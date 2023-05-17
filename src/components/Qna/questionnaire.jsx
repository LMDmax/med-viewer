import React from "react";

import { Box, Stack, Text, VStack } from "@chakra-ui/react";
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
	...restProps
}) {
	console.log(questions);
	const setQnaResponse = ({
		questionId = null,
		choice = null,
		choiceType = null,
	}) => {
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
			{questions?.map((question, index) => (
				<Stack
					key={question?.Question?.id ? question?.Question?.id : index}
					direction={direction}
					spacing={4}
					mt="15px"
				>
					<Text
						// whiteSpace="nowrap"
						// fontSize="14px"
						color={
							question?.question?.Question?.id ===
							questions[1]?.question?.Question?.id
						}
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
					{response && <Text>Your response: {response[index]?.response}</Text>}
				</Stack>
			))}
		</VStack>
	);
}

export default Questionnaire;
