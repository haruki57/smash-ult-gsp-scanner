import React, { useCallback, useEffect, useState } from "react";
import CropImages from "./CropImages";
import Tesseract, { createWorker } from "tesseract.js";
import { getFighterId as getFighterId } from "@/utils/getFighterIdId";

type Props = {
  capImage: string;
  addFighter: (fighterName: string, gsp: number) => void;
};

export const Ocr = ({ capImage, addFighter }: Props) => {
  const [gspImage, setGspImage] = useState<string>("");
  const [fighterNameImage, setFighterNameImage] = useState<string>("");
  const [ocrWorker, setOcrWorker] = useState<Tesseract.Worker | null>(null);
  const [set, setSet] = useState(new Set());

  const initWorker = useCallback(async () => {
    if (!ocrWorker) {
      const worker = await createWorker("eng", Tesseract.OEM.LSTM_ONLY);
      worker.setParameters({
        tessedit_pageseg_mode: Tesseract.PSM.SINGLE_LINE,
      });
      setOcrWorker(worker);
    }
  }, []);

  useEffect(() => {
    initWorker(); // もし Worker が未初期化なら作成
    (async () => {
      if (!ocrWorker) {
        return;
      }
      if (gspImage === "" || fighterNameImage === "") {
        return;
      }

      const fighterName = await ocrWorker.recognize(fighterNameImage);
      if (!fighterName) {
        return;
      }
      const fighterId = getFighterId(fighterName?.data?.text?.trim());
      if (!fighterId) {
        return;
      }
      setSet((set) => {
        return new Set([...set, fighterName?.data?.text?.trim()]);
      });

      const gsp = await ocrWorker.recognize(gspImage);
      if (!gsp) {
        return;
      }
      const output =
        fighterName?.data?.text?.trim() + " " + gsp?.data?.text?.trim();
      console.log(output);

      addFighter(
        fighterId,
        Number(gsp?.data?.text?.trim().replace(".", "").replaceAll(",", ""))
      );
      //await ocrWorker.terminate();
    })();
  }, [gspImage, fighterNameImage, initWorker, ocrWorker, addFighter]);

  return (
    <>
      <CropImages
        capImage={capImage}
        setGspImg={setGspImage}
        setFighterNameImg={setFighterNameImage}
      />
      <div>{set.size}</div>
      {/*
      
      <div>
        {Array.from(set).map((fighterName) => (
          <img
            key={fighterName as string}
            width={60}
            height={60}
            src={`/fighters/${getCharacterId(fighterName as string)}.png`}
          />
        ))}
      </div>
      <pre>
        {Array.from(set)
          .map(
            (fighterName) =>
              fighterName + " " + getCharacterId(fighterName as string)
          )
          .join("\n")}
      </pre>

       <div>{gspImage != "" && <img src={gspImage} alt="" />}</div>
      <div>
        {fighterNameImage != "" && <img src={fighterNameImage} alt="" />}
      </div> */}
    </>
  );
};

export default Ocr;
