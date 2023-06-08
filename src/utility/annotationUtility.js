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
    "area",
    "perimeter",
    "centroid",
    "end_points",
    "isAnalysed",
    "analysedROI",
    "timeStamp",
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
    const {
      slide,
      hash,
      text,
      title,
      zoomLevel,
      points,
      isClosed,
      timeStamp,
      area,
      perimeter,
      centroid,
      endPoints,
      isAnalysed,
      analysedROI,
    } = annotation;

    if (shape.type === "viewport") {
      message.object = {
        ...message.object,
        slide,
        hash,
        text,
        title,
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
        title,
        zoomLevel,
        points,
        timeStamp,
        isClosed,
        area,
        perimeter,
        centroid,
        endPoints,
        isAnalysed,
        analysedROI,
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
        text: message.object.text,
        maskType: maskType || "",
        type: type || "",
        isClosed: isClosed,
      });
    }
  }

  return message;
};

// create annotation from the annotation data
export const createAnnotation = (annotation) => {
  let shape;
  switch (annotation.type) {
    case "ellipse":
      shape = new fabric.Ellipse({
        left: annotation.left,
        top: annotation.top,
        width: annotation.width,
        height: annotation.height,
        color: "black",
        fill: annotation.fill,
        stroke: "#000",
        strokeWidth: annotation.strokeWidth ? annotation.strokeWidth : 30,
        strokeUniform: annotation.strokeUniform,
        rx: annotation.rx,
        ry: annotation.ry,
        angle: annotation.angle,
        hasControls: annotation.hash,
        hasRotatingPoint: annotation.hash,
        lockMovementX: !annotation.hash,
        lockMovementY: !annotation.hash,
      });
      break;

    case "textbox":
      shape = new fabric.Textbox(`${annotation.text}`, {
        left: annotation.left,
        top: annotation.top,
        width: 450,
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
      });
      break;

    case "rect":
      shape = new fabric.Rect({
        left: annotation.left,
        top: annotation.top,
        width: annotation.width,
        height: annotation.height,
        color: "black",
        fill: annotation.fill,
        stroke: "#000",
        strokeWidth: annotation.strokeWidth ? annotation.strokeWidth : 30,
        strokeUniform: annotation.strokeUniform,
        hasControls: annotation.hash,
        hasRotatingPoint: annotation.hash,
        lockMovementX: !annotation.hash,
        lockMovementY: !annotation.hash,
      });
      break;

    case "polygon":
      shape = new fabric.Polygon(annotation.points, {
        stroke: "#000",
        strokeWidth: annotation.strokeWidth ? annotation.strokeWidth : 30,
        fill: annotation.fill,
        strokeUniform: annotation.strokeUniform,
        hasControls: annotation.hash,
        hasRotatingPoint: annotation.hash,
        lockMovementX: !annotation.hash,
        lockMovementY: !annotation.hash,
      });
      break;

    case "path":
      shape = new fabric.Path(annotation.path, {
        color: "black",
        stroke: "#000",
        strokeWidth: annotation.strokeWidth ? annotation.strokeWidth : 30,
        strokeUniform: annotation.strokeUniform,
        fill: annotation.fill,
        hasControls: annotation.hash,
        hasRotatingPoint: annotation.hash,
        lockMovementX: !annotation.hash,
        lockMovementY: !annotation.hash,
      });
      break;

    case "line":
      shape = new fabric.Line(annotation.cords, {
        color: "black",
        stroke: "#000",
        strokeWidth: annotation.strokeWidth ? annotation.strokeWidth : 30,
        strokeUniform: annotation.strokeUniform,
        fill: annotation.fill,
        hasControls: annotation.hash,
        hasRotatingPoint: annotation.hash,
        lockMovementX: !annotation.hash,
        lockMovementY: !annotation.hash,
      });
      break;
    case "arrow":
      // need to remove declaration in case bloack
      const pointerX = annotation.left;
      const pointerY = annotation.top;
      const width = annotation.width;
      const height = annotation.height;
      const startPointX = annotation.left;
      const startPointY = annotation.top;
      const ratio = height / width;
      const angle = (Math.atan(ratio) / Math.PI) * 100;
      const line = new fabric.Line(
        [
          annotation.left,
          annotation.top,
          annotation.left,
          annotation.top + 150,
        ],
        {
          stroke: "#00ff00",
          strokeWidth: 30,
        }
      );
      const arrowHead = new fabric.Polygon(
        [
          { x: 0, y: 0 },
          { x: -100, y: -50 },
          { x: -100, y: 50 },
        ],
        {
          stroke: "#00ff00",
          strokeWidth: 30,
          fill: "#00ff00",
          top: annotation.top,
          left: annotation.left,
          originX: "center",
          originY: "center",
        }
      );
      if (pointerX >= startPointX) {
        if (pointerY <= startPointY) {
          arrowHead.angle = 180 - angle;
        } else if (pointerY > startPointY) {
          arrowHead.angle = 360 - angle;
        }
      } else if (pointerY <= startPointY) {
        arrowHead.angle = angle;
      } else if (pointerY > startPointY) {
        arrowHead.angle = angle;
      }
      var objs = [line, arrowHead];
      shape = new fabric.Group(objs, {
        hasControls: annotation.hash,
        hasRotatingPoint: annotation.hash,
        lockMovementX: !annotation.hash,
        lockMovementY: !annotation.hash,
      });
      break;
    case "marker":
      const line1 = new fabric.Line(
        [
          annotation.left,
          annotation.top - 20,
          annotation.left,
          annotation.top - 150,
        ],
        {
          stroke: "#00ff00",
          strokeWidth: annotation.strokeWidth ? annotation.strokeWidth : 30,
        }
      );
      const line2 = new fabric.Line(
        [
          annotation.left,
          annotation.top + 30,
          annotation.left,
          annotation.top + 150,
        ],
        {
          stroke: "#00ff00",
          strokeWidth: annotation.strokeWidth ? annotation.strokeWidth : 30,
        }
      );
      const line3 = new fabric.Line(
        [
          annotation.left - 10,
          annotation.top - 10,
          annotation.left - 150,
          annotation.top - 10,
        ],
        {
          stroke: "#00ff00",
          strokeWidth: annotation.strokeWidth ? annotation.strokeWidth : 30,
        }
      );
      const line4 = new fabric.Line(
        [
          annotation.left + 40,
          annotation.top - 10,
          annotation.left + 170,
          annotation.top - 10,
        ],
        {
          stroke: "#00ff00",
          strokeWidth: annotation.strokeWidth ? annotation.strokeWidth : 30,
        }
      );
      const Id = new fabric.Textbox(`${annotation.localId}`, {
        left: annotation.left - 150,
        top: annotation.top - 200,
        color: "#00ff00",
        backgroundColor: "rgba(0,0,0,0.6)",
        fill: "#00ff00",
      });
      var objs = annotation.localId
        ? [line1, line2, line3, line4, Id]
        : [line1, line2, line3, line4];
      shape = new fabric.Group(objs, {
        hasControls: annotation.hash,
        hasRotatingPoint: annotation.hash,
        lockMovementX: !annotation.hash,
        lockMovementY: !annotation.hash,
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

  annotations.forEach((annotation) => {
    const shape = createAnnotation(annotation);
    canvas.on("mouse:over", function (e) {
      if (e?.target?.type === "textBox" || e?.target?.type === "textbox")
        return;
      const zoomLevel = viewer.viewport.getZoom();
      const fontSize = zoomLevel <= 1 ? 250 : 250 / zoomLevel;
      const textHeight = e?.target?.height / 2; // height of target
      const title = new fabric.Text(`${e?.target?.title}`, {
        left: e?.target?.left + e?.target?.width + 20, // positining text
        top: e?.target?.top + textHeight,
        backgroundColor: "rgba(0,0,0,0.6)",
        fill: e?.taget?.color ? e?.taget?.color : "#00ff00",
        selectable: false,
        textAlign: "center",
        fontWeight: 600,
        fontFamily: "inter",
      });
      if (e?.target === shape && e?.target?.title) {
        if (shape && shape.type !== "viewport") canvas.add(title);
        title.fontSize = fontSize;
      }
      canvas.on("mouse:out", function (e) {
        canvas.remove(title).requestRenderAll();
      });
    });

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
  // console.log(annotation);
  const annotationJSON = getAnnotationJSON(annotation);
  // console.log(annotationJSON);
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
