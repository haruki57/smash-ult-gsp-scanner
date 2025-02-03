"use client";

import React, { useState } from "react";
import Webcam from "react-webcam";
import { VideoList } from "./SelectVideo";

export default function ClientTop() {
  const [videoId, setVideoId] = useState<string>("");
  return (
    <>
      <Webcam
        audio={false}
        className="w-72"
        videoConstraints={{
          width: 1920,
          height: 1080,
          deviceId: videoId,
        }}
      />
      <VideoList setVideoId={setVideoId} />
    </>
  );
}
