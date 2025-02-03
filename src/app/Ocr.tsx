import React, { useCallback, useEffect, useState } from "react";
import CropImages from "./CropImages";
import Tesseract, { createWorker } from "tesseract.js";

type Props = {
  capImage: string;
};

export const Ocr = ({ capImage }: Props) => {
  const [gspImage, setGspImage] = useState<string>("");
  const [fighterNameImage, setFighterNameImage] = useState<string>("");
  const [ocrWorker, setOcrWorker] = useState<Tesseract.Worker | null>(null);

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
      let output = "";
      if (gspImage === "" || fighterNameImage === "") {
        return;
      }
      const gsp = await ocrWorker.recognize(gspImage);
      if (!gsp) {
        return;
      }
      output += gsp?.data?.text?.trim();
      const fighterName = await ocrWorker.recognize(fighterNameImage);
      if (!fighterName) {
        return;
      }
      output += " " + fighterName?.data?.text?.trim();
      console.log(output);
      await ocrWorker.terminate();
    })();
  }, [gspImage, fighterNameImage, initWorker, ocrWorker]);

  return (
    <>
      <CropImages
        capImage={capImage}
        setGspImg={setGspImage}
        setFighterNameImg={setFighterNameImage}
      />

      <div>{gspImage != "" && <img src={gspImage} alt="" />}</div>
      <div>
        {fighterNameImage != "" && <img src={fighterNameImage} alt="" />}
      </div>
    </>
  );
};

export default Ocr;
