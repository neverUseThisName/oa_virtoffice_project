import React, { useCallback, useEffect, useRef, useState } from "react";
import Peer from "simple-peer";

const OtherVideoReceived = ({ myStream, from, to, otherStream, socket }) => {
  console.log("OtherVideoReceived");
  const peer = useRef();

  // create a rtc peer representing self
  const createPeer = useCallback(
    (myStream, myScktID, toScktID, socket) => {
      const peer = new Peer({
        initiator: false, // init call rather than waiting
        trickle: false, //
        stream: myStream, // the stream to send
      });

      // trigger when "signal" event is received.
      // if peer is initiator, triggered by itself immediately with myStream as data.
      // if peer is not initiator, wait for event instead. E.q. do nothing.
      peer.on("signal", (stream) => {
        socket.emit("sendAnswer", {
          from: myScktID,
          to: toScktID,
          stream: stream,
        });
      });
      peer.signal(otherStream);
      return peer;
    },
    [socket, myStream]
  );

  return <video width={"200px"} src={otherStream} autoPlay={true} />;
};

export default OtherVideoReceived;
