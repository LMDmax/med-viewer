/* eslint-disable no-case-declarations */
/* eslint-disable no-unsafe-optional-chaining */
import { fabric } from "openseadragon-fabricjs-overlay";
import md5 from "md5";
import { normalizeUnits } from "./utility";

/** Get annotation JSON */
export const getAnnotationJSON = (annotation) => {
  if (!annotation) return null;
  // console.log("====================================");
  // console.log("annotationssss", annotation);
  // console.log("====================================");
  if (annotation.type === "viewport") return annotation;
  return annotation.toJSON([
    "slide",
    "hash",
    "text",
    "title",
    "zoomLevel",
    "points",
    "cords",
    "timeStamp",
    "isClosed",
    "usingAs",
    "area",
    "perimeter",
    "centroid",
    "end_points",
    "isAnalysed",
    "analysedROI",
    "timeStamp",
    "modelName",
    "isProcessed",
    "patternName",
    "processType"
  ]);
};

/** Get annotations JSON from canvas */
export const getCanvasJSON = (canvas) => {
  if (!canvas) return null;
  return canvas.toJSON([
    "slide",
    "hash",
    "text",
    "title",
    "zoomLevel",
    "points",
    "timeStamp",
    "area",
    "perimeter",
    "centroid",
    "end_points",
    "isAnalysed",
    "analysedROI",
  ]);
};

// create annotation message for the feed
export const createAnnotationMessage = ({
  slideId,
  shape,
  viewer,
  userInfo,
  annotation,
  maskType,
  type,
  isClosed,
  usingAs,
  processType,
  patternName,
  isProcessed,
  addLocalRegion,
  modelName,
}) => {
  if (!viewer || !shape) return null;
  const message = {
    username: userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : "",
    object: shape,
    image: null,
  };

  // if annotation data is available
  // else create a new one

  if (annotation) {
    console.log("AAA", annotation);
    const {
      slide,
      hash,
      text,
      title,
      type,
      zoomLevel,
      points,
      isClosed,
      usingAs,
      timeStamp,
      area,
      perimeter,
      centroid,
      endPoints,
      isAnalysed,
      analysedROI,
      processType,
      patternName,
      isProcessed,
      addLocalRegion,
      modelName,
    } = annotation;

    if (shape.type === "viewport") {
      message.object = {
        ...message.object,
        slide,
        hash,
        text,
        title,
        type,
        zoomLevel,
        points,
        timeStamp,
        area,
        perimeter,
        centroid,
        endPoints,
        isAnalysed,
        analysedROI,
      };
    } else {
      message.object.set({
        slide,
        hash,
        text,
        type,
        title,
        zoomLevel,
        points,
        timeStamp,
        isClosed,
        usingAs,
        area,
        perimeter,
        centroid,
        endPoints,
        isAnalysed,
        analysedROI,
        processType,
        patternName,
        isProcessed,
        addLocalRegion,
        modelName,
      });
    }
  } else {
    const timeStamp = Date.now();
    const hash = md5(shape + timeStamp);
    // message.image = await getCanvasImage(viewerId);
    if (shape.type === "viewport") {
      message.object = {
        ...message.object,
        timeStamp,
        hash,
        slide: slideId,
        zoomLevel: viewer.viewport.getZoom(),
        text: "",
        maskType: maskType || "",
        type: type || "",
      };
    } else {
      message.object.set({
        timeStamp,
        hash,
        slide: slideId,
        zoomLevel: viewer.viewport.getZoom(),
        text: message.object.text || "",
        maskType: maskType || "",
        type: type || "",
        isClosed,
        usingAs: usingAs || "",
        processType: processType || "",
        patternName: patternName || "",
        isProcessed: isProcessed || false,
        addLocalRegion: addLocalRegion || false,
        modelName: modelName || "",
      });
    }
  }

  return message;
};

