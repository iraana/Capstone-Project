import { useParams } from "react-router";
import { supabase } from "../../../supabase-client";
import { useEffect, useState } from "react";

const fetchMenu = async (menuDate : string) => {
  const { data, error } = await supabase.from('MenuDayDishes')
    .select('*, Dishes ( * ), MenuDays ( * )')
    .eq('MenuDays.date', menuDate);
  if (error) {
    throw error;
  }
  return data;
}

type MenuItem = {
  dish_id: number;
  name: string;
  price: number;
  category: string;
  stock?: number;
  menu_id: number;
}

export const EditMenu = () => {
  const { date } = useParams<{ date: string }>();
  const [menuDate] = useState<string>(date || "");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const loadMenuItems = async () => {
      if (!menuDate) return;
      try {
        const itemData = await fetchMenu(menuDate);
        const itemsForDate = itemData
          .filter(md => md.MenuDays?.date === menuDate && md.Dishes)
          .map(md => ({
            dish_id: md.dish_id,
            name: md.Dishes.name,
            price: md.Dishes.price,
            category: md.Dishes.category,
            stock: md.stock,
            menu_id: md.MenuDays.menu_day_id
          }));
        setMenuItems(itemsForDate);
      } catch (error) {
        console.error("Error loading menu items:", error);
      }
    };
    loadMenuItems();
  }, [menuDate]);

  const handleRemoveItem = async (dishId: number, menuId: number) => {
    const updatedMenuItems = menuItems.filter(item => item.dish_id !== dishId);
    setMenuItems(updatedMenuItems);
    
    const {error : deleteMenuDishError} = await supabase.from('MenuDayDishes')
      .delete()
      .eq('dish_id', dishId)
      .eq('menu_id', menuId);
    if (deleteMenuDishError) {
      console.error("Error removing menu item:", deleteMenuDishError);
    }

    if (updatedMenuItems.length === 0) {
      const {error: deleteMenuError} = await supabase.from('MenuDays')
        .delete()
        .eq('menu_day_id', menuId);
      if (deleteMenuError) {
        console.error("Error removing empty menu day:", deleteMenuError);
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Edit Menu for {menuDate}</h1>

      <table className="bg-white shadow-md rounded-lg p-4 space-y-2">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2 text-center align-middle">Dish</th>
            <th className="px-3 py-2 text-center align-middle">Category</th>
            <th className="px-3 py-2 text-center align-middle">Price</th>
            <th className="px-3 py-2 text-center align-middle">Stock</th>
            <th className="px-3 py-2 text-center align-middle">Action</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map((item) => (
            <tr key={item.dish_id} className="border-b border-gray-200">
              <td className="px-3 py-2 text-center align-middle">{item.name}</td>
              <td className="px-3 py-2 text-center align-middle">{item.category}</td>
              <td className="px-3 py-2 text-center align-middle">{item.price}</td>
              <td className="px-3 py-2 text-center align-middle">{item.stock}</td>
              <td className="px-3 py-2 text-center align-middle">
                <button 
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick = {() => handleRemoveItem(item.dish_id, item.menu_id)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
