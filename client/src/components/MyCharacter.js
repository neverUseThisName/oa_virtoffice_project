import React, { useEffect, useContext } from "react";
import { connect } from "react-redux";

import CanvasConext from "./CanvasContext";
import {
  CHARACTER_IMAGE_SIZE,
  CHARACTER_CLASSES_MAP,
} from "./characterConstants";
import { TILE_SIZE } from "./mapConstants";
import { loadCharacter } from "./slices/statusSlice";
import { MY_CHARACTER_INIT_CONFIG } from "./characterConstants";
import { update as updateAllCharactersData } from "./slices/allCharactersSlice";

function MyCharacter({
  myCharactersData,
  loadCharacter,
  updateAllCharactersData,
  webrtcSocket,
}) {
  const context = useContext(CanvasConext);

  useEffect(() => {
    const myInitData = {
      ...MY_CHARACTER_INIT_CONFIG,
      socketId: webrtcSocket.id,
    };

    const users = {};
    const myId = MY_CHARACTER_INIT_CONFIG.id;
    users[myId] = myInitData;
    updateAllCharactersData(users);
  }, [webrtcSocket]);

  useEffect(() => {
    if (context == null || myCharactersData == null) {
      return;
    }
    const characterImg = document.querySelector(
      `#character-sprite-img-${MY_CHARACTER_INIT_CONFIG.characterClass}`
    );
    const { sx, sy } =
      CHARACTER_CLASSES_MAP[MY_CHARACTER_INIT_CONFIG.characterClass].icon;
    context.canvas.drawImage(
      characterImg,
      sx,
      sy,
      CHARACTER_IMAGE_SIZE - 5,
      CHARACTER_IMAGE_SIZE - 5,
      myCharactersData.position.x * TILE_SIZE,
      myCharactersData.position.y * TILE_SIZE,
      CHARACTER_IMAGE_SIZE,
      CHARACTER_IMAGE_SIZE
    );
    loadCharacter(true);
  }, [
    context,
    myCharactersData?.position.x,
    myCharactersData?.position.y,
    loadCharacter,
  ]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      let newPosition = { ...myCharactersData.position };

      switch (key) {
        case "w":
          newPosition.y -= 1;
          break;
        case "s":
          newPosition.y += 1;
          break;
        case "a":
          newPosition.x -= 1;
          break;
        case "d":
          newPosition.x += 1;
          break;
        default:
          return;
      }

      // Update the character's position
      const updatedUsers = {
        [MY_CHARACTER_INIT_CONFIG.id]: {
          ...myCharactersData,
          position: newPosition,
        },
      };
      updateAllCharactersData(updatedUsers);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [myCharactersData, updateAllCharactersData]);

  return null;
}

const mapStateToProps = (state) => {
  return {
    myCharactersData: state.allCharacters.users[MY_CHARACTER_INIT_CONFIG.id],
  };
};

const mapDispatch = { loadCharacter, updateAllCharactersData };

export default connect(mapStateToProps, mapDispatch)(MyCharacter);
