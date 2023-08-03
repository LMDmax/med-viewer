import React from "react";

import { Stack, Checkbox, CheckboxGroup } from "@chakra-ui/react";
import _ from "lodash";

function CheckboxType({ question, response, setQnaResponse, slideQna }) {
	const handleChange = (value = []) => {
		const choiceText = [];
		if (value.length > 0)
			question?.Question?.choices.forEach((choice) => {
				if (value.includes(choice)) choiceText.push(choice);
			});
		setQnaResponse({
			questionId: question?.Question?.id,
			choice: choiceText,
		});
	};

	return (
		<CheckboxGroup
			name={question?.Question?.id}
			defaultValue={
				!_.isEmpty(response)
					? response[question?.Question?.id]?.choiceId
					: question?.Question?.correctAnswer &&
					  question?.Question?.correctAnswer
			}
			isDisabled={!_.isEmpty(response) || question?.Question?.correctAnswer}
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
						// borderWidth="thin"
						// onChange={(e) =>
						//   handleChange({
						//     question_id: question?.question_id,
						//     choice: e.target.value,
						//   })
						// }
					>
						{choice}
					</Checkbox>
				))}
			</Stack>
		</CheckboxGroup>
	);
}

export default CheckboxType;
