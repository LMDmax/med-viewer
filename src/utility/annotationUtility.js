import { fabric } from "openseadragon-fabricjs-overlay";
import md5 from "md5";
import { normalizeUnits } from "./utility";

/** Get annotation JSON */
export const getAnnotationJSON = (annotation) => {
  if (!annotation) return null;
  if (annotation.type === "viewport") return annotation;
  return annotation.toJSON([
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
  user,
  annotation,
}) => {
  if (!viewer || !shape) return null;

  const message = {
    username: user ? `${user.firstName} ${user.lastName}` : "",
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
      };
    } else {
      message.object.set({
        timeStamp,
        hash,
        slide: slideId,
        zoomLevel: viewer.viewport.getZoom(),
        text: "",
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
      break;

    case "line":
      shape = new fabric.Line(annotation.points, {
        color: annotation.color,
        stroke: annotation.stroke,
        strokeWidth: annotation.strokeWidth,
        strokeUniform: annotation.strokeUniform,
        fill: annotation.fill,
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

// add annotation to the canvas
export const addAnnotationsToCanvas = ({
  canvas,
  viewer,
  user,
  annotations = [],
}) => {
  if (!canvas || !viewer || annotations.length === 0) return null;
  // remove render on each add annotation
  const originalRender = canvas.renderOnAddRemove;
  canvas.renderOnAddRemove = false;

  const feed = [];

  annotations.forEach((annotation) => {
    const shape = createAnnotation(annotation);

    // add shape to canvas and to activity feed
    if (shape && shape.type !== "viewport") canvas.add(shape);

    const message = createAnnotationMessage({
      shape,
      viewer,
      annotation,
      user,
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
    group.set({ analysedData: optionalData });
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
}) => {
  if (!onDeleteAnnotation) return false;
  try {
    const resp = await onDeleteAnnotation({ hash, slideId });
    if (resp.data.success) return true;
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
  const annotationJSON = getAnnotationJSON(annotation);
  try {
    await onSaveAnnotation({ slideId, data: annotationJSON });
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
  onLoadAnnotations,
}) => {
  if (!slideId || !canvas || !viewer || !onLoadAnnotations)
    return { feed: null, status: "error", message: "Invalid parameters" };
  try {
    const { data, success } = await onLoadAnnotations({ slideId }).unwrap();
    if (success) {
      const feed = addAnnotationsToCanvas({
        canvas,
        viewer,
        annotations: data,
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
    Neutrophil: { hex: "#9800FF" },
    Epithelial: { hex: "#0008FF" },
    Lymphocyte: { hex: "#00F6FF" },
    Plasma: { hex: "#2AFF00" },
    Eosinohil: { hex: "#FAFF00" },
    Connective: { hex: "#478C9E" },
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
    const [x1, y1, x2, y2] = annotation.points;
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