// create annotation from the annotation data
export const createAnnotation = (annotation) => {
  let shape;
  const textLength = annotation?.text?.length;
  switch (annotation.type) {
    case "ellipse":
      shape = new fabric.Ellipse({
        left: annotation.left,
        top: annotation.top,
        width: annotation.width,
        height: annotation.height,
        color: annotation.stroke,
        fill: annotation.fill,
        stroke: annotation.stroke ? annotation.stroke : "#000",
        strokeWidth: annotation.strokeWidth ? annotation.strokeWidth : 30,
        strokeUniform: annotation.strokeUniform,
        rx: annotation.rx,
        ry: annotation.ry,
        angle: annotation.angle,
        hasControls: annotation.globalCompositeOperation,
        hasRotatingPoint: annotation.globalCompositeOperation,
        lockMovementX: !annotation.globalCompositeOperation,
        lockMovementY: !annotation.globalCompositeOperation,
      });
      break;

    case "textbox":
      shape = new fabric.Textbox(`${annotation.text}`, {
        left: annotation.left,
        top: annotation.top,
        width: annotation.width,
        color: annotation.color,
        backgroundColor: "#B0C8D6",
        opacity: annotation.opacity,
        title: annotation.title,
        text: annotation.text,
        hasBorders: false,
        hasControls: false,
        hasRotatingPoint: false,
        lockMovementX: true,
        lockMovementY: true,
        visible: false,
      });
      break;

    case "rect":
      shape = new fabric.Rect({
        left: annotation.left,
        top: annotation.top,
        width: annotation.width,
        height: annotation.height,
        color: annotation.stroke,
        fill: annotation.fill,
        angle: annotation.angle,
        stroke: annotation.stroke ? annotation.stroke : "#000",
        strokeWidth: annotation.strokeWidth ? annotation.strokeWidth : 30,
        strokeUniform: annotation.strokeUniform,
        strokeDashArray: annotation.strokeDashArray,
        hasControls: annotation.globalCompositeOperation,
        hasRotatingPoint: annotation.globalCompositeOperation,
        lockMovementX: !annotation.globalCompositeOperation,
        lockMovementY: !annotation.globalCompositeOperation,
      });
      break;

    case "polygon":
      shape = new fabric.Polygon(annotation.points, {
        stroke: annotation.stroke ? annotation.stroke : "#000",
        strokeWidth: annotation.strokeWidth ? annotation.strokeWidth : 30,
        fill: annotation.fill,
        strokeUniform: annotation.strokeUniform,
        hasControls: annotation.globalCompositeOperation,
        hasRotatingPoint: annotation.globalCompositeOperation,
        lockMovementX: !annotation.globalCompositeOperation,
        lockMovementY: !annotation.globalCompositeOperation,
        angle: annotation.angle,
      });
      break;

    case "path":
      shape = new fabric.Path(annotation.path, {
        color: annotation.stroke,
        stroke: annotation.stroke ? annotation.stroke : "#000",
        strokeWidth: annotation.strokeWidth ? annotation.strokeWidth : 30,
        strokeUniform: annotation.strokeUniform,
        fill: annotation.fill,
        hasControls: annotation.globalCompositeOperation,
        hasRotatingPoint: annotation.globalCompositeOperation,
        lockMovementX: !annotation.globalCompositeOperation,
        lockMovementY: !annotation.globalCompositeOperation,
        angle: annotation.angle,
      });
      break;

    case "line":
      shape = new fabric.Line(annotation.cords, {
        color: annotation.stroke,
        stroke: annotation.stroke ? annotation.stroke : "#000",
        strokeWidth: annotation.strokeWidth ? annotation.strokeWidth : 30,
        strokeUniform: annotation.strokeUniform,
        fill: annotation.fill,
        hasControls: annotation.globalCompositeOperation,
        hasRotatingPoint: annotation.globalCompositeOperation,
        lockMovementX: !annotation.globalCompositeOperation,
        lockMovementY: !annotation.globalCompositeOperation,
        angle: annotation.angle,
      });
      break;
    case "ruler":
      shape = new fabric.Line(annotation.cords, {
        color: "black",
        stroke: annotation?.color ? annotation?.color : "#000",
        strokeWidth: annotation.strokeWidth ? annotation.strokeWidth : 30,
        strokeUniform: annotation.strokeUniform,
        fill: annotation.fill,
        hasControls: annotation.globalCompositeOperation,
        hasRotatingPoint: annotation.globalCompositeOperation,
        lockMovementX: !annotation.globalCompositeOperation,
        lockMovementY: !annotation.globalCompositeOperation,
        angle: annotation.angle,
      });
      break;
    case "arrow":
      // need to remove declaration in case block
      const endX = annotation.left + annotation.width;
      const endY = annotation.top + annotation.height;
      const { width } = annotation;
      const { height } = annotation;
      const startPointX = annotation.left;
      const startPointY = annotation.top;
      const ratio = height / width;
      const angle =
        (Math.atan2(endY - startPointY, endX - startPointX) * 180) / Math.PI;
      const line = new fabric.Line(
        [
          annotation.left,
          annotation.top,
          annotation.left + annotation.width,
          annotation.top + annotation.height,
        ],
        {
          stroke: annotation?.color ? annotation?.color : "#00ff00",
          strokeWidth: 4,
        }
      );
      const arrowHead = new fabric.Polygon(
        [
          { x: 0, y: 0 },
          { x: 8, y: -4 },
          { x: 8, y: 4 },
        ],
        {
          width: annotation?.width,
          height: annotation?.height,
          stroke: annotation?.color ? annotation?.color : "#00ff00",
          strokeWidth: 6,
          fill: annotation?.color ? annotation?.color : "#00ff00",
          top: annotation.top,
          left: annotation.left,
          originX: "center",
          originY: "center",
          angle,
        }
      );
      var objs = [line, arrowHead];
      shape = new fabric.Group(objs, {
        hasControls: false,
        hasRotatingPoint: false,
        lockMovementX: true,
        lockMovementY: true,
      });
      break;
    case "marker":
      shape = new fabric.Ellipse({
        left: textLength >= 300 ? -10000 : annotation.left,
        top: textLength >= 300 ? 200 : annotation.top,
        width: 120,
        height: 120,
        color: "#00ff00",
        fill: "transparent",
        stroke: "#00ff00",
        strokeWidth: 30,
        strokeUniform: annotation.strokeUniform,
        rx: 60,
        ry: 60,
        angle: annotation.angle,
        hasControls: annotation.globalCompositeOperation,
        hasRotatingPoint: annotation.globalCompositeOperation,
        lockMovementX: !annotation.globalCompositeOperation,
        lockMovementY: !annotation.globalCompositeOperation,
      });
      break;
    case "viewport":
      shape = { ...annotation };
      break;

    default:
      shape = null;
  }
  return shape;
};

