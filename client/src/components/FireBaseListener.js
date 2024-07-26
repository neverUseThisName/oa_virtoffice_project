import { useEffect } from "react";
import { MY_CHARACTER_INIT_CONFIG } from "./characterConstants";
import { app as fbApp } from "../firebase/firebase";
import { set, ref, onValue } from "firebase/database";
import { update as updateAllCharactersData } from "./slices/allCharactersSlice";

const FireBaseListener = () => {
  useEffect(() => {
    const posRef = ref(fbApp, "users");
    onValue(posRef, (ref) => {
      updateAllCharactersData(ref.val());
    });
  }, []);
  return <div></div>;
};

export default FireBaseListener;
