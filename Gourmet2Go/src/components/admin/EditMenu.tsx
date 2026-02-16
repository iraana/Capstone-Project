import { NavLink, useParams } from "react-router";
import { supabase } from "../../../supabase-client";
import { useEffect, useState } from "react";
import * as z from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from "react-router";

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

type Dish = {
  dish_id: number;
  name: string;
  price: number;
  category: string;
};

const menuSchema = z.object({
  date: z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    'Invalid date'
  ),
  day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  dishes: z
    .array(
      z.object({
        dish_id: z.number().min(1, 'Dish is required'),
        stock: z.number().min(1, 'Stock is required'),
      })
    )
    .min(1, 'Please add at least one dish')
    .refine(
      (dishes) => new Set(dishes.map((d) => d.dish_id)).size === dishes.length,
      'Each dish can only be added once'
    ),
});

type MenuFormValues = z.infer<typeof menuSchema>;

export const EditMenu = () => {
  const { date } = useParams<{ date: string }>();
  const [menuDate, setMenuDate] = useState<string>(date || "");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasMenu, setHasMenu] = useState<boolean>(false);
  
  const getDayFromDate = (date: string) => {
    const [year, month, day] = date.split('-').map(Number);
    const newDate = new Date(year, month - 1, day);
    return newDate.toLocaleDateString('en-US', { weekday: 'long' }) as MenuFormValues['day'];
  }

  const {
      control,
      handleSubmit,
      register,
      reset,
      formState: { errors },
      watch,
    } = useForm<MenuFormValues>({
      resolver: zodResolver(menuSchema),
      defaultValues: {
        date: menuDate,
        day: getDayFromDate(menuDate),
        dishes: [],
      },
    });

  const navigate = useNavigate();
  
  const { fields, append, remove } = useFieldArray({
      control,
      name: 'dishes',
  });

  const { data: dishes = [] } = useQuery({
    queryKey: ['dishes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Dishes')
        .select('dish_id, name, price, category')
        .order('name');

      if (error) throw error;

      return data as Dish[];
    },
    refetchOnWindowFocus: true,
  });

  const selectedDishIds = fields.map((_, i) => watch(`dishes.${i}.dish_id`));

  const availableDishes = dishes.filter(
    (dish) => !selectedDishIds.includes(dish.dish_id)
  );

  const handleAddToMenu = (dish: Dish) => {
    append({ dish_id: dish.dish_id, stock: 1 });
  };

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
          reset({ dishes: itemsForDate, date: menuDate, day: getDayFromDate(menuDate) });
      } catch (error) {
        console.error("Error loading menu items:", error);
      }
    };
    loadMenuItems();
  }, [menuDate, reset]);

  const handleRemoveItem = async (fieldIndex: number) => {
    remove(fieldIndex);
  };

  const checkForMenu = async (date: string) => {
  try {
    const { data } = await supabase
      .from('MenuDays')
      .select('menu_day_id')
      .eq('date', date)
      .single();
    return !!data;
  } catch {
    return false;
  }
};

