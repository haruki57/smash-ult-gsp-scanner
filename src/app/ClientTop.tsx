"use client";

import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { VideoList } from "./SelectVideo";
import Ocr from "./Ocr";
import TierList from "./TierList";
import { VIDEO_SIZE_RATIO } from "@/utils/commons";
import { fighterIdList } from "@/utils/getFighterId";
import processImage from "@/utils/processImage";
import { fighterInfoMap } from "@/utils/fighterInfo";

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
  const [videoConstraints, setVideoConstraints] = useState({
    width: 1920,
    height: 1080,
  });
  const [onlyGspCount, setOnlyGspCount] = useState<number>(0);
  const webcamRef = React.useRef<Webcam>(null);
  const [fighterToGsp, setFighterToGsp] =
    useState<{ [key in string]: GspType }>(initialFighterToGsp);

  const [gspImage, setGspImage] = useState<string>("");
  const [fighterNameImage, setFighterNameImage] = useState<string>("");
  const capture = React.useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot({
      width: videoConstraints.width / VIDEO_SIZE_RATIO,
      height: videoConstraints.height / VIDEO_SIZE_RATIO,
    });
    if (!imageSrc) {
      return;
    }
    const { fighterNameImage: newFighterNameImage, gspImage: newGspImage } =
      await processImage({
        capturedImage: imageSrc,
        videoConstraints,
      });
    if (newFighterNameImage === "" && gspImage === "") {
      return;
    }
    if (fighterNameImage !== newFighterNameImage) {
      console.log("fighterNameImage changed");
      setFighterNameImage(newFighterNameImage);
      setGspImage(newGspImage);
    }
  }, [webcamRef, fighterNameImage, gspImage, videoConstraints]);
  useEffect(() => {
    const interval = setInterval(capture, 1000 / 30);
    return () => clearInterval(interval);
  }, [capture]);

  const unlistedFighters = Object.keys(fighterToGsp)
    .filter((fighter) => fighterToGsp[fighter] === undefined)
    .sort((a, b) => {
      return fighterInfoMap[a]?.order - fighterInfoMap[b]?.order;
    });
  const noGspFighters = Object.keys(fighterToGsp)
    .filter((fighter) => fighterToGsp[fighter] === "no gsp")
    .sort((a, b) => {
      return fighterInfoMap[a]?.order - fighterInfoMap[b]?.order;
    });

  const scannedFighterNum = Object.values(fighterToGsp).filter(
    (gsp) => gsp !== undefined
  ).length;

  return (
    <div className="flex justify-center  overflow-x-auto min-w-[1120px]">
      <div className="flex">
        <div className="w-[480px] flex-shrink-0">
          <div className="fixed w-[480px] z-50 bg-white">
            <div className="flex justify-between items-center gap-2">
              <div className="text-2xl font-bold my-2">
                世界戦闘力スキャナー(β)
              </div>
              <div className=" text-sm text-gray-500">
                Developed by{" "}
                <a
                  href="https://x.com/harukisb"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @harukisb
                </a>
              </div>
            </div>
            <div className="aspect-video">
              {videoId ? (
                <Webcam
                  className="w-full aspect-video"
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/png"
                  videoConstraints={{
                    width: videoConstraints.width,
                    height: videoConstraints.height,
                    deviceId: videoId,
                  }}
                />
              ) : (
                <div className="w-full aspect-video bg-gray-200"></div>
              )}
            </div>
          </div>
          <div className="h-[318px]"></div>

          <VideoList
            setVideoId={setVideoId}
            videoConstraints={videoConstraints}
          />
          {onlyGspCount > 10 && (
            <div className="text-red-500 my-4 font-bold">
              言語設定を英語に切り替え忘れていませんか？
              もし英語なのにうまく読み取れない場合は @harukisb
              まで気軽にご連絡を！
            </div>
          )}

          <div className="mt-4">解像度を選択</div>
          <select
            className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            onChange={(e) => {
              const [width, height] = e.target.value.split(",").map(Number);
              setVideoConstraints({ width, height });
            }}
          >
            <option value="1920,1080">1080p</option>
            <option value="1280,720">720p</option>
          </select>

          <div className="mt-4">未スキャンファイター</div>
          <div className="flex flex-wrap gap-2 mt-2">
            {unlistedFighters.map((fighterName) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={fighterName as string}
                alt={fighterName}
                width={30}
                height={30}
                src={`/fighters/${fighterName}.png`}
                className="border border-gray-500 rounded"
              />
            ))}
          </div>
          <hr className="my-4"></hr>
          <div className="mt-4">未プレイファイター(世界戦闘力なし)</div>
          <div className="flex flex-wrap gap-2 mt-2">
            {noGspFighters.map((fighterName) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={fighterName as string}
                alt={fighterName}
                width={30}
                height={30}
                src={`/fighters/${fighterName}.png`}
                className="border border-gray-500 rounded"
              />
            ))}
          </div>
          {scannedFighterNum > 0 && (
            <>
              <hr className="my-4"></hr>

              <div className="w-64">
                <button
                  onClick={() => {
                    const tsv = Object.entries(fighterToGsp)
                      .sort(
                        (a, b) =>
                          fighterInfoMap[a[0]]?.order -
                          fighterInfoMap[b[0]]?.order
                      )
                      .map(
                        ([fighterName, gsp]) =>
                          `${fighterInfoMap[fighterName]?.nameJpn}\t${
                            gsp === "no gsp" || gsp === undefined ? "" : gsp
                          }`
                      )
                      .join("\n");
                    navigator.clipboard.writeText(tsv);
                  }}
                  className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  TSVとしてコピー
                </button>
                {Object.entries(fighterToGsp)
                  .sort((a, b) => {
                    return (
                      fighterInfoMap[a[0]]?.order - fighterInfoMap[b[0]]?.order
                    );
                  })
                  .map(([fighterName, gsp]) => (
                    <div
                      key={fighterName}
                      className="flex items-center justify-between odd:bg-gray-100"
                    >
                      <span>{fighterInfoMap[fighterName]?.nameJpn}</span>
                      <span>
                        {gsp === "no gsp" || gsp === undefined ? "" : gsp}
                      </span>
                    </div>
                  ))}
              </div>
            </>
          )}
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
              setFighterToGsp((fighterToGsp) => {
                return { ...fighterToGsp, [fighterName]: gsp };
              });
            }}
            vipBorder={vipBorder}
          />
        </div>

        <div className="w-[640px] flex-shrink-0 mt-2">
          {scannedFighterNum == 0 ? (
            <div className="flex flex-col items-center w-full max-w-4xl mx-10">
              <div className="text-2xl font-bold my-2">使い方</div>
              <div className="flex flex-col gap-2">
                <div>1. パソコンとキャプチャーボードをつないでください。</div>
                <div>
                  2.
                  このページ左の「キャプチャーボードを選ぶ」から、スマブラの画面を映したキャプチャーボードを選択してください。
                </div>
                <div>
                  3.
                  スマブラSPの言語設定を英語にしてください(めんどくさくてすみません)。
                </div>
                <div>
                  4. トップ画面からOnline → Smash → Quick Play → Elite
                  Smashと進み、ファイター選択画面に移動してください。
                </div>
                <div>
                  5.
                  カーソルをファイターに合わせると、世界戦闘力が読み込まれます！
                </div>
              </div>

              <div className="text-2xl font-bold mt-8 my-2">
                ゲーム画面が読み込めない場合
              </div>
              <div className="flex flex-col gap-2">
                <div>
                  ・OBSなど、カメラを使用している他のソフトやタブを閉じてみてください
                </div>
                <div>・解像度を変えてみてください</div>
                <div>・ページをリロードしてみてください</div>
                <div>・キャプチャーボードをつなぎ直してみてください</div>
                <div>・OBSの仮想カメラ経由なら認識することがあるようです</div>
              </div>
            </div>
          ) : (
            <TierList
              vipBorder={vipBorder}
              ranks={ranks}
              fighterToGsp={fighterToGsp}
            />
          )}
        </div>
      </div>
    </div>
  );
}
