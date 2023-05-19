import { Input } from "@chakra-ui/react";
import React, { useEffect } from "react";
import _ from "lodash";

const TextType = ({
  question,
  handleChange,
  response,
  slideQna,
  isLastDisable,
}) => {
  useEffect(() => {
    if (!isLastDisable) return;
    handleChange({ questionId: question?.id });
  }, [isLastDisable]);

  return isLastDisable ? null : (
    <Input
      name={question?.id}
      value={
        !_.isEmpty(response)
          ? response[question?.id]?.choiceText
          : slideQna?.response?.[question?.id]?.choiceText ?? ""
      }
      isDisabled={!_.isEmpty(response)}
      border="none"
      borderBottom="1px solid"
      borderRadius="none"
      _hover={{ borderBottom: "1px solid" }}
      _focus={{ border: "none", borderBottom: "1px solid" }}
      onChange={(e) =>
        handleChange({
          questionId: e.target.name,
          choiceText: e.target.value,
          choiceType: "text",
        })
      }
    />
  );
};

export default TextType;
