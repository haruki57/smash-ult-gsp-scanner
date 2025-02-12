"use client";

import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { VideoList } from "./SelectVideo";
import Ocr from "./Ocr";
import TierList from "./TierList";
import { VIDEO_SIZE_RATIO } from "@/utils/commons";
import { fighterIdList } from "@/utils/getFighterId";
import processImage from "@/utils/processImage";

interface ClientTopProps {
  vipBorder: number;
  ranks: {
    name: string;
    multiplier: number;
  }[];
}
export type GspType = number | "no gsp" | undefined;

const initialFighterToGsp: { [key in string]: GspType } = fighterIdList.reduce(
  (prev, id) => {
    prev[id] = undefined;
    return prev;
  },
  {} as { [key in string]: GspType }
);

export default function ClientTop({ vipBorder, ranks }: ClientTopProps) {
  const [videoId, setVideoId] = useState<string>("");
  const [onlyGspCount, setOnlyGspCount] = useState<number>(0);
  const webcamRef = React.useRef<Webcam>(null);
  const [fighterToGsp, setFighterToGsp] =
    useState<{ [key in string]: GspType }>(initialFighterToGsp);

  const [gspImage, setGspImage] = useState<string>("");
  const [fighterNameImage, setFighterNameImage] = useState<string>("");
  const capture = React.useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot({
      width: 1920 / VIDEO_SIZE_RATIO,
      height: 1080 / VIDEO_SIZE_RATIO,
    });
    if (!imageSrc) {
      return;
    }
    const { fighterNameImage: newFighterNameImage, gspImage: newGspImage } =
      await processImage({
        capturedImage: imageSrc,
      });
    if (newFighterNameImage === "" && gspImage === "") {
      return;
    }
    if (fighterNameImage !== newFighterNameImage) {
      console.log("fighterNameImage changed");
      setFighterNameImage(newFighterNameImage);
      setGspImage(newGspImage);
    }
  }, [webcamRef, fighterNameImage, gspImage]);
  useEffect(() => {
    const interval = setInterval(capture, 1000 / 30);
    return () => clearInterval(interval);
  }, [capture]);

  const unlistedFighters = Object.keys(fighterToGsp).filter(
    (fighter) => fighterToGsp[fighter] === undefined
  );
  const noGspFighters = Object.keys(fighterToGsp).filter(
    (fighter) => fighterToGsp[fighter] === "no gsp"
  );

  return (
    <div className="flex justify-center  overflow-x-auto min-w-[1120px]">
      <div className="flex">
        <div className="w-[480px] flex-shrink-0">
          <div className="text-2xl font-bold my-2">GSP Visualizer</div>
          <div className="aspect-video">
            {videoId ? (
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
            ) : (
              <div className="w-full aspect-video bg-gray-200"></div>
            )}
          </div>
          <VideoList setVideoId={setVideoId} />
          {onlyGspCount > 10 && (
            <div className="text-red-500 my-4 font-bold">
              言語設定を英語に切り替え忘れていませんか？
              もし英語なのにうまく読み取れない場合は @harukisb
              まで気軽にご連絡を！
            </div>
          )}

          <div className="mt-4">未スキャンファイター</div>
          <div className="flex flex-wrap gap-2">
            {unlistedFighters.map((fighterName) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={fighterName as string}
                alt={fighterName}
                width={40}
                height={40}
                src={`/fighters/${fighterName}.png`}
                className="border border-gray-500 rounded"
              />
            ))}
          </div>
          <div className="mt-4">未プレイファイター(世界戦闘力なし)</div>
          <div className="flex flex-wrap gap-2">
            {noGspFighters.map((fighterName) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={fighterName as string}
                alt={fighterName}
                width={40}
                height={40}
                src={`/fighters/${fighterName}.png`}
                className="border border-gray-500 rounded"
              />
            ))}
          </div>
          <Ocr
            gspImage={gspImage}
            fighterNameImage={fighterNameImage}
            addFighter={(fighterName, gsp) => {
              if (fighterName === undefined && Number(gsp) >= 0) {
                setOnlyGspCount((onlyGspCount) => onlyGspCount + 1);
                return;
              }
              if (fighterName === undefined) {
                return;
              }
              if (fighterToGsp[fighterName]) {
                return;
              }
              setFighterToGsp((fighterToGsp) => {
                return { ...fighterToGsp, [fighterName]: gsp };
              });
            }}
          />
        </div>
        <div className="w-[640px] flex-shrink-0">
          <TierList
            vipBorder={vipBorder}
            ranks={ranks}
            fighterToGsp={fighterToGsp}
            scannedFighters={
              Object.values(fighterToGsp).filter((gsp) => gsp !== undefined)
                .length
            }
          />
        </div>
      </div>
    </div>
  );
}