const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const newDate = e.target.value;
  setMenuDate(newDate);
  const exists = await checkForMenu(newDate);
  setHasMenu(exists);
  // Optionally reset form state here if needed
};

  const onSubmit = async (formData: MenuFormValues) => {
    const originalDishes = menuItems; 
    const updatedDishes = formData.dishes;
    try {
      for (const updatedDish of updatedDishes) {
        const original = originalDishes.find(o => o.dish_id === updatedDish.dish_id);
        if (original) {
          if (original.stock !== updatedDish.stock) {
            const { error: updateError } = await supabase.from('MenuDayDishes')
              .update({ stock: updatedDish.stock })
              .eq('dish_id', updatedDish.dish_id)
              .eq('menu_id', original.menu_id);
            if (updateError) {
              console.error("Error updating menu item:", updateError);
            }
          }
        } else {
          const { error: insertError } = await supabase.from('MenuDayDishes')
            .insert({
              dish_id: updatedDish.dish_id,
              menu_id: originalDishes[0]?.menu_id, 
              stock: updatedDish.stock,
            });
          if (insertError) {
            console.error("Error adding menu item:", insertError);
          }
        }
      }
    
      for (const originalDish of originalDishes) {
        if (!updatedDishes.find(i => i.dish_id === originalDish.dish_id)) {
          const { error: deleteError } = await supabase.from('MenuDayDishes')
            .delete()
            .eq('dish_id', originalDish.dish_id)
            .eq('menu_id', originalDish.menu_id);
          if (deleteError) {
            console.error("Error deleting menu item:", deleteError);
          }
        }
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Failed to update menu');
    }
    setSuccessMsg("Menu updated successfully!");
    setErrorMsg(null);
  };

  return (
    <div className="max-w-3x3 mx-auto p-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Success/Error messages */}
        {successMsg && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {errorMsg}
          </div>
        )}

        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/50">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Menu</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Update menu for a specific day</p>
              </div>
              <div className="px-4 py-2 rounded-full border text-sm font-bold uppercase tracking-wide text-center bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                {menuDate ? menuDate : 'Select Date'}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <label className="block text-blue-600 dark:text-blue-400 font-bold text-xs uppercase mb-1">Menu Date</label>
                <input
                  type="date"
                  {...register('date')}
                  className="border rounded px-3 py-2 w-full font-semibold text-gray-900 dark:text-white bg-white dark:bg-zinc-800"
                  onChange={handleDateChange}
                  value={menuDate}
                />
                {errors.date && (
                  <p className="text-red-600 text-sm mt-1">{errors.date.message}</p>
                )}
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="block text-blue-600 dark:text-blue-400 font-bold text-xs uppercase">Day</span>
                <span className="font-semibold text-gray-900 dark:text-white">{getDayFromDate(menuDate)}</span>
              </div>
            </div>

            {hasMenu ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xl block font-semibold mb-4 text-gray-900 dark:text-white">Current Menu</label>
                  <div className="border rounded-xl border-gray-200 dark:border-zinc-700 overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 dark:bg-zinc-700/50">
                        <tr>
                          <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Dish</th>
                          <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Category</th>
                          <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Price</th>
                          <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Stock</th>
                          <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-700">
                        {fields.map((field, index) => {
                          const dish = dishes.find(d => d.dish_id === field.dish_id);
                          return (
                            <tr key={field.id}>
                              <td className="p-3 text-gray-900 dark:text-white">{dish?.name}</td>
                              <td className="p-3 text-gray-900 dark:text-white">{dish?.category}</td>
                              <td className="p-3 text-gray-900 dark:text-white">{dish?.price}</td>
                              <td className="p-3 text-gray-900 dark:text-white">
                                <input
                                  type="number"
                                  {...register(`dishes.${index}.stock`, { valueAsNumber: true })}
                                  className="border rounded px-2 py-1 w-20 text-center bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                                />
                              </td>
                              <td className="p-3 text-center">
                                <button
                                  className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-xl font-semibold transition-all active:scale-95"
                                  type="button"
                                  onClick={() => handleRemoveItem(index)}
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <label className="text-xl block font-semibold mb-4 text-gray-900 dark:text-white">Available Menu Items</label>
                  <div className="border rounded-xl border-gray-200 dark:border-zinc-700 overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 dark:bg-zinc-700/50">
                        <tr>
                          <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Dish</th>
                          <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Category</th>
                          <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Price</th>
                          <th className="p-3 font-semibold text-gray-600 dark:text-gray-300">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-zinc-700">
                        {availableDishes.map((item) => (
                          <tr key={item.dish_id}>
                            <td className="p-3 text-gray-900 dark:text-white">{item.name}</td>
                            <td className="p-3 text-gray-900 dark:text-white">{item.category}</td>
                            <td className="p-3 text-gray-900 dark:text-white">{item.price}</td>
                            <td className="p-3 text-center flex justify-center gap-2">
                              <button
                                className="bg-[#00659B] hover:bg-[#005082] text-white py-1 px-3 rounded-xl font-semibold transition-all active:scale-95"
                                type="button"
                                onClick={() => handleAddToMenu(item)}
                              >
                                Add to Menu
                              </button>
                              <NavLink
                                to={`/admin/edit-dish/${item.dish_id}`}
                                className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-xl font-semibold transition-all active:scale-95"
                              >
                                Edit Item
                              </NavLink>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-95"
                  onClick={() => {navigate('/admin/add-menu');}}
                >
                  Create Menu
                </button>
              </div>
            )}

            <div className="pt-4 border-t border-gray-100 dark:border-zinc-700 flex flex-col sm:flex-row gap-3 mt-6">
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-bold shadow-lg shadow-green-900/20 transition-all active:scale-95"
              >
                Save Changes
              </button>
              <button
                type="button"
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-xl font-semibold transition-all active:scale-95"
                onClick={() => navigate('/admin')}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
