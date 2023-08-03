import React from "react";

import CheckboxType from "./checkboxType";
import RadioType from "./radioType";
import TextType from "./textType";

function QuestionType({ question, response, setQnaResponse, slideQna }) {
	const handleChange = ({ questionId, choice, choiceType = null }) => {
		setQnaResponse({ questionId, choice: [choice], choiceType });
	};

	if (question?.Question?.questionType === "multiple-choice")
		return (
			<RadioType
				question={question}
				response={response}
				handleChange={handleChange}
				slideQna={slideQna}
				// setQnaResponse={setQnaResponse}
			/>
		);
	if (
		question?.Question?.questionType === "one-word" ||
		question?.Question?.questionType === "text"
	)
		return (
			<TextType
				question={question}
				response={response}
				handleChange={handleChange}
				slideQna={slideQna}
				// setQnaResponse={setQnaResponse}
			/>
		);
	if (question?.Question?.questionType === "checkbox")
		return (
			<CheckboxType
				question={question}
				response={response}
				setQnaResponse={setQnaResponse}
				slideQna={slideQna}
				handleChange={handleChange}
			/>
		);
	return null;
}

export default QuestionType;
