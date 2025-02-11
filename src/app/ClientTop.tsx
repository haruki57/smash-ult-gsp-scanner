"use client";

import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { VideoList } from "./SelectVideo";
import Ocr from "./Ocr";
import GspChart from "./GspChart";
import TierList from "./TierList";
import { VIDEO_SIZE_RATIO } from "@/utils/commons";
import { fighterIdList } from "@/utils/getFighterIdId";

interface ClientTopProps {
  vipBorder: number;
  ranks: {
    name: string;
    multiplier: number;
  }[];
}
export type GspType = number | "no gsp" | undefined;

const sampleFighterToGsp: { [key in string]: GspType } = {
  mario: 14_000_000,
  luigi: 15_000_000,
  donkey: 15_000_000,
  peach: 15_000_000,
  yoshi: 15_000_000,
  kirby: 15_000_000,
  zelda: 15_000_000,
  link: 15_000_000,
  samus: 15_000_000,
  ness: 15_000_000,
  falco: 15_000_000,
  marth: 15_000_000,
  sheik: "no gsp",
  lucina: undefined,
};

const initialFighterToGsp: { [key in string]: GspType } = fighterIdList.reduce(
  (prev, id) => {
    prev[id] = undefined;
    return prev;
  },
  {} as { [key in string]: GspType }
);

export default function ClientTop({ vipBorder, ranks }: ClientTopProps) {
  const [videoId, setVideoId] = useState<string>("");
  const webcamRef = React.useRef<Webcam>(null);
  const [fighterToGsp, setFighterToGsp] =
    useState<{ [key in string]: GspType }>(initialFighterToGsp);

  const [capImage, setCapImage] = useState<string>("");
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot({
      width: 1920 / VIDEO_SIZE_RATIO,
      height: 1080 / VIDEO_SIZE_RATIO,
    });
    if (imageSrc) {
      setCapImage(imageSrc);
    }
  }, [webcamRef]);
  useEffect(() => {
    const interval = setInterval(capture, 1000 / 30);
    return () => clearInterval(interval);
  });

  const unlistedFighters = Object.keys(fighterToGsp).filter(
    (fighter) =>
      fighterToGsp[fighter] === undefined || fighterToGsp[fighter] === "no gsp"
  );

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

      {unlistedFighters.length > 0 && (
        <div className="m-8">
          <div>未スキャン/未プレイ</div>
          <div>{unlistedFighters.join(", ")}</div>
        </div>
      )}

      <TierList
        vipBorder={vipBorder}
        ranks={ranks}
        //fighterToGsp={fighterToGsp}
        fighterToGsp={sampleFighterToGsp}
      />
    </>
  );
}
