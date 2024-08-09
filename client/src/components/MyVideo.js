import React, { useCallback } from "react";

const MyVideo = ({ myStream }) => {
  const setVideoNode = useCallback(
    (vidNode) => {
      vidNode && (vidNode.srcObject = myStream);
    },
    [myStream]
  );

  return (
    <>
      {myStream && <video width="200px" ref={setVideoNode} autoPlay={true} />}
    </>
  );
};

export default MyVideo;
