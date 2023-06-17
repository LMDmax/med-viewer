import { Stack, Checkbox, CheckboxGroup } from "@chakra-ui/react";
import React from "react";
import _ from "lodash";

const CheckboxType = ({ question, response, setQnaResponse, slideQna }) => {
  const handleChange = (value = []) => {
    const choiceText = [];
    if (value.length > 0)
      question?.choices.forEach((choice) => {
        if (value.includes(choice)) choiceText.push(choice);
      });
    setQnaResponse({
      question_id: question?.question_id,
      choice: choiceText,
    });
  };

  return (
    <CheckboxGroup
      name={question?.question_id}
      defaultValue={
        !_.isEmpty(response) ? response[question?.question_id]?.choice_id : ""
      }
      isDisabled={!_.isEmpty(response)}
      ml="10px"
      onChange={handleChange}
    >
      <Stack spacing={4} wrap="wrap" fontSize="12px" fontFamily="inter">
        {question?.choices?.map((choice, index) => (
          <Checkbox
            borderColor="#000"
            key={choice}
            value={choice}
            checked={true}
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
};

export default CheckboxType;
