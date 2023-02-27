import React, { useState, useRef, useEffect } from "react";

import { useMutation } from "@apollo/client";
import {
	Box,
	Flex,
	HStack,
	Text,
	Icon,
	useDisclosure,
	useMediaQuery,
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	AccordionIcon,
	Circle,
	IconButton,
} from "@chakra-ui/react";
import { BiRectangle } from "react-icons/bi";
import { BsCircle, BsSlash } from "react-icons/bs";
import { FaDrawPolygon } from "react-icons/fa";
import { GrFormClose } from "react-icons/gr";
import { MdModeEditOutline, MdDelete, MdTextsms } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";

import {
	DELETE_ANNOTATION,
	UPDATE_ANNOTATION,
} from "../../graphql/annotaionsQuery";
import useCanvasHelpers from "../../hooks/use-fabric-helpers";
import { useFabricOverlayState } from "../../state/store";
import { updateAnnotationInDB } from "../../utility";
import DeleteConfirmation from "../Annotations/DeleteConfirmation";
import ScrollBar from "../ScrollBar";
import EditText from "./editText";

function EditTextButton({ feed, handleEditClick, ...restProps }) {
	return (
		<Icon
			as={MdModeEditOutline}
			cursor="pointer"
			onClick={() => handleEditClick(feed)}
			{...restProps}
		/>
	);
}

function CardDetailsRow({ title, value, ...restProps }) {
	return (
		<HStack
			py="8px"
			marginStart="18px"
			borderBottom="1px solid #F6F6F6"
			pb="0.5vw"
			{...restProps}
		>
			<Text minW="35%">{title}:</Text>
			<Text>{value}</Text>
		</HStack>
	);
}

function CustomTab({ title, ...props }) {
	return (
		<Tab
			{...props}
			fontSize="12px"
			lineHeight="15px"
			letterSpacing="0.005em"
			fontWeight="400"
			background="#FFFFFF"
			_selected={{
				background: "#FCFCFC",
				boxShadow: "inset 0px 1px 2px rgba(0, 0, 0, 0.05)",
				border: "none",
				outline: "none",
				color: "#3B5D7C",
				fontWeight: "500",
			}}
			_disabled={{ background: "#FFFFFF90", cursor: "not-allowed" }}
			flex="1"
			p="8px"
		>
			{title}
		</Tab>
	);
}

function CustomTabPanel({ children, title, annotation, totalCells, ...props }) {
	return (
		<TabPanel {...props} px={0} py="8px">
			<Text
				py="12px"
				px="18px"
				bg="#FFFFFF"
				fontSize="14px"
				lineHeight="17px"
				letterSpacing="0.0025em"
				fontWeight="400"
			>
				{title}
			</Text>
			{children ? (
				<Flex flexDir="column" minH="0px" h="42vh">
					<ScrollBar>
						<Flex flexDir="column" pb="85px">
							{children}
						</Flex>
					</ScrollBar>
				</Flex>
			) : null}
		</TabPanel>
	);
}

