import React, { useState } from "react";
import CropImages from "./CropImages";

type Props = {
  capImage: string;
};

export const Ocr = ({ capImage }: Props) => {
  const [gspImage, setGspImage] = useState<string>("");
  const [fighterNameImage, setFighterNameImage] = useState<string>("");
  // const [roomId, setRoomId] = useState<string>("");

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
