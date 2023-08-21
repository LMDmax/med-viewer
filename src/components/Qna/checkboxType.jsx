import React from "react";

import { Stack, Checkbox, CheckboxGroup, Text } from "@chakra-ui/react";
import _ from "lodash";

function CheckboxType({ question, response, setQnaResponse, application }) {
	const handleChange = (value = []) => {
		// console.log(value);
		const choiceText = [];
		if (value.length > 0 && application === "education"){
			question?.Question?.choices.forEach((choice) => {
				if (value.includes(choice)) choiceText.push(choice);
			});
		setQnaResponse({
			questionId: question?.Question?.id,
			choice: choiceText,
		});
		}
		else if(value.length > 0 && application === "clinical"){
			question?.choices.forEach((choice) => {
				if (value.includes(choice)) choiceText.push(choice);
			});
		setQnaResponse({
			questionId: question?.question_id,
			choice: choiceText,
		});
		}

	};

	// console.log("QUESTION", question)

	return application === "education" ? (
		<CheckboxGroup
			name={question?.Question?.id}
			defaultValue={
				!_.isEmpty(response)
					? response[question?.Question?.id]?.choiceId
					: question?.Question?.correctAnswer &&
					  question?.Question?.correctAnswer
			}
			isDisabled={
				!_.isEmpty(response) || question?.Question?.correctAnswer
			}
			ml="10px"
			onChange={handleChange}
		>
			<Stack spacing={4} wrap="wrap" fontSize="12px" fontFamily="inter">
				{question?.Question?.choices?.map((choice, index) => (
					<Checkbox
						borderColor="#000"
						key={`${index + 1}`}
						value={choice}
						checked
					>
						<Text
							wordBreak="break-word"
							whiteSpace="pre-wrap"
							maxWidth="100%"
							overflowWrap="break-word"
						>
							{choice}
						</Text>
					</Checkbox>
				))}
			</Stack>
		</CheckboxGroup>
	) :	<CheckboxGroup
	name={question?.question_id}
	ml="10px"
	onChange={handleChange}
>
	<Stack spacing={4} wrap="wrap" fontSize="12px" fontFamily="inter">
		{question?.choices?.map((choice, index) => (
			<Checkbox
				borderColor="#000"
				key={`${index + 1}`}
				value={choice}
				checked
			>
				<Text
					wordBreak="break-word"
					whiteSpace="pre-wrap"
					maxWidth="100%"
					overflowWrap="break-word"
				>
					{choice}
				</Text>
			</Checkbox>
		))}
	</Stack>
</CheckboxGroup>;
}

export default CheckboxType;
