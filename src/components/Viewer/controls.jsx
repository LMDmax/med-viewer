import React, { useEffect, useState, useRef, useCallback } from "react";
import OpenSeadragon from "openseadragon";
import "./zoom-levels";
import "./openseadragon-scalebar";
import { fabric } from "fabric";
import { useLazyQuery, useMutation, useSubscription } from "@apollo/client";
import {
  VStack,
  useToast,
  useDisclosure,
  Flex,
  Text,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import axios from "axios";
import Draggable from "react-draggable";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { MdOutlineDragIndicator } from "react-icons/md";

import {
  ANNOTATIONS_SUBSCRIPTION,
  DELETE_ANNOTATION,
  GET_ANNOTATION,
  GET_VHUT_ANALYSIS,
  GET_XMLANNOTATION,
  UPDATE_ANNOTATION,
  VHUT_ANALTSIS,
  VHUT_ANALYSIS_SUBSCRIPTION,
} from "../../graphql/annotaionsQuery";
import useCanvasHelpers from "../../hooks/use-fabric-helpers";
import {
  updateIsAnnotationLoading,
  updateActivityFeed,
  updateFeedInAnnotationFeed,
  updateIsViewportAnalysing,
  removeFromActivityFeed,
} from "../../state/actions/fabricOverlayActions";
import { useFabricOverlayState } from "../../state/store";
import {
  convertToZoomValue,
  getFileBucketFolder,
  groupAnnotationAndCells,
  loadAnnotationsFromDB,
  zoomToLevel,
  getViewportBounds,
  getVhutAnalysisData,
  getPPMfromMPP,
  getZoomValue,
  updateAnnotationInDB,
} from "../../utility";
import AnnotationChat from "../AnnotationChat/AnnotationChat";
import ShowMetric from "../Annotations/ShowMetric";
import ActivityFeed from "../Feed/activityFeed";
import EditText from "../Feed/editText";
import FullScreen from "../Fullscreen/Fullscreen";
import { MoveBar } from "../Icons/CustomIcons";
import Loading from "../Loading/loading";
import { CustomMenu } from "../RightClickMenu/Menu";
import ToolbarButton from "../ViewerToolbar/button";
import IconSize from "../ViewerToolbar/IconSize";
import ZoomButton from "../ZoomButton/ZoomButton";
import ZoomSlider from "../ZoomSlider/slider";
import { GET_ADJUSTMENT_RESULT } from "../../graphql/filterQuery";
import { useLocation } from "react-router-dom";

const ViewerControls = ({
  viewerId,
  setModelname,
  userInfo,
  bottomZoomValue,
  runAiModel,
  setToolSelected,
  viewerIds,
  setBottomZoomValue,
  enableAI,
  slide,
  isXmlAnnotations,
  application,
  setLoadUI,
  zoomValue,
  setNewSliderInputs,
  navigatorCounter,
  setZoomValue,
  client2,
  mentionUsers,
  caseInfo,
  addUsersToCase,
  Environment,
  accessToken,
  setIsXmlAnnotations,
  handleAnnotationClick,
  isLocalRegion,
}) => {
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { viewerWindow, isViewportAnalysing } = fabricOverlayState;
  const { viewer, fabricOverlay, slideId, originalFileUrl, tile } =
    viewerWindow[viewerId];
  localStorage.setItem("slide", slideId);
  const {
    updateAnnotation,
    deleteAnnotation,
    subscriptionAddAnnotation,
    subscriptionClearAnnotations,
    subscriptionDeleteAnnotation,
    subscriptionUpdateAnnotation,
  } = useCanvasHelpers(viewerId);

  const [isAnnotationLoaded, setIsAnnotationLoaded] = useState(false);
  const location = useLocation();
  const [hash, setHash] = useState(location.state.hash || "");
  const [isRightClickActive, setIsRightClickActive] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ left: 0, top: 0 });
  const [annotationObject, setAnnotationObject] = useState(null);
  const [updatedAnnotation, setUpdatedAnnotation] = useState({});
  const [manipulationComplete, setManipulationComplete] = useState(false);
  const [isMorphometryDisabled, setIsMorphometryDisabled] = useState(true);
  const [annotationText, setAnnotationText] = useState("");
  const [annotationShape, setAnnotationShape] = useState(null);
  const [activeFeed, setActiveFeed] = useState([]);
  const [xmlLink, setXmlLink] = useState("");
  const [annotatedData, setAnnotatedData] = useState("");
  const slideRef = useRef(null);
  const toast = useToast();
  const iconSize = IconSize();
  const { isOpen, onOpen: openMenu, onClose: closeMenu } = useDisclosure();
  const [isDisabled, setIsDisablesd] = useState(false);
  const {
    isOpen: isAnnotationOpen,
    onOpen: annotationChat,
    onClose: annotationClose,
  } = useDisclosure();

  const {
    isOpen: isEditOpen,
    onOpen: openEdit,
    onClose: closeEdit,
  } = useDisclosure();
  // console.log("sadddddddddddddd");
  const {
    isOpen: isKI67Open,
    onOpen: isKI67,
    onClose: isKI67Close,
  } = useDisclosure();

  // ############### LOAD_ANNOTATION ####################
  const [getAnnotation, { data: annotationData, loading, error }] =
    useLazyQuery(GET_ANNOTATION);
  const [getXmlAnnotation, { data: xmlAnnotationData }] =
    useLazyQuery(GET_XMLANNOTATION);

  //################## GET_FILTER_DATA #################
  const [
    onGetFilterData,
    { data: filterResponseData, error: filterResponseError },
  ] = useLazyQuery(GET_ADJUSTMENT_RESULT);

  // ########## RUN MORPHOMETRY ##########################
  const [onVhutAnalysis, { data: analysis_data, error: analysis_error }] =
    useMutation(VHUT_ANALTSIS);

  // ######## SHOW ANALYSIS AFTER RUNNING MORPHOMETRY ##############
  const [onGetVhutAnalysis, { data: responseData, error: responseError }] =
    useLazyQuery(GET_VHUT_ANALYSIS);

  const [
    modifyAnnotation,
    { data: updatedData, error: updateError, loading: updateLoading },
  ] = useMutation(UPDATE_ANNOTATION);

  const [removeAnnotation, { data: deletedData, error: deleteError }] =
    useMutation(DELETE_ANNOTATION);

  // console.log("ssssssssssslidedeeeeeeee", slideId);
  // ############### ANNOTATION_SUBSCRIPTION ########################
  const { data: subscriptionData, error: subscription_error } = useSubscription(
    ANNOTATIONS_SUBSCRIPTION,
    {
      variables: {
        slideId,
      },
    }
  );
  // console.log(annotationData);

  useEffect(() => {
    if (annotationData?.loadAnnotation?.data.length > 0) {
      const selectedChatAnnotation = annotationData?.loadAnnotation?.data.find(
        (item) => item.hash === hash
      );
      if (selectedChatAnnotation) {
        const { left, width, top, height, zoomLevel } = selectedChatAnnotation;
        const vpoint = viewer.viewport.imageToViewportRectangle(
          left + width / 2,
          top + height / 2
        );
        viewer.viewport.zoomTo(zoomLevel * 2);
        viewer.viewport.panTo(vpoint);
      }
    }
  }, [annotationData]);

  // #################### VHUT_ANALYSIS_SUBSCRIPTION ##############
  const { data: vhutSubscriptionData, error: vhutSubscription_error } =
    useSubscription(VHUT_ANALYSIS_SUBSCRIPTION, {
      variables: {
        body: {
          slideId,
        },
      },
    });

  // console.log(viewer?.viewport?.getZoom(true));
  // console.log(viewer?.viewport?.getBounds());
  const bounds = viewer?.viewport?.getBounds();

  // get the x and y values in the viewport
  const x = bounds?.x + bounds?.width / 2;
  const y = bounds?.y + bounds?.height / 2;

  // console.log(filterResponseData);
  // console.log(filterResponseDataError);
  const getFilters = (sliderInputs) => {
    const filters = [];
    if (sliderInputs.thresholding > -1)
      filters.push(
        OpenSeadragon.Filters.THRESHOLDING(sliderInputs.thresholding)
      );
    return filters;
  };

  useEffect(() => {
    if (filterResponseData) {
      if (filterResponseData.loadAdjustment.data !== null) {
        const sliderInputs = filterResponseData.loadAdjustment.data;
        if (!viewer) return;
        // console.log(sliderInputs);
        setNewSliderInputs({
          contrast: sliderInputs.contrast,
          brightness: sliderInputs.brightness,
          thresholding: sliderInputs.thresholding,
          gamma: sliderInputs.gamma,
          exposure: 0,
        });
        const filters = getFilters(sliderInputs);

        try {
          viewer.setFilterOptions({
            filters: {
              processors: [
                ...filters,
                OpenSeadragon.Filters.CONTRAST(sliderInputs.contrast),
                OpenSeadragon.Filters.BRIGHTNESS(sliderInputs.brightness),
                OpenSeadragon.Filters.GAMMA(sliderInputs.gamma),
              ],
            },
            loadMode: "async",
          });
        } catch (err) {
          console.error(err);
        }
        if (!localStorage.getItem("til")) {
          toast({
            title: "Adjustment loaded",
            status: "success",
            duration: 1500,
            isClosable: true,
          });
        }
      }
    }
  }, [filterResponseData]);

  const handleZoomIn = () => {
    try {
      const value1 = Math.ceil(
        (viewer.viewport.getZoom() * 40) / viewer.viewport.getMaxZoom()
      );
      zoomToLevel({ viewer, value: value1 + 0.6 });
    } catch (err) {
      // console.error("Error handling Zoom In button click", err);
    }
  };

  const handleZoomOut = () => {
    try {
      const value2 = Math.ceil(
        (viewer.viewport.getZoom() * 40) / viewer.viewport.getMaxZoom()
      );
      zoomToLevel({ viewer, value: value2 - 1.06 });
    } catch (err) {
      // console.error("Error handling Zoom Out button click", err);
    }
  };

  const handleZoomLevel = (value) => {
    zoomToLevel({ viewer, value });
  };

  const handleDeleteAnnotation = () => {
    deleteAnnotation(onDeleteAnnotation);
    closeMenu();
  };

  const handleSave = ({ text, title }) => {
    updateAnnotation({ text, title, onUpdateAnnotation });
    closeEdit();
  };

  const handleEditOpen = () => {
    closeMenu();
    openEdit();
  };

  const handleAnnotationChat = () => {
    closeMenu();
    annotationChat();
    // annotationClose();
  };

  // update / resize annotation

  useEffect(() => {
    const canvas = fabricOverlay?.fabricCanvas();
    let clickedObject = null;

    canvas?.on("mouse:down", (e) => {
      clickedObject = canvas?.findTarget(e.e);
    });

    canvas?.on("object:modified", (e) => {
      const modifiedObject = e.target;
      if (modifiedObject === clickedObject) {
        const { scaleX, scaleY, width, height, left, top, angle, text } =
          modifiedObject;
        const updatedWidth = width * scaleX;
        const updatedHeight = height * scaleY;
        const updatedLeft = left;
        const updatedTop = top;
        const updatedAngle = angle;

        // console.log("Updated width:", updatedWidth);
        // console.log("Updated height:", updatedHeight);

        // Create a new object with updated dimensions, position, and angle
        const updatedObject = {
          ...clickedObject,
          width: updatedWidth,
          height: updatedHeight,
          left: updatedLeft,
          top: updatedTop,
          angle: updatedAngle,
          text,
        };
        setUpdatedAnnotation(updatedObject);
        setAnnotationObject(updatedObject);
        setManipulationComplete(true); // Set manipulation as complete
      }
    });
  }, [fabricOverlay]);

  useEffect(() => {
    if (updatedAnnotation && manipulationComplete) {
      // console.log('Updated annotation object: ', updatedAnnotation);
      const canvas = fabricOverlay?.fabricCanvas();
      const { width } = updatedAnnotation;
      const { height } = updatedAnnotation;
      const { left } = updatedAnnotation;
      const { top } = updatedAnnotation;
      const { angle } = updatedAnnotation;
      const { text } = updatedAnnotation;
      // console.log(annotationObject);
      // console.log(angle);
      updateAnnotationInDB({
        slideId,
        hash: updatedAnnotation.hash,
        updateObject: { width, height, left, top, angle, text },
        onUpdateAnnotation,
      });
      // console.log("sss");
      setManipulationComplete(false);
    }
  }, [updatedAnnotation]);

  //  console.log(annotationObject);

  const handleVhutAnalysis = async () => {
    if (!fabricOverlay || !annotationObject) return;

    // get s3 folder key from the originalFileUrl
    const key = getFileBucketFolder(viewerIds[0].originalFileUrl);
    const { left, top, width, height, type } = annotationObject;
    let body = {
      key,
      type,
      left,
      top,
      width,
      height,
      slideId,
      hash: annotationObject.hash,
    };

    // if annoatation is a freehand, send the coordinates of the path
    // otherwise, send the coordinates of the rectangle
    if (annotationObject.type === "path") {
      body = { ...body, path: annotationObject.path };
    } else if (annotationObject.type === "ellipse") {
      body = {
        ...body,
        cx: annotationObject.cx,
        cy: annotationObject.cy,
        rx: annotationObject.rx,
        ry: annotationObject.ry,
        type: "ellipse",
      };
    } else if (annotationObject.type === "polygon") {
      body = { ...body, points: annotationObject.points };
    }
    // console.log("slideID", slideId);
    // console.log("body....", body);
    try {
      // const resp = await onVhutAnalysis(body);
      // console.log(body);
      onVhutAnalysis({
        variables: { body: { ...body } },
      });
      setLoadUI(false);
      localStorage.setItem("ModelName", "Morphometry");
      // toast({
      //   title: resp.data.message,
      //   status: "success",
      //   duration: 1500,
      //   isClosable: true,
      // });
    } catch (err) {
      toast({
        title: "Server Unavailable",
        description: err.message,
        status: "error",
        duration: 1500,
        isClosable: true,
      });
    }
  };

  // console.log(annotationObject);
  const showAnalysisData = async (resp) => {
    const canvas = fabricOverlay.fabricCanvas();

    if (resp && typeof resp === "object") {
      // console.log(resp.getVhutAnalysis.data.hash);
      const { data: vhut } = resp.getVhutAnalysis;
      const { left, top } = annotationObject;
      const { analysedData, cells, totalCells } = await getVhutAnalysisData({
        canvas,
        vhut,
        left,
        top,
      });

      // group enclosing annotation and cells
      const feedMessage = groupAnnotationAndCells({
        enclosingAnnotation: annotationObject,
        cells,
        optionalData: {
          data: analysedData,
          totalCells,
          roiType: "morphometry",
        },
      });

      // remove enclosing annotation
      // and group to canvas
      if (feedMessage.object) {
        // console.log(feedMessage);
        // remove enclosing annotation and add new one to canvas
        feedMessage.object.selectable = false;
        feedMessage.object.evented = false;
        feedMessage.object.getObjects().forEach((circle) => {
          circle.selectable = false;
          circle.evented = false;
        });
        canvas.remove(annotationObject); // width, left and top
        // console.log(feedMessage);
        canvas.add(feedMessage.object).requestRenderAll(); // width, left and top + analysedData

        setFabricOverlayState(
          updateFeedInAnnotationFeed({ id: viewerId, feed: feedMessage })
        );
      }
    }
  };

  const handleShowAnalysis = async () => {
    // console.log(annotationObject);
    if (!annotationObject) return;

    const canvas = fabricOverlay.fabricCanvas();
    // console.log(annotationObject);
    onGetVhutAnalysis({
      variables: {
        query: {
          analysisId: annotationObject?.analysedROI,
        },
      },
    });
  };

  // update Annotation in db
  const onUpdateAnnotation = (data) => {
    delete data?.slideId;
    // console.log(data);
    modifyAnnotation({
      variables: { body: { ...data } },
    });
  };

  if (deleteError)
    toast({
      title: "Annotation could not be deleted",
      description: "server error",
      status: "error",
      duration: 1000,
      isClosable: true,
    });

  // delete Annotation from db
  const onDeleteAnnotation = (data) => {
    const canvas = fabricOverlay.fabricCanvas();
    const groupObjects = canvas
      .getObjects()
      .filter((obj) => obj.type === "group");
    // console.log(groupObjects);
    if (groupObjects) {
      groupObjects.map((object) => {
        if (object.hash === data.hash) {
          object.set("visible", false);
          // console.log(object);
        }
      });
    }
    removeAnnotation({ variables: { body: data } });
  };

  useEffect(() => {
    setIsAnnotationLoaded(true);
  }, [slideId]);

  // console.log(responseData);

  useEffect(() => {
    if (responseData) {
      // console.log("====================================");
      // console.log("response...", responseData);
      // console.log("====================================");
      if (
        responseData.getVhutAnalysis.message !== "No Analysis found" &&
        responseData.getVhutAnalysis.data.analysedData
      ) {
        showAnalysisData(responseData);
        setLoadUI(true);
        localStorage.removeItem("ModelName");
      }
    }
  }, [responseData]);

  // On load run roi for existing ones

  useEffect(() => {
    // console.log(vhutSubscriptionData)
    if (vhutSubscriptionData) {
      const {
        data,
        message,
        analysisType: type,
      } = vhutSubscriptionData.analysisStatus;

      if (type === "VHUT_ANALYSIS") {
        // console.log(data);
        if (data && data.hash) {
          // console.log(data);
          const canvas = fabricOverlay.fabricCanvas();
          const { hash, analysedROI } = data;
          const annotation = canvas.getObjectByHash(hash);
          setAnnotationObject(annotation);
          if (annotation) {
            annotation.set({ isAnalysed: true, analysedROI });
            // console.log(annotation);
          }
          // console.log(annotation);
          const ROI_ID = analysedROI;
          // console.log(ROI_ID);
          if (ROI_ID !== null && ROI_ID !== undefined) {
            if (annotation && annotation.analysedROI) {
              onGetVhutAnalysis({
                variables: {
                  query: {
                    analysisId: ROI_ID,
                  },
                },
              });
              setToolSelected("MorphometryAnalysed");
            }
          }
        }
      } else if (type === "KI67_ANALYSIS") {
        setModelname("KI67Analysed");
      } else if (type === "VIEWPORT_ANALYSIS") {
        if (data && data.isAnalysed)
          setFabricOverlayState(updateIsViewportAnalysing(false));
        toast({
          title: message || "ViewPort Ready",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    }
  }, [vhutSubscriptionData]);

  // ################ UPDATING ANNOTATION VIA SUBSCRIPTION #######################
  useEffect(() => {
    if (subscriptionData && annotationData) {
      // console.log("Subscribed Changed Annotation", subscriptionData);
      if (subscriptionData.changedAnnotations.status.isDeleted) {
        const received_hash = subscriptionData.changedAnnotations.data.hash;
        if (received_hash) subscriptionDeleteAnnotation(received_hash);
        else
          subscriptionClearAnnotations(
            subscriptionData.changedAnnotations.deleteType
          );
      } else if (subscriptionData.changedAnnotations.status.isCreated) {
        subscriptionAddAnnotation(subscriptionData.changedAnnotations.data);
      } else if (subscriptionData.changedAnnotations.status.isUpdated) {
        subscriptionUpdateAnnotation(subscriptionData.changedAnnotations.data);
      }
    }
  }, [subscriptionData]);
  // fetch xml file
  useEffect(() => {
    async function fetchXmlFile() {
      if (application === "education") {
        const response = await axios.get(
          `${Environment.FILES_URL}/v1/files/xml-file/?slideUrl=${tile}`,
          {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setXmlLink(response?.data?.data?.originalUrl);
      }
    }
    fetchXmlFile();
    return () => {
      setXmlLink("");
    };
  }, [tile]);

  // load saved annotations from the server
  // once viewer is initialized
  useEffect(() => {
    onGetFilterData({
      variables: {
        query: {
          slideId,
        },
      },
      fetchPolicy: "network-only",
    });
    if (xmlLink) {
      getXmlAnnotation({
        variables: {
          query: {
            slideId,
          },
        },
      });
      setIsXmlAnnotations(true);
    } else {
      getAnnotation({
        variables: {
          query: {
            slideId,
          },
        },
        fetchPolicy: "network-only",
      });
      setIsXmlAnnotations(false);
    }
  }, [xmlLink, slideId, fabricOverlay, isLocalRegion]);

  // set annotation data
  useEffect(() => {
    if (
      !xmlAnnotationData?.loadImportedAnnotation?.ImportedAnnotation[0]?.data
    ) {
      setAnnotatedData(annotationData?.loadAnnotation?.data);
    } else {
      setAnnotatedData(
        xmlAnnotationData?.loadImportedAnnotation?.ImportedAnnotation[0]?.data
      );
    }
  }, [xmlAnnotationData, annotationData]);
  useEffect(() => {
    if (!fabricOverlay) return;
    // console.log("laodAnnotationFromDb")

    // console.log(btoa(JSON.stringify(annotatedData)))
    const canvas = fabricOverlay.fabricCanvas();
    canvas.clear().requestRenderAll();
    const loadAnnotations = async () => {
      // check if the annotations is already loaded
      if (canvas.toJSON().objects.length === 0 && annotatedData) {
        const { feed, status, error } = await loadAnnotationsFromDB({
          slideId,
          canvas,
          viewer,
          // onLoadAnnotations,
          data: annotatedData,
          success: annotatedData,
          userInfo,
        });

        if (status === "success") {
          if (feed) {
            // console.log(feed);
            setFabricOverlayState(
              updateActivityFeed({ id: viewerId, fullFeed: feed })
            );
            setActiveFeed(feed);
          }
          canvas.requestRenderAll();
          // console.log(annotatedData);
          if (annotatedData?.length > 0 && navigatorCounter === 0) {
            const shapeAnnotation = annotatedData.filter(
              (eachAnnotation) => eachAnnotation.type !== "textbox"
            );
            if (shapeAnnotation.length > 0 && !localStorage.getItem("til")) {
              toast({
                title: "Annotation loaded",
                status: "success",
                duration: 1000,
                isClosable: true,
              });
            }
            const textAnnotation = annotatedData.filter(
              (eachAnnotation) =>
                eachAnnotation.type == "textbox" && eachAnnotation.text !== ""
            );
            if (textAnnotation.length > 0 && !localStorage.getItem("til")) {
              toast({
                title: "Comment loaded",
                status: "success",
                duration: 1000,
                isClosable: true,
              });
            }
            for (let i = 0; i < annotatedData.length; i++) {
              if (annotatedData[i].type === "textbox") {
                const textbox = annotatedData[i];
                // console.log(textbox);
                if (textbox.text !== "" && textbox.usingAs === "comment") {
                  const circle = new fabric.Rect({
                    left: textbox.left,
                    top: textbox.top - 75,
                    height: 100,
                    width: 100,
                    fill: "#C1C6D7",
                    selectable: false,
                    hasControls: false,
                    hasBorders: false,
                    hoverCursor: "pointer",
                  });

                  // Load the image from your local folder
                  fabric.Image.fromURL(
                    "https://i.postimg.cc/6qdhNGP4/user.png",
                    (img) => {
                      // Set the position and size to match the letter "C"
                      img.set({
                        left: circle.left + 22,
                        top: circle.top + 22,
                        selectable: false,
                        hasControls: false,
                        hasBorders: true,
                        hoverCursor: "pointer",
                      });

                      // Scale the image to fit within the circle
                      const scale = Math.min(58 / img.width, 58 / img.height);
                      img.scaleToWidth(img.width * scale);
                      img.scaleToHeight(img.height * scale);

                      const triangle = new fabric.Triangle({
                        left: circle.left + 51,
                        top: circle.top + 75,
                        width: 50,
                        height: 50,
                        fill: "#C1C6D7",
                        angle: 90,
                        selectable: false,
                        hasControls: false,
                        hasBorders: false,
                        hoverCursor: "pointer",
                      });

                      const group = new fabric.Group([triangle, circle, img], {
                        selectable: false,
                        hasControls: false,
                        hasBorders: false,
                        hash: textbox.hash,
                        hoverCursor: "pointer",
                      });

                      canvas.add(group);
                      // console.log(group);
                      canvas.renderAll();
                    }
                  );
                }
              }
            }
          }
        } else {
          setFabricOverlayState(
            updateActivityFeed({ id: viewerId, fullFeed: [] })
          );
          canvas.requestRenderAll();
          toast({
            title: "Annotation load failed",
            description: "Please try again",
            status: "error",
            duration: 1500,
            isClosable: true,
          });
        }
      }
      setIsAnnotationLoaded(true);
    };
    loadAnnotations();
  }, [fabricOverlay, annotatedData, slideId, isLocalRegion]);

  useEffect(() => {
    const canvas = fabricOverlay?.fabricCanvas();
    if (canvas) {
      canvas.on("mouse:down", function (e) {
        const canvas = fabricOverlay?.fabricCanvas();
        // find all group and textboxes
        const groupObjects = canvas
          .getObjects()
          .filter(
            (obj) => obj.type === "group" && !obj.hasOwnProperty("roiType")
          );
        // console.log(groupObjects)
        const textboxObjects = canvas
          .getObjects()
          .filter((obj) => obj.type === "textbox" && obj.usingAs === "comment");
        // console.log(textboxObjects);
        textboxObjects.forEach((textbox) => {
          textbox.editable = false;
        });
        if (e.target && e.target.type === "group") {
          // console.log(e.target.visible);
          const clickedGroupHash = e.target.get("hash");

          // Hide the clicked group and show the textbox with the same hash
          groupObjects.forEach((group) => {
            if (group.get("hash") === clickedGroupHash) {
              group.set("visible", false);
            }
          });

          textboxObjects.forEach((textbox) => {
            if (textbox.get("hash") === clickedGroupHash) {
              textbox.set("visible", true);
              textbox.set("hoverCursor", "pointer");
            }
          });

          canvas.renderAll();
        } else if (e.target === null) {
          // Show all groups and hide all textboxes
          groupObjects.forEach((group) => {
            group.set("visible", true);
            const correspondingTextbox = textboxObjects.find(
              (textbox) => textbox.get("hash") === group.get("hash")
            );
            if (!correspondingTextbox) {
              group.set("visible", false);
            } else {
              group.set("visible", true);
            }
          });
          textboxObjects.forEach((textbox) => {
            textbox.set("visible", false);

            // empty textbox found then remove the textbox and hide group
            if (textbox.text === "") {
              // console.log(textbox);
              groupObjects.forEach((group) => {
                if (group.get("hash") === textbox.hash) {
                  group.set("visible", false);
                }
              });
            }
          });
          // console.log(textboxObjects);
          // Add a new group for each textbox that doesn't have a corresponding group
          textboxObjects.forEach((textbox) => {
            const textboxHash = textbox.get("hash");
            const hasCorrespondingGroup = groupObjects.some(
              (group) => group.get("hash") === textboxHash
            );
            if (!hasCorrespondingGroup && textbox.text !== "") {
              const circle = new fabric.Rect({
                left: textbox.left,
                top: textbox.top - 75,
                height: 100,
                width: 100,
                fill: "#C1C6D7",
                selectable: false,
                hasControls: false,
                hasBorders: false,
                hoverCursor: "pointer",
              });

              // Load the image from your local folder
              fabric.Image.fromURL(
                "https://i.postimg.cc/6qdhNGP4/user.png",
                (img) => {
                  // Set the position and size to match the letter "C"
                  img.set({
                    left: circle.left + 22,
                    top: circle.top + 22,
                    selectable: false,
                    hasControls: false,
                    hasBorders: true,
                    hoverCursor: "pointer",
                  });

                  // Scale the image to fit within the circle
                  const scale = Math.min(58 / img.width, 58 / img.height);
                  img.scaleToWidth(img.width * scale);
                  img.scaleToHeight(img.height * scale);

                  const triangle = new fabric.Triangle({
                    left: circle.left + 51,
                    top: circle.top + 75,
                    width: 50,
                    height: 50,
                    fill: "#C1C6D7",
                    angle: 90,
                    selectable: false,
                    hasControls: false,
                    hasBorders: false,
                    hoverCursor: "pointer",
                  });

                  const group = new fabric.Group([triangle, circle, img], {
                    selectable: false,
                    hasControls: false,
                    hasBorders: false,
                    hash: textbox.hash,
                    hoverCursor: "pointer",
                  });

                  canvas.add(group);
                  // console.log(group);
                  canvas.renderAll();
                }
              );
            }
          });
          canvas.renderAll();
        }
      });
    }
  }, [fabricOverlay]);

  // check if annotation is loaded or not
  // and then update fabricOverlayState
  useEffect(() => {
    setFabricOverlayState(
      updateIsAnnotationLoading({ isLoading: !isAnnotationLoaded })
    );
  }, [isAnnotationLoaded]);

  // initialize scalebar
  useEffect(() => {
    if (!viewer) return;
    viewer.scalebar({
      type: 1,
      pixelsPerMeter: getPPMfromMPP(slide?.metadata?.mpp),
      minWidth: "75px",
      maxWidth: "75px",
      location: 0,
      xOffset: 5,
      yOffset: 10,
      color: "black",
      fontColor: "white",
      backgroundColor: "black",
      fontSize: "14px",
      display: "none",
      barThickness: 2,
      stayInsideImage: false,
    });
  }, [viewer]);

  // add right click event
  useEffect(() => {
    if (!viewer || !fabricOverlay) return;
    const canvas = fabricOverlay.fabricCanvas();
    const handleMouseDown = (event) => {
      const annotation = canvas.getActiveObject();

      // if not right click
      if (event.button !== 3) {
        if (annotation) {
          handleAnnotationClick(annotation);
          setAnnotationObject(annotation);
          // console.log(annotation);
        }
        closeMenu();
        return;
      }

      // set annotationObject if right click is on annotation
      if (annotation) {
        setAnnotationObject(annotation);
        const zoomValue = convertToZoomValue({
          level: annotation.zoomLevel,
          viewer,
        });
        setIsMorphometryDisabled(
          annotation.type === "line" || !(zoomValue >= 20)
        );
      } else {
        setAnnotationObject(null);
        setIsMorphometryDisabled(true);
      }
      setMenuPosition({ left: event.pointer.x, top: event.pointer.y });
      openMenu();
    };

    canvas.on("mouse:down", handleMouseDown);
    return () => {
      canvas.on("mouse:down", handleMouseDown);
    };
  }, [viewer, fabricOverlay]);

  useEffect(() => {
    if (!viewer || !fabricOverlay) return;
    const canvas = fabricOverlay.fabricCanvas();

    const handleMouseDown = (event) => {
      const annotation = canvas.getActiveObject();

      if (annotation && annotation.type === "textbox") {
        setAnnotationText(annotation.text);
        setAnnotationShape("textbox");
      }
    };

    canvas.requestRenderAll();

    canvas.on("mouse:move", handleMouseDown);
    return () => {
      canvas.on("mouse:move", handleMouseDown);
    };
  }, [viewer, fabricOverlay]);

  // ######################## RUN KI67 ###############################################
  // ######################## RUN KI67 ###############################################
  const groupAnnotationAndCellsKI67 = ({
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
      selectable: false,
      evented: false,
      path,
      timeStamp,
      isKI67Analysed: true,
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

  const runKI67 = async () => {
    if (!fabricOverlay || !annotationObject) return;

    // get s3 folder key from the originalFileUrl
    const key = getFileBucketFolder(originalFileUrl);
    const { left, top, width, height, type } = annotationObject;
    let body = {
      key,
      type,
      left,
      top,
      width,
      height,
      slideId,
      hash: annotationObject.hash,
    };

    // if annoatation is a freehand, send the coordinates of the path
    // otherwise, send the coordinates of the rectangle
    if (annotationObject.type === "path") {
      body = { ...body, path: annotationObject.path };

      if (slide?.isIHC === false || application === "education") {
        isKI67Open();
      }
    } else if (annotationObject.type === "ellipse") {
      body = {
        ...body,
        cx: annotationObject.cx,
        cy: annotationObject.cy,
        rx: annotationObject.rx,
        ry: annotationObject.ry,
        type: "ellipse",
      };
    } else if (annotationObject.type === "polygon") {
      body = { ...body, points: annotationObject.points };
    }
    // console.log("slideID", slideId);
    // console.log("body....", body);
    const originalBody = {
      ...body,
      notifyHook: `${Environment.VIEWER_URL}/notify_KI67`,
      annotationId: "",
    };
    // console.log("body", originalBody);
    try {
      // const resp = await onVhutAnalysis(body);
      const resp = await axios.post(
        "https://development-morphometry-api.prr.ai/quantize/ki_six_seven_predict",
        originalBody
      );
    } catch (err) {
      toast({
        title: "Server Unavailable",
        description: err.message,
        status: "error",
        duration: 1500,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (vhutSubscriptionData) {
      const canvas = fabricOverlay.fabricCanvas();
      const annotation = canvas.getObjectByHash(
        vhutSubscriptionData.analysisStatus.data.hash
      );
      setAnnotationObject(annotation);
      // console.log("subscribed", vhutSubscriptionData);
      const {
        data,
        status,
        message,
        analysisType: type,
      } = vhutSubscriptionData.analysisStatus;
      if (type === "KI67_ANALYSIS") {
        // console.log(vhutSubscriptionData.analysisStatus.data.hash);
        const posContours = data.kiResults.pos_contours;
        const negContours = data.kiResults.neg_contours;
        const canvas = fabricOverlay.fabricCanvas();
        const { left, top } = annotationObject;
        const circles = posContours.map((coord) => {
          const circle = new fabric.Circle({
            left: coord[0] + left,
            top: coord[1] + top,
            radius: 6,
            fill: "red",
            stroke: "red",
            strokeWidth: 2,
          });
          return circle;
        });
        const circlesNegative = negContours.map((coord) => {
          const circle = new fabric.Circle({
            left: coord[0] + left,
            top: coord[1] + top,
            radius: 9,
            fill: "green",
            stroke: "green",
            strokeWidth: 2,
          });
          return circle;
        });
        const cells = [...circles, ...circlesNegative];
        const feedMessage = groupAnnotationAndCellsKI67({
          enclosingAnnotation: annotationObject,
          cells,
          optionalData: {
            data: "",
            roiType: "KI67",
            num_positive: data?.kiResults?.num_positive,
            num_negative: data?.kiResults?.num_negative,
            proliferation_score: data?.kiResults?.proliferation_score,
          },
        });
        // console.log(feedMessage);
        if (feedMessage?.object) {
          // remove enclosing annotation and add new one to canvas
          feedMessage.object.selectable = false;
          feedMessage.object.evented = false;
          feedMessage.object.getObjects().forEach((circle) => {
            circle.selectable = false;
            circle.evented = false;
          });

          // remove enclosing annotation and add new one to canvas
          // console.log(feedMessage);
          canvas.remove(annotationObject);
          canvas.add(feedMessage.object).requestRenderAll();

          setFabricOverlayState(
            updateFeedInAnnotationFeed({ id: viewerId, feed: feedMessage })
          );
        }
      }
    }
  }, [vhutSubscriptionData]);

  // console.log(annotationObject);
  useEffect(() => {
    if (annotationObject?.type === "path") {
      if (annotationObject?.isClosed === false) {
        // return from this block print a console out
        setToolSelected("OpenPath");
        return;
      }
    }
    if (bottomZoomValue > 39) {
      if (runAiModel === "KI67") {
        if (!annotationObject && runAiModel === "KI67") {
          setToolSelected("MorphometryError");
          setModelname("");
        }
        if (runAiModel === "KI67" && annotationObject) {
          runKI67();
          setToolSelected("KI67Analysed");
          //  setModelname("");
          setModelname("");
        }
      }
      if (slide?.stainType === "H&E" || application === "education") {
        if (runAiModel === "Morphometry") {
          if (annotationObject) {
            // first time run morphometry
            if (!annotationObject?.isAnalysed) {
              handleVhutAnalysis();
              setModelname("");
              //  setAnnotationObject(null);
              // console.log("iiiiiammmmm");
            }
            if (
              !annotationObject?.analysedData &&
              annotationObject?.isAnalysed &&
              annotationObject
            ) {
              handleShowAnalysis(); // second time run to show only analysis
              setToolSelected("MorphometryAnalysed");
              setModelname("");
              // console.log("sssssssss");
            }
          }
          if (runAiModel === "Morphometry" && !annotationObject) {
            setToolSelected("MorphometryError");
            // console.log("jjjjjjjjjjjjmm");
          }
        }
      }

      //  console.log(runAiModel);
    } else {
      // console.log("aaaa");
      setModelname("ZoomError");
    }

    setModelname("");
    // setAnnotationObject(null);
  }, [runAiModel]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     // handleShowAnalysis();

  //   }, 4000);
  //   return () => {
  //     clearTimeout(timer);
  //     setModelname("");
  //   };
  // }, [analysis_data]);

  return (
    <Box>
      {!isAnnotationLoaded || isViewportAnalysing ? (
        <Loading position="absolute" w="100%" zIndex="3" h="79vh" />
      ) : null}
      <Box position="absolute" left="2vw" top="5vh">
        <Flex direction="column" alignItems="end" mr="23px">
          <Draggable
            bounds={{
              top: 0,
              left: 0,
              right: 90 * (window.screen.width / 100),
              bottom: 60 * (window.screen.height / 100),
            }}
            handle=".drag-handle"
          >
            <Flex
              direction="column"
              boxShadow="1px 1px 2px rgba(176, 200, 214, 0.5)"
              zIndex="1"
            >
              <VStack
                className="drag-handle"
                cursor="move"
                // borderTop="5px solid black"
                // borderBottom="5px solid black"
                // border="1px solid red"
                bg="whitesmoke"
                w="100%"
                h="15px"
              >
                {/* <MoveBar/> */}
                <MdOutlineDragIndicator
                  style={{ transform: "rotate(90deg)", color: "darkgrey" }}
                />
              </VStack>
              <VStack
                // w="fit-content"
                backgroundColor="#fcfcfc"
                // border="1px solid #00153F"
                // borderRadius="5px"
                py={2}
                px={1.5}
                zIndex="1"
              >
                <FullScreen viewerId={viewerId} />
              </VStack>
              <VStack
                // w="fit-content"
                backgroundColor="#fcfcfc"
                // border="1px solid #00153F"
                // borderRadius="5px"
                py={2}
                px={1.5}
                zIndex="1"
              >
                <ToolbarButton
                  icon={<AiOutlinePlus color="#2E519E" size={iconSize} />}
                  // border="1px solid #3965C6"
                  backgroundColor="#F6F6F6"
                  onClick={handleZoomIn}
                  label="Zoom In"
                  mr="0px"
                  _hover={{ bgColor: "#D9D9D9" }}
                  _active={{
                    outline: "none",
                  }}
                />
                <ZoomSlider
                  setBottomZoomValue={setBottomZoomValue}
                  viewerId={viewerId}
                />
                <ToolbarButton
                  icon={<AiOutlineMinus color="#2E519E" size={iconSize} />}
                  // border="1px solid #3965C6"
                  backgroundColor="#F6F6F6"
                  onClick={handleZoomOut}
                  label="Zoom Out"
                  mr="0px"
                  _hover={{ bgColor: "#D9D9D9" }}
                  _active={{
                    outline: "none",
                  }}
                />
              </VStack>
              <VStack
                // w="fit-content"
                backgroundColor="#fcfcfc"
                // border="1px solid #00153F"
                // borderRadius="5px"
                py={2}
                px={1.5}
                zIndex="1"
              >
                <ZoomButton
                  navigatorCounter={navigatorCounter}
                  setBottomZoomValue={setBottomZoomValue}
                  viewerId={viewerId}
                />
              </VStack>
            </Flex>
          </Draggable>
          <CustomMenu
            isMenuOpen={isOpen}
            closeMenu={closeMenu}
            setIsOpen={setIsRightClickActive}
            left={menuPosition.left}
            top={menuPosition.top}
            viewerId={viewerId}
            onHandleVhutAnalysis={handleVhutAnalysis}
            setZoom={handleZoomLevel}
            slide={slide}
            isXmlAnnotations={isXmlAnnotations}
            enableAI={enableAI}
            setModelname={setModelname}
            isMorphometryDisabled={isMorphometryDisabled}
            isAnnotationSelected={annotationObject}
            isAnalysed={annotationObject?.isAnalysed}
            isKI67Analysed={annotationObject?.isKI67Analysed}
            viewer={viewer}
            runKI67={runKI67}
            onHandleShowAnalysis={handleShowAnalysis}
            handleDeleteAnnotation={handleDeleteAnnotation}
            handleEditOpen={handleEditOpen}
            handleAnnotationChat={handleAnnotationChat}
            application={application}
          />

          <EditText
            isOpen={isEditOpen}
            onClose={closeEdit}
            handleClose={closeEdit}
            handleSave={handleSave}
            textValue={annotationObject?.text ? annotationObject.text : ""}
            titleValue={annotationObject?.title ? annotationObject.title : ""}
          />
          {application === "hospital" && (
            <AnnotationChat
              isOpen={isAnnotationOpen}
              onClose={annotationClose}
              onOpen={annotationChat}
              userInfo={userInfo}
              client={client2}
              mentionUsers={mentionUsers}
              chatId={caseInfo?._id}
              annotationObject={annotationObject}
              addUsersToCase={addUsersToCase}
              slideId={slideId}
              caseInfo={caseInfo}
            />
          )}
          <ShowMetric viewerId={viewerId} slide={slide} />
        </Flex>
      </Box>
    </Box>
  );
};

export default ViewerControls;
