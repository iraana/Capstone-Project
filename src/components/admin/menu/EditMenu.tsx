import { NavLink, useParams, useNavigate } from "react-router";
import { supabase } from "../../../../supabase-client.ts";
import { useEffect, useState } from "react";
import * as z from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from '@tanstack/react-query';
import { toast } from "sonner";

const fetchMenu = async (menuDate: string) => {
  const { data, error } = await supabase
    .from("MenuDayDishes")
    .select("*, Dishes ( * ), MenuDays ( * )")
    .eq('Dishes.dish_status', true)
    .eq("MenuDays.date", menuDate)
    .eq("MenuDays.status", true);
    
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
  const navigate = useNavigate();

  const [menuDate, setMenuDate] = useState<string>(date || "");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [hasMenu, setHasMenu] = useState<boolean>(false);

  const [dishSearch, setDishSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  
  const getDayFromDate = (date: string) => {
    if (!date) return 'Monday';
    const [year, month, day] = date.split('-').map(Number);
    const newDate = new Date(year, month - 1, day);
    return newDate.toLocaleDateString('en-US', { weekday: 'long' }) as MenuFormValues['day'];
  }

  const {
      control,
      handleSubmit,
      register,
      reset,
      formState: { errors, isSubmitting },
      watch,
    } = useForm<MenuFormValues>({
      resolver: zodResolver(menuSchema),
      defaultValues: {
        date: menuDate,
        day: getDayFromDate(menuDate),
        dishes:[],
      },
    });
  
  const { fields, append, remove } = useFieldArray({
      control,
      name: 'dishes',
  });

  const { data: dishes = [], isLoading: isDishesLoading } = useQuery({
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

  const selectedDishIds = fields.map((_, i) => watch(`dishes.${i}.dish_id`));

  const availableDishes = dishes
    .filter((dish) => !selectedDishIds.includes(dish.dish_id))
    .filter((dish) => {
        if (!dishSearch) return true; 
        const searchLower = dishSearch.toLowerCase();
        const nameMatch = dish.name.toLowerCase().includes(searchLower);
        const categoryMatch = dish.category.toLowerCase().includes(searchLower);
        return nameMatch || categoryMatch;
    });

  // --- Pagination Logic ---
  const totalAvailableDishes = availableDishes.length;
  const totalPages = Math.ceil(totalAvailableDishes / PAGE_SIZE);
  const isFirstPage = currentPage === 1;
  const isLastPage = totalPages === 0 || currentPage === totalPages;

  const paginatedDishes = availableDishes.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
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
          reset({ dishes: itemsForDate, date: menuDate, day: getDayFromDate(menuDate) });

          if (itemsForDate && itemsForDate.length > 0) {
              setHasMenu(true);
          } else {
              checkForMenu(menuDate).then(setHasMenu);
          }
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
        .eq('status', true)
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
  };

  const { data: associatedOrders } = useQuery({
    queryKey: ['associatedOrders', menuDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Orders')
        .select('order_id, MenuDays!inner(date)')
        .eq('MenuDays.date', menuDate);
      if (error) throw error;
      return data;
    },
    enabled: !!menuDate,
  });

  const clearFormState = () => {
    setMenuDate("");
    setHasMenu(false);
    reset({ date: "", day: "Monday", dishes: [] });
    if (date) {
      navigate('/admin/edit-menu', { replace: true });
    }
  };

  const handleDeleteMenu = async () => {
    const hasOrders = Array.isArray(associatedOrders) && associatedOrders.length > 0;
    const confirmMessage = hasOrders 
      ? "This menu has associated orders. Deleting it will make the menu unavailable but keep the data for existing orders. Do you want to proceed?" 
      : "Are you sure you want to delete this menu? This action cannot be undone.";

    if (!window.confirm(confirmMessage)) return;

    const toastId = toast.loading("Deleting menu...");

    try {
      if (hasOrders) {
        const { error: deleteMenuError } = await supabase
          .from('MenuDays')
          .update({ status: false })
          .eq('date', menuDate);
        if (deleteMenuError) throw deleteMenuError;
      } else {
        const { error: deleteMenuError } = await supabase
          .from('MenuDays')
          .delete()
          .eq('date', menuDate);  
        if (deleteMenuError) throw deleteMenuError;
      }

      toast.success('Menu deleted successfully!', { id: toastId });
      clearFormState();

    } catch (error: any) {
      console.error("Error deleting menu:", error);
      toast.error(error.message || "Failed to delete menu. Please try again.", { id: toastId });
    }
  }

  const onSubmit = async (formData: MenuFormValues) => {
    const toastId = toast.loading("Saving changes to menu...");
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
            if (updateError) throw updateError;
          }
        } else {
          const { error: insertError } = await supabase.from('MenuDayDishes')
            .insert({
              dish_id: updatedDish.dish_id,
              menu_id: originalDishes[0]?.menu_id, 
              stock: updatedDish.stock,
            });
          if (insertError) throw insertError;
        }
      }
    
      for (const originalDish of originalDishes) {
        if (!updatedDishes.find(i => i.dish_id === originalDish.dish_id)) {
          const { error: deleteError } = await supabase.from('MenuDayDishes')
            .delete()
            .eq('dish_id', originalDish.dish_id)
            .eq('menu_id', originalDish.menu_id);
          if (deleteError) throw deleteError;
        }
      }

      toast.success('Menu updated successfully!', { id: toastId });
      clearFormState();

    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to update menu', { id: toastId });
    }
  };

  return (
      <form onSubmit={handleSubmit(onSubmit)}>
        
        <div className="text-center space-y-2  mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Edit Menu
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Select a date to update its menu items and stock.
          </p>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-full sm:w-1/2 space-y-1">
                <label htmlFor="menu-date" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Select Date to Edit
                </label>
                <input
                    id="menu-date"
                    type="date"
                    {...register('date')}
                    onChange={handleDateChange}
                    value={menuDate}
                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                {errors.date && (
                  <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
                )}
            </div>
            
            {menuDate && (
                <div className="w-full sm:w-1/2 flex items-center sm:justify-end">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 px-6 py-3 rounded-xl text-center min-w-150px">
                        <span className="block text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Menu Day</span>
                        <span className="text-lg font-semibold text-zinc-900 dark:text-white">{getDayFromDate(menuDate)}</span>
                    </div>
                </div>
            )}
        </div>

        {!menuDate ? (
            <div className="mt-8 p-12 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700">
                <p className="text-zinc-500 dark:text-zinc-400">Please select a date above to view or edit its menu.</p>
            </div>
        ) : hasMenu ? (
          <div className="space-y-8 mt-8">
            
            <div>
              <h2 className="font-semibold text-lg mb-3 text-zinc-900 dark:text-white">Currently on Menu</h2>
              <div className="overflow-x-auto shadow-sm rounded-xl border border-zinc-200 dark:border-zinc-700">
                <table className="min-w-full text-left text-sm divide-y divide-zinc-200 dark:divide-zinc-700">
                  <thead className="bg-zinc-50 dark:bg-zinc-800">
                    <tr>
                      <th className="p-3 text-center w-16"></th>
                      <th className="p-3 font-semibold text-zinc-600 dark:text-zinc-300">Dish Name</th>
                      <th className="p-3 font-semibold text-zinc-600 dark:text-zinc-300 text-center">Category</th>
                      <th className="p-3 font-semibold text-zinc-600 dark:text-zinc-300 text-center">Price</th>
                      <th className="p-3 font-semibold text-zinc-600 dark:text-zinc-300 text-center">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-100 dark:divide-zinc-800">
                    {fields.map((field, index) => {
                      const dish = dishes.find(d => d.dish_id === field.dish_id);
                      return (
                        <tr key={field.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                          <td className="p-3 text-center align-middle">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              className="p-1.5 rounded-lg text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
                              title="Remove from menu"
                            >
                              ❌
                            </button>
                          </td>
                          <td className="p-3 font-medium text-zinc-900 dark:text-white">{dish?.name}</td>
                          <td className="p-3 text-center text-zinc-600 dark:text-zinc-400">{dish?.category}</td>
                          <td className="p-3 text-center text-zinc-600 dark:text-zinc-400">${dish?.price.toFixed(2)}</td>
                          <td className="p-3 text-center">
                            <input
                              type="number"
                              min={1}
                              {...register(`dishes.${index}.stock`, { valueAsNumber: true })}
                              className="border border-zinc-300 dark:border-zinc-600 rounded-lg px-2 py-1.5 w-20 text-center bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                             {errors.dishes?.[index]?.stock && (
                                <p className="text-red-500 text-xs mt-1">Required</p>
                              )}
                          </td>
                        </tr>
                      );
                    })}
                    {fields.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-6 text-center text-zinc-500">All items removed. Save to clear menu, or add items below.</td>
                        </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Array Validation Error Catch */}
              {errors.dishes?.message && typeof errors.dishes.message === 'string' && (
                <p className="text-red-500 text-sm font-medium mt-3 text-center">
                  {errors.dishes.message}
                </p>
              )}
            </div>

            {/* --- Search Bar --- */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700">
                <div className="grow w-full md:max-w-md">
                    <input
                        type="text"
                        placeholder="Search dish by name or category..."
                        value={dishSearch}
                        onChange={(e) => {
                            setDishSearch(e.target.value);
                            setCurrentPage(1); 
                        }}
                        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>
                <p className='text-sm text-zinc-500 dark:text-zinc-400 shrink-0 font-medium'>
                    Showing {paginatedDishes.length} of {availableDishes.length} items
                </p>
            </div>

            <div>
              <h2 className="font-semibold text-lg mb-3 text-zinc-900 dark:text-white">Available to Add</h2>
              <div className="overflow-x-auto shadow-sm rounded-xl border border-zinc-200 dark:border-zinc-700">
                <table className="min-w-full text-left text-sm divide-y divide-zinc-200 dark:divide-zinc-700">
                  <thead className="bg-zinc-50 dark:bg-zinc-800">
                    <tr>
                      <th className="p-3 font-semibold text-zinc-600 dark:text-zinc-300">Dish Name</th>
                      <th className="p-3 font-semibold text-zinc-600 dark:text-zinc-300 text-center">Category</th>
                      <th className="p-3 font-semibold text-zinc-600 dark:text-zinc-300 text-center">Price</th>
                      <th className="p-3 font-semibold text-zinc-600 dark:text-zinc-300 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-100 dark:divide-zinc-800">
                    {paginatedDishes.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="p-6 text-center text-zinc-500">No dishes match your search.</td>
                        </tr>
                    ) : (
                        paginatedDishes.map((item) => (
                        <tr key={item.dish_id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                            <td className="p-3 font-medium text-zinc-900 dark:text-white">{item.name}</td>
                            <td className="p-3 text-center text-zinc-600 dark:text-zinc-400">{item.category}</td>
                            <td className="p-3 text-center text-zinc-600 dark:text-zinc-400">${item.price.toFixed(2)}</td>
                            <td className="p-3 text-center flex justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleAddToMenu(item)}
                                className="px-4 py-1.5 rounded-lg text-sm font-bold bg-[#00659B] text-white hover:bg-[#005082] transition-all active:scale-95"
                              >
                                Add
                              </button>
                              <NavLink
                                to={`/admin/edit-dish/${item.dish_id}`}
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
              </div>
              
              {/* Pagination Controls */}
              {availableDishes.length > 0 && (
                <div className="flex justify-center items-center pt-4">
                    <div className="flex items-center gap-4 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-xl p-1.5 shadow-sm">
                        <button
                            type="button"
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
                            type="button"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={isLastPage || isDishesLoading} 
                            className="p-2 px-3 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-30 transition"
                        >
                            &gt;&gt;
                        </button>
                    </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={handleDeleteMenu}
                className="px-6 py-2.5 rounded-xl font-semibold border border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all active:scale-95"
              >
                Delete Menu
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="px-6 py-2.5 rounded-xl font-semibold border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2.5 rounded-xl font-bold bg-[#00659B] text-white shadow-lg shadow-blue-900/20 hover:bg-[#005082] transition-all active:scale-95 disabled:bg-zinc-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8 p-12 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl shadow-sm border border-dashed border-zinc-300 dark:border-zinc-700">
            <div className="mb-4">
                <span className="text-4xl">📅</span>
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">No menu found for this date</h3>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-md mx-auto">
              There is currently no menu scheduled for {getDayFromDate(menuDate)}, {menuDate}. Would you like to create one?
            </p>
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-6 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
              onClick={() => navigate('/admin/add-menu')}
            >
              Go to Create Menu
            </button>
          </div>
        )}
      </form>
  );
};