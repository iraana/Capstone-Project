import { useParams, useNavigate } from "react-router";
import { supabase } from "../../../supabase-client";
import { useEffect, useState } from "react";

const fetchMenu = async (menuDate: string) => {
  const { data, error } = await supabase
    .from("MenuDayDishes")
    .select("*, Dishes ( * ), MenuDays ( * )")
    .eq("MenuDays.date", menuDate);

  if (error) throw error;
  return data;
};

type MenuItem = {
  dish_id: number;
  name: string;
  price: number;
  category: string;
  stock?: number;
  menu_id: number;
};

export const EditMenu = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [menuDate] = useState<string>(date || "");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMenuItems = async () => {
      if (!menuDate) return;
      try {
        const itemData = await fetchMenu(menuDate);

        const itemsForDate = itemData
          .filter((md: any) => md.MenuDays?.date === menuDate && md.Dishes)
          .map((md: any) => ({
            dish_id: md.dish_id,
            name: md.Dishes.name,
            price: md.Dishes.price,
            category: md.Dishes.category,
            stock: md.stock,
            menu_id: md.MenuDays.menu_day_id,
          }));

        setMenuItems(itemsForDate);
      } catch (error) {
        console.error("Error loading menu items:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMenuItems();
  }, [menuDate]);

  const handleRemoveItem = async (dishId: number, menuId: number) => {
    const updatedMenuItems = menuItems.filter(
      (item) => item.dish_id !== dishId
    );
    setMenuItems(updatedMenuItems);

    await supabase
      .from("MenuDayDishes")
      .delete()
      .eq("dish_id", dishId)
      .eq("menu_id", menuId);

    if (updatedMenuItems.length === 0) {
      await supabase.from("MenuDays").delete().eq("menu_day_id", menuId);
      navigate("/admin/edit-menu");
    }
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Edit Menu
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1">
            {menuDate}
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/edit-menu")}
          className="bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-white px-4 py-2 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
        >
          ← Back to Menus
        </button>
      </div>

      {/* Card */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-md border border-zinc-200 dark:border-zinc-700 overflow-hidden">

        {loading ? (
          <div className="p-10 text-center text-zinc-500">
            Loading menu...
          </div>
        ) : menuItems.length === 0 ? (
          <div className="p-10 text-center text-zinc-500">
            This menu has no dishes.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-white">
              <tr>
                <th className="px-6 py-3 text-left">Dish</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Stock</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr
                  key={item.dish_id}
                  className="border-t border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition"
                >
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                    {item.name}
                  </td>
                  <td className="px-6 py-4">{item.category}</td>
                  <td className="px-6 py-4">${item.price}</td>
                  <td className="px-6 py-4">{item.stock}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() =>
                        handleRemoveItem(item.dish_id, item.menu_id)
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
