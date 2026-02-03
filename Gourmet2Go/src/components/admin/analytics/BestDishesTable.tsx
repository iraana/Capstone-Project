interface DishStats {
  name: string;
  sold: number;
}

interface BestDishesTableProps {
  dishes: DishStats[];
}

export const BestDishesTable = ({ dishes }: BestDishesTableProps) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="font-semibold text-lg mb-4">
        Best Selling Dishes
      </h2>

      <table className="min-w-full border border-gray-200">
        <thead className="bg-blue-100">
          <tr>
            <th className="px-3 py-2 text-center">Dish</th>
            <th className="px-3 py-2 text-center">Sold</th>
          </tr>
        </thead>
        <tbody>
          {dishes.map((dish, idx) => (
            <tr key={idx} className={idx === 0 ? "bg-green-100" : idx % 2 === 0 ? "bg-blue-50" : "bg-white"}>
              <td className="px-3 py-2 text-center">{dish.name}</td>
              <td className="px-3 py-2 text-center">{dish.sold}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};