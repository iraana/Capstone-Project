interface CategoryStats {
  category: string;
  itemsOrdered: number;
}

interface CategoryBreakdownProps {
  data: CategoryStats[];
}

export const CategoryBreakdown = ({ data }: CategoryBreakdownProps) => {
  const total = data.reduce((sum, d) => sum + d.itemsOrdered, 0);

  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <h2 className="font-semibold text-lg mb-4">Category Performance</h2>
      <table className="min-w-full border border-gray-200">
        <thead className="bg-blue-100">
          <tr>
            <th className="px-3 py-2 text-center">Category</th>
            <th className="px-3 py-2 text-center">Items Ordered</th>
            <th className="px-3 py-2 text-center">%</th>
          </tr>
        </thead>
        <tbody>
          {data.map((cat, idx) => (
            <tr key={idx} className="border-t">
              <td className="px-3 py-2 text-center">{cat.category}</td>
              <td className="px-3 py-2 text-center">{cat.itemsOrdered}</td>
              <td className="px-3 py-2 text-center">
                {((cat.itemsOrdered / total) * 100).toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
