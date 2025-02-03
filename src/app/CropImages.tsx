import React, { useEffect } from "react";
import { Image } from "image-js";

interface Props {
  capImage: string;
  setGspImg: React.Dispatch<React.SetStateAction<string>>;
  setFighterNameImg: React.Dispatch<React.SetStateAction<string>>;
}

export const CropImages = ({
  capImage,
  setGspImg,
  setFighterNameImg,
}: Props) => {
  useEffect(() => {
    const getGspImg = async () => {
      const image = await Image.load(capImage);
      if (image) {
        const ocrImg = image
          .crop({ x: 1500 / 2, y: 720 / 2, width: 300 / 2, height: 60 / 2 })
          .grey()
          .mask({ threshold: 180 })
          .toBase64("image/png");
        setGspImg("data:image/png;base64," + ocrImg);
      }
    };
    const getFighterNameImg = async () => {
      const image = await Image.load(capImage);
      if (image) {
        const ocrImg = image
          .crop({ x: 470 / 2, y: 845 / 2, width: 450 / 2, height: 70 / 2 })
          .grey()
          .mask({ threshold: 180 })
          .toBase64("image/png");
        setFighterNameImg("data:image/png;base64," + ocrImg);
      }
    };
    getGspImg();
    getFighterNameImg();
  }, [capImage, setFighterNameImg, setGspImg]);

  return <></>;
};
export default CropImages;
