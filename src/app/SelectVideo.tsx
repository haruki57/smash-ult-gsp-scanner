"use client";

// import { VIDEO_SIZE_RATIO } from "@/utils/commons";
import { useEffect, useState } from "react";

type Props = {
  setVideoId: React.Dispatch<React.SetStateAction<string>>;
  videoConstraints: { width: number; height: number };
};

export const VideoList = ({ setVideoId, videoConstraints }: Props) => {
  const [videos, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  useEffect(() => {
    const constraints = {
      audio: false,
      video: {
        width: videoConstraints.width,
        height: videoConstraints.height,
      },
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(() => {
        const getDevice = async () => {
          const videos = await navigator.mediaDevices.enumerateDevices(); //.filter(({ kind }) => kind === "videoinput");
          setVideoDevices(videos);
        };
        getDevice();
      })
      .catch((err) => {
        console.error(err);
      });
  }, [videoConstraints]);

  return (
    <>
      <select
        onChange={(e) => {
          setVideoId(e.target.value);
        }}
        className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
      >
        <option value="" defaultChecked>
          キャプチャーボードを選ぶ
        </option>
        {videos.map((video) => (
          <option key={video.deviceId} value={video.deviceId}>
            {video.label || `Camera ${video.deviceId}`}
          </option>
        ))}
      </select>
    </>
  );
};
