import React from "react";

import CheckboxType from "./checkboxType";
import RadioType from "./radioType";
import TextType from "./textType";

function QuestionType({
  question,
  response,
  setQnaResponse,
  slideQna,
  application,
}) {
  const questionText = question?.question_text;
  const handleChange = ({ questionId, choice, choiceType = null,  }) => {
    setQnaResponse({ questionId, choice: [choice], choiceType, questionText });
  };

  if (
    question?.Question?.questionType === "multiple-choice" ||
    question?.question_type === "Multiple Choice"
  )
    return (
      <RadioType
        question={question}
        response={response}
        handleChange={handleChange}
        slideQna={slideQna}
        application={application}
        // setQnaResponse={setQnaResponse}
      />
    );
  if (
    question?.Question?.questionType === "one-word" ||
    question?.Question?.questionType === "text" ||
    question?.question_type === "text"
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
  if (
    question?.Question?.questionType === "checkbox" ||
    question?.question_type === "Checkbox"
  )
    return (
      <CheckboxType
        question={question}
        response={response}
        setQnaResponse={setQnaResponse}
        slideQna={slideQna}
        handleChange={handleChange}
        application={application}
      />
    );
  return null;
}

export default QuestionType;
