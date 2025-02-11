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
  vipBorder: number;
  ranks: {
    name: string;
    multiplier: number;
  }[];
  fighterToGsp: {
    [key: string]: number;
  };
};

const generateTierList = (
  fighterToGsp: { [key: string]: number },
  vipBorder: number,
  ranks: { name: string; multiplier: number }[]
) => {
  const sortedFighters = Object.entries(fighterToGsp)
    .map(([fighterId, gsp]) => ({ fighterId, gsp }))
    .sort((a, b) => b.gsp - a.gsp);

  const tiers: Tier[] = [];
  for (const rank of ranks) {
    const tier: Tier = { tierLabel: rank.name, fighters: [] };
    tiers.push(tier);
  }
  tiers.push({ tierLabel: "VIP外", fighters: [] });
  tiers.push({ tierLabel: "未スキャン/未プレイ", fighters: [] });

  sortedFighters.forEach((fighter) => {
    const rank = ranks.find(
      (rank) => fighter.gsp >= vipBorder * rank.multiplier
    );
    if (rank) {
      tiers
        .find((tier) => tier.tierLabel === rank.name)
        ?.fighters.push(fighter);
    } else {
      tiers[tiers.length - 2].fighters.push(fighter);
    }
  });

  return tiers; //tiers.filter((tier) => tier.fighters.length > 0);
};

const TierList: React.FC<TierListProps> = ({
  vipBorder,
  ranks,
  fighterToGsp,
}) => {
  const data = generateTierList(fighterToGsp, vipBorder, ranks);
  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto">
      {data.map((tier) => (
        <div key={tier.tierLabel} className="flex items-center mb-2">
          <div className="w-10 h-10 flex items-center justify-center font-bold text-white bg-gray-800 mr-2 rounded">
            {tier.tierLabel}
          </div>
          {/* <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 flex-grow"> */}
          <div className="flex flex-wrap gap-2">
            {tier.fighters.map((fighter) => (
              <div key={fighter.fighterId} className="relative">
                <Image
                  src={`/fighters/${fighter.fighterId}.png`}
                  alt={fighter.fighterId}
                  width={40}
                  height={40}
                  className="border border-gray-500 rounded"
                />
                {/* <span className="absolute bottom-1 right-4 bg-black text-white text-xs px-1 py-0.5 rounded">
                  {Math.floor(fighter.gsp / 1000)}k
                </span> */}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TierList;
