import { Image, GreyAlgorithmCallback } from "image-js";
import { VIDEO_SIZE_RATIO } from "@/utils/commons";

interface Props {
  capturedImage: string;
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

export const processImage = async ({ capturedImage }: Props): Promise<{fighterNameImage: string; gspImage: string}> => {
  const originalImg = await Image.load(capturedImage);
  if (!originalImg) {
    return { fighterNameImage: "", gspImage: "" };
  }

  const processingImg = originalImg
    .crop({
      x: 1500 / VIDEO_SIZE_RATIO,
      y: 720 / VIDEO_SIZE_RATIO,
      width: 300 / VIDEO_SIZE_RATIO,
      height: 60 / VIDEO_SIZE_RATIO,
    })
    .grey({ algorithm: greyAlgorithm })
    .mask({ threshold: 180 });

  const gspImage =  "data:image/png;base64," + (await processingImg.toBase64("image/png"));

  const fighterNameImage = "data:image/png;base64," + (await originalImg
    .crop({
      x: 470 / VIDEO_SIZE_RATIO,
      y: 845 / VIDEO_SIZE_RATIO,
      width: 450 / VIDEO_SIZE_RATIO,
      height: 70 / VIDEO_SIZE_RATIO,
    })
    .grey()
    .mask({ threshold: 180 })
    .toBase64("image/png"));
  
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
  // magic number!!
  if (sum > 140000) {
    return { fighterNameImage, gspImage: "" };
  }
  return { fighterNameImage, gspImage };
};


export default processImage;
