import { Flex, Text, HStack, IconButton, Tooltip } from "@chakra-ui/react";
import React, { useState } from "react";
import {
	MdOutlineKeyboardArrowLeft,
	MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import SlideNavigatorIcon from "../Navigator/slideNavigatorIcon";
import ToolbarButton from "../ViewerToolbar/button";
import { isCaseViewable } from "../../utility/utility";
import "../../styles/viewer.css";
import TooltipLabel from "../AdjustmentBar/ToolTipLabel";

function ChangeCase({
	project,
	caseInfo,
	slide,
	slides,
	changeCaseHandler,
	closeToggle,
}) {
	const currentIndex = project
		? project?.cases.findIndex(
				(projectCase) => projectCase._id === caseInfo?._id
		  )
		: slides?.findIndex(
				(s) => s.awsImageBucketUrl === slide?.awsImageBucketUrl
		  );

	const maxIndex = project ? project?.cases?.length : slides?.length;
	const [closeButton, setCloseButton] = useState(true);
	const handleCloseButtonClick = () => {
		setCloseButton(false);
		closeToggle(false);
	};

	return (
		<Flex
			justifyContent="space-between"
			alignItems="center"
			height="18px"
			minW="140px"
			pl="26px"
		>
			<HStack>
				<Tooltip
					label={
						<TooltipLabel
							heading="Navigator"
							paragraph="For previous WSI image"
						/>
					}
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
					<IconButton
						icon={<MdOutlineKeyboardArrowLeft color="#151C25" />}
						color="#fff"
						variant="unstyled"
						cursor="pointer"
						minW={0}
						_focus={{ background: "none" }}
						disabled={
							currentIndex - 1 < 0 ||
							(project
								? !isCaseViewable(
										project?.type,
										project?.cases[currentIndex - 1].slides.length
								  )
								: slides?.[currentIndex - 1].awsImageBucketUrl === "")
						}
						onClick={() => changeCaseHandler(currentIndex - 1)}
					/>
				</Tooltip>

				<Text mr="24px">
					{project
						? project?.cases[currentIndex]?.name
						: slides[currentIndex]?.accessionId}
				</Text>
				<Tooltip
					label={
						<TooltipLabel heading="Navigator" paragraph="For next WSI image" />
					}
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
					<IconButton
						icon={<MdOutlineKeyboardArrowRight color="#151C25" />}
						variant="unstyled"
						color="#fff"
						cursor="pointer"
						minW={0}
						_focus={{ background: "none", border: "none" }}
						disabled={
							currentIndex + 1 === maxIndex ||
							(project
								? !isCaseViewable(
										project?.type,
										project?.cases[currentIndex + 1].slides.length
								  )
								: slides?.[currentIndex + 1]?.awsImageBucketUrl === "")
						}
						onClick={() => changeCaseHandler(currentIndex + 1)}
					/>
				</Tooltip>
			</HStack>
		</Flex>
	);
}

export default ChangeCase;
