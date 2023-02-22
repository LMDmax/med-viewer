import { fabric } from "openseadragon-fabricjs-overlay";

fabric.Canvas.prototype.getObjectByHash = function (hash) {
  return this.getObjects().find((obj) => obj.hash === hash);
};
