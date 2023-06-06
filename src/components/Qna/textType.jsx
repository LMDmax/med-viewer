import React, { useEffect } from "react";

import { Input } from "@chakra-ui/react";
import _ from "lodash";

function TextType({
	question,
	handleChange,
	response,
	slideQna,
	isLastDisable,
}) {
	useEffect(() => {
		if (!isLastDisable) return;
		handleChange({ questionId: question?.Question?.id });
	}, [isLastDisable]);

	return isLastDisable ? null : (
		<Input
			name={question?.Question?.id}
			// value={
			// 	!_.isEmpty(response)
			// 		? response[question?.Question?.id]?.choiceText
			// 		: slideQna?.response?.[question?.Question?.id]?.choiceText ?? ""
			// }
			isDisabled={!_.isEmpty(response)}
			border="none"
			borderBottom="1px solid"
			borderRadius="none"
			_hover={{ borderBottom: "1px solid" }}
			_focus={{ border: "none", borderBottom: "1px solid" }}
			onChange={(e) =>
				handleChange({
					questionId: e.target.name,
					choice: [`${e.target.value}`],
					choiceType: "text",
				})
			}
		/>
	);
}

export default TextType;
