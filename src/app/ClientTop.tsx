"use client";

import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { VideoList } from "./SelectVideo";
import Ocr from "./Ocr";
import GspChart from "./GspChart";
import TierList from "./TierList";

const tierList = [
  {
    tierLabel: "S",
    fighters: [
      {
        fighterId: "mario",
        gsp: 15432456,
      },
      {
        fighterId: "luigi",
        gsp: 15432456,
      },
      {
        fighterId: "donkey",
        gsp: 15432456,
      },
    ],
  },
  {
    tierLabel: "A",
    fighters: [
      {
        fighterId: "mario",
        gsp: 15432456,
      },
      {
        fighterId: "luigi",
        gsp: 15432456,
      },
      {
        fighterId: "donkey",
        gsp: 15432456,
      },
    ],
  },
];

interface ClientTopProps {
  vipBorder: number;
  ranks: {
    name: string;
    multiplier: number;
  }[];
}

export default function ClientTop({ vipBorder, ranks }: ClientTopProps) {
  const [videoId, setVideoId] = useState<string>("");
  const webcamRef = React.useRef<Webcam>(null);
  const [fighterToGsp, setFighterToGsp] = useState<{ [key in string]: number }>(
    {}
  );

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
    const interval = setInterval(capture, 1000 / 30);
    return () => clearInterval(interval);
  });

  return (
    <>
      <div className="w-[640px] aspect-video">
        {videoId && (
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
        )}
      </div>
      <VideoList setVideoId={setVideoId} />
      <Ocr
        capImage={capImage}
        addFighter={(fighterName, gsp) => {
          setFighterToGsp({ ...fighterToGsp, [fighterName]: gsp });
        }}
      />
      <div>{JSON.stringify(fighterToGsp)}</div>

      <div className="m-8">
        <GspChart data={fighterToGsp} vipBorder={vipBorder} ranks={ranks} />
      </div>

      <TierList data={tierList} />
    </>
  );
}
