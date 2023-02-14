import React from "react";
import RadioType from "./radioType";
import TextType from "./textType";
import CheckboxType from "./checkboxType";

const QuestionType = ({ question, response, setQnaResponse, slideQna }) => {
  const handleChange = ({ question_id, choice }) => {
    setQnaResponse({ question_id, choice });
  };

  if (question?.question_type === "multiple choice")
    return (
      <RadioType
        question={question}
        response={response}
        handleChange={handleChange}
        slideQna={slideQna}
        // setQnaResponse={setQnaResponse}
      />
    );
  if (question?.question_type === "text")
    return (
      <TextType
        question={question}
        response={response}
        handleChange={handleChange}
        slideQna={slideQna}
        // setQnaResponse={setQnaResponse}
      />
    );
  if (question?.question_type === "checkbox")
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
};

export default QuestionType;
