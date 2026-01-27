import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { MenuItem } from "../components/admin/MenuCard";

const allMenuItems: MenuItem[] = [
  { name: "Salad", price: 5.5, category: "Soups" },
  { name: "Steak", price: 15.0, category: "Entrees" },
];

export const AdminEditMenuItemPage = () => {
  const navigate = useNavigate();
  const { name } = useParams<{ name: string }>();
  const itemToEdit = allMenuItems.find((i) => i.name === name);

  const [itemName, setItemName] = useState(itemToEdit?.name || "");
  const [price, setPrice] = useState<number | "">(itemToEdit?.price || "");
  const [category, setCategory] = useState(itemToEdit?.category || "");

  useEffect(() => {
    if (!itemToEdit) navigate(-1); // go back if item not found
  }, [itemToEdit]);

  const handleSave = () => {
    console.log({ itemName, price, category });
    navigate(-1); // go back
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Edit Menu Item</h1>
      <div className="flex flex-col gap-4 max-w-sm">
        <input
          type="text"
          placeholder="Dish Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
