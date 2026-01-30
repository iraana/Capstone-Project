import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import { MenuCard, type MenuItem } from "../../components/admin/MenuCard";
import { supabase } from "../../../supabase-client";
 
 

interface MenuItemWithStock extends MenuItem {
  stock: number;
}
 
export const AddMenu = () => {
  const { date } = useParams<{ date: string }>();
  const [availableItems, setAvailableItems] = useState<MenuItem[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItemWithStock[]>([]);
  const [loading, setLoading] = useState(true);
 
  
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("Dishes").select("*"); 
      if (error) {
        console.error(error);
      } else if (data) {
        setAvailableItems(data as MenuItem[]);
      }
      setLoading(false);
    };
    fetchItems();
  }, []);
 
  const handleAddToMenu = (item: MenuItem) => {
    const stockStr = prompt(`Enter stock amount for "${item.name}"`); 
    if (!stockStr) return;
    const stock = parseInt(stockStr);
    if (isNaN(stock) || stock < 0) return alert("Invalid stock value");
 
    setMenuItems([{ ...item, stock }, ...menuItems]);
    setAvailableItems(availableItems.filter((i) => i.name !== item.name));
  };
 
  const handleSaveMenu = async () => {
    if (!date) return;
 
    try {
      const { error } = await supabase.from("Menus").insert(
        menuItems.map((item) => ({
          dish_name: item.name,
          price: item.price,
          category: item.category,
          stock: item.stock,
          menu_date: date,
        }))
      );
 
      if (error) throw error;
      alert("Menu saved successfully!");
      setMenuItems([]);
    } catch (err) {
      console.error(err);
      alert("Failed to save menu");
    }
  };
 
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Add Menu for {date}
      </h1>
 
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
 
      <h2 className="font-semibold text-lg mt-6 mb-2">Available Menu Items</h2>
      {loading ? (
        <p>Loading items...</p>
      ) : availableItems.length === 0 ? (
        <p className="text-gray-400">All items are added to the menu</p>
      ) : (
        <table className="min-w-full border border-gray-200 bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-center">Dish</th>
              <th className="px-3 py-2 text-center">Category</th>
              <th className="px-3 py-2 text-center">Price</th>
              <th className="px-3 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {availableItems.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-200">
                <td className="px-3 py-2 text-center">{item.name}</td>
                <td className="px-3 py-2 text-center">{item.category}</td>
                <td className="px-3 py-2 text-center">${item.price.toFixed(2)}</td>
                <td className="px-3 py-2 text-center flex justify-center gap-2">
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
      
      <div className="flex gap-4 mt-4">
        <NavLink
          to="/menu/item/new"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create New Menu Item
        </NavLink>
 
        <button
          onClick={handleSaveMenu}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Menu
        </button>
      </div>
    </div>
  );
};