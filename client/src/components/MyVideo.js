import React, { useCallback } from "react";

const MyVideo = ({ stream }) => {
  const setVideoNode = useCallback(
    (vidNode) => {
      vidNode && (vidNode.srcObject = stream);
    },
    [stream]
  );

  return (
    <>{stream && <video width="200px" ref={setVideoNode} autoPlay={true} />}</>
  );
};

export default MyVideo;
