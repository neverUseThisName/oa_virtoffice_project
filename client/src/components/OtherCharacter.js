import React, { useEffect, useContext } from "react";
import { connect } from "react-redux";

import CanvasConext from "./CanvasContext";
import {
  CHARACTER_IMAGE_SIZE,
  CHARACTER_CLASSES_MAP,
} from "./characterConstants";
import { TILE_SIZE } from "./mapConstants";

function OtherCharacter({ name, x, y, charClass }) {
  const context = useContext(CanvasConext);

  useEffect(() => {
    if (context == null) {
      console.log("null context");
      return;
    }
    const characterImg = document.querySelector(
      `#character-sprite-img-${charClass}`
    );
    const { sx, sy } = CHARACTER_CLASSES_MAP[charClass].icon;
    context.canvas.drawImage(
      characterImg,
      sx,
      sy,
      CHARACTER_IMAGE_SIZE - 5,
      CHARACTER_IMAGE_SIZE - 5,
      x * TILE_SIZE,
      y * TILE_SIZE,
      CHARACTER_IMAGE_SIZE,
      CHARACTER_IMAGE_SIZE
    );
  }, [context, name, x, y, charClass]);

  return null;
}

export default OtherCharacter;
