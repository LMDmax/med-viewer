import { RadioGroup, Stack, Radio } from "@chakra-ui/react";
import React, { useEffect } from "react";
import _ from "lodash";

const RadioType = ({ question, response, handleChange, slideQna }) => {
  return (
    <RadioGroup
      name={question?.question_id}
      defaultValue={
        !_.isEmpty(response) ? response[question?.question_id]?.choice_id : ""
      }
      isDisabled={!_.isEmpty(response)}
      ml="10px"
    >
      <Stack spacing={4} wrap="wrap" fontSize="12px" fontFamily="inter">
        {question?.choices?.map((choice, index) => (
          <Radio
            borderColor="#000"
            key={choice}
            value={choice}
            onChange={(e) =>
              handleChange({
                question_id: question?.question_id,
                choice: e.target.value,
              })
            }
            checked={true}
            borderWidth="thin"
          >
            {choice}
          </Radio>
        ))}
      </Stack>
    </RadioGroup>
  );
};

export default RadioType;
