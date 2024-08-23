import React, { useEffect, useState } from "react";

import MyVideo from "./MyVideo";
import { MY_CHARACTER_INIT_CONFIG } from "./characterConstants";
import { connect } from "react-redux";
import OtherVideoInited from "./OtherVideoInited";
import OtherVideoReceived from "./OtherVideoReceived";

const VideoCalls = ({ me, others, socket }) => {
  const [myStream, setMyStream] = useState();
  const [receivedOffers, setReceivedOffers] = useState([]);
  // get self cam
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setMyStream(stream);
      });
  }, []);

  // wait for calls from those with smaller keys than me
  useEffect(() => {
    socket.on("receiveOffer", ({ from, stream }) => {
      console.log("received offer", from);
      // add to received offers
      setReceivedOffers((prev) => [...prev, { from, stream }]);
      // send answer back
      socket.emit("sendAnswer", {
        from: me.socketId,
        to: from,
        stream: myStream,
      });
    });
  }, [socket, receivedOffers]);

  // only init calls to those with bigger keys than me
  const othersBiggerID = Object.keys(others)
    .filter((id) => id > me.id)
    .reduce((res, id) => {
      res[id] = others[id];
      return res;
    }, {});
  console.log("othersBiggerID", othersBiggerID);

  return (
    <>
      <MyVideo stream={myStream} />
      {Object.keys(othersBiggerID).map((id) => (
        <OtherVideoInited
          key={id}
          myStream={myStream}
          from={me.socketId}
          to={othersBiggerID[id].socketId}
          socket={socket}
        />
      ))}
      {receivedOffers.map(({ from, stream }) => (
        <OtherVideoReceived
          key={from}
          from={from}
          stream={stream}
          socket={socket}
        />
      ))}
    </>
  );
};

const state2props = (state) => {
  const me = state.allCharacters.users[MY_CHARACTER_INIT_CONFIG.id];
  const others = Object.keys(state.allCharacters.users)
    .filter((id) => id !== MY_CHARACTER_INIT_CONFIG.id)
    .reduce((res, id) => {
      res[id] = state.allCharacters.users[id];
      return res;
    }, {});
  console.log("others", others);
  return {
    me: me,
    others: others,
  };
};

export default connect(state2props, {})(VideoCalls);