export const addAnnotationToCanvas = ({ canvas, user, viewer, annotation }) => {
  if (!canvas || !annotation || !viewer) return null;

  const shape = createAnnotation(annotation);

  // add shape to canvas and to activity feed
  if (shape && shape.type !== "viewport") canvas.add(shape);

  const message = createAnnotationMessage({
    shape,
    viewer,
    annotation,
    user,
  });

  return message;
};

// add annotation to the canvas
export const addAnnotationsToCanvas = ({
  canvas,
  viewer,
  user,
  annotations = [],
  userInfo,
}) => {
  if (!canvas || !viewer || annotations.length === 0) return null;
  // remove render on each add annotation
  const originalRender = canvas.renderOnAddRemove;
  canvas.renderOnAddRemove = false;

  const feed = [];
  // console.log("AAA", annotations);

  annotations.forEach((annotation) => {
    const shape = createAnnotation(annotation);
    const textLength = annotation?.text?.length;
    if (
      annotation?.type === "textBox" ||
      (annotation?.type === "textbox" && annotation.usingAs !== "comment")
    )
      return;
    const text = new fabric.Textbox(`${annotation?.text}`, {
      left: textLength >= 300 ? -10000 : annotation?.left, // positining text
      top: textLength >= 300 ? 200 : annotation?.top,
      backgroundColor: "transparent",
      fill:
        annotation.type === "marker" && textLength >= 300
          ? "#1109ed"
          : "#0078d4",
      selectable: false,
      textAlign: "left",
      fontWeight: 500,
      fontFamily: "inter",
      lineHeight: 0.9,
      hasBorders: true,
      padding: "100px",
      hasControls: false,
      hasRotatingPoint: false,
    });
    viewer.addHandler("zoom", function (e) {
      const zoomlevel = e.zoom;
      const initialObjectSize = 560;
      const initialMarkerSize = 300;
      const zoomValue = parseInt(
        Math.ceil((e.zoom * 40) / viewer.viewport.getMaxZoom()),
        10
      );
      const newObjectSize = initialObjectSize / zoomValue;
      const newMarkerSize = initialMarkerSize / zoomValue;
      function getTextWidth(textData) {
        const context = canvas.getContext("2d");
        return context.measureText(textData).width;
      }
      text.set("width", getTextWidth(annotation?.text, "inter") * 1.3);
      text.set("backgroundColor", "#F6F6F6");
      text.set("fontSize", newObjectSize);
      text.set(
        "left",
        textLength >= 300
          ? -10000 + newObjectSize
          : annotation.left + newObjectSize
      );
      // text.set("top", annotation?.top + 10);
      text.set("rx", 10);
      text.set("ry", 10);
      if (shape.type === "marker") {
        shape.set("width", newMarkerSize);
        shape.set("height", newMarkerSize);
        shape.set("rx", newMarkerSize / 1.5);
        shape.set("ry", newMarkerSize / 1.5);
      }
      canvas.renderAll();
    });
    if (
      shape &&
      shape.type !== "viewport" &&
      annotation?.text &&
      annotation?.globalCompositeOperation !== "source-over"
    )
      canvas.add(text);

    // add shape to canvas and to activity feed
    if (shape && shape.type !== "viewport") canvas.add(shape);

    const message = createAnnotationMessage({
      shape,
      viewer,
      annotation,
      user,
      userInfo,
    });

    feed.push(message);
  });

  // restore render on each add annotation
  canvas.renderOnAddRemove = originalRender;

  canvas.requestRenderAll();

  viewer.viewport.zoomBy(1.01);

  return feed;
};

