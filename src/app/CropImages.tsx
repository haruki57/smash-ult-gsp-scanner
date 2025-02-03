import React, { useEffect, useRef } from "react";
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
  const firstRender = useRef(true);

  // image processing
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const getGspImg = async () => {
      const image = await Image.load(capImage);
      if (image) {
        const ocrImg = image
          .crop({ x: 1500, y: 720, width: 300, height: 60 })
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
          .crop({ x: 470, y: 845, width: 450, height: 70 })
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
