import React from "react";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from "recharts";
import type { TrendStat } from "../../../types/analyticsTypes";
import { DateTime } from "luxon";

type Props = {
  data: TrendStat[];
  color?: string;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-3 rounded-lg shadow-xl text-sm min-w-40">
        <p className="font-bold text-zinc-900 dark:text-white mb-2 pb-1 border-b border-gray-100 dark:border-zinc-800">
          {DateTime.fromISO(label).toFormat("MMM dd, yyyy")}
        </p>

        <div className="flex flex-col gap-1.5 text-zinc-600 dark:text-zinc-300">
          <div className="flex justify-between items-center">
            <span className="font-medium">Revenue:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              ${Number(data.revenue).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Orders:</span>
            <span className="font-bold text-zinc-900 dark:text-white">
              {data.orders}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-xs uppercase tracking-wide">AOV:</span>
            <span className="font-bold text-zinc-900 dark:text-white">
              ${Number(data.aov).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const RevenueTrend: React.FC<Props> = ({ data, color = "#8b5cf6" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500">
        <div className="border-2 border-dashed border-gray-200 dark:border-zinc-700 rounded-xl p-8 flex flex-col items-center">
          <p className="font-medium text-sm">Not enough data for trend analysis</p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%" className="text-zinc-500 dark:text-zinc-400">
      <AreaChart data={data} margin={{ top: 20, right: 10, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.15} />

        <XAxis
          dataKey="date"
          tickFormatter={(v) => DateTime.fromISO(v).toFormat("MMM dd")}
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

        <Area
          type="monotone"
          dataKey="revenue"
          stroke={color}
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorRevenue)"
          animationDuration={1000}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};