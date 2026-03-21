import React from "react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell } from "recharts";
import type { DishStat } from "../../../types/analyticsTypes";

type Props = {
  data: DishStat[];
  xKey?: string;
  yKey?: string;
  color?: string;
  emptyMessage?: string;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-3 rounded-lg shadow-xl text-sm min-w-35">
        <p className="font-bold text-zinc-900 dark:text-white mb-2 pb-1 border-b border-gray-100 dark:border-zinc-800">
          {label}
        </p>

        <div className="flex justify-between items-center text-zinc-600 dark:text-zinc-300">
          <span className="font-medium capitalize">
            {payload[0].name}:
          </span>

          <span className="font-bold text-zinc-900 dark:text-white ml-3">
            {payload[0].name === "spent" ? "$" : ""}
            {payload[0].value.toFixed(2)}
          </span>
        </div>
      </div>
    );
  }

  return null;
};

export const TopDishes: React.FC<Props> = ({
  data,
  xKey = "name",
  yKey = "quantity",
  color = "#00659B",
  emptyMessage = "Not enough data to display"
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500">
        <div className="border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-xl p-8 flex flex-col items-center">
          <p className="font-medium text-sm">
            {emptyMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      className="text-zinc-500 dark:text-zinc-400"
    >
      <BarChart
        data={data}
        margin={{ top: 20, right: 10, left: -12, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="currentColor"
          strokeOpacity={0.15}
        />

        <XAxis
          dataKey={xKey}
          tickFormatter={(v: any) =>
            typeof v === "string"
              ? v.length > 12
                ? `${v.substring(0, 10)}...`
                : v
              : v
          }
          axisLine={false}
          tickLine={false}
          tick={{ fill: "currentColor", fontSize: 12, fontWeight: 500 }}
          dy={10}
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "currentColor", fontSize: 12, fontWeight: 500 }}
          dx={-10}
        />

        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: "currentColor", opacity: 0.05 }}
        />

        <Bar
          dataKey={yKey}
          radius={[4, 4, 0, 0]}
          animationDuration={800}
          maxBarSize={60}
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};