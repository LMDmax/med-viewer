import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useFabricOverlayState } from "../state/store";
import {
  deleteAnnotationFromDB,
  updateAnnotationInDB,
} from "../utility/annotationUtility";
import {
  removeFromActivityFeed,
  updateActivityFeed,
} from "../state/actions/fabricOverlayActions";

const useCanvasHelpers = (viewerId) => {
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { viewerWindow } = fabricOverlayState;
  const { fabricOverlay, slideId } = viewerWindow[viewerId];

  const [canvas, setCanvas] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (!fabricOverlay) return;
    setCanvas(fabricOverlay.fabricCanvas());
  }, [fabricOverlay]);

  // Remove all Fabric canvas objects
  const clearCanvas = () => {
    if (!canvas) return;
    canvas.clear();
  };

  // delete annotation/object from canvas
  const deleteAnnotation = async (onDeleteAnnotation) => {
    if (!canvas || !onDeleteAnnotation) return;
    const activeObject = canvas.getActiveObject();

    // // Object has children (ie. arrow has children objects triangle and line)
    // if (activeObject.getObjects) {
    //   const objs = activeObject.getObjects();
    //   Object.values(objs).forEach((obj) => {
    //     canvas.remove(obj);
    //   });
    // }

    if (
      await deleteAnnotationFromDB({
        slideId,
        hash: activeObject?.hash,
        onDeleteAnnotation,
      })
    ) {
      setFabricOverlayState(
        removeFromActivityFeed({ id: viewerId, hash: activeObject?.hash })
      );

      canvas.remove(activeObject);
      canvas.renderAll();

      toast({
        title: "Annotation deleted",
        status: "success",
        duration: 1000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Annotation could not be deleted",
        description: "server error",
        status: "error",
        duration: 1000,
        isClosable: true,
      });
    }
  };

  // update annotation
  const updateAnnotation = ({ text, title, onUpdateAnnotation }) => {
    if (!canvas) return;

    const annotation = canvas.getActiveObject();

    if (!annotation) return;

    annotation.text = text;
    annotation.title = title;

    updateAnnotationInDB({
      slideId,
      hash: annotation.hash,
      updateObject: { text, title },
      onUpdateAnnotation,
    });
  };

  const deleteAllAnnotations = async (onDeleteAnnotation) => {
    if (!canvas || !onDeleteAnnotation) return;

    if (
      await deleteAnnotationFromDB({
        slideId,
        onDeleteAnnotation,
      })
    ) {
      setFabricOverlayState(updateActivityFeed({ id: viewerId, fullFeed: [] }));

      canvas.clear().requestRenderAll();

      toast({
        title: "Annotations deleted",
        status: "success",
        duration: 1000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Annotations could not be deleted",
        description: "server error",
        status: "error",
        duration: 1000,
        isClosable: true,
      });
    }
  };

  // is annotation active/selected
  const isAnnotationSelected = () => {
    if (!canvas) return false;
    return canvas.getActiveObject !== null;
  };

  // Deselect all Fabric canvas objects
  const deselectAll = () => {
    if (!canvas) return;
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  };

  const makeAnnotationsInvisible = (fabricObjects = []) => {
    if (!canvas) return;

    fabricObjects.forEach((obj) => {
      obj.set({ visible: false });
    });

    canvas.requestRenderAll();
  };

  const makeAnnotationsVisible = (fabricObjects = []) => {
    if (!canvas) return;

    fabricObjects.forEach((obj) => {
      obj.set({ opacity: 1 });
    });
    canvas.requestRenderAll();
  };

  const toggleAnnotationVisibility = (visible) => {
    if (!canvas) return;

    canvas.getObjects().forEach((obj) => {
      obj.set({ visible });
    });

    deselectAll();
  };

  const updateCursor = () => {
    if (!canvas) return;

    canvas.defaultCursor = "auto";
    canvas.hoverCursor = "move";
  };

  return {
    clearCanvas,
    deleteAnnotation,
    updateAnnotation,
    deselectAll,
    makeAnnotationsInvisible,
    makeAnnotationsVisible,
    updateCursor,
    toggleAnnotationVisibility,
    isAnnotationSelected,
    deleteAllAnnotations,
  };
};

export default useCanvasHelpers;