/** create contour(annotation) from the analysed data */
export const createContour = ({ contour, color, tag, left, top }) => {
  if (!contour || !left || !top) return null;
  const points = contour.map((point) => ({
    x: point[0][0] + left,
    y: point[0][1] + top,
  }));
  return new fabric.Polygon(points, {
    stroke: "black",
    strokeWidth: 1.2,
    tag,
    fill: color ? `${color.hex}80` : "",
    strokeUniform: true,
  });
};

/** create contours(annotation) around cell from analysis data */
export const createContours = ({ canvas, contours, color, tag, left, top }) => {
  if (!canvas || !contours || contours.length === 0) return null;

  const cells = [];

  contours[0].forEach((roi) => {
    cells.push(createContour({ contour: roi, color, tag, left, top }));
  });

  return cells;
};

/**  
  Group enclosing annotation and cells (contours) and return feed message object 
*/
export const groupAnnotationAndCells = ({
  cells,
  enclosingAnnotation,
  optionalData,
}) => {
  if (!cells || !enclosingAnnotation) return null;
  const { slide, hash, title, text, zoomLevel, points, timeStamp, path } =
    enclosingAnnotation;
  enclosingAnnotation.set({ fill: "" });
  const group = new fabric.Group([enclosingAnnotation, ...cells]).set({
    slide,
    hash,
    title,
    text,
    zoomLevel,
    points,
    path,
    timeStamp,
    isAnalysed: true,
    fill: "",
  });

  // check if optionalData is available and also is not empty
  if (optionalData && Object.keys(optionalData).length > 0) {
    group.set({ analysedData: optionalData, roiType: optionalData.roiType });
  }

  const message = {
    username: "",
    object: group,
    image: null,
  };

  return message;
};

/** Remove annotation from the DB */
export const deleteAnnotationFromDB = async ({
  slideId,
  hash,
  onDeleteAnnotation,
  type,
}) => {
  if (!onDeleteAnnotation) return false;
  try {
    // const resp = await onDeleteAnnotation({ hash, slideId });
    onDeleteAnnotation({ hash, slideId, type });

    // if (resp.data.success) return true;
    return true;
  } catch (error) {
    console.error(error);
  }
  return false;
};

/** Save annotation to the database */
export const saveAnnotationToDB = async ({
  slideId,
  annotation,
  onSaveAnnotation,
}) => {
  if (!slideId || !annotation || !onSaveAnnotation) return false;
  console.log(annotation);
  const annotationJSON = getAnnotationJSON(annotation);
  console.log(annotationJSON);
  try {
    if (annotationJSON.type === "line") {
      annotationJSON.x1 = annotationJSON.cords[0];
      annotationJSON.y1 = annotationJSON.cords[1];
      annotationJSON.x2 = annotationJSON.cords[2];
      annotationJSON.y2 = annotationJSON.cords[3];
    }
    annotationJSON.strokeWidth = annotationJSON.strokeWidth.toString();
    delete annotationJSON?.strokeDashArray;
    delete annotationJSON?.slide;
    delete annotationJSON?.shadow;
    delete annotationJSON?.timeStamp;

    onSaveAnnotation({ slideId, data: annotationJSON });
  } catch (error) {
    return false;
  }
  return true;
};

/** Save annotations to the database */
export const saveAnnotationsToDB = async ({
  slideId,
  canvas,
  onSaveAnnotation,
}) => {
  if (!slideId || !canvas || !onSaveAnnotation) return false;
  const annotations = getCanvasJSON(canvas);
  if (annotations.objects.length > 0) {
    try {
      await onSaveAnnotation({ slideId, data: annotations.objects });
    } catch (error) {
      return false;
    }
  }
  return true;
};

/** Update annotation details in feed and also update DB */
export const updateAnnotationInDB = async ({
  slideId,
  hash,
  updateObject,
  onUpdateAnnotation,
}) => {
  // console.log("updateObject",updateObject);
  if (!hash || !updateObject || !onUpdateAnnotation) return false;
  try {
    await onUpdateAnnotation({
      slideId,
      hash,
      updateObject,
    });
  } catch (error) {
    return false;
  }
  return true;
};

