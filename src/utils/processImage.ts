import { Image, GreyAlgorithmCallback } from "image-js";
import { VIDEO_SIZE_RATIO } from "@/utils/commons";

interface Props {
  capturedImage: string;
  videoConstraints: { width: number; height: number };
}

const greyAlgorithm: GreyAlgorithmCallback = (
  red: number,
  green: number,
  blue: number
) => {
  // 未プレイのファイターの数字の色は62 122 195
  // 既プレイは105 121 131
  if (blue > 150) {
    return 255;
  }
  // 加重平均法によるグレースケール変換
  return Math.round(0.2989 * red + 0.587 * green + 0.114 * blue);
  // 単純平均法によるグレースケール変換1
  //return Math.round((red + green + blue) / 3);
};

export const processImage = async ({ capturedImage, videoConstraints }: Props): Promise<{fighterNameImage: string; gspImage: string}> => {
  const originalImg = await Image.load(capturedImage);
  if (!originalImg) {
    return { fighterNameImage: "", gspImage: "" };
  }
  const widthRatio = videoConstraints.width / 1920;
  const heightRatio = videoConstraints.height / 1080;

  const processingImg = originalImg
    .crop({
      x: 1500 * widthRatio / VIDEO_SIZE_RATIO,
      y: 720 * heightRatio / VIDEO_SIZE_RATIO,
      width: 300 * widthRatio  / VIDEO_SIZE_RATIO,
      height: 60 * heightRatio / VIDEO_SIZE_RATIO,
    })
    .grey({ algorithm: greyAlgorithm })
    .mask({ threshold: 180 });

  const gspImage =  "data:image/png;base64," + (await processingImg.toBase64("image/png"));

  const fighterNameImage = "data:image/png;base64," + (await originalImg
    .crop({
      x: 470 * widthRatio  / VIDEO_SIZE_RATIO,
      y: 845 * heightRatio / VIDEO_SIZE_RATIO,
      width: 450 * widthRatio  / VIDEO_SIZE_RATIO,
      height: 70 * heightRatio / VIDEO_SIZE_RATIO,
    })
    .grey()
    .mask({ threshold: 180 })
    .toBase64("image/png"));
  
  let maxBlue = 0;
  for (let y = 0; y < processingImg.height; y++) {
    for (let x = 0; x < processingImg.width; x++) {
      const pixel = processingImg.getPixelXY(x, y); // ピクセルの RGB 値を取得
      const b = pixel[2];
      if (b > maxBlue) {
        maxBlue = b;
      }
    }
  }
  // magic number!!
  if (maxBlue > 180) {
    return { fighterNameImage, gspImage: "" };
  }
  return { fighterNameImage, gspImage };
};


export default processImage;
