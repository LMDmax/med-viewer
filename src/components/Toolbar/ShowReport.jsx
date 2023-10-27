import React from "react";

import CLSReportHelper from "../CLSReport/CLSReportHelper";
import ReportHelper from "../Report/ReportHelper";

function ShowReport({
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
	handleReportsubmit,
	saveSynopticReport,
	questions,
	app,
	setSlideId,
	responseHandler,
	questionnaireResponse,
	synopticType,
	setSynopticType,
	getSynopticReport,
	updateSynopticReport,
	reportData,
	setReportData,
	handleReportData,
	handleUpload,
	annotedSlideImages,
	setAnnotedSlideImages,
	slideData,
	setSlideData,
	questionIndex,
	setIsOpen,
	sendReportDataToHospital,
}) {
	if (application === "hospital")
		return (
			<ReportHelper
				caseInfo={caseInfo}
				saveReport={saveReport}
				saveSynopticReport={saveSynopticReport}
				viewerId={viewerId}
				mediaUpload={mediaUpload}
				slideInfo={slideInfo}
				handleReport={handleReport}
				showReport={showReport}
				setShowReport={setShowReport}
				userInfo={userInfo}
				synopticType={synopticType}
				setSynopticType={setSynopticType}
				getSynopticReport={getSynopticReport}
				updateSynopticReport={updateSynopticReport}
				reportData={reportData}
				setReportData={setReportData}
				handleReportData={handleReportData}
				handleUpload={handleUpload}
				annotedSlideImages={annotedSlideImages}
				setAnnotedSlideImages={setAnnotedSlideImages}
				slideData={slideData}
				setSlideData={setSlideData}
				sendReportDataToHospital={sendReportDataToHospital}
			/>
		);

	if (application === "clinical" || application === "education")
		return (
			<CLSReportHelper
				questions={questions}
				caseInfo={caseInfo}
				userInfo={userInfo}
				application={application}
				responseHandler={responseHandler}
				viewerId={viewerId}
				app={app}
				setIsOpen={setIsOpen}
				setSlideId={setSlideId}
				questionnaireResponse={questionnaireResponse}
				questionIndex={questionIndex}
			/>
		);

	return null;
}

export default ShowReport;
