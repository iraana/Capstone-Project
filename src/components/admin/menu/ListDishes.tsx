import { NavLink } from "react-router";
import { supabase } from "../../../../supabase-client.ts";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

type Dish = {
  dish_id: number;
  name: string;
  price: number;
  category: string;
};

export const ListDishes = () => {
    const queryClient = useQueryClient();
    
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [dishToDelete, setDishToDelete] = useState<Dish | null>(null); 
    
    const PAGE_SIZE = 20;

    const { data: dishes = [], isLoading } = useQuery({
        queryKey: ['dishes'],
        queryFn: async () => {
            const { data, error } = await supabase
              .from('Dishes')
              .select('*')
              .eq('dish_status', true)
              .order( 'name', { ascending: true });
            if (error) throw error;
            return data as Dish[];
        },
    });

    const handleDeleteClick = (dish: Dish) => {
        setDishToDelete(dish);
    };

    const confirmDelete = async () => {
        if (!dishToDelete) return;
        
        const dish = dishToDelete;
        setDishToDelete(null); 
        
        const toastId = toast.loading(`Deleting ${dish.name}...`);

        try {
            const { error } = await supabase
                .from('Dishes')
                .update({ dish_status: false }) 
                .eq('dish_id', dish.dish_id);
                
            if (error) throw error;
            
            toast.success("Dish deleted successfully!", { id: toastId });
            
            queryClient.setQueryData<Dish[]>(['dishes'], (old) =>
                (old ?? []).filter((d) => d.dish_id !== dish.dish_id)
            );
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to delete dish. Please try again.", { id: toastId });
        }
    };

    const filteredDishes = dishes.filter((dish) => {
        if (!search) return true;
        const searchLower = search.toLowerCase();
        const nameMatch = dish.name.toLowerCase().includes(searchLower);
        const categoryMatch = dish.category.toLowerCase().includes(searchLower);
        return nameMatch || categoryMatch;
    });

    const totalPages = Math.ceil(filteredDishes.length / PAGE_SIZE) || 1;
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    const paginatedDishes = filteredDishes.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    if (isLoading) {
        return <div className="p-12 text-center text-zinc-500">Loading dishes...</div>;
    }

    return (
      <div className="space-y-4 relative">
        <div className='space-y-3'>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 shrink-0">
                    Search Dishes:
                </label>
                <input
                    type="text"
                    placeholder="Search dish by name or category..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1); 
                    }}
                    className="grow rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
            </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
            <thead className="bg-gray-50 dark:bg-zinc-800">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Dish
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Price
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800">
              {paginatedDishes.length === 0 ? (
                <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                        No dishes found matching your search.
                    </td>
                </tr>
              ) : (
                paginatedDishes.map((item) => (
                  <tr key={item.dish_id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-white">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">{item.category}</td>
                    <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">${item.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center flex justify-center gap-3">
                      <NavLink
                        to={`/admin/edit-dish/${item.dish_id}`}
                        className="px-4 py-1.5 rounded-lg text-sm font-medium border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all active:scale-95"
                      >
                        Edit
                      </NavLink>
                      <button
                        onClick={() => handleDeleteClick(item)}
                        className="px-4 py-1.5 rounded-lg text-sm font-medium border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-900/10 text-rose-800 dark:text-rose-200 hover:bg-rose-100 dark:hover:bg-rose-900/20 transition-all active:scale-95"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredDishes.length > 0 && (
            <div className="flex justify-center items-center pt-2">
                <div className="flex items-center gap-4 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-xl p-1.5 shadow-sm">
                    <button
                        type="button"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={isFirstPage} 
                        className="p-2 px-3 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-30 transition-all"
                    >
                        &lt;&lt;
                    </button>
                    
                    <div className='text-center min-w-70px'> 
                        <span className='text-sm font-bold text-zinc-700 dark:text-zinc-300 block leading-tight'>
                            Page {currentPage}
                        </span>
                        <span className='text-xs text-zinc-500 dark:text-zinc-500 block leading-tight'>
                            of {totalPages}
                        </span>
                    </div>
                    
                    <button
                        type="button"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev - -1))}
                        disabled={isLastPage} 
                        className="p-2 px-3 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-30 transition-all"
                    >
                        &gt;&gt;
                    </button>
                </div>
            </div>
        )}

        {dishToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    
                    <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full shrink-0">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Delete Dish</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">This action cannot be undone.</p>
                            </div>
                        </div>
                        
                        <p className="text-sm text-zinc-600 dark:text-zinc-300">
                            Are you sure you want to remove the following dish from the system? <br/>
                            <span className="font-semibold text-zinc-900 dark:text-white block mt-2">"{dishToDelete.name}"</span>
                        </p>
                    </div>

                    <div className="flex items-center justify-end gap-3 px-6 py-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800">
                        <button
                            onClick={() => setDishToDelete(null)}
                            className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/20 rounded-xl transition-all active:scale-95"
                        >
                            Yes, Delete
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    );
}