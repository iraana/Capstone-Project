import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '../../../supabase-client';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';
import { NavLink } from 'react-router';
 
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
 
const getDayFromDate = (date: string) => {
  const [year, month, day] = date.split('-').map(Number);
  const newDate = new Date(year, month - 1, day);
  return newDate.toLocaleDateString('en-US', { weekday: 'long' });
};
 
export const AddMenu = () => {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dishSearch, setDishSearch] = useState('');

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10
 
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    reset,
    watch,
  } = useForm<MenuFormValues>({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      day: 'Monday',
      dishes: [],
    },
  });
 
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'dishes',
  });
 
  const { data: dishes = [], isLoading: isDishesLoading  } = useQuery({
    queryKey: ['dishes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Dishes')
        .select('dish_id, name, price, category')
        .eq('dish_status', true)
        .order('name');
 
      if (error) throw error;
 
      return data as Dish[];
    },
    refetchOnWindowFocus: true,
  });
 
  const onSubmit = async (data: MenuFormValues) => {
    setLoading(true);
   
    try {
      const day = getDayFromDate(data.date);
      const { data: menuData, error: menuError } = await supabase
        .from('MenuDays')
        .insert({
          date: data.date,
          day,
        })
        .select('menu_day_id')
        .single();
 
      if (menuError) throw menuError;
 
      const menuDayDishes = data.dishes.map((d) => ({
        menu_id: menuData.menu_day_id,
        dish_id: d.dish_id,
        stock: d.stock,
      }));
 
      const { error: dishesError } = await supabase
        .from('MenuDayDishes')
        .insert(menuDayDishes);
 
      if (dishesError) throw dishesError;
 
      setSuccessMsg('Menu saved successfully!');
      reset();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create menu');
    } finally {
      setLoading(false);
    }
  };
 
 
  const selectedDishIds = fields.map((_, i) => watch(`dishes.${i}.dish_id`));

  const availableDishes = dishes
    .filter(
      (dish) => !selectedDishIds.includes(dish.dish_id)
    )
    
    .filter((dish) => {
        if (!dishSearch) return true; 
        const searchLower = dishSearch.toLowerCase();
        const nameMatch = dish.name.toLowerCase().includes(searchLower);
        const categoryMatch = dish.category.toLowerCase().includes(searchLower);
        return nameMatch || categoryMatch;
    });
 
  const selectedDishes = fields
    .map((_, index) => {
      const dishId = watch(`dishes.${index}.dish_id`);
      const stock = watch(`dishes.${index}.stock`);
      const dish = dishes.find((d) => d.dish_id === dishId);
      return dish ? { ...dish, stock, fieldIndex: index } : null;
    })
    .filter((d) => d !== null);
 
  const handleAddToMenu = (dish: Dish) => {
    append({ dish_id: dish.dish_id, stock: 1 });
  };
 
  const handleRemoveFromMenu = (fieldIndex: number) => {
    remove(fieldIndex);
  };

  // Pagination logic
  const totalAvailableDishes = availableDishes.length;
  const totalPages = Math.ceil(totalAvailableDishes / PAGE_SIZE);
  const isFirstPage = currentPage === 1;
  const isLastPage = totalPages === 0 || currentPage === totalPages;

  const paginatedDishes = availableDishes.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
 
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">
            Add Menu for Selected Date
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Pick dishes and assign stock for the day.
          </p>
        </div>

        {successMsg && (
          <div className="text-sm text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-4 py-2 rounded-lg">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="text-sm text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 px-4 py-2 rounded-lg">
            {errorMsg}
          </div>
        )}


        <div className="space-y-1">
          <label htmlFor="menu-date" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Menu Date
          </label>
          <input
            id="menu-date"
            type="date"
            {...register("date")}
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-2">Current Menu Preview</h2>
          <table className="min-w-full border border-gray-200 shadow-md rounded-lg">
            <thead className="bg-gray-100 dark:bg-zinc-700">
              <tr>
                <th></th>
                <th className="px-3 py-2 text-center">Dish</th>
                <th className="px-3 py-2 text-center">Category</th>
                <th className="px-3 py-2 text-center">Price</th>
                <th className="px-3 py-2 text-center">Stock</th>
              </tr>
            </thead>
            <tbody>
              {selectedDishes.map((item) => (
                <tr key={item.fieldIndex} className="border-b border-gray-200">
                  <td className="px-3 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveFromMenu(item.fieldIndex)}
                      className="px-3 py-1 rounded hover:bg-gray-200"
                    >
                      ❌
                    </button>
                  </td>
                  <td className="px-3 py-2 text-center">{item.name}</td>
                  <td className="px-3 py-2 text-center">{item.category}</td>
                  <td className="px-3 py-2 text-center">{item.price}</td>
                  <td className="px-3 py-2 text-center">
                    <input
                      type="number"
                      min={1}
                      {...register(`dishes.${item.fieldIndex}.stock`, { valueAsNumber: true })}
                      className="w-16 px-2 py-1 text-sm border rounded text-center"
                    />
                    {errors.dishes?.[item.fieldIndex]?.stock && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.dishes[item.fieldIndex]?.stock?.message}
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      {/* --- Search Bar --- */}
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 shrink-0">
                Search Dishes:
            </label>
            <input
              type="text"
              placeholder="Search dish by name or category..."
              value={dishSearch}
              onChange={(e) => {
                setDishSearch(e.target.value);
                setCurrentPage(1); // Reset page on search change
              }}
              className="grow rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-lg mt-6 mb-2">Available Menu Items</h2>
          <table className="min-w-full border border-gray-200 shadow-md rounded-lg">
            <thead className="bg-gray-100 dark:bg-zinc-700">
              <tr>
                <th className="px-3 py-2 text-center">Dish</th>
                <th className="px-3 py-2 text-center">Category</th>
                <th className="px-3 py-2 text-center">Price</th>
                <th className="px-3 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDishes.length === 0 ? (
                <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                        No dishes found matching your search.
                    </td>
                </tr>
              ) : (
                paginatedDishes.map((dish) => ( 
                <tr key={dish.dish_id} className="border-b border-gray-200">
                  <td className="px-3 py-2 text-center">{dish.name}</td>
                  <td className="px-3 py-2 text-center">{dish.category}</td>
                  <td className="px-3 py-2 text-center">{dish.price}</td>
                  <td className="px-3 py-2 text-center flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddToMenu(dish)}
                      className="bg-[#00659B] text-white px-3 py-1 rounded hover:bg-[#005082]"
                    >
                      Add to Menu
                    </button>
                    <NavLink
                      to={`/admin/edit-dish/${dish.dish_id}`}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Edit Item
                    </NavLink>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>

          {/* --- THE PAGINATION CONTROLS --- */}
          {availableDishes.length > 0 && (
            <div className="flex justify-center items-center pt-2">
                <div className="flex items-center gap-4 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-xl p-1 shadow-sm">
                    <button
                        type="button" // Prevents form submission
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={isFirstPage || isDishesLoading} 
                        className="p-2 px-3 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-30 transition"
                    >
                        &lt;&lt;
                    </button>
                    
                    <div className='text-center min-w-70px'> 
                        <span className='text-sm font-medium text-zinc-700 dark:text-zinc-300 block leading-tight'>
                            Page {currentPage}
                        </span>
                        <span className='text-xs text-zinc-500 dark:text-zinc-500 block leading-tight'>
                            of {totalPages || 1}
                        </span>
                    </div>
                    
                    <button
                        type="button" // Prevents form submission
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={isLastPage || isDishesLoading} 
                        className="p-2 px-3 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-30 transition"
                    >
                        &gt;&gt;
                    </button>
                </div>
            </div>
          )}
          {/* ----------------------------------------------- */}
        </div>
 
        <div className="flex justify-end mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving Menu...' : 'Save Menu'}
          </button>
        </div>

      </div>
    </form>
    </div>
  );
};