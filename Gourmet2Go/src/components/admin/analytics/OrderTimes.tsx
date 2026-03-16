import React, { useRef, useState } from "react";

type Props = {
  dayHourMatrix: number[][];
  dayHourMax: number;
};

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const hourLabels = Array.from({ length: 24 }, (_, i) => {
  const period = i >= 12 ? "PM" : "AM";
  const h = i % 12 === 0 ? 12 : i % 12;
  return `${h}${period}`;
});

const colorForValue = (value: number, max: number) => {
  if (max === 0 || value === 0) return undefined; 

  const ratio = value / max;
  const alpha = 0.12 + 0.88 * ratio;

  return `rgba(0,101,155,${alpha.toFixed(3)})`;
};

export const OrderTimes: React.FC<Props> = ({ dayHourMatrix, dayHourMax }) => {
  const heatmapRef = useRef<HTMLDivElement | null>(null);

  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    dayLabel?: string;
    hour?: number;
    count?: number;
    x?: number;
    y?: number;
  }>({ visible: false });

  const handleCellEnter = (
    e: React.MouseEvent,
    dIdx: number,
    h: number,
    count: number
  ) => {
    const rect = heatmapRef.current?.getBoundingClientRect();

    setTooltip({
      visible: true,
      dayLabel: dayLabels[dIdx],
      hour: h,
      count,
      x: rect ? e.clientX - rect.left : e.clientX,
      y: rect ? e.clientY - rect.top : e.clientY
    });
  };

  const handleCellMove = (e: React.MouseEvent) => {
    const rect = heatmapRef.current?.getBoundingClientRect();

    setTooltip((t) => ({
      ...t,
      x: rect ? e.clientX - rect.left : e.clientX,
      y: rect ? e.clientY - rect.top : e.clientY
    }));
  };

  const handleCellLeave = () => setTooltip({ visible: false });

  return (
    <div className="w-full h-full flex flex-col">
      <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">
        Order Times Heatmap
      </div>

      <div
        ref={heatmapRef}
        className="relative border border-gray-200 dark:border-zinc-700 rounded-xl p-4 sm:p-6 bg-white dark:bg-zinc-800 shadow-sm overflow-x-auto flex-1 custom-scrollbar"
        onMouseLeave={handleCellLeave}
      >
        <div className="inline-block min-w-full">
          <div className="grid grid-cols-[3rem_repeat(24,1fr)] sm:grid-cols-[4rem_repeat(24,1fr)] gap-1 items-center mb-2">
            <div className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
              Day / Hr
            </div>

            {hourLabels.map((hl, i) => (
              <div
                key={i}
                className="text-[10px] sm:text-xs text-center font-medium text-zinc-500 dark:text-zinc-400 whitespace-nowrap"
              >
                {hl}
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            {dayHourMatrix.map((row, dIdx) => (
              <div
                key={dIdx}
                className="grid grid-cols-[3rem_repeat(24,1fr)] sm:grid-cols-[4rem_repeat(24,1fr)] gap-1 items-center"
              >
                <div className="text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300 pr-2">
                  {dayLabels[dIdx]}
                </div>

                {row.map((count, h) => {
                  const hasOrders = count > 0;

                  return (
                    <div
                      key={h}
                      onMouseEnter={(e) => handleCellEnter(e, dIdx, h, count)}
                      onMouseMove={handleCellMove}
                      onMouseLeave={handleCellLeave}
                      className={`rounded transition-all cursor-pointer flex items-center justify-center
                        ${
                          hasOrders
                            ? "hover:brightness-110 shadow-xs"
                            : "bg-zinc-100/50 dark:bg-zinc-700/30 hover:bg-zinc-200 dark:hover:bg-zinc-600"
                        }`}
                      style={{
                        minHeight: 28,
                        backgroundColor: colorForValue(count, dayHourMax)
                      }}
                    >
                      {hasOrders && (
                        <span className="text-[10px] font-bold text-white/95">
                          {count}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {tooltip.visible && (
          <div
            style={{
              position: "absolute",
              left: (tooltip.x ?? 0) + 12,
              top: (tooltip.y ?? 0) - 12,
              transform: "translateY(-100%)",
              zIndex: 50
            }}
            className="pointer-events-none"
          >
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-3 rounded-lg shadow-xl text-xs min-w-30">
              <div className="font-bold text-zinc-900 dark:text-white mb-1 border-b border-gray-100 dark:border-zinc-800 pb-1">
                {tooltip.dayLabel} • {tooltip.hour}:00
              </div>

              <div className="text-zinc-600 dark:text-zinc-400 font-medium flex justify-between">
                <span>Orders:</span>
                <span className="text-zinc-900 dark:text-white font-bold ml-3">
                  {tooltip.count}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};