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
  const handleChange = ({ questionId, choice, choiceType = null }) => {
    setQnaResponse({ questionId, choice: [choice], choiceType });
  };

  console.log(application)

  if (
    question?.Question?.questionType === "multiple-choice" ||
    question?.question_type === "multiple choice"
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
  if (
    question?.Question?.questionType === "checkbox" ||
    question?.question_type === "checkbox"
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
