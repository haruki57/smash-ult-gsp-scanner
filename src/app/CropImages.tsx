import React, { useEffect } from "react";
import { Image, GreyAlgorithmCallback } from "image-js";

interface Props {
  capImage: string;
  setGspImg: React.Dispatch<React.SetStateAction<string>>;
  setFighterNameImg: React.Dispatch<React.SetStateAction<string>>;
}

const greyAlgorithm: GreyAlgorithmCallback = (
  red: number,
  green: number,
  blue: number
) => {
  // 未プレイのファイターの数字の色は62 122 195
  // 既プレイは105 121 131
  /*
  if (blue > 150) {
    return 255;
  }
  */

  // 加重平均法によるグレースケール変換
  return Math.round(0.2989 * red + 0.587 * green + 0.114 * blue);
  // 単純平均法によるグレースケール変換1
  //return Math.round((red + green + blue) / 3);
};

export const CropImages = ({
  capImage,
  setGspImg,
  setFighterNameImg,
}: Props) => {
  useEffect(() => {
    const getGspImg = async () => {
      const originalImg = await Image.load(capImage);
      if (!originalImg) {
        return;
      }

      const processingImg = originalImg
        .crop({ x: 1500 / 2, y: 720 / 2, width: 300 / 2, height: 60 / 2 })
        .grey({ algorithm: greyAlgorithm })
        .mask({ threshold: 180 });
      let sum = 0;
      for (let y = 0; y < processingImg.height; y++) {
        for (let x = 0; x < processingImg.width; x++) {
          const pixel = processingImg.getPixelXY(x, y); // ピクセルの RGB 値を取得
          const r = pixel[0];
          if (r) {
            sum += r;
          }
        }
      }
      // magical number!!
      if (sum > 140000) {
        setGspImg("");
        setFighterNameImg("");
        return;
      }
      const gspImg = processingImg.toBase64("image/png");
      setGspImg("data:image/png;base64," + gspImg);

      const nameImg = originalImg
        .crop({ x: 470 / 2, y: 845 / 2, width: 450 / 2, height: 70 / 2 })
        .grey()
        .mask({ threshold: 180 })
        .toBase64("image/png");
      setFighterNameImg("data:image/png;base64," + nameImg);
    };
    const getFighterNameImg = async () => {
      const image = await Image.load(capImage);
      if (image) {
      }
    };
    getGspImg();
    getFighterNameImg();
  }, [capImage, setFighterNameImg, setGspImg]);

  return <></>;
};
export default CropImages;
