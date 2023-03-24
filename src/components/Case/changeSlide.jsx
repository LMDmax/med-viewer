import React from "react";

import {
	changeTile,
	updateTool,
} from "../../state/actions/fabricOverlayActions";
import { useFabricOverlayState } from "../../state/store";
import "../../styles/viewer.css";
import ChangeHelper from "./changeHelper";

function ChangeSlide({
	caseInfo,
	slides,
	slideUrl,
	viewerId,
	setIsMultiview,
	setIsNavigatorActive,
	isNavigatorActive,
	...restProps
}) {
	const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
	const { viewerWindow, isAnnotationLoading } = fabricOverlayState;
	const { viewer, fabricOverlay } = viewerWindow[viewerId];

	const currentIndex = slides?.findIndex(
		(s) => s.awsImageBucketUrl === slideUrl
	);

	const maxIndex = slides?.length;

	const disabledLeft =
		isAnnotationLoading ||
		currentIndex - 1 < 0 ||
		slides?.[currentIndex - 1]?.awsImageBucketUrl === "";

	const disabledRight =
		isAnnotationLoading ||
		currentIndex + 1 === maxIndex ||
		slides?.[currentIndex + 1]?.awsImageBucketUrl === "";

	const title =
		
		`${caseInfo?.caseName}-${currentIndex + 1}`;

	const clickHandler = (position) => {
		const nextSlide = slides?.[currentIndex + position];
		setFabricOverlayState(updateTool({ tool: "Move" }));
		setFabricOverlayState(
			changeTile({
				id: viewerId,
				tile: nextSlide.awsImageBucketUrl,
				slideName: nextSlide.accessionId,
				slideId: nextSlide?._id || nextSlide?.slideId,
				originalFileUrl: nextSlide.originalFileUrl,
			})
		);
		viewer.open(nextSlide.awsImageBucketUrl);
		fabricOverlay.fabricCanvas().clear();
	};

	return (
		<ChangeHelper
			title={title}
			disabledLeft={disabledLeft}
			disabledRight={disabledRight}
			clickHandler={clickHandler}
			setIsMultiview={setIsMultiview}
			setIsNavigatorActive={setIsNavigatorActive}
			isNavigatorActive={isNavigatorActive}
			isAnnotationLoading={isAnnotationLoading}
		/>
	);
}

export default ChangeSlide;