/** Load annotations from the DB  and return feed */
export const loadAnnotationsFromDB = async ({
  slideId,
  canvas,
  viewer,
  // onLoadAnnotations,
  data,
  success,
  userInfo,
}) => {
  // if (!slideId || !canvas || !viewer || !onLoadAnnotations)
  if (!slideId || !canvas || !viewer)
    return { feed: null, status: "error", message: "Invalid parameters" };
  try {
    // const { data, success } = await onLoadAnnotations({ slideId }).unwrap();
    if (success) {
      const feed = addAnnotationsToCanvas({
        canvas,
        viewer,
        annotations: data,
        userInfo,
      });

      return { feed, status: "success" };
    }
  } catch (error) {
    return { feed: null, status: "error" };
  }
  return { feed: null, status: "success" };
};

/** Group selected anntations */
export const groupAnnotations = ({ canvas }) => {
  if (!canvas) return;
  if (!canvas.getActiveObject()) {
    return;
  }
  if (canvas.getActiveObject().type !== "activeSelection") {
    return;
  }
  const annoGroup = canvas.getActiveObject().toGroup();
  annoGroup.hash = md5(annoGroup);
  canvas.requestRenderAll();
  // const annotations = canvas.getObjects();

  // if (annotations.length > 1) {
  //   const annoGroup = new fabric.Group(annotations);
  //   const hash = md5(annoGroup);
  //   annoGroup.set({ hash });
  //   annotations.forEach((obj) => canvas.remove(obj));
  //   canvas.add(annoGroup);
  //   canvas.renderAll();
  // }
};

/** Ungroup the group annotation */
export const ungroupAnnotations = ({ canvas }) => {
  if (!canvas) return;
  if (!canvas.getActiveObject()) {
    return;
  }
  if (canvas.getActiveObject().type !== "group") {
    return;
  }
  canvas.getActiveObject().toActiveSelection();
  canvas.requestRenderAll();
};

export const getVhutAnalysisData = async ({ canvas, vhut, left, top }) => {
  if (!canvas || !vhut) return null;
  const { analysedData: data } = vhut;
  const analysedData = [];
  let cells = [];
  let totalCells = 0;

  const cellColor = {
    Neutrophil: { hex: "#FFFF00" },
    Epithelial: { hex: "#FF0000" },
    Lymphocyte: { hex: "#00FFFF" },
    Plasma: { hex: "#8FED66" },
    Eosinohil: { hex: "#FF00FF" },
    Connective: { hex: "#FFA500" },
  };

  data.forEach((item) => {
    const {
      status,
      type,
      count,
      ratio,
      total_area,
      min_area,
      max_area,
      avg_area,
      total_perimeter,
      min_perimeter,
      max_perimeter,
      avg_perimeter,
      contours,
    } = item;
    if (status === "detected") {
      const cell = createContours({
        canvas,
        contours,
        tag: type,
        color: cellColor[type],
        left,
        top,
      });

      cells = [...cells, ...cell];
      totalCells += count;
    }
    analysedData.push({
      color: cellColor[type].hex,
      status,
      type,
      count,
      ratio,
      total_area,
      min_area,
      max_area,
      avg_area,
      total_perimeter,
      min_perimeter,
      max_perimeter,
      avg_perimeter,
    });
  });

  return { analysedData, cells, totalCells };
};

export const getAnnotationMetric = (annotation, mpp) => {
  if (!annotation) return null;

  let metric = { type: "", value: "", unit: "μm" };

  if (annotation.type === "line") {
    let x1;
    let y1;
    let x2;
    let y2;
    if (annotation.cords) {
      [x1, y1, x2, y2] = annotation.cords;
    } else {
      //  var {x1, y1, x2, y2} = annotation
      x1 = annotation.x1;
      x2 = annotation.x2;
      y1 = annotation.y1;
      y2 = annotation.y2;
    }
    // const [x1, y1, x2, y2] = annotation.cords || annotation;
    metric = { type: "length", value: Math.hypot(x2 - x1, y2 - y1) * mpp };
  } else if (annotation.type === "rectang") {
    metric = {
      type: "area",
      value: annotation.width * annotation.height * mpp * mpp,
    };
  } else if (annotation.type === "ellipsesph") {
    metric = { type: "area", value: 9 };
  }

  if (metric.value) {
    const res = normalizeUnits(metric);
    metric = { ...metric, ...res };
  }
  return metric;
};
