import React from "react";

import { Button } from "@chakra-ui/react";

import { useFabricOverlayState } from "../../state/store";

function SaveAnnotations({ viewerId, saveAnnotationsHandler }) {
	const { fabricOverlayState } = useFabricOverlayState();
	const { fabricOverlay } = fabricOverlayState?.viewerWindow[viewerId];

	const handleSaveAnnotations = async () => {
		const canvas = fabricOverlay.fabricCanvas();
		const annotations = canvas.toJSON(["hash", "text", "zoomLevel"]);
		if (annotations.objects.length === 0) return;
		// console.log(annotations);
		// saveAnnotationsHandler(annotations);
	};

	return (
		<Button
			variant="solid"
			h="32px"
			w="100px"
			borderRadius="0px"
			backgroundColor="#ECECEC"
			border="1px solid #00153F"
			_focus={{
				border: "none",
			}}
			color="#00153F"
			fontFamily="inter"
			fontSize="14px"
			fontWeight="600"
			onClick={handleSaveAnnotations}
		>
			Save
		</Button>
	);
}

export default SaveAnnotations;
