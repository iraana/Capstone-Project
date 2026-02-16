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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-6 space-y-6">
        {successMsg && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="text-red-600 text-sm mt-2">
            {errorMsg}
          </div>
        )}
      </div>
      <div className="p-6 space-y-6">
        <div>
            <label className="block font-semibold mb-1">Menu Date</label>
            <input
              type="date"
              {...register('date')}
              className="border rounded px-3 py-2"
              onChange={handleDateChange}
              value={menuDate}
            />
            
            {errors.date && (
              <p className="text-red-600 text-sm">{errors.date.message}</p>
            )}
          </div>
          {hasMenu ? (
        <div className="flex gap-6  ">
          <div className="w-1/2">
          <label className="text-2xl block font-semibold mb-6">Current Menu: </label>
            <table className="min-w-full border border-gray-200 shadow-md rounded-lg">
              <thead className="bg-gray-100 dark:bg-zinc-700">
                <tr>
                  <th className="px-3 py-2 text-center align-middle">Dish</th>
                  <th className="px-3 py-2 text-center align-middle">Category</th>
                  <th className="px-3 py-2 text-center align-middle">Price</th>
                  <th className="px-3 py-2 text-center align-middle">Stock</th>
                  <th className="px-3 py-2 text-center align-middle">Action</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => {
                  const dish = dishes.find(d => d.dish_id === field.dish_id);
                  return (
                    <tr key={field.id} className="border-b border-gray-200">
                      <td className="px-3 py-2 text-center align-middle">{dish?.name}</td>
                      <td className="px-3 py-2 text-center align-middle">{dish?.category}</td>
                      <td className="px-3 py-2 text-center align-middle">{dish?.price}</td>
                      <td className="px-3 py-2 text-center align-middle">
                        <input
                          type="number"
                          {...register(`dishes.${index}.stock`, { valueAsNumber: true })}
                          className="border rounded px-2 py-1 w-20 text-center"
                        />
                      </td>
                      <td className="px-3 py-2 text-center align-middle">
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
          <div className="w-1/2">
            <label className="text-2xl block font-semibold mb-6">Available Menu Items: </label>
            <table className="min-w-full border border-gray-200 shadow-md rounded-lg">
            <thead className="bg-gray-100 dark:bg-zinc-700">
              <tr>
                <th className="px-3 py-2 text-center align-middle">Dish</th>
                <th className="px-3 py-2 text-center align-middle">Category</th>
                <th className="px-3 py-2 text-center align-middle">Price</th>
                <th className="px-3 py-2 text-center align-middle">Action</th>
              </tr>
            </thead>
            <tbody>
              {availableDishes.map((item) => (
                <tr className="border-b border-gray-200" key={item.dish_id}>
                  <td className="px-3 py-2 text-center align-middle">{item.name}</td>
                  <td className="px-3 py-2 text-center align-middle">{item.category}</td>
                  <td className="px-3 py-2 text-center align-middle">{item.price}</td>
                  <td className="px-3 py-2 text-center align-middle flex justify-center gap-2">
                    <button
                      className="bg-[#00659B] text-white px-3 py-1 rounded hover:bg-[#005082]"
                      type="button"
                      onClick={() => handleAddToMenu(item)}
                    >
                      Add to Menu
                    </button>
                    <NavLink
                      to={`/admin/edit-dish/${item.dish_id}`}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
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
        ) : (
          <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => {navigate('/admin/add-menu');}}
          >
            Create Menu
          </button>
        )}
      </div>
      <div>
        <pre>{JSON.stringify(errors, null, 2)}</pre>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-4"
        >
          Save Changes
        </button>
        
      </div>
      <div>
        <button type="button" 
        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 mt-4" 
        onClick={() => navigate('/admin')}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
