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

const TEMP_VIP_BORDER = 13755558;

const multi = [
  1.105, 1.101, 1.099, 1.097, 1.095, 1.093, 1.09, 1.087, 1.084, 1.081, 1.076,
  1.054, 1.046, 1.039, 1.011,
];

const GspChart = ({ data }: { data: { [name in string]: number } }) => {
  const [startFromZero, setStartFromZero] = useState<boolean>(true);
  const minPower = startFromZero ? 0 : TEMP_VIP_BORDER;
  const ticks = startFromZero
    ? [5000000, 10000000, 15000000]
    : [minPower, 15000000];
  const maxPower = Math.max(...Object.values(data)) * 1.01;
  // data (props) はキャラクター名をキー、世界戦闘力をバリューとするオブジェクト
  const chartData = Object.entries(data).map(([name, gsp]) => ({
    name,
    gsp: Math.max(minPower, gsp),
  }));

  const lines = [];
  for (let i = 0; i < multi.length; i++) {
    lines.push(TEMP_VIP_BORDER * multi[i]);
  }
  console.log(data);

  return (
    <div>
      <button onClick={() => setStartFromZero(!startFromZero)}>
        {startFromZero ? "Start from 0" : `Start from ${TEMP_VIP_BORDER}`}
      </button>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          layout="vertical"
          width={600}
          height={data.length * 40}
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
          {lines.map((gsp, idx) => (
            <ReferenceLine
              key={gsp}
              x={gsp}
              stroke="red"
              label={{
                value: "low",
                position: idx % 2 == 0 ? "top" : "insideTop",
              }}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GspChart;
