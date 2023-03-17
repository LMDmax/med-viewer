import React, { useEffect, useState, useRef, useCallback } from "react";

import "./zoom-levels";
import "./openseadragon-scalebar";
import { useLazyQuery, useMutation, useSubscription } from "@apollo/client";
import {
  VStack,
  useToast,
  useDisclosure,
  Flex,
  Text,
  Box,
} from "@chakra-ui/react";
import axios from "axios";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

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
} from "../../utility";
import AnnotationChat from "../AnnotationChat/AnnotationChat";
import ShowMetric from "../Annotations/ShowMetric";
import EditText from "../Feed/editText";
import FullScreen from "../Fullscreen/Fullscreen";
import Loading from "../Loading/loading";
import { CustomMenu } from "../RightClickMenu/Menu";
import ToolbarButton from "../ViewerToolbar/button";
import IconSize from "../ViewerToolbar/IconSize";
import ZoomButton from "../ZoomButton/ZoomButton";
import ZoomSlider from "../ZoomSlider/slider";

function ViewerControls({
  viewerId,
  userInfo,
  enableAI,
  slide,
  application,
  setLoadUI,
  client2,
  mentionUsers,
  caseInfo,
  addUsersToCase,
  Environment,
  accessToken,
  setIsXmlAnnotations,
}) {
  const { fabricOverlayState, setFabricOverlayState } = useFabricOverlayState();
  const { viewerWindow, isViewportAnalysing } = fabricOverlayState;
  const { viewer, fabricOverlay, slideId, originalFileUrl, tile } =
    viewerWindow[viewerId];
  const {
    updateAnnotation,
    deleteAnnotation,
    subscriptionAddAnnotation,
    subscriptionClearAnnotations,
    subscriptionDeleteAnnotation,
    subscriptionUpdateAnnotation,
  } = useCanvasHelpers(viewerId);

  const [isAnnotationLoaded, setIsAnnotationLoaded] = useState(false);
  const [isRightClickActive, setIsRightClickActive] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ left: 0, top: 0 });
  const [annotationObject, setAnnotationObject] = useState(null);
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

  // ############### ANNOTATION_SUBSCRIPTION ########################
  const { data: subscriptionData, error: subscription_error } = useSubscription(
    ANNOTATIONS_SUBSCRIPTION,
    {
      variables: {
        slideId,
      },
    }
  );

  // #################### VHUT_ANALYSIS_SUBSCRIPTION ##############
  const { data: vhutSubscriptionData, error: vhutSubscription_error } =
    useSubscription(VHUT_ANALYSIS_SUBSCRIPTION, {
      variables: {
        body: {
          slideId,
        },
      },
    });

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

  const handleVhutAnalysis = async () => {
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
      onVhutAnalysis({
        variables: { body: { ...body } },
      });
      setLoadUI(false);
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

  const showAnalysisData = async (resp) => {
    const canvas = fabricOverlay.fabricCanvas();

    if (resp && typeof resp === "object") {
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
        // remove enclosing annotation and add new one to canvas
        canvas.remove(annotationObject);
        canvas.add(feedMessage.object).requestRenderAll();

        setFabricOverlayState(
          updateFeedInAnnotationFeed({ id: viewerId, feed: feedMessage })
        );
      }
    }
  };

  const handleShowAnalysis = async () => {
    if (!annotationObject) return;

    const canvas = fabricOverlay.fabricCanvas();

    // const resp = await onGetVhutAnalysis({
    //   analysisId: annotationObject?.analysedROI,
    // });

    onGetVhutAnalysis({
      variables: {
        query: {
          analysisId: annotationObject?.analysedROI,
        },
      },
    });

    // if (resp.data && typeof resp.data === "object") {
    //   const { vhut } = resp.data;
    //   const { left, top } = annotationObject;
    //   const { analysedData, cells, totalCells } = await getVhutAnalysisData({
    //     canvas,
    //     vhut,
    //     left,
    //     top,
    //   });

    //   // group enclosing annotation and cells
    //   const feedMessage = groupAnnotationAndCells({
    //     enclosingAnnotation: annotationObject,
    //     cells,
    //     optionalData: {
    //       data: analysedData,
    //       totalCells,
    //     },
    //   });

    //   // remove enclosing annotation
    //   // and group to canvas
    //   if (feedMessage.object) {
    //     // remove enclosing annotation and add new one to canvas
    //     canvas.remove(annotationObject);
    //     canvas.add(feedMessage.object).requestRenderAll();

    //     setFabricOverlayState(
    //       updateFeedInAnnotationFeed({ id: viewerId, feed: feedMessage })
    //     );
    //   }
    // }
  };

  // update Annotation in db
  const onUpdateAnnotation = (data) => {
    delete data?.slideId;
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
    removeAnnotation({ variables: { body: data } });
  };

  useEffect(() => {
    setIsAnnotationLoaded(true);
  }, [slideId]);

  useEffect(() => {
    if (responseData) {
      // console.log("====================================");
      // console.log("analysis...", responseData);
      // console.log("====================================");

      showAnalysisData(responseData);
    }
  }, [responseData]);

  useEffect(() => {
    if (vhutSubscriptionData) {
      // console.log("subscribed", vhutSubscriptionData);
      const {
        data,
        status,
        message,
        analysisType: type,
      } = vhutSubscriptionData.analysisStatus;

      if (type === "VHUT_ANALYSIS") {
        if (data && data.hash) {
          const canvas = fabricOverlay.fabricCanvas();
          const { hash, analysedROI } = data;
          const annotation = canvas.getObjectByHash(hash);

          if (annotation) {
            annotation.set({ isAnalysed: true, analysedROI });
          }
          setLoadUI(true);
        }
        // console.log(vhutSubscriptionData.analysisStatus);
        toast({
          title: message,
          status: "success",
          duration: 1500,
          isClosable: true,
        });
      } else if (type === "KI67_ANALYSIS") {
        toast({
          title: message,
          status: "success",
          duration: 1500,
          isClosable: true,
        });
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
    fetchXmlFile();
    return () => {
      setXmlLink("");
    };
  }, [tile]);

  // load saved annotations from the server
  // once viewer is initialized
  useEffect(() => {
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
      });
      setIsXmlAnnotations(false);
    }
  }, [xmlLink, slideId]);

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
    const canvas = fabricOverlay.fabricCanvas();
    const data = [
      {
        type: "arrow",
        points: [
          [32025, 39905],
          [32225, 39496],
        ],
      },
    ];
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
            setFabricOverlayState(
              updateActivityFeed({ id: viewerId, fullFeed: feed })
            );
            setActiveFeed(feed);
          }

          canvas.requestRenderAll();
          console.log(annotatedData);
          if (annotatedData?.length > 0) {
            toast({
              title: "Annotation loaded",
              status: "success",
              duration: 1000,
              isClosable: true,
            });
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
  }, [fabricOverlay, annotatedData]);

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
      location: 4,
      xOffset: 5,
      yOffset: 10,
      color: "white",
      fontColor: "white",
      backgroundColor: "black",
      fontSize: "14px",
      barThickness: 2,
      stayInsideImage: false,
    });
  }, [viewer]);

  // add right click event
  useEffect(() => {
    if (!viewer || !fabricOverlay) return;
    const canvas = fabricOverlay.fabricCanvas();

    const handleMouseDown = (event) => {
      // if not right click
      if (event.button !== 3) {
        closeMenu();
        return;
      }

      const annotation = canvas.getActiveObject();

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

  useEffect(() => {
    updateAnnotation({
      text: annotationText,
      title: `${userInfo.firstName} ${userInfo.lastName}`,
      onUpdateAnnotation,
    });
  }, [annotationText]);

  useEffect(() => {
    updateAnnotation({
      text: annotationText,
      title: `${userInfo.firstName} ${userInfo.lastName}`,
      onUpdateAnnotation,
    });
  }, [annotationText]);

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
    else {
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

        if (slide?.isIHC === false) {
          isKI67Open();
          F;
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
      console.log("body", originalBody);
      try {
        // const resp = await onVhutAnalysis(body);
        const resp = await axios.post(
          "https://backup-quantize-vhut.prr.ai/ki_six_seven_predict",
          originalBody
        );
        console.log("resp", resp);
        //   setLoadUI(false);
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
    }
  };

  useEffect(() => {
    if (vhutSubscriptionData) {
      // console.log("subscribed", vhutSubscriptionData);
      const {
        data,
        status,
        message,
        analysisType: type,
      } = vhutSubscriptionData.analysisStatus;

      if (type === "KI67_ANALYSIS") {
        const posContours = data.kiResults.pos_contours;
        const negContours = data.kiResults.neg_contours;
        const canvas = fabricOverlay.fabricCanvas();
        const { left, top } = annotationObject;
        const circles = posContours.map((coord) => {
          const circle = new fabric.Circle({
            left: coord[0] + left,
            top: coord[1] + top,
            radius: 3,
            fill: "#BB4139",
            stroke: "#BB4139",
            strokeWidth: 2,
          });
          return circle;
        });
        const circlesNegative = negContours.map((coord) => {
          const circle = new fabric.Circle({
            left: coord[0] + left,
            top: coord[1] + top,
            radius: 3,
            fill: "#17478D",
            stroke: "#17478D",
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
        console.log(feedMessage);
        if (feedMessage?.object) {
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

  return (
    <>
      {!isAnnotationLoaded || isViewportAnalysing ? (
        <Loading position="absolute" w="100%" zIndex="3" h="79vh" />
      ) : null}
      <Box position="absolute" left="2vw">
        <Flex
          direction="column"
          gap="1.3vh"
          alignItems="end"
          mt="8px"
          mr="23px"
        >
          <VStack
            // w="fit-content"
            backgroundColor="#F8F8F5"
            border="1px solid #00153F"
            // borderRadius="5px"
            py={2}
            px={1.5}
            zIndex="1"
          >
            <FullScreen viewerId={viewerId} />
          </VStack>
          <VStack
            // w="fit-content"
            backgroundColor="#F8F8F5"
            border="1px solid #00153F"
            // borderRadius="5px"
            py={2}
            px={1.5}
            zIndex="1"
          >
            <ToolbarButton
              icon={<AiOutlinePlus color="#00153F" size={iconSize} />}
              // border="1px solid #3965C6"
              backgroundColor="#E4E5E8"
              onClick={handleZoomIn}
              label="Zoom In"
              mr="0px"
              _hover={{ bgColor: "#ECECEC" }}
              _active={{
                outline: "none",
              }}
            />
            <ZoomSlider viewerId={viewerId} />
            <ToolbarButton
              icon={<AiOutlineMinus color="#00153F" size={iconSize} />}
              // border="1px solid #3965C6"
              backgroundColor="#E4E5E8"
              onClick={handleZoomOut}
              label="Zoom Out"
              mr="0px"
              _hover={{ bgColor: "#ECECEC" }}
              _active={{
                outline: "none",
              }}
            />
          </VStack>
          <VStack
            // w="fit-content"
            backgroundColor="#F8F8F5"
            border="1px solid #00153F"
            // borderRadius="5px"
            py={2}
            px={1.5}
            zIndex="1"
          >
            <ZoomButton viewerId={viewerId} />
          </VStack>
          <CustomMenu
            isMenuOpen={isOpen}
            closeMenu={closeMenu}
            setIsOpen={setIsRightClickActive}
            left={menuPosition.left}
            top={menuPosition.top}
            onHandleVhutAnalysis={handleVhutAnalysis}
            setZoom={handleZoomLevel}
            slide={slide}
            enableAI={enableAI}
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
            />
          )}
          <ShowMetric viewerId={viewerId} slide={slide} />
        </Flex>
      </Box>
      {isKI67Open ? (
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          zIndex="999"
        >
          <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Create your account</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <Lorem count={2} />
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3}>
                  Save
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      ) : (
        ""
      )}
    </>
  );
}

export default ViewerControls;
