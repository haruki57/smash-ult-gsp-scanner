import Image from "next/image";
import React from "react";

type Fighter = {
  fighterId: string;
  gsp: number;
};

type Tier = {
  tierLabel: string;
  fighters: Fighter[];
};

type TierListProps = {
  data: Tier[];
};

const TierList: React.FC<TierListProps> = ({ data }) => {
  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto">
      {data.map((tier) => (
        <div key={tier.tierLabel} className="flex items-center mb-2">
          <div className="w-12 h-12 flex items-center justify-center font-bold text-white bg-gray-800 mr-2 rounded">
            {tier.tierLabel}
          </div>
          <div className="flex space-x-2">
            {tier.fighters.map((fighter) => (
              <div key={fighter.fighterId} className="relative">
                <Image
                  src={`/fighters/${fighter.fighterId}.png`}
                  alt={fighter.fighterId}
                  width={60}
                  height={60}
                  className="border border-gray-500 rounded"
                />
                <span className="absolute bottom-1 right-1 bg-black text-white text-xs px-1 py-0.5 rounded">
                  123456k
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TierList;
