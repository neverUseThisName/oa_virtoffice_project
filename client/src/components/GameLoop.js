import React, { useCallback, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import CanvasContext from "./CanvasContext";

import { MOVE_DIRECTIONS, MAP_DIMENSIONS, TILE_SIZE } from "./mapConstants";
import { MY_CHARACTER_INIT_CONFIG } from "./characterConstants";
import { checkMapCollision } from "./utils";
import { update as updateAllCharactersData } from "./slices/allCharactersSlice";
import { set, ref } from "firebase/database";
import { app as fbApp } from "../firebase/firebase";
import FireBaseListener from "./FireBaseListener";

const GameLoop = ({ children, allCharactersData, updateAllCharactersData }) => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  useEffect(() => {
    // frameCount used for re-rendering child components
    console.log("initial setContext");
    setContext({ canvas: canvasRef.current.getContext("2d"), frameCount: 0 });
  }, [setContext]);

  // keeps the reference to the main rendering loop
  const loopRef = useRef();
  const mycharacterData = allCharactersData[MY_CHARACTER_INIT_CONFIG.id];

  const moveMyCharacter = useCallback(
    (e) => {
      const key = e.key;
      if (MOVE_DIRECTIONS[key]) {
        // ***********************************************
        // TODO: Add your move logic here
        // new position
        const x = mycharacterData.position.x + MOVE_DIRECTIONS[key][0];
        const y = mycharacterData.position.y + MOVE_DIRECTIONS[key][1];
        // update users
        set(ref(fbApp, "users/" + mycharacterData.id + "position"), { x, y });
      }
    },
    [allCharactersData, mycharacterData]
  );

  const tick = useCallback(() => {
    if (context != null) {
      setContext({
        canvas: context.canvas,
        frameCount: (context.frameCount + 1) % 60,
      });
    }
    loopRef.current = requestAnimationFrame(tick);
  }, [context]);

  useEffect(() => {
    loopRef.current = requestAnimationFrame(tick);
    return () => {
      loopRef.current && cancelAnimationFrame(loopRef.current);
    };
  }, [loopRef, tick]);

  useEffect(() => {
    document.addEventListener("keypress", moveMyCharacter);
    return () => {
      document.removeEventListener("keypress", moveMyCharacter);
    };
  }, [moveMyCharacter]);

  return (
    <CanvasContext.Provider value={context}>
      <canvas
        ref={canvasRef}
        width={TILE_SIZE * MAP_DIMENSIONS.COLS}
        height={TILE_SIZE * MAP_DIMENSIONS.ROWS}
        class="main-canvas"
      />
      {children}
      <FireBaseListener />
    </CanvasContext.Provider>
  );
};

const mapStateToProps = (state) => {
  return { allCharactersData: state.allCharacters.users };
};

const mapDispatch = { updateAllCharactersData };

export default connect(mapStateToProps, mapDispatch)(GameLoop);
