import React, { useEffect, useState } from "react";
import ScreenCapture from "../Screencapture/ScreenCapture";
import "../../styles/styles.css";
import Navbar from "../Screencapture/CaptureButton";
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
} from "@chakra-ui/react";
import { useFabricOverlayState } from "../../state/store";
import { fabric } from "openseadragon-fabricjs-overlay";

const ViewerImport = ({
  viewerId,
  uploadPatch,
  setStartX,
  setStartY,
  setWindowWidth,
  setWindowHeight,
}) => {
  const [screenCapture, setScreenCapture] = useState("");
  const [open, setModalOpen] = useState(false);
  const [title, setTitle] = useState("image Title");
  const { fabricOverlayState } = useFabricOverlayState();
  const { viewerWindow, color } = fabricOverlayState;
  const { viewer, fabricOverlay } = viewerWindow[viewerId];

  const handleScreenCapture = (screenCapture) => {
    setScreenCapture(screenCapture);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSave = () => {
    fetch(screenCapture)
      .then((res) => res.blob())
      .then((blob) => {
        const fd = new FormData();
        const file = new File([blob], "patch.png", { type: "image/png" });
        fd.append("file", file);
        uploadPatch(fd);
      });
    closeModal();
  };

  // useEffect(() => {
  //   if (!show) return;
  //   const canvas = fabricOverlay.fabricCanvas();
  //   const cells = [];
  //   const { left, top, nuc } = cellData[0][0];
  //   Object.values(nuc).forEach((cell) => {
  //     const points = cell.contour.map((point) => ({
  //       x: point[0] + left,
  //       y: point[1] + top,
  //     }));
  //     const polygon = new fabric.Polygon(points, {
  //       stroke: "black",
  //       strokeWidth: 1.2,
  //       fill: `${color.hex}40`,
  //       strokeUniform: true,
  //     });
  //     cells.push(polygon);
  //   });
  //   const group = new fabric.Group(cells, {
  //     stroke: "black",
  //     strokeWidth: 1,
  //     fill: `${color.hex}40`,
  //     strokeUniform: true,
  //   });
  //   canvas.add(group).requestRenderAll();
  //   setShow(false);
  // }, [show]);

  return (
    <ScreenCapture
      onEndCapture={handleScreenCapture}
      setStartX={setStartX}
      setStartY={setStartY}
      setWindowWidth={setWindowWidth}
      setWindowHeight={setWindowHeight}
    >
      {({ onStartCapture }) => (
        <>
          <header>
            <Navbar capture={onStartCapture} />
          </header>

          <Modal isOpen={open} size="xl">
            <ModalContent>
             

              <ModalBody>
                {screenCapture && <Image src={screenCapture} />}
              </ModalBody>
              <ModalFooter>
                <Button onClick={handleSave}>Save to S3</Button>
                <Button onClick={closeModal}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </ScreenCapture>
  );
};

export default ViewerImport;
