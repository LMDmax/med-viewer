import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useFabricOverlayState } from "../state/store";
import {
  addAnnotationsToCanvas,
  addAnnotationToCanvas,
  deleteAnnotationFromDB,
  updateAnnotationInDB,
} from "../utility/annotationUtility";
import {
  addToActivityFeed,
  removeFromActivityFeed,
  updateActivityFeed,
} from "../state/actions/fabricOverlayActions";

const useCanvasHelpers = (viewerId) => {
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { viewerWindow } = fabricOverlayState;
  const { fabricOverlay, viewer, slideId } = viewerWindow[viewerId];

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

  // subscription sync delete annotation from canvas
  const subscriptionDeleteAnnotation = (hash) => {
    if (!canvas || !hash) return;
    const target = canvas.getObjectByHash(hash);
    setFabricOverlayState(
      removeFromActivityFeed({ id: viewerId, hash: target?.hash })
    );

    canvas.remove(target).requestRenderAll();

    if (target?.type === "textbox") {
      toast({
        title: "Comment deleted",
        status: "success",
        duration: 1000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Annotation deleted",
        status: "success",
        duration: 1000,
        isClosable: true,
      });
    }
  };

  //subscription sync clear annotations from canvas
  const subscriptionClearAnnotations = (deleteType) => {
    if (!canvas) return;

    let objects = canvas.getObjects();
    for (let i = 0; i < objects.length; i++) {
      if (deleteType.includes(objects[i].type)) {
        canvas.remove(objects[i]).requestRenderAll();
        setFabricOverlayState(
          removeFromActivityFeed({ id: viewerId, hash: objects[i].hash })
        );
      }
    }

    if (deleteType.includes("textbox")) {
      toast({
        title: "Comments deleted",
        status: "success",
        duration: 1000,
        isClosable: true,
      });
      // console.log("comments");
    } else {
      toast({
        title: "Annotations deleted",
        status: "success",
        duration: 1000,
        isClosable: true,
      });
    }
  };

  // subscription sync add annotation to canvas
  const subscriptionAddAnnotation = (annotation) => {
    if (!canvas || !annotation) return;

    const target = canvas.getObjectByHash(annotation?.hash);
    if (target) return;
    const feed = addAnnotationToCanvas({ canvas, viewer, annotation });

    setFabricOverlayState(addToActivityFeed({ id: viewerId, feed }));

    canvas.requestRenderAll();

    toast({
      title: "Annotation created",
      status: "success",
      duration: 1000,
      isClosable: true,
    });
  };

  // subscription sync update annotation
  const subscriptionUpdateAnnotation = (annotation) => {
    if (!canvas || !annotation) return;

    const target = canvas.getObjectByHash(annotation?.hash);
    target?.set(annotation);

    if (target?.type === "textbox") {
      toast({
        title: "Comment updated",
        status: "success",
        duration: 1000,
        isClosable: true,
      });
    } 
  };
  // delete annotation/object from canvas
  const deleteAnnotation = async (onDeleteAnnotation) => {
    if (!canvas || !onDeleteAnnotation) return;
    const activeObject = canvas.getActiveObject();
    // console.log("active....", activeObject);
    // // Object has children (ie. arrow has children objects triangle and line)
    // if (activeObject.getObjects) {
    //   const objs = activeObject.getObjects();
    //   Object.values(objs).forEach((obj) => {
    //     canvas.remove(obj);
    //   });
    // }

    if (
      !(await deleteAnnotationFromDB({
        slideId,
        type: [],
        hash: activeObject?.hash,
        onDeleteAnnotation,
      }))
    ) {
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
      !(await deleteAnnotationFromDB({
        slideId,
        type: ["ellipse", "rect", "polygon", "path", "line"],
        onDeleteAnnotation,
      }))
    ) {
      toast({
        title: "Annotations could not be deleted",
        description: "server error",
        status: "error",
        duration: 1000,
        isClosable: true,
      });
    }
  };

  const deleteAllComments = async (onDeleteAnnotation) => {
    if (!canvas || !onDeleteAnnotation) return;

    if (
      !(await deleteAnnotationFromDB({
        slideId,
        type: ["textbox"],
        onDeleteAnnotation,
      }))
    ) {
      toast({
        title: "Comments could not be deleted",
        description: "server error",
        status: "error",
        duration: 2000,
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
    subscriptionAddAnnotation,
    subscriptionClearAnnotations,
    subscriptionDeleteAnnotation,
    subscriptionUpdateAnnotation,
    deleteAllComments,
  };
};

export default useCanvasHelpers;
