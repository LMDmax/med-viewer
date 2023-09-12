import React from "react";
import { Divider, Text } from "@chakra-ui/react";
import { Scrollbars } from "react-custom-scrollbars";
import AnswersPreview from "./answersPreview";
import Questionnaire from "../Qna/questionnaire";
import "../../styles/scrollBar.css";
import _ from "lodash";

const MultiViewerQuestions = ({
  questionnaire,
  response,
  slideType,
  slideQna,
  setSlideQna,
}) => {
  return (
    <Scrollbars
      style={{ width: "100%", height: "79vh" }}
      renderThumbVertical={(props) => (
        <div {...props} className="thumb-vertical-messageBox" />
      )}
    >
      <Text mb={3} fontSize="lg">
        {slideType}
      </Text>
      <Divider />
      <Questionnaire
        direction="column"
        questions={questionnaire?.questions}
        response={response}
        slideQna={slideQna}
        slideType={slideType}
        setSlideQna={setSlideQna}
      />
    </Scrollbars>
  );
};

export default MultiViewerQuestions;
