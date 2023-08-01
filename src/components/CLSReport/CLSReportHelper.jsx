import React, { useState, useEffect } from "react";

import { Button, Tooltip, useToast, Flex, IconButton } from "@chakra-ui/react";
import _ from "lodash";
import { AiOutlineClose } from "react-icons/ai";

import { useFabricOverlayState } from "../../state/store";
import CLSReport from "./CLSReport";

function CLSReportHelper({
	restProps,
	caseInfo,
	viewerId,
	questions,
	userInfo,
	app,
	setSlideId,
	responseHandler,
	questionnaireResponse,
	questionIndex,
}) {
	const { fabricOverlayState } = useFabricOverlayState();
	const { viewerWindow } = fabricOverlayState;
	const { slideId } = viewerWindow[viewerId];
	const [showCLSreport, setShowCLSReport] = useState(false);
	const [questionsResponse, setQuestionsResponse] = useState();
	const [slideQuestions, setSlideQuestions] = useState();
	const [loading, setLoading] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const toast = useToast();
	const [slideQna, setSlideQna] = useState({
		qna: {},
	});

	// get questions and response
	const lessonId = caseInfo?.id;
	useEffect(() => {
		setIsUpdating(true);
		if (app === "education") setSlideId(slideId);
		async function fetchResponse() {
			const response = await questionnaireResponse({
				lessonId,
			});
			setQuestionsResponse(response?.data?.data);
		}
		fetchResponse();
	}, [showCLSreport]);

	const handleCLSReport = () => {
		setShowCLSReport(!showCLSreport);
		setSlideQna({ qna: {} });
	};
	const response = Object.values(slideQna?.qna);
	const submitQnaReport = async () => {
		try {
			setLoading(true);
			await responseHandler({
				lessonId,
				response,
			});
			setShowCLSReport(!showCLSreport);
			setLoading(false);
			toast({
				status: "success",
				title: "Successfully Reported",
				duration: 1500,
				isClosable: true,
			});
		} catch (err) {
			toast({
				status: "error",
				title: "Reporting Failed",
				description: "Something went wrong, try again!",
				duration: 1500,
				isClosable: true,
			});
		}
	};
	//open report if navigated through questions
	useEffect(()=>{
		if(questionIndex){
				setShowCLSReport(true);
		}
	},[questionIndex]);
	return (
		<>
			{!showCLSreport ? (
				<Tooltip
					label="Report"
					placement="bottom"
					openDelay={0}
					bg="#E4E5E8"
					color="rgba(89, 89, 89, 1)"
					fontSize="14px"
					fontFamily="inter"
					hasArrow
					borderRadius="0px"
					size="20px"
				>
					<Button
						variant="solid"
						h="32px"
						ml="15px"
						borderRadius="0px"
						backgroundColor="#00153F"
						_hover={{}}
						_focus={{
							border: "none",
						}}
						color="#fff"
						fontFamily="inter"
						fontSize="14px"
						fontWeight="500"
						{...restProps}
						onClick={handleCLSReport}
					>
						Report
					</Button>
				</Tooltip>
			) : !questionsResponse && userInfo?.userType !== "professor" ? (
				<Tooltip
					label="Submit-Report"
					placement="bottom"
					openDelay={0}
					bg="#E4E5E8"
					color="rgba(89, 89, 89, 1)"
					fontSize="14px"
					fontFamily="inter"
					hasArrow
					borderRadius="0px"
					size="20px"
				>
					<Button
						variant="solid"
						h="32px"
						ml="15px"
						borderRadius="0px"
						backgroundColor="#00153F"
						_hover={{}}
						_focus={{
							border: "none",
						}}
						color="#fff"
						fontFamily="inter"
						fontSize="14px"
						fontWeight="500"
						{...restProps}
						onClick={submitQnaReport}
						disabled={
							questions[0]?.LessonQuestions?.length !== response?.length
						}
					>
						Submit Report
					</Button>
				</Tooltip>
			) : showCLSreport ? (
				<Flex w="100%" justifyContent="flex-end">
					<IconButton
						icon={<AiOutlineClose />}
						onClick={handleCLSReport}
						borderRadius="0"
						background="#fcfcfc"
						size="sm"
						_focus={{}}
					/>
				</Flex>
			) : null}
			{showCLSreport && (
				<CLSReport
					isUpdating={isUpdating}
					questions={questions}
					caseInfo={caseInfo}
					userInfo={userInfo}
					responseHandler={responseHandler}
					handleCLSReport={handleCLSReport}
					slideQna={slideQna}
					setSlideQna={setSlideQna}
					questionsResponse={questionsResponse}
					slideId={slideId}
					loading={loading}
					questionIndex={questionIndex}
				/>
			)}
		</>
	);
}

export default CLSReportHelper;
