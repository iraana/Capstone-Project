import { useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import type { MenuItem } from "../components/admin/MenuCard";
import { MenuCard } from "../components/admin/MenuCard";

// Sample all menu items
const allMenuItems: MenuItem[] = [
  { name: "Salad", price: 5.5, category: "Soups" },
  { name: "Soup", price: 4.0, category: "Soups" },
  { name: "Steak", price: 15.0, category: "Entrees" },
  { name: "Pasta", price: 8.0, category: "Entrees" },
  { name: "Chicken Curry", price: 12.0, category: "Entrees" },
  { name: "Rice", price: 3.5, category: "Sides" },
];

// Add a category field to MenuItem
interface MenuItemWithCategory extends MenuItem {
  category: string;
}

export const AdminAddMenuPage = () => {
  const { date } = useParams<{ date: string }>();

  const [menuItems, setMenuItems] = useState<MenuItemWithCategory[]>([]);
  const [availableItems, setAvailableItems] = useState<MenuItemWithCategory[]>(allMenuItems);

  const handleAddToMenu = (item: MenuItemWithCategory) => {
    setMenuItems([item, ...menuItems]); // add to menu preview
    setAvailableItems(availableItems.filter((i) => i.name !== item.name)); // remove from table
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Add Menu for {date}
      </h1>

      {/* Menu Preview */}
      {menuItems.length > 0 && (
        <div>
          <h2 className="font-semibold text-lg mb-2">Current Menu Preview</h2>
          <MenuCard
            date={date || ""}
            items={menuItems}
            editable={true}
          />
        </div>
      )}

      {/* Table of available items */}
      <h2 className="font-semibold text-lg mt-6 mb-2">Available Menu Items</h2>
      {availableItems.length === 0 ? (
        <p className="text-gray-400">All items are added to the menu</p>
      ) : (
        <table className="min-w-full border border-gray-200 bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-center align-middle">Dish</th>
              <th className="px-3 py-2 text-center align-middle">Category</th>
              <th className="px-3 py-2 text-center align-middle">Price</th>
              <th className="px-3 py-2 text-center align-middle">Action</th>
            </tr>
          </thead>
          <tbody>
            {availableItems.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-200">
                <td className="px-3 py-2 text-center align-middle">{item.name}</td>
                <td className="px-3 py-2 text-center align-middle">{item.category}</td>
                <td className="px-3 py-2 text-center align-middle">${item.price.toFixed(2)}</td>
                <td className="px-3 py-2 text-center align-middle flex justify-center gap-2">
                  <button
                    className="bg-[#00659B] text-white px-3 py-1 rounded hover:bg-[#005082]"
                    onClick={() => handleAddToMenu(item)}
                  >
                    Add to Menu
                  </button>
                  <NavLink
                    to={`/menu/item/edit/${encodeURIComponent(item.name)}`}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Edit Item
                  </NavLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Bottom buttons */}
      <div className="flex gap-4 mt-4">
        <NavLink
          to="/menu/item/new"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create New Menu Item
        </NavLink>

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Save Menu
        </button>
      </div>
    </div>
  );
};
