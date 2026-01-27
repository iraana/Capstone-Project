export interface TopDish {
  id: string;
  name: string;
  sold: number;
}

export const TopDishesList = ({ dishes }: { dishes: TopDish[] }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Top Dishes</h3>
      <ul className="space-y-2">
        {dishes.map((dish) => (
          <li key={dish.id} className="flex justify-between bg-blue-50 p-2 rounded">
            <span className="font-medium text-blue-900">{dish.name}</span>
            <span className="text-gray-700">{dish.sold} sold</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
