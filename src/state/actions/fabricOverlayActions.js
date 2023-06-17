export const updateColor = (payload) => ({
  type: "updateColor",
  payload,
});

export const updateTool = ({ tool }) => ({
  type: "updateTool",
  payload: { tool },
});

export const updateOverlay = ({ id, fabricOverlay, viewer }) => ({
  type: "updateOverlay",
  payload: { id, fabricOverlay, viewer },
});

export const updateUserCanvases = (payload) => ({
  type: "updateUserCanvases",
  payload,
});

export const addToActivityFeed = ({ id, feed }) => ({
  type: "addToActivityFeed",
  payload: { id, feed },
});

export const removeFromActivityFeed = ({ id, hash }) => ({
  type: "removeFromActivityFeed",
  payload: { id, hash },
});

export const updateActivityFeed = ({ id, fullFeed }) => ({
  type: "updateActivityFeed",
  payload: { id, feed: fullFeed },
});

export const updateFeedInAnnotationFeed = ({ id, feed }) => ({
  type: "updateFeedInAnnotationFeed",
  payload: { id, feed },
});

export const addViewerWindow = (viewerWindows) => ({
  type: "addViewerWindow",
  payload: viewerWindows,
});

export const removeViewerWindow = ({ id }) => ({
  type: "removeViewerWindow",
  payload: { id },
});

export const addViewerInstance = ({
  id,
  viewerId,
  tile,
  slideName,
  originalFileUrl,
}) => ({
  type: "addViewerInstance",
  payload: { id, viewerId, tile, slideName, originalFileUrl },
});

export const removeViewerInstance = ({ id, viewerId }) => ({
  type: "removeViewerInstance",
  payload: { id, viewerId },
});

export const resetFabricOverlay = () => ({
  type: "resetFabricOverlay",
});

export const changeTile = ({
  id,
  tile,
  slideId,
  slideName,
  originalFileUrl,
}) => ({
  type: "changeTile",
  payload: { id, tile, slideId, slideName, originalFileUrl },
});

export const toggleSync = () => ({
  type: "toggleSync",
});

export const updateIsAnnotationLoading = ({ isLoading }) => ({
  type: "updateIsAnnotationLoading",
  payload: { isLoading },
});

export const updateIsViewportAnalysing = (isAnalysing) => ({
  type: "UPDATE_VIEWPORT_ANALYSING",
  payload: { isAnalysing },
});
