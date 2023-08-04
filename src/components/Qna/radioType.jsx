import React from "react";
import _ from "lodash";

function RadioType({ question, response, handleChange, slideQna }) {
  return (
    <div>
      {question?.Question?.choices?.map((choice, index) => (
        <label key={index + 1}>
          <input
            type="radio"
            name={question?.Question?.id}
            value={choice}
            checked={
              !_.isEmpty(response)
                ? response[question?.Question?.id]?.choiceId === choice
                : question?.Question?.correctAnswer &&
                  question?.Question?.correctAnswer[0] === choice
            }
            onChange={(e) => {
              handleChange({
                questionId: question?.Question?.id,
                choice: e.target.value,
              });
            }}
            disabled={
              !_.isEmpty(response) || question?.Question?.correctAnswer
            }
          />
          <span>{choice}</span>
        </label>
      ))}
    </div>
  );
}

export default RadioType;