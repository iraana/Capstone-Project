export interface CustomerTypeStats {
  type: "Repeat" | "One-Time";
  count: number;
}

export interface CustomerTypeBreakdownProps {
  data: CustomerTypeStats[];
}

export const CustomerTypeBreakdown = ({ data }: CustomerTypeBreakdownProps) => {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <h2 className="font-semibold text-lg mb-4">Repeat vs One-Time Customers</h2>
      <ul className="space-y-2">
        {data.map((d, idx) => (
          <li key={idx}>
            {d.type}: {d.count} ({((d.count / total) * 100).toFixed(1)}%)
          </li>
        ))}
      </ul>
    </div>
  );
};
