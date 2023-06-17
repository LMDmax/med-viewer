import html2canvas from "html2canvas";
import md5 from "md5";

export const getTimestamp = () => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(Date.now());
};

export const getTime = (timeStamp) => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(timeStamp);
};

export const getFontSize = (screenSize, zoomValue) => {
  const scaleValue = zoomValue / 40;
  // for screen smaller than 1280
  if (screenSize[0]) {
    if (zoomValue === 0) return 650;
    return 15 / scaleValue;
  }
  // for screen smaller than 1440
  if (screenSize[1]) {
    if (zoomValue === 0) return 900;
    if (zoomValue <= 1) return 480;
    if (zoomValue <= 2) return 290;
    if (zoomValue <= 3) return 190;
    return 16 / scaleValue;
  }
  // for screen smaller than 1920
  if (screenSize[2]) {
    if (zoomValue === 0) return 1000;
    if (zoomValue <= 1) return 650;
    if (zoomValue <= 2) return 400;
    return 24 / scaleValue;
  }
  // for screen smaller than 2560
  if (screenSize[3]) {
    if (zoomValue === 0) return 1500;
    return 35 / scaleValue;
  }
  if (zoomValue === 0) return 2000;
  return 44 / scaleValue;
};

export const getCanvasImage = async (viewerId) => {
  const canvas = await html2canvas(
    document.querySelector(`#${`viewer${viewerId}`} .openseadragon-canvas`),
    {
      backgroundColor: null,
      logging: true,
      allowTaint: false,
      useCORS: true,
      removeContainer: false,
    }
  );
  return canvas.toDataURL("image/png");
};

// check if case has enough slides for a particular project type
// for single slide - 1 and for multi slide more than 1
export const isCaseViewable = (projectType, numOfSlides) => {
  if (projectType === "singleSlide" && numOfSlides !== 1) return false;
  if (projectType === "multiSlide" && numOfSlides < 2) return false;
  return true;
};

// to get id (number) from user subclaim
export const getUserId = (user) =>
  user ? user.sub.substring(user.sub.indexOf("|") + 1) : "";

// extract slide url from .dzi file
export const getSlideUrl = (url) => {
  return url
    ? `${url.substring(0, url.lastIndexOf("."))}_files/8/0_0.jpeg`
    : "";
};

// get index of the item in the array
export const findCurrentIndex = (itemId, arr = []) => {
  return arr.findIndex((elm) => elm._id === itemId);
};

// get the zoom value from the zoom level
export const getZoomValue = (viewer) => {
  if (!viewer) return null;
  return parseInt(
    Math.ceil((viewer.viewport.getZoom() * 40) / viewer.viewport.getMaxZoom()),
    10
  );
};

// get the scale Factor
export const getScaleFactor = (viewer) => {
  const zoomValue = getZoomValue(viewer);
  return zoomValue !== 0 ? zoomValue / 40 : 1 / 40;
};

// get s3 bucket folder of tile
export const getFileBucketFolder = (url) => {
  return url ? url.split("/").splice(3).join("/") : "";
};

// get viewport bounds
export const getViewportBounds = (viewer) => {
  if (!viewer) return null;
  const bounds = viewer.viewport.getBounds();
  const { x, y, width, height } = viewer.viewport.viewportToImageRectangle(
    bounds.x,
    bounds.y,
    bounds.width,
    bounds.height
  );

  return { x, y, width, height };
};

// zoom to a specific level
export const zoomToLevel = ({ viewer, value }) => {
  if (!viewer) return;

  // check if value is less than 1, then make it 1
  // and if value is greater than 40, then make it 40
  if (value && value < 1) {
    value = 1;
  } else if (value > 40) {
    value = 40;
  }

  // if value is empty, don't do anything
  if (value) {
    const level = value * (viewer.viewport.getMaxZoom() / 40);
    viewer.viewport.zoomTo(level);
  }
};

// convert zoom level to zoom value
export const convertToZoomValue = ({ level, viewer }) => {
  if (!viewer) return null;
  return parseInt(Math.ceil((level * 40) / viewer.viewport.getMaxZoom()), 10);
};

// normalize measurement units
export const normalizeUnits = ({ type, value }) => {
  const res = { unit: "μm" };
  if (type === "length") {
    if (value >= 100) {
      value /= 1000;
      res.unit = "mm";
    }
    if (res.unit === "mm" && value >= 10) {
      value /= 10;
      res.unit = "cm";
    }
    if (res.unit === "cm" && value >= 100) {
      value /= 100;
      res.unit = "m";
    }
  } else {
    if (value >= 100000) {
      value /= 1000000;
      res.unit = "mm";
    }
    if (res.unit === "mm" && value >= 100) {
      value /= 100;
      res.unit = "cm";
    }
    if (res.unit === "cm" && value >= 1000) {
      value /= 10000;
      res.unit = "m";
    }
  }

  res.value = value.toFixed(3);

  return res;
};

export const getPPMfromMPP = (mpp) => {
  if (!mpp) mpp = 0.25;
  return Math.round(1000000 / mpp);
};
