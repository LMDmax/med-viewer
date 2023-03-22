import React, { useState, useEffect, useRef } from "react";

import { Flex, useMediaQuery } from "@chakra-ui/react";
import PropTypes from "prop-types";

import AdjustmentBar from "../AdjustmentBar/adjustmentBar";
import ChatFeed from "../Feed/ChatFeed";
import SlideFeed from "../Feed/feed";
import TILFeedBar from "../Feed/TILFeedBar";
import ProgressBar from "../Loading/ProgressBar";
import Navigator from "../Navigator/navigator";
import ViewerFactory from "../Viewer/viewerFactory";
import LayoutAppBody from "./body";
import LayoutInnerBody from "./innerbody";
import LayoutOuterBody from "./outerbody";
import LayoutAppSidebar from "./sidebar";

function LayoutApp({
	userInfo,
	caseInfo,
	slides,
	viewerIds,
	questionnaire,
	report,
	application,
	hitTil,
	annotations,
	enableAI,
	enableFilters,
	userIdToQuery,
	response,
	finalSubmitHandler,
	saveReport,
	saveSynopticReport,
	mediaUpload,
	slideInfo,
	clinicalStudy,
	questions,
	setSlideId,
	responseHandler,
	questionnaireResponse,
	getSynopticReport,
	client2,
	users,
	mentionUsers,
	Environment,
	updateSynopticReport,
	addUsersToCase,
	accessToken,
}) {
	// const { handleEvent } = useKeyboardEvents();

	const [sidebar, setSidebar] = useState(false);
	const [isNavigatorActive, setIsNavigatorActive] = useState(false);
	const [isMultiview, setIsMultiview] = useState(false);
	const [newHilData, setNewHilData] = useState(false);
	const [refreshHil, setRefreshHil] = useState(0);
	const [hideModification, setHideModification] = useState(false);
	const [totalCells, setTotalCells] = useState(0);
	const [tilScore, setTilScore] = useState();
	const [tumorArea, setTumorArea] = useState();
	const [stromaArea, setStromaArea] = useState();
	const [lymphocyteCount, setLymphocyteCount] = useState();

	const [ifBiggerScreen] = useMediaQuery("(min-width:1920px)");
	const [currentViewer, setCurrentViewer] = useState(
		viewerIds?.[0]?._id || viewerIds?.[0]?.slideId
	);
	// console.log('slideInfo',refreshHil);
	const [showAnnotationsBar, setShowAnnotationsBar] = useState(false);
	const [showFeedBar, setShowFeedBar] = useState(false);
	const [chatFeedBar, setChatFeedBar] = useState(false);
	const [tILFedBar, setTILFedBar] = useState(false);
	const [showReport, setShowReport] = useState(false);
	const [feedTab, setFeedBar] = useState(0);
	const [pathStroma, setPathStroma] = useState(null);
	const [synopticType, setSynopticType] = useState("");
	const [chatHover, setChatHover] = useState(false);
	const [hideTumor, setHideTumor] = useState(false);
	const [hideStroma, setHideStroma] = useState(false);
	const [hideLymphocyte, setHideLymphocyte] = useState(false);
	const [annotationObject, setAnnotationObject] = useState("");

	// xml annotations check
	const [isXmlAnnotations, setIsXmlAnnotations] = useState(false);
	const [loadUI, setLoadUI] = useState(true);

	const showSidebar = () => {
		setSidebar(!sidebar);
	};

	const handleFeedBar = () => {
		setShowFeedBar(true);
		setFeedBar(0);
	};
	const handleChatFeedbar = () => {
		setChatFeedBar(true);
		setChatHover(!chatHover);
	};
	const handleTILFeedBar = () => {
		setTILFedBar(true);
	};
	const handleFeedBarClose = () => {
		setShowFeedBar(false);
		setChatFeedBar(false);
		setTILFedBar(false);
	};
	const handleChatFeedBarClose = () => {
		setChatFeedBar(false);
		setChatHover(false);
	};
	const handleReport = () => {
		setShowReport(true);
	};
	const handleAnnotationBar = () => {
		setShowAnnotationsBar(!showAnnotationsBar);
		setShowFeedBar(true);
		setFeedBar(1);
	};
	const handleAnnotationClick = (annotation) => {
		setAnnotationObject(annotation);
		setShowFeedBar(true);
		setFeedBar(1);
	};
	return (
		<Flex
			h={ifBiggerScreen ? "calc(100vh - 5.5vh)" : "calc(100vh - 44px)"}
			direction="column"
		>
			<LayoutOuterBody>
				{!loadUI === true ? <ProgressBar /> : null}
				<AdjustmentBar
					userInfo={userInfo}
					hideStroma={hideStroma}
					hideTumor={hideTumor}
					hideLymphocyte={hideLymphocyte}
					caseInfo={caseInfo}
					loadUI={loadUI}
					setLoadUI={setLoadUI}
					refreshHil={refreshHil}
					pathStroma={pathStroma}
					hitTil={hitTil}
					setTumorArea={setTumorArea}
					setTilScore={setTilScore}
					setStromaArea={setStromaArea}
					setLymphocyteCount={setLymphocyteCount}
					slide={viewerIds?.[0]}
					slides={slides}
					annotations={annotations}
					hideModification={hideModification}
					report={report}
					enableAI={enableAI}
					enableFilters={enableFilters}
					application={application}
					tILFedBar={tILFedBar}
					setNewHilData={setNewHilData}
					setChatHover={setChatHover}
					chatHover={chatHover}
					currentViewer={currentViewer}
					showSidebar={() => showSidebar()}
					sidebar={sidebar}
					setTotalCells={setTotalCells}
					isNavigatorActive={isNavigatorActive}
					setIsNavigatorActive={setIsNavigatorActive}
					isMultiview={isMultiview}
					setIsMultiview={setIsMultiview}
					handleAnnotationBar={handleAnnotationBar}
					saveReport={saveReport}
					saveSynopticReport={saveSynopticReport}
					mediaUpload={mediaUpload}
					slideInfo={slideInfo}
					handleFeedBar={handleFeedBar}
					handleChatFeedbar={handleChatFeedbar}
					handleChatFeedBarClose={handleChatFeedBarClose}
					handleTILFeedBar={handleTILFeedBar}
					handleReport={handleReport}
					synopticType={synopticType}
					setSynopticType={setSynopticType}
					showReport={showReport}
					setShowReport={setShowReport}
					clinicalStudy={clinicalStudy}
					questions={questions}
					app={application}
					viewerIds={viewerIds}
					setSlideId={setSlideId}
					responseHandler={responseHandler}
					questionnaireResponse={questionnaireResponse}
					getSynopticReport={getSynopticReport}
					updateSynopticReport={updateSynopticReport}
					isXmlAnnotations={isXmlAnnotations}
				/>

				{isNavigatorActive && (
					<Navigator
						caseInfo={caseInfo}
						slides={slides}
						viewerId={currentViewer}
						isActive={isNavigatorActive}
						setIsNavigatorActive={setIsNavigatorActive}
					/>
				)}
				{isMultiview && (
					<Navigator
						caseInfo={caseInfo}
						slides={slides}
						viewerId={currentViewer}
						isActive={isMultiview}
						isMultiview={isMultiview}
						setIsMultiview={setIsMultiview}
					/>
				)}
				<LayoutInnerBody>
					{sidebar ? (
						<LayoutAppSidebar
							caseInfo={caseInfo}
							questionnaire={questionnaire}
							annotations={annotations}
							report={report}
							viewerIds={viewerIds}
							userIdToQuery={userIdToQuery}
							userInfo={userInfo}
							finalSubmitHandler={finalSubmitHandler}
							response={response}
							currentViewer={currentViewer}
							setSidebar={setSidebar}
						/>
					) : null}
					{showFeedBar ? (
						<SlideFeed
							viewerId={currentViewer}
							showFeedBar={showFeedBar}
							handleFeedBarClose={handleFeedBarClose}
							showReport={showReport}
							feedTab={feedTab}
							synopticType={synopticType}
							isXmlAnnotations={isXmlAnnotations}
							annotationObject={annotationObject}
						/>
					) : null}
					{chatFeedBar ? (
						<ChatFeed
							viewerId={currentViewer}
							chatFeedBar={chatFeedBar}
							handleChatFeedBarClose={handleChatFeedBarClose}
							showReport={showReport}
							feedTab={feedTab}
							userInfo={userInfo}
							caseInfo={caseInfo}
							synopticType={synopticType}
							application={application}
							app={application}
							users={users}
							client2={client2}
							mentionUsers={mentionUsers}
							Environment={Environment}
							addUsersToCase={addUsersToCase}
						/>
					) : null}
					{tILFedBar ? (
						<TILFeedBar
							viewerId={currentViewer}
							hideTumor={hideTumor}
							setHideTumor={setHideTumor}
							hideLymphocyte={hideLymphocyte}
							setHideLymphocyte={setHideLymphocyte}
							setHideStroma={setHideStroma}
							hideStroma={hideStroma}
							chatFeedBar={chatFeedBar}
							setHideModification={setHideModification}
							hideModification={hideModification}
							handleFeedBarClose={handleFeedBarClose}
							showReport={showReport}
							setRefreshHil={setRefreshHil}
							setLoadUI={setLoadUI}
							refreshHil={refreshHil}
							tumorArea={tumorArea}
							stromaArea={stromaArea}
							tilScore={tilScore}
							lymphocyteCount={lymphocyteCount}
							feedTab={feedTab}
							newHilData={newHilData}
							setPathStroma={setPathStroma}
							pathStroma={pathStroma}
							userInfo={userInfo}
							caseInfo={caseInfo}
							synopticType={synopticType}
							application={application}
							app={application}
							showFeedBar={showFeedBar}
							users={users}
							client2={client2}
							mentionUsers={mentionUsers}
							Environment={Environment}
						/>
					) : null}
					<LayoutAppBody>
						<ViewerFactory
							application={application}
							enableAI={enableAI}
							caseInfo={caseInfo}
							userInfo={userInfo}
							slide={viewerIds?.[0]}
							slides={slides}
							setCurrentViewer={setCurrentViewer}
							client2={client2}
							setLoadUI={setLoadUI}
							mentionUsers={mentionUsers}
							addUsersToCase={addUsersToCase}
							Environment={Environment}
							accessToken={accessToken}
							setIsXmlAnnotations={setIsXmlAnnotations}
							handleAnnotationClick={handleAnnotationClick}
						/>
					</LayoutAppBody>
				</LayoutInnerBody>
			</LayoutOuterBody>
		</Flex>
	);
}

LayoutApp.propTypes = {
	finalSubmitHandler: PropTypes.func,
};

export default LayoutApp;
