import { useParams } from "react-router-dom";
import type { MenuItem } from "../../components/admin/MenuCard";

const sampleMenus: Record<string, MenuItem[]> = {
  "2026-01-26": [
    { name: "Salad", price: 5.5, category: "Appetizer" },
    { name: "Soup", price: 4.0, category: "Appetizer" },
  ],
};

export const EditMenu = () => {
  const { date } = useParams<{ date: string }>();
  const menuItems = sampleMenus[date || ""] || [];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Edit Menu for {date}</h1>

      <ul className="bg-white shadow-md rounded-lg p-4 space-y-2">
        {menuItems.map((item, idx) => (
          <li
            key={idx}
            className="flex justify-between items-center bg-gray-50 p-2 rounded"
          >
            <span>{item.name}</span>
            <span>${item.price.toFixed(2)}</span>
            <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
