import { useFabricOverlayState } from "../state/store";

// https://stackoverflow.com/questions/44320104/fabricjs-how-to-move-the-selected-object-by-keyboard
const useKeyboardEvents = ({ viewerId }) => {
  const { fabricOverlayState } = useFabricOverlayState();
  const { fabricOverlay } = fabricOverlayState.viewerWindow[viewerId];

  const handleEvent = (e) => {
    if (e.repeat) {
      return;
    }

    const { key } = e;
    const canvas = fabricOverlay.fabricCanvas();
    const activeObject = canvas.getActiveObject();
    // const activeGroup = canvas.getActiveGroup();
    let activeGroup;
    if (!activeObject) return;

    const STEP = 10;

    const moveSelected = (direction) => {
      if (activeObject) {
        switch (direction) {
          case "LEFT":
            activeObject.left -= STEP;
            break;
          case "UP":
            activeObject.top -= STEP;
            break;
          case "RIGHT":
            activeObject.left += STEP;
            break;
          case "DOWN":
            activeObject.top += STEP;
            break;
          default:
            break;
        }
        activeObject.setCoords();
        canvas.renderAll();
      }
      // TODO: Wire this up if we actually need it?
      else if (activeGroup) {
        switch (direction) {
          case direction.LEFT:
            activeGroup.left -= STEP;
            break;
          case direction.UP:
            activeGroup.top -= STEP;
            break;
          case direction.RIGHT:
            activeGroup.left += STEP;
            break;
          case direction.DOWN:
            activeGroup.top += STEP;
            break;
          default:
            break;
        }
        activeGroup.setCoords();
        canvas.renderAll();
      } else {
        console.warn("no object selected");
      }
    };

    if (key === "ArrowLeft") {
      // handle Left key
      moveSelected("LEFT");
    } else if (key === "ArrowUp") {
      // handle Up key
      moveSelected("UP");
    } else if (key === "ArrowRight") {
      // handle Right key
      moveSelected("RIGHT");
    } else if (key === "ArrowDown") {
      // handle Down key
      moveSelected("DOWN");
    } else if (key === "Backspace" || key === "Clear") {
      // Handle Delete key
      // Object has children (ie. arrow has children objects triangle and line)
      if (activeObject.getObjects) {
        const objs = activeObject.getObjects();

        Object.values(objs).forEach((obj) => {
          canvas.remove(obj);
        });
      }
      canvas.remove(activeObject);
    }
  };

  return { handleEvent };
};

export default useKeyboardEvents;
