import React, { useCallback, useEffect, useState } from "react";
import Tesseract, { createWorker } from "tesseract.js";
import { getFighterId } from "@/utils/getFighterId";
import { GspType } from "./ClientTop";

type Props = {
  gspImage: string;
  fighterNameImage: string;
  vipBorder: number;
  addFighter: (fighterName: string | undefined, gsp: GspType) => void;
};

export const Ocr = ({
  gspImage,
  vipBorder,
  fighterNameImage,
  addFighter,
}: Props) => {
  const [ocrWorker, setOcrWorker] = useState<Tesseract.Worker | null>(null);

  const initWorker = useCallback(async () => {
    if (!ocrWorker) {
      const worker = await createWorker("eng", Tesseract.OEM.LSTM_ONLY);
      worker.setParameters({
        tessedit_pageseg_mode: Tesseract.PSM.SINGLE_LINE,
      });
      setOcrWorker(worker);
    }
  }, [ocrWorker]);

  useEffect(() => {
    initWorker(); // もし Worker が未初期化なら作成
    (async () => {
      if (!ocrWorker) {
        return;
      }
      if (gspImage === "" && fighterNameImage === "") {
        return;
      }
      const fighterName = await ocrWorker.recognize(fighterNameImage);
      if (!fighterName) {
        return;
      }
      const fighterId = getFighterId(fighterName?.data?.text?.trim());
      if (gspImage === "") {
        addFighter(fighterId, "no gsp");
        return;
      }

      const gsp = await ocrWorker.recognize(gspImage);
      const trimmedGsp = gsp?.data?.text?.trim();
      if (
        !gsp ||
        Number.isNaN(
          parseInt(trimmedGsp.replaceAll(".", "").replaceAll(",", ""))
        )
      ) {
        addFighter(fighterId, "no gsp");
        return;
      }
      const parsedGsp = parseInt(
        trimmedGsp
          .replaceAll(".", "")
          .replaceAll(",", "")
          .replaceAll("l", "1")
          .replaceAll("|", "1")
          .replaceAll("O", "0")
      );

      if (parsedGsp >= vipBorder * 1.5) {
        // too high. something wrong
        return;
      }
      addFighter(fighterId, parsedGsp);
      //await ocrWorker.terminate();
    })();
  }, [
    gspImage,
    fighterNameImage,
    initWorker,
    ocrWorker,
    addFighter,
    vipBorder,
  ]);

  return <></>;
};

export default Ocr;
