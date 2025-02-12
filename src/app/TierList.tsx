"use client";

import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { GspType } from "./ClientTop";

type Fighter = {
  fighterId: string;
  gsp: GspType;
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
    [key: string]: GspType;
  };
};

const generateTierList = (
  fighterToGsp: { [key: string]: GspType },
  vipBorder: number,
  ranks: { name: string; multiplier: number }[]
) => {
  const sortedFighters = Object.entries(fighterToGsp)
    .filter(([_, gsp]) => typeof gsp === "number")
    .map(([fighterId, gsp]) => ({ fighterId, gsp }))
    .sort((a, b) => (b.gsp as number) - (a.gsp as number));

  const tiers: Tier[] = [];
  for (const rank of ranks) {
    const tier: Tier = { tierLabel: rank.name, fighters: [] };
    tiers.push(tier);
  }
  tiers.push({ tierLabel: "~9", fighters: [] });

  sortedFighters.forEach((fighter) => {
    const gsp = fighter.gsp;
    if (gsp === "no gsp" || gsp === undefined) {
      return;
    }
    const rank = ranks.find((rank) => gsp >= vipBorder * rank.multiplier);
    if (rank) {
      tiers
        .find((tier) => tier.tierLabel === rank.name)
        ?.fighters.push(fighter);
    } else {
      tiers[tiers.length - 1].fighters.push(fighter);
    }
  });

  return tiers;
};

const TierList: React.FC<TierListProps> = ({
  vipBorder,
  ranks,
  fighterToGsp,
}) => {
  const tierListRef = useRef<HTMLDivElement>(null);
  const data = generateTierList(fighterToGsp, vipBorder, ranks);
  const [saving, setSaving] = useState<boolean>(false);

  const handleDownload = async () => {
    setSaving(true);
    setTimeout(async () => {
      try {
        if (!tierListRef.current) return;
        const canvas = await html2canvas(tierListRef.current, {
          backgroundColor: "#ffffff", // 背景色を白に設定
          scale: 2, // 画質を上げるために2倍のスケールで描画
        });

        const image = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = image;
        link.download = `tierlist-${new Date().toISOString().slice(0, 10)}.png`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setSaving(false);
      } catch (error) {
        console.error("画像の保存に失敗しました:", error);
      }
    }, 1);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <div
        ref={tierListRef}
        className="flex flex-col w-full bg-white p-4 rounded"
      >
        {data.map((tier) => (
          <div key={tier.tierLabel} className="flex mb-2">
            <div className="w-10 h-10 text-center font-bold text-white bg-gray-800 mr-4 rounded">
              {/* hack to prevent html2canvas from capturing the text below */}
              {saving ? (
                tier.tierLabel
              ) : (
                <div className="pt-2">{tier.tierLabel}</div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {tier.fighters.map((fighter) => (
                <div key={fighter.fighterId} className="relative">
                  <div className="border border-gray-500 rounded object-cover w-[42px] h-[42px]">
                    {/* Image tag cannot be treated by html2canvas correctly */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt={fighter.fighterId}
                      src={`/fighters/${fighter.fighterId}.png`}
                      width={40}
                      height={40}
                    />
                  </div>
                  {/* <span className="absolute bottom-1 right-1 bg-black text-white text-xs px-1 py-0.5 rounded">
                    {Math.floor(fighter.gsp / 1000)}k
                  </span> */}
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="text-right text-gray-500 text-xs mt-4">
          {`${new Date()
            .toISOString()
            .slice(0, 10)}時点でのVIPボーダー推定値: ${vipBorder}`}
        </div>
        <div className="text-right text-gray-500 text-xs">
          <a
            href="https://kumamate.net/vip/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 text-xs"
          >
            クマメイトツール
          </a>
          様の基準値を使用しています
        </div>
        <div className="text-right text-gray-500 text-xs mt-4">
          https://gsp-vis.harukisb.net/
        </div>
        <div className="text-right text-gray-500 text-xs">
          Developed by @harukisb
        </div>
      </div>
      <button
        onClick={handleDownload}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400 transition-colors"
      >
        画像として保存
      </button>
    </div>
  );
};

export default TierList;
