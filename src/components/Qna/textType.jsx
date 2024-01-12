import React, { useEffect } from "react";

import { Input } from "@chakra-ui/react";
import _ from "lodash";

function TextType({
  question,
  handleChange,
  response,
  slideQna,
  isLastDisable,
  clinicalResponse,
  edit_report,
}) {
  useEffect(() => {
    if (!isLastDisable) return;
    handleChange({ questionId: question?.Question?.id });
  }, [isLastDisable]);
  // console.log(slideQna);
  // console.log({ clinicalResponse });
  const cleanedClinicalResponse = clinicalResponse
    ?.replace(/[{"]+/g, "")
    ?.replace(/[}"]+/g, "");
  
    useEffect(() => {
      if (cleanedClinicalResponse) {
        handleChange({
          questionId: question?.question_id,
          choice: cleanedClinicalResponse,
        });
      }
    }, [cleanedClinicalResponse]);

  return (
    <Input
      name={question?.question_id}
      // value={
      // 	!_.isEmpty(response)
      // 		? response[question?.Question?.id]?.choiceText
      // 		: slideQna?.response?.[question?.Question?.id]?.choiceText ?? ""
      // }
      defaultValue={
        cleanedClinicalResponse? cleanedClinicalResponse : !_.isEmpty(response)
        ? response[question?.Question?.id]?.choiceId
        : question?.Question?.correctAnswer &&
          question?.Question?.correctAnswer
      }
      // isDisabled={(!_.isEmpty(response) || question?.Question?.correctAnswer) }
      border="1px solid black"
      borderRadius="none"
      w="250px"
      ml="40px"
      mt="10px"
      _hover={{ borderBottom: "1px solid" }}
      _focus={{ border: "none", border: "1px solid black" }}
      onChange={(e) =>
        handleChange({
          questionId: e.target.name,
          choice: e.target.value,
          choiceType: "text",
        })
      }
    />
  );
}

export default TextType;
