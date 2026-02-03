interface OrderStatusStatsProps {
  completed: number;
  cancelled: number;
  noShow: number;
}

export const OrderStatusStats = ({
  completed,
  cancelled,
  noShow,
}: OrderStatusStatsProps) => {
  const total = completed + cancelled + noShow;
  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <h2 className="font-semibold text-lg mb-4">Order Completion Stats</h2>
      <ul className="space-y-2">
        <li>
          Completed: {completed} ({((completed / total) * 100).toFixed(1)}%)
        </li>
        <li>
          Cancelled: {cancelled} ({((cancelled / total) * 100).toFixed(1)}%)
        </li>
        <li>
          No Show: {noShow} ({((noShow / total) * 100).toFixed(1)}%)
        </li>
      </ul>
    </div>
  );
};
