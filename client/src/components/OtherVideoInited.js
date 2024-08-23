import React, { useCallback, useEffect, useRef, useState } from "react";
import Peer from "simple-peer";

const OtherVideoInited = ({ myStream, from, to, socket }) => {
  console.log("OtherVideoInited");
  const [otherStream, setOtherStream] = useState();
  const peer = useRef();
  // set other stream when it comes
  const setVideoNode = useCallback(
    (node) => {
      if (node) {
        node.srcObject = otherStream;
      }
    },
    [otherStream]
  );

  // create a rtc peer representing self
  const createPeer = useCallback(
    (myStream, myScktID, toScktID, socket) => {
      const peer = new Peer({
        initiator: true, // init call rather than waiting
        trickle: false, //
        stream: myStream, // the stream to send
      });

      // trigger when "signal" event is received.
      // if peer is initiator, triggered by itself immediately with myStream as data.
      // if peer is not initiator, wait for event instead. E.q. do nothing.
      console.log("installing sending offer event");
      peer.on("signal", (stream) => {
        socket.emit("sendOffer", {
          from: myScktID,
          to: toScktID,
          stream: stream,
        });
        console.log(myScktID, " sent offer to ", toScktID);
      });
      return peer;
    },
    [socket, myStream]
  );

  useEffect(() => {
    peer.current = createPeer(myStream, from, to, socket);
    // add logic to listen to the answer signal
    const handleAnswer = (answer) => {
      peer.current.signal(answer.signal);
    };

    socket.on("receiveAnswer", handleAnswer);
    peer.current.on("stream", (stream) => setOtherStream(stream));

    // Clean up
    return () => {
      socket.off("receiveAnswer", handleAnswer);
      if (peer.current) {
        peer.current.destroy();
      }
    };
  }, [from, myStream, socket, to]);

  return <video width={"200px"} ref={setVideoNode} autoPlay={true} />;
};

export default OtherVideoInited;