function ActivityFeed({
	userInfo,
	viewerId,
	totalCells,
	handlePopup,
	popup,
	showFeedBar,
	isXmlAnnotations,
}) {
	// const onUpdateAnnotation = (data) => {
	//   console.log("activityfeed", data);
	// };

	const [
		modifyAnnotation,
		{ data: updatedData, error: updateError, loading: updateLoading },
	] = useMutation(UPDATE_ANNOTATION);

	const onUpdateAnnotation = (data) => {
		// console.log("====================================");
		// console.log("activity feed update");
		// console.log("====================================");
		delete data?.slideId;
		modifyAnnotation({
			variables: { body: { ...data } },
		});
	};

	const [removeAnnotation, { data: deletedData, error: deleteError }] =
		useMutation(DELETE_ANNOTATION);
	if (deleteError)
		toast({
			title: "Annotation could not be deleted",
			description: "server error",
			status: "error",
			duration: 1000,
			isClosable: true,
		});
	const onDeleteAnnotation = (data) => {
		// console.log("====================================");
		// console.log("activity feed delete", data);
		// console.log("====================================");
		removeAnnotation({ variables: { body: data } });
	};

	const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
	const { activeTool, viewerWindow } = fabricOverlayState;
	const { fabricOverlay, activityFeed, viewer, tile, slideId } =
		viewerWindow[viewerId];

	const { deleteAllAnnotations } = useCanvasHelpers(viewerId);

	const scrollbar = useRef(null);
	const { isOpen, onClose, onOpen } = useDisclosure();
	const {
		isOpen: isDeleteConfirmationOpen,
		onClose: onDeleteConfirmationClose,
		onOpen: onDeleteConfirmationOpen,
	} = useDisclosure();

	const [annotationObject, setAnnotationObject] = useState(null);
	const [annotationDetails, setAnnotationsDetails] = useState(null);
	const [ifScreenlessthan1660px] = useMediaQuery("(max-width:1660px)");

	useEffect(() => {
		if (scrollbar.current) scrollbar.current.scrollToBottom();
		if (activityFeed.length === 0) setAnnotationsDetails(null);
	}, [activityFeed]);

	useEffect(() => {
		return () => {
			setAnnotationObject(null);
			setAnnotationsDetails(null);
		};
	}, []);

	useEffect(() => {
		setAnnotationObject(null);
		setAnnotationsDetails(null);
	}, [tile]);

	const handleClick = (feed) => {
		if (!feed.object || !feed.object?.visible) return;
		const canvas = fabricOverlay.fabricCanvas();

		if (feed.object.type !== "viewport") {
			canvas.setActiveObject(feed.object);
		}

		// change position to annotation object location
		// except for when MagicWand tool is activated
		if (activeTool !== "MagicWand") {
			const { zoomLevel, left, top, width, height, Zoom } = feed.object;
			const zoom = zoomLevel || Zoom;
			viewer.viewport.zoomTo(zoom);

			// get viewport point of middle of selected annotation
			const vpoint = viewer.viewport.imageToViewportRectangle(
				left + width / 2,
				top + height / 2
			);
			viewer.viewport.panTo(vpoint);
		}

		canvas.requestRenderAll();
		setAnnotationsDetails(feed.object);
	};

	const handleSave = ({ text, title }) => {
		annotationObject.text = text;
		annotationObject.title = title;

		updateAnnotationInDB({
			slideId,
			hash: annotationObject.hash,
			updateObject: { text, title },
			onUpdateAnnotation,
		});
		setAnnotationObject(null);
		onClose();
	};

	const handleEditClick = (feed) => {
		setAnnotationObject(feed.object);
		onOpen();
	};

	const deleteAnnotations = () => {
		deleteAllAnnotations(onDeleteAnnotation);
		onDeleteConfirmationClose();
	};

	return (
		<Flex
			as="section"
			w="100%"
			position={showFeedBar ? "unset" : "absolute"}
			// h={ifScreenlessthan1660px ? "calc(100% - 90px)" : "90%"}
			h={
				showFeedBar
					? "90vh"
					: !showFeedBar && ifScreenlessthan1660px
					? "calc(100% - 90px)"
					: "90%"
			}
			padding={0}
			margin={0}
			right="0"
			zIndex={2}
			background="#FCFCFC"
			boxShadow={showFeedBar ? "" : "-1px 0px 2px rgba(176, 200, 214, 0.3)"}
			direction="column"
			pr="2px"
		>
			<Flex
				py="0.5px"
				justifyContent="flex-end"
				alignItems="center"
				background="#F6F6F6"
				display={showFeedBar ? "none" : "flex"}
			>
				<GrFormClose
					size={16}
					onClick={() => handlePopup(!popup)}
					_hover={{ cursor: "pointer" }}
				/>
			</Flex>

			<Flex
				direction="column"
				marginStart="0.8vw"
				pt="2px"
				overflowY="auto"
				flex="1"
			>
				<HStack justify="space-between">
					<Text fontSize="1rem" pb="3px">
						Annotation List
					</Text>
					{!isXmlAnnotations && (
						<IconButton
							icon={<MdDelete size={18} />}
							size="sm"
							variant="unstyled"
							cursor="pointer"
							isDisabled={activityFeed.length === 0}
							_focus={{ border: "none", outline: "none" }}
							onClick={onDeleteConfirmationOpen}
						/>
					)}
				</HStack>
				<ScrollBar>
					<Flex direction="column">
						{activityFeed.map((feed, index) => {
							return feed?.object && feed?.object?.type !== "textbox" ? (
								<Flex
									key={feed.object.hash}
									pb="0.5vh"
									borderBottom="1px solid #F6F6F6"
									cursor="pointer"
									onClick={() => handleClick(feed)}
									justify="space-between"
									align="center"
								>
									<Flex align="center">
										{feed.object?.type === "rect" ? (
											<BiRectangle color="#E23636" />
										) : feed.object?.type === "polygon" ? (
											<FaDrawPolygon color="#E23636" />
										) : feed.object?.type === "ellipse" ? (
											<BsCircle color="#E23636" />
										) : (
											<BsSlash color="#E23636" />
										)}
										<Text ml="0.8vw">
											{feed.object?.title
												? feed.object.title
												: feed.object?.type === "group"
												? "ROI"
												: feed.object?.type === "viewport"
												? `Viewport ${index + 1}`
												: `Annotation ${index + 1}`}
										</Text>
									</Flex>
									<EditTextButton
										feed={feed}
										handleEditClick={handleEditClick}
										mr={2}
									/>
								</Flex>
							) : null;
						})}
					</Flex>
				</ScrollBar>
			</Flex>

			{annotationDetails ? (
				<Flex fontSize="14px" flexDir="column" background="#FCFCFC">
					<Box h="6px" background="#F6F6F6" w="100%" />
					<Tabs variant="unstyled" defaultIndex={0}>
						<TabList>
							<CustomTab title="Annotation Values" />
							<CustomTab
								isDisabled={!annotationDetails?.analysedData}
								title="Morphometry Values"
							/>
						</TabList>
						<TabPanels px={0}>
							<CustomTabPanel title="Annotation Values">
								{annotationDetails ? (
									<>
										<CardDetailsRow
											title="Annotation"
											value={
												annotationDetails?.type ? annotationDetails.type : "-"
											}
										/>
										<CardDetailsRow
											title="Description"
											value={
												annotationDetails?.text ? annotationDetails.text : "-"
											}
										/>

										{annotationDetails?.area ? (
											<>
												{/* <CardDetailsRow
                            title="Centroid X"
                            value={
                              <>{annotationDetails.centroid?.[0][0]}</>
                            }
                          />
                          <CardDetailsRow
                            title="Centroid Y"
                            value={
                              <>{annotationDetails.centroid?.[0][1]}</>
                            }
                          /> */}
												<CardDetailsRow
													title="Class"
													value={annotationDetails?.classType}
												/>
												<CardDetailsRow
													title="Perimeter"
													value={<>{annotationDetails.perimeter.toFixed(2)}</>}
												/>
												<CardDetailsRow
													title="Area"
													value={annotationDetails.area}
												/>
												{/* <CardDetailsRow
                            title="Total Cells"
                            value={totalCells || "-"}
                          /> */}
											</>
										) : null}
									</>
								) : null}
							</CustomTabPanel>
							<CustomTabPanel title="Morphometry Values">
								{annotationDetails?.analysedData &&
								annotationDetails.analysedData.data.length > 0 ? (
									<Accordion allowToggle>
										{annotationDetails.analysedData.data.map((cell) => {
											return (
												<AccordionItem
													key={uuidv4()}
													color="black"
													isDisabled={cell.status !== "detected"}
												>
													<h2>
														<AccordionButton _focus={{ outline: "none" }}>
															<HStack flex="1" textAlign="left" align="center">
																<Text fontSize="14px">{cell.type}</Text>
																{cell.status === "detected" ? (
																	<Circle size="12px" bg={cell.color} />
																) : null}
															</HStack>
															<AccordionIcon />
														</AccordionButton>
													</h2>
													{cell.status === "detected" ? (
														<AccordionPanel pb={4}>
															{/* <CardDetailsRow
                                  title="Total Cells"
                                  value={
                                    annotationDetails.analysedData.totalCells
                                  }
                                /> */}
															<CardDetailsRow
																title="Nucleus Count"
																value={cell.count}
															/>
															{/* <CardDetailsRow
                                title="Nucleus Cytoplasm Ratio"
                                value={cell.ratio.toFixed(2)}
                              /> */}
															<CardDetailsRow
																title="Min. Perimeter"
																value={<>{cell.min_perimeter.toFixed(2)}</>}
															/>
															<CardDetailsRow
																title="Max. Perimeter"
																value={<>{cell.max_perimeter.toFixed(2)}</>}
															/>
															<CardDetailsRow
																title="Avg. Perimeter"
																value={<>{cell.avg_perimeter.toFixed(2)}</>}
															/>
															<CardDetailsRow
																title="Min. Area"
																value={<>{cell.min_area.toFixed(2)}</>}
															/>
															<CardDetailsRow
																title="Max. Area"
																value={<>{cell.max_area.toFixed(2)}</>}
															/>
															<CardDetailsRow
																title="Avg. Area"
																value={<>{cell.avg_area.toFixed(2)}</>}
															/>
														</AccordionPanel>
													) : null}
												</AccordionItem>
											);
										})}
									</Accordion>
								) : null}
							</CustomTabPanel>
						</TabPanels>
					</Tabs>
				</Flex>
			) : null}
			<EditText
				isOpen={isOpen}
				onClose={onClose}
				textValue={annotationObject?.text ? annotationObject.text : ""}
				titleValue={annotationObject?.title ? annotationObject.title : ""}
				handleClose={onClose}
				handleSave={handleSave}
			/>
			<DeleteConfirmation
				isOpen={isDeleteConfirmationOpen}
				onClose={onDeleteConfirmationClose}
				handleConfirmation={deleteAnnotations}
				type="annotations"
			/>
		</Flex>
	);
}

export default ActivityFeed;
