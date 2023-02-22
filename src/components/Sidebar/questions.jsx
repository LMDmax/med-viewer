import React, { useState } from "react";
import { Divider, Text, Button } from "@chakra-ui/react";
import { Scrollbars } from "react-custom-scrollbars";
import AnswersPreview from "./answersPreview";
import Questionnaire from "../Qna/questionnaire";
import "../../styles/scrollBar.css";
import _ from "lodash";
import MultiViewerQuestions from "./multiviewerQuestions";

const Questions = ({
  userInfo,
  project,
  questionnaire,
  viewerIds,
  response,
  finalSubmitHandler,
}) => {
  const [question, setQuestion] = useState("first-slide");
  const [firstSlideQna, setFirstSlideQna] = useState({
    qna: {},
    response: {},
  });

  const [secondSlideQna, setSecondSlideQna] = useState({
    qna: {},
    response: {},
  });

  return (
    <>
      <>
        {project?.type === "multiSlide" ? (
          <>
            <Button
              onClick={() => {
                setQuestion("first-slide");
              }}
              width="50%"
              borderRadius="none"
              _focus={{ outline: "none" }}
              _hover={{ bgColor: "none" }}
              bgColor={question === "first-slide" ? "#E4E5E8" : "#F8F8F5"}
              borderBottom="1px solid #000"
              h="32px"
              borderLeft="1px solid #000"
              borderRight="1px solid #000"
              fontFamily="inter"
              fontSize="14px"
              fontWeight="400"
            >
              Left-Slide
            </Button>
            <Button
              onClick={() => {
                setQuestion("second-slide");
              }}
              width="50%"
              borderRadius="none"
              _focus={{ outline: "none" }}
              _hover={{ bgColor: "none" }}
              bgColor={question === "second-slide" ? "#E4E5E8" : "#F8F8F5"}
              borderBottom="1px solid #000"
              h="32px"
              borderRight="1px solid #000"
              fontFamily="inter"
              fontSize="14px"
              fontWeight="400"
            >
              Right-Slide
            </Button>
          </>
        ) : (
          ""
        )}
        {/*  */}
        {question === "first-slide" ? (
          <Scrollbars
            style={{ width: "100%", height: "79vh" }}
            renderThumbVertical={(props) => (
              <div {...props} className="thumb-vertical-messageBox" />
            )}
          >
            <Divider />
            {!response ? (
              <Text>...</Text>
            ) : (
              <Questionnaire
                direction="column"
                questions={questionnaire?.questions}
                response={response}
                slideQna={firstSlideQna}
                slideType={project?.slideType}
                setSlideQna={setFirstSlideQna}
              />
            )}
          </Scrollbars>
        ) : (
          <MultiViewerQuestions
            questionnaire={questionnaire}
            response={response}
            slideQna={secondSlideQna}
            setSlideQna={setSecondSlideQna}
          />
        )}
      </>
      {_.isEmpty(response) && (
        <AnswersPreview
          userInfo={userInfo}
          project={project}
          questionnaire={questionnaire}
          firstSlideQna={firstSlideQna}
          secondSlideQna={secondSlideQna}
          viewerIds={viewerIds}
          finalSubmitHandler={finalSubmitHandler}
        />
      )}
    </>
  );
};

export default Questions;
