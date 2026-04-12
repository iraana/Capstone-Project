import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '../../../../supabase-client.ts';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';
import { NavLink } from 'react-router';
import { toast } from 'sonner';
 
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
  const [dishSearch, setDishSearch] = useState('');

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // responsive check to avoid duplicating React Hook Form inputs
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
 
  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
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
    const toastId = toast.loading('Saving menu...');
   
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
 
      toast.success('Menu saved successfully!', { id: toastId });
      reset();

    } catch (err: any) {
      if (err.code === '23505') {
        toast.error('A menu for this date already exists. Please choose another date.', { id: toastId });
      } else if (err.code === '23503') {
        toast.error('One or more dishes are invalid or do not exist.', { id: toastId });
      } else {
        toast.error(err.message || 'Failed to create menu.', { id: toastId });
      }
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

          <div className="space-y-1">
            <label htmlFor="menu-date" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Menu Date
            </label>
            <input
              id="menu-date"
              type="date"
              {...register("date")}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            {errors.date && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.date.message}</p>}
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-2">Current Menu Preview</h2>
            {!isMobile ? (
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
                  {selectedDishes.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-zinc-500 dark:text-white">
                        No dishes added to the menu yet.
                      </td>
                    </tr>
                  ) : (
                    selectedDishes.map((item) => (
                      <tr key={item.fieldIndex} className="border-b border-gray-200">
                        <td className="px-3 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveFromMenu(item.fieldIndex)}
                            className="px-3 py-1 rounded hover:bg-gray-200 transition-colors"
                          >
                            ❌
                          </button>
                        </td>
                        <td className="px-3 py-2 text-center">{item.name}</td>
                        <td className="px-3 py-2 text-center">{item.category}</td>
                        <td className="px-3 py-2 text-center">{item.price.toFixed(2)}</td>
                        <td className="px-3 py-2 text-center">
                          <input
                            type="number"
                            min={1}
                            {...register(`dishes.${item.fieldIndex}.stock`, { valueAsNumber: true })}
                            className="w-16 px-2 py-1 text-sm border rounded text-center dark:bg-zinc-800 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {errors.dishes?.[item.fieldIndex]?.stock && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.dishes[item.fieldIndex]?.stock?.message}
                            </p>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <div className="mt-4 space-y-4">
                {selectedDishes.length === 0 ? (
                  <div className="px-4 py-6 text-center text-zinc-500 dark:text-white border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800">
                    No dishes added to the menu yet.
                  </div>
                ) : (
                  selectedDishes.map((item) => (
                    <div 
                      key={item.fieldIndex} 
                      className="border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <button
                          type="button"
                          onClick={() => handleRemoveFromMenu(item.fieldIndex)}
                          className="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors text-2xl leading-none"
                        >
                          ❌
                        </button>
                        <div>
                          <span className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 block mb-1">Stock</span>
                          <input
                            type="number"
                            min={1}
                            {...register(`dishes.${item.fieldIndex}.stock`, { valueAsNumber: true })}
                            className="w-20 px-4 py-2 text-sm border border-zinc-300 dark:border-zinc-600 rounded-lg text-center dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {errors.dishes?.[item.fieldIndex]?.stock && (
                            <p className="text-red-500 text-xs mt-1 text-center">
                              {errors.dishes[item.fieldIndex]?.stock?.message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-y-3 text-sm">
                        <div className="font-medium text-zinc-700 dark:text-zinc-300">Dish</div>
                        <div className="text-right text-zinc-900 dark:text-white">{item.name}</div>
                        <div className="font-medium text-zinc-700 dark:text-zinc-300">Category</div>
                        <div className="text-right text-zinc-900 dark:text-white">{item.category}</div>
                        <div className="font-medium text-zinc-700 dark:text-zinc-300">Price</div>
                        <div className="text-right text-zinc-900 dark:text-white">{item.price.toFixed(2)}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            
            {/* Array Validation Error Catch */}
            {errors.dishes?.message && typeof errors.dishes.message === 'string' && (
              <p className="text-red-500 text-sm font-medium mt-3 text-center">
                {errors.dishes.message}
              </p>
            )}
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
            {!isMobile ? (
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
                      <td className="px-3 py-2 text-center">{dish.price.toFixed(2)}</td>
                      <td className="px-3 py-2 text-center flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddToMenu(dish)}
                          className="px-4 py-1.5 rounded-lg text-sm font-bold bg-[#00659B] text-white hover:bg-[#005082] shadow-sm shadow-blue-900/10 transition-all active:scale-95"
                        >
                          Add
                        </button>
                        <NavLink
                          to={`/admin/edit-dish/${dish.dish_id}`}
                          className="px-4 py-1.5 rounded-lg text-sm font-medium border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all active:scale-95"
                        >
                          Edit
                        </NavLink>
                      </td>
                    </tr>
                  ))
                  )}
                </tbody>
              </table>
            ) : (
              <div className="mt-2 space-y-4">
                {paginatedDishes.length === 0 ? (
                  <div className="px-4 py-8 text-center text-zinc-500 border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800">
                    No dishes found matching your search.
                  </div>
                ) : (
                  paginatedDishes.map((dish) => ( 
                    <div key={dish.dish_id} className="border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-sm flex flex-col">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-semibold text-zinc-900 dark:text-white text-lg">{dish.name}</div>
                          <div className="text-sm text-zinc-500 dark:text-zinc-400">{dish.category}</div>
                        </div>
                        <div className="text-right font-medium text-zinc-900 dark:text-white text-lg">
                          {dish.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="flex gap-3 mt-6">
                        <button
                          type="button"
                          onClick={() => handleAddToMenu(dish)}
                          className="flex-1 px-4 py-1.5 rounded-lg text-sm font-bold bg-[#00659B] text-white hover:bg-[#005082] shadow-sm shadow-blue-900/10 transition-all active:scale-95"
                        >
                          Add
                        </button>
                        <NavLink
                          to={`/admin/edit-dish/${dish.dish_id}`}
                          className="flex-1 px-4 py-1.5 text-center rounded-lg text-sm font-medium border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all active:scale-95"
                        >
                          Edit
                        </NavLink>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* --- THE PAGINATION CONTROLS --- */}
            {availableDishes.length > 0 && (
              <div className="flex justify-center items-center pt-2">
                  <div className="flex items-center gap-4 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-xl p-1 shadow-sm">
                      <button
                          type="button" 
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={isFirstPage || isDishesLoading} 
                          className="p-2 px-3 rounded-lg text-zinc-600 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-30 transition"
                      >
                          &lt;&lt;
                      </button>
                      
                      <div className='text-center min-w-70px'> 
                          <span className='text-sm font-medium text-zinc-700 dark:text-white block leading-tight'>
                              Page {currentPage}
                          </span>
                          <span className='text-xs text-zinc-500 dark:text-white block leading-tight'>
                              of {totalPages || 1}
                          </span>
                      </div>
                      
                      <button
                          type="button"
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={isLastPage || isDishesLoading} 
                          className="p-2 px-3 rounded-lg text-zinc-600 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-30 transition"
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
              disabled={isSubmitting}
              className="bg-[#00659B] hover:bg-[#005082] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-95 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed">
              {isSubmitting ? 'Saving...' : 'Save Menu'}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};