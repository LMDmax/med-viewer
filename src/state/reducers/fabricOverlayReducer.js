import _ from "lodash";
import { brandColors } from "../../styles/brandPalette";

export const getLocalUserCanvases = () => {
  const userCanvases = window.localStorage.getItem("userCanvases");
  if (!userCanvases) {
    window.localStorage.setItem("userCanvases", JSON.stringify({}));
    return {};
  }
  return JSON.parse(userCanvases);
};

const defaultViewerWindow = {
  activeUserCanvas: "",
  fabricOverlay: null,
  userCanvases: getLocalUserCanvases(),
  viewer: null,
  activityFeed: [],
  tile: "",
  slideName: "",
  slideId: "",
  originalFileUrl: "",
};

const fabricOverlayReducer = (state, action) => {
  switch (action.type) {
    case "updateColor":
      return { ...state, color: action.payload };

    case "updateTool":
      return { ...state, activeTool: action.payload.tool };

    case "updateOverlay":
      if (action.payload.id in state.viewerWindow) {
        return {
          ...state,
          viewerWindow: {
            ...state.viewerWindow,
            [action.payload.id]: {
              ...state.viewerWindow[action.payload.id],
              fabricOverlay: action.payload.fabricOverlay,
              viewer: action.payload.viewer,
            },
          },
        };
      }
      return state;

    case "updateUserCanvases":
      return {
        ...state,
        viewerWindow: {
          ...state.viewerWindow,
          [action.payload.id]: {
            ...state.viewerWindow[action.payload.id],
            activeUserCanvas: action.payload.activeUserCanvas,
            userCanvases: action.payload.userCanvases,
          },
        },
      };

    case "addToActivityFeed": {
      const af = state.viewerWindow[action.payload.id].activityFeed;
      return {
        ...state,
        viewerWindow: {
          ...state.viewerWindow,
          [action.payload.id]: {
            ...state.viewerWindow[action.payload.id],
            activityFeed: [...af, action.payload.feed],
          },
        },
      };
    }

    case "removeFromActivityFeed": {
      const newFeed = state.viewerWindow[action.payload.id].activityFeed.filter(
        (af) => af?.object?.hash !== action.payload.hash
      );
      return {
        ...state,
        viewerWindow: {
          ...state.viewerWindow,
          [action.payload.id]: {
            ...state.viewerWindow[action.payload.id],
            activityFeed: newFeed,
          },
        },
      };
    }

    case "updateActivityFeed":
      return {
        ...state,
        viewerWindow: {
          ...state.viewerWindow,
          [action.payload.id]: {
            ...state.viewerWindow[action.payload.id],
            activityFeed: action.payload.feed,
          },
        },
      };

    case "updateFeedInAnnotationFeed": {
      const newFeed = state.viewerWindow[action.payload.id].activityFeed.filter(
        (af) => af.object.hash !== action.payload.feed.object.hash
      );
      return {
        ...state,
        viewerWindow: {
          ...state.viewerWindow,
          [action.payload.id]: {
            ...state.viewerWindow[action.payload.id],
            activityFeed: [...newFeed, action.payload.feed],
          },
        },
      };
    }

    case "addViewerWindow": {
      const viewerWindow = {};
      action.payload.forEach((w) => {
        viewerWindow[w.id] = {
          ...defaultViewerWindow,
          tile: w.tile,
          slideName: w.slideName,
          slideId: w.slideId,
          originalFileUrl: w.originalFileUrl,
        };
      });
      return {
        ...state,
        viewerWindow: {
          ...state.viewerWindow,
          ...viewerWindow,
        },
      };
    }

    case "removeViewerWindow": {
      const newViewerWindow = {};
      _.keys(state.viewerWindow).forEach((id) => {
        if (id !== action.payload.id)
          newViewerWindow[id] = state.viewerWindow[id];
      });
      const { viewer } = state.viewerWindow[action.payload.id];
      viewer.destroy();
      return { ...state, viewerWindow: { ...newViewerWindow } };
    }

    case "addViewerInstance": {
      const parentViewer = state.viewerWindow[action.payload.viewerId];
      return {
        ...state,
        viewerWindow: {
          ...state.viewerWindow,
          [action.payload.viewerId]: {
            ...parentViewer,
            instance: action.payload.id,
          },
          [action.payload.id]: {
            ...defaultViewerWindow,
            tile: action.payload.tile,
            slideName: action.payload.slideName,
            parent: action.payload.viewerId,
            originalFileUrl: action.payload.originalFileUrl,
          },
        },
      };
    }

    case "removeViewerInstance": {
      const newViewerWindow = {};
      _.keys(state.viewerWindow).forEach((id) => {
        if (id !== action.payload.id)
          newViewerWindow[id] = state.viewerWindow[id];
      });
      const parentViewer = state.viewerWindow[action.payload.viewerId];
      // state.viewerWindow[action.payload.id].viewer.destroy();
      return {
        ...state,
        viewerWindow: {
          ...newViewerWindow,
          [action.payload.viewerId]: { ...parentViewer, instance: null },
        },
      };
    }

    case "changeTile": {
      const viewerW = state.viewerWindow[action.payload.id];
      return {
        ...state,
        viewerWindow: {
          ...state.viewerWindow,
          [action.payload.id]: {
            ...viewerW,
            tile: action.payload.tile,
            slideName: action.payload.slideName,
            slideId: action.payload.slideId,
            originalFileUrl: action.originalFileUrl,
            activityFeed: [],
          },
        },
      };
    }

    case "resetFabricOverlay":
      return {
        ...state,
        viewerWindow: {},
        activeTool: "Move",
        color: brandColors[0],
      };

    case "toggleSync":
      return {
        ...state,
        sync: !state.sync,
      };

    case "updateIsAnnotationLoading":
      return {
        ...state,
        isAnnotationLoading: action.payload.isLoading,
      };

    case "UPDATE_VIEWPORT_ANALYSING":
      return {
        ...state,
        isViewportAnalysing: action.payload.isAnalysing,
      };

    default:
      return state;
  }
};

export default fabricOverlayReducer;
