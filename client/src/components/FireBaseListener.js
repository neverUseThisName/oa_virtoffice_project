import { useEffect } from "react";
import { FireBaseDB as fbdb } from "../firebase/firebase";
import { ref, onValue } from "firebase/database";
import { update as updateAllCharactersData } from "./slices/allCharactersSlice";
import { connect } from "react-redux";

const FireBaseListener = ({ updateAllCharactersData }) => {
  useEffect(() => {
    const posRef = ref(fbdb, "users/");
    const remove = onValue(posRef, (ref) => {
      console.log(ref.val());
      updateAllCharactersData(ref.val());
    });
    return remove;
  }, [updateAllCharactersData]);
  return <></>;
};

const mapDispatch = { updateAllCharactersData };

export default connect(null, mapDispatch)(FireBaseListener);
