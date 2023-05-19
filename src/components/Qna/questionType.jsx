import React from "react";
import RadioType from "./radioType";
import TextType from "./textType";
import CheckboxType from "./checkboxType";

function QuestionType({ question, response, setQnaResponse, slideQna }) {
	const handleChange = ({ questionId, choice }) => {
		setQnaResponse({ questionId, choice });
	};

	if (question?.questionType === "multiple-choice")
		return (
			<RadioType
				question={question}
				response={response}
				handleChange={handleChange}
				slideQna={slideQna}
				// setQnaResponse={setQnaResponse}
			/>
		);
	if (question?.questionType === "text")
		return (
			<TextType
				question={question}
				response={response}
				handleChange={handleChange}
				slideQna={slideQna}
				// setQnaResponse={setQnaResponse}
			/>
		);
	if (question?.questionType === "checkbox")
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
