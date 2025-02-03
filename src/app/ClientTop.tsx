"use client";

import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { VideoList } from "./SelectVideo";
import Ocr from "./Ocr";

export default function ClientTop() {
  const [videoId, setVideoId] = useState<string>("");
  const webcamRef = React.useRef<Webcam>(null);

  const [capImage, setCapImage] = useState<string>("");
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot({
      width: 1920 / 2,
      height: 1080 / 2,
    });
    if (imageSrc) {
      setCapImage(imageSrc);
    }
  }, [webcamRef]);
  useEffect(() => {
    const interval = setInterval(capture, 1000 / 60);
    return () => clearInterval(interval);
  });
  return (
    <>
      <div className="w-[640px] aspect-video">
        <Webcam
          className="w-full aspect-video"
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/png"
          videoConstraints={{
            width: 1920,
            height: 1080,
            deviceId: videoId,
          }}
        />
      </div>
      <VideoList setVideoId={setVideoId} />
      <Ocr capImage={capImage}></Ocr>
    </>
  );
}
