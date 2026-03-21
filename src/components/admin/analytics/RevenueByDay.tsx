import React from "react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Cell } from "recharts";
import type { DayStat } from "../../../types/analyticsTypes";

type Props = {
  data: DayStat[];
  color?: string;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-3 rounded-lg shadow-xl text-sm min-w-35">
        <p className="font-bold text-zinc-900 dark:text-white mb-2 pb-1 border-b border-gray-100 dark:border-zinc-800">
          {label}
        </p>
        <div className="flex flex-col gap-1 text-zinc-600 dark:text-zinc-300">
          <div className="flex justify-between items-center">
            <span className="font-medium">Revenue:</span>
            <span className="font-bold text-zinc-900 dark:text-white ml-3">
              ${Number(data.revenue).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Orders:</span>
            <span className="font-bold text-zinc-900 dark:text-white ml-3">
              {data.orders}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const RevenueByDay: React.FC<Props> = ({ data, color = "#3b82f6" }) => {
  return (
    <ResponsiveContainer width="100%" height="100%" className="text-zinc-500 dark:text-zinc-400">
      <BarChart data={data} margin={{ top: 20, right: 10, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.15} />
        <XAxis 
          dataKey="day" 
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
          tickFormatter={(v) => `$${v}`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "currentColor", opacity: 0.05 }} />
        <Bar dataKey="revenue" radius={[4, 4, 0, 0]} animationDuration={800} maxBarSize={60}>
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};