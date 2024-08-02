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
  const chars = state.allCharacters.users;
  Object.keys(chars)
    .filter((id) => id !== MY_CHARACTER_INIT_CONFIG.id)
    .reduce((res, id) => {
      res[id] = chars[id];
      return res;
    }, {});
  return { otherChars: chars };
};

export default connect(state2props, {})(OtherCharacters);
