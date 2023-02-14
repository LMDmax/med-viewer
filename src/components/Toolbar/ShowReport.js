import React from "react";
import CLSReportHelper from "../CLSReport/CLSReportHelper";
import ReportHelper from "../Report/ReportHelper";

const ShowReport = ({
  viewerId,
  application,
  caseInfo,
  userInfo,
  mediaUpload,
  slideInfo,
  handleReport,
  showReport,
  setShowReport,
  saveReport,
  questions,
  responseHandler,
  questionnaireResponse,
}) => {
  if (application === "hospital")
    return (
      <ReportHelper
        caseInfo={caseInfo}
        saveReport={saveReport}
        viewerId={viewerId}
        mediaUpload={mediaUpload}
        slideInfo={slideInfo}
        handleReport={handleReport}
        showReport={showReport}
        setShowReport={setShowReport}
        userInfo={userInfo}
      />
    );

  if (application === "clinical")
    return (
      <CLSReportHelper
        questions={questions}
        caseInfo={caseInfo}
        userInfo={userInfo}
        responseHandler={responseHandler}
        viewerId={viewerId}
        questionnaireResponse={questionnaireResponse}
      />
    );

  return null;
};

export default ShowReport;
