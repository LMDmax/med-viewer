import React from "react";

import { Button } from "@chakra-ui/react";
import _ from "lodash";
import { fabric } from "openseadragon-fabricjs-overlay";

import { updateActivityFeed } from "../../state/actions/fabricOverlayActions";
import { useFabricOverlayState } from "../../state/store";
import { getCanvasImage, getTimestamp } from "../../utility/utility";

function LoadAnnotations({ viewerId, userInfo, loadAnnotationsHandler }) {
	const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
	const { fabricOverlay, activityFeed } =
		fabricOverlayState?.viewerWindow[viewerId];

	const loadAnnotations = (annotations) => {
		const canvas = fabricOverlay.fabricCanvas();

		const addToFeed = async (shape) => {
			const message = {
				username: `${userInfo?.user.firstName} ${userInfo?.user.lastName}`,
				color: shape.fill ? shape.fill : shape.stroke,
				action: "added",
				text: "",
				timeStamp: getTimestamp(),
				type: shape.type,
				object: shape,
				image: null,
			};

			message.image = await getCanvasImage(viewerId);

			setFabricOverlayState(
				updateActivityFeed({ id: viewerId, feed: [...activityFeed, message] })
			);
		};

		const createAnnotations = (annotation) => {
			let shape;
			switch (annotation.type) {
				case "ellipse":
					shape = new fabric.Ellipse({
						left: annotation.left,
						top: annotation.top,
						width: annotation.width,
						height: annotation.height,
						color: annotation.color,
						fill: annotation.fill,
						stroke: annotation.stroke,
						strokeWidth: annotation.strokeWidth,
						strokeUniform: annotation.strokeUniform,
						rx: annotation.rx,
						ry: annotation.ry,
						angle: annotation.angle,
					});
					break;

				case "rect":
					shape = new fabric.Rect({
						left: annotation.left,
						top: annotation.top,
						width: annotation.width,
						height: annotation.height,
						color: annotation.color,
						fill: annotation.fill,
						stroke: annotation.stroke,
						strokeWidth: annotation.strokeWidth,
						strokeUniform: annotation.strokeUniform,
					});
					break;

				case "polygon":
					shape = new fabric.Polygon(annotation.points, {
						stroke: annotation.stroke,
						strokeWidth: annotation.strokeWidth,
						fill: annotation.fill,
						strokeUniform: annotation.strokeUniform,
					});
					break;

				case "path":
					shape = new fabric.Path(annotation.path, {
						color: annotation.color,
						stroke: annotation.stroke,
						strokeWidth: annotation.strokeWidth,
						strokeUniform: annotation.strokeUniform,
						fill: annotation.fill,
					});
			}
			canvas.add(shape);
			canvas.renderAll();
			addToFeed(shape);
		};

		annotations.forEach((annotation) => {
			createAnnotations(annotation);
		});

		canvas.renderAll();
	};

	const handleLoadAnnotations = async () => {
		const annotations = await loadAnnotationsHandler();

		loadAnnotations(annotations.data);
	};

	return (
		<Button
			variant="solid"
			h="32px"
			w="100px"
			borderRadius="0px"
			backgroundColor="#00153F"
			_focus={{
				border: "none",
			}}
			color="#fff"
			fontFamily="inter"
			fontSize="14px"
			fontWeight="600"
			onClick={handleLoadAnnotations}
		>
			Load
		</Button>
	);
}

export default LoadAnnotations;
