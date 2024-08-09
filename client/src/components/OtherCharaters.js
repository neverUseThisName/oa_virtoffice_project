import React from "react";

import { connect } from "react-redux";
import { MY_CHARACTER_INIT_CONFIG } from "./characterConstants";
import OtherCharacter from "./OtherCharacter";

const OtherCharacters = ({ otherChars }) => {
  return (
    <>
      {Object.keys(otherChars).map((id) => (
        <OtherCharacter
          key={id}
          name={otherChars[id]["username"]}
          x={otherChars[id]["x"]}
          y={otherChars[id]["y"]}
          charClass={otherChars[id]["characterClass"]}
        />
      ))}
    </>
  );
};

const state2props = (state) => {
  const otherChars = Object.keys(state.allCharacters.users)
    .filter((id) => id !== MY_CHARACTER_INIT_CONFIG.id)
    .reduce((res, id) => {
      res[id] = state.allCharacters.users[id];
      return res;
    }, {});
  // console.log(otherChars);
  return { otherChars: otherChars };
};

export default connect(state2props, {})(OtherCharacters);
