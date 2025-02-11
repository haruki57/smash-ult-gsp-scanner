"use client";

import React, { useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  Legend,
} from "recharts";
import { GspType } from "./ClientTop";

/*
const multi = [
  1.105, 1.101, 1.099, 1.097, 1.095, 1.093, 1.09, 1.087, 1.084, 1.081, 1.076,
  1.054, 1.046, 1.039, 1.011,
];
*/

// 型定義を追加
type Rank = {
  name: string;
  multiplier: number;
};

interface GspChartProps {
  data: { [name: string]: GspType };
  vipBorder: number;
  ranks: Rank[];
}

const GspChart = ({ data, vipBorder, ranks }: GspChartProps) => {
  const [startFromZero, setStartFromZero] = useState<boolean>(true);
  const minPower = startFromZero ? 0 : vipBorder;
  const ticks = startFromZero
    ? [5000000, 10000000, 15000000]
    : [minPower, 15000000];
  const maxPower =
    Math.max(
      ...(Object.values(data).filter(
        (gsp) => gsp !== "no gsp" && gsp !== undefined
      ) as number[])
    ) * 1.01;
  // data (props) はキャラクター名をキー、世界戦闘力をバリューとするオブジェクト
  const chartData = Object.entries(data)
    .filter((d) => typeof d[1] === "number")
    .map(([name, gsp]) => ({
      name,
      gsp: Math.max(minPower, gsp as number),
    }));

  const lines = ranks.map((rank) => ({
    gsp: vipBorder * rank.multiplier,
    name: rank.name,
  }));

  return (
    <div>
      <button onClick={() => setStartFromZero(!startFromZero)}>
        {startFromZero ? "Start from 0" : `Start from ${vipBorder}`}
      </button>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          layout="vertical"
          width={600}
          height={Object.entries(data).length * 40}
          data={chartData}
          margin={{ top: 20, right: 80, left: 100, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[minPower, maxPower]} ticks={ticks} />
          <YAxis type="category" dataKey="name" width={150} />

          <Tooltip />
          <Legend />
          <Bar dataKey="gsp" fill="#8884d8" />
          {/* 参照線を追加 */}
          {}
          {/* 参照線とラベルを追加 */}
          {lines.map((line, idx) => (
            <ReferenceLine
              key={line.gsp}
              x={line.gsp}
              stroke="red"
              label={{
                value: line.name,
                position: idx % 2 === 0 ? "top" : "insideTop",
                fill: "red",
                fontSize: 12,
              }}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GspChart;
