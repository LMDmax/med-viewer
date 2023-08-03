import React, { useEffect } from "react";

import { RadioGroup, Stack, Radio } from "@chakra-ui/react";
import _ from "lodash";

function RadioType({ question, response, handleChange, slideQna }) {
	return (
		<RadioGroup
			name={question?.Question?.id}
			defaultValue={
				!_.isEmpty(response)
					? response[question?.Question?.id]?.choiceId
					: question?.Question?.correctAnswer &&
					  question?.Question?.correctAnswer[0]
			}
			isDisabled={!_.isEmpty(response) || question?.Question?.correctAnswer}
			ml="10px"
		>
			<Stack spacing={4} wrap="wrap" fontSize="12px" fontFamily="inter">
				{question?.Question?.choices?.map((choice, index) => (
					<Radio
						borderColor="#000"
						key={`${index + 1}`}
						value={choice}
						onChange={(e) => {
							handleChange({
								questionId: question?.Question?.id,
								choice: e.target.value,
							});
						}}
						checked
						borderWidth="thin"
					>
						{choice}
					</Radio>
				))}
			</Stack>
		</RadioGroup>
	);
}

export default RadioType;
