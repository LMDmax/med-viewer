import React, { useState, useRef, useEffect } from "react";

import {
	IconButton,
	useDisclosure,
	useMediaQuery,
	useToast,
} from "@chakra-ui/react";
import { fabric } from "openseadragon-fabricjs-overlay";
import PropTypes from "prop-types";

import useCanvasHelpers from "../../hooks/use-fabric-helpers";
import {
	addToActivityFeed,
	updateTool,
} from "../../state/actions/fabricOverlayActions";
import { useFabricOverlayState } from "../../state/store";
import {
	createAnnotationMessage,
	getCanvasImage,
	getScaleFactor,
	saveAnnotationToDB,
} from "../../utility";
import { CircleIcon, CircleIconFilled } from "../Icons/CustomIcons";

function Circle({ viewerId, onSaveAnnotation, setToolSelected }) {
	const toast = useToast();
	const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
	const { color, viewerWindow, activeTool } = fabricOverlayState;

	const { fabricOverlay, viewer, activityFeed, slideId } =
		viewerWindow[viewerId];

	const { deselectAll } = useCanvasHelpers(viewerId);
	const isActive = activeTool === "Circle";

	const [shape, setShape] = useState(null);
	const [textbox, setTextbox] = useState(false);

	const [myState, setState] = useState({
		activeShape: null, // active shape in event Panel
		color: null,
		currentDragShape: null,
		isActive: false, // Is the Shape tool itself active
		isMouseDown: false,
		origX: null, // starting X point for drag creating an object
		origY: null,
	});
	const myStateRef = useRef(myState);
	const setMyState = (data) => {
		myStateRef.current = { ...myState, ...data };
		setState((state) => ({ ...state, ...data }));
	};
	const { isOpen, onClose, onOpen } = useDisclosure();

	const screenSize = useMediaQuery([
		"(max-width: 1280px)",
		"(max-width: 1440px)",
		"(max-width: 1920px)",
		"(max-width: 2560px)",
	]);

	/**
	 * Handle primary tool change
	 */
	useEffect(() => {
		setMyState({ activeShape: null, isActive });
	}, [isActive]);

	/**
	 * Handle color change
	 */
	useEffect(() => {
		setMyState({ color });
	}, [color.hex]);

	/**
	 * Handle an individual shape being selected
	 */
	useEffect(() => {
		if (!fabricOverlay || !isActive) return;
		const canvas = fabricOverlay.fabricCanvas();

		canvas.defaultCursor = "crosshair";

		// Deselect all Fabric Canvas objects
		deselectAll(canvas);
	}, [isActive]);

	/**
	 * Add shapes and handle mouse events
	 */
	useEffect(() => {
		if (!fabricOverlay || !isActive) return;
		const canvas = fabricOverlay.fabricCanvas();

		/**
		 * Mouse down
		 */
		function handleMouseDown(event) {
			if (event.button !== 1 || event.target || !myStateRef.current.isActive) {
				return;
			}

			canvas.selection = false;

			// Disable OSD mouseclicks
			viewer.setMouseNavEnabled(false);
			viewer.outerTracker.setTracking(false);

			// Save starting mouse down coordinates
			const pointer = canvas.getPointer(event.e);
			const origX = pointer.x;
			const origY = pointer.y;

			// Create new Shape instance
			let newShape = null;
			const shapeOptions = {
				color: myStateRef.current.color.hex,
				left: origX,
				top: origY,
				width: 0,
				height: 0,
			};

			// Stroke fill
			const scaleFactor = getScaleFactor(viewer);

			const fillProps = {
				fill: "",
				stroke: "#000000",
				strokeWidth: 2 / scaleFactor,
				strokeUniform: true,
			};

			/**
			 * Circle
			 */
			newShape = new fabric.Ellipse({
				...shapeOptions,
				...fillProps,
				originX: "left",
				originY: "top",
				rx: pointer.x - origX,
				ry: pointer.y - origY,
				angle: 0,
			});
			canvas.add(newShape);

			setMyState({
				...myStateRef.current,
				currentDragShape: newShape,
				isMouseDown: true,
				origX,
				origY,
			});

			// Add new shape to the canvas
			// newShape && fabricOverlay.fabricCanvas().add(newShape);
		}

		/**
		 * Mouse move
		 */
		function handleMouseMove(event) {
			if (
				!myStateRef.current.isActive ||
				!myStateRef.current.currentDragShape
			) {
				return;
			}
			const c = myStateRef.current;

			// Dynamically drag size element to the canvas
			const pointer = canvas.getPointer(event.e);

			let rx = Math.abs(c.origX - pointer.x) / 2;
			let ry = Math.abs(c.origY - pointer.y) / 2;
			if (rx > c.currentDragShape.strokeWidth) {
				rx -= c.currentDragShape.strokeWidth / 2;
			}
			if (ry > c.currentDragShape.strokeWidth) {
				ry -= c.currentDragShape.strokeWidth / 2;
			}
			c.currentDragShape.set({ rx, ry });

			if (c.origX > pointer.x) {
				c.currentDragShape.set({ originX: "right" });
			} else {
				c.currentDragShape.set({ originX: "left" });
			}
			if (c.origY > pointer.y) {
				c.currentDragShape.set({ originY: "bottom" });
			} else {
				c.currentDragShape.set({ originY: "top" });
			}

			fabricOverlay.fabricCanvas().renderAll();
		}

		// // Create new Textbox instance and add it to canvas
		// const createTextbox = ({ left, top, height }) => {
		//   const tbox = new fabric.IText("", {
		//     left,
		//     top: top + height + 2,
		//     fontFamily: fonts[0].fontFamily,
		//     fontSize,
		//     fontWeight: "bold",
		//     selectionBackgroundColor: "rgba(255, 255, 255, 0.5)",
		//   });

		//   fabricOverlay.fabricCanvas().add(tbox);
		//   canvas.setActiveObject(tbox);
		//   tbox.enterEditing();
		// };

		/**
		 * Mouse up
		 */
		function handleMouseUp(event) {
			if (
				event.button !== 1 ||
				!myStateRef.current.isActive ||
				!myStateRef.current.currentDragShape
			) {
				return;
			}

			canvas.selection = true;

			// Enable OSD mouseclicks
			viewer.setMouseNavEnabled(true);
			viewer.outerTracker.setTracking(true);

			canvas.setActiveObject(myStateRef.current.currentDragShape);

			canvas.renderAll();

			const currShape = myStateRef.current.currentDragShape;

			setShape(myStateRef.current.currentDragShape);

			let [left, top, height, width] = [
				currShape.left,
				currShape.top,
				currShape.height,
				currShape.width,
			];

			if (currShape.type === "ellipse") {
				if (currShape.originX === "right") left -= width;
				if (currShape.originY === "bottom") height = 0;
			}

			setMyState({
				...myStateRef.current,
				currentDragShape: null,
				isMouseDown: false,
			});

			onOpen();
		}

		// Add click handlers
		canvas.on("mouse:down", handleMouseDown);
		canvas.on("mouse:move", handleMouseMove);
		canvas.on("mouse:up", handleMouseUp);

		// Remove handler
		return () => {
			canvas.off("mouse:down", handleMouseDown);
			canvas.off("mouse:move", handleMouseMove);
			canvas.off("mouse:up", handleMouseUp);
		};
	}, [isActive, fabricOverlay]);

	// group shape and textbox together
	// first remove both from canvas then group them and then add group to canvas
	useEffect(() => {
		const addToFeed = async () => {
			if (!shape) return;
            setToolSelected("RunRoi");
			const message = createAnnotationMessage({
				slideId,
				shape,
				viewer,
				type: "ellipse",
			});

			saveAnnotationToDB({
				slideId,
				annotation: message.object,
				onSaveAnnotation,
			});

			setShape(null);
			setTextbox(false);

			setFabricOverlayState(addToActivityFeed({ id: viewerId, feed: message }));
		};

		addToFeed();

		// change tool back to move
		setFabricOverlayState(updateTool({ tool: "Move" }));

		// send annotation
		// socket.emit(
		//   "send_annotations",
		//   JSON.stringify({
		//     roomName,
		//     username,
		//     content: canvas,
		//     feed: [...activityFeed, message],
		//   })
		// );
	}, [shape]);

	const handleClick = () => {
		setFabricOverlayState(updateTool({ tool: "Circle" }));
	};

	const handleSave = ({ text, tag }) => {
		shape.set({ isExist: true, text, tag });
		setTextbox(true);
		onClose();
	};

	const handleClose = () => {
		shape.set({ isExist: true, text: "" });
		setTextbox(true);
		onClose();
	};

	return (
		<IconButton
			icon={isActive ? <CircleIconFilled /> : <CircleIcon />}
			onClick={() => {
				handleClick();
				setToolSelected("CircleTool");
				toast({
					title: "Circle annotation tool selected",
					status: "success",
					duration: 1500,
					isClosable: true,
				});
			}}
			borderRadius={0}
			bg={isActive ? "#DEDEDE" : "#F6F6F6"}
			title="Circle Annotation"
			_focus={{ border: "none" }}
			boxShadow={
				isActive
					? "inset -2px -2px 2px rgba(0, 0, 0, 0.1), inset 2px 2px 2px rgba(0, 0, 0, 0.1)"
					: null
			}
			_hover={{ bgColor: "rgba(228, 229, 232, 1)" }}
		/>
	);
}

export default Circle;
