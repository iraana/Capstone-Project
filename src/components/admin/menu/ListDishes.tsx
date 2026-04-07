import { NavLink } from "react-router";
import { supabase } from "../../../../supabase-client.ts";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

type Dish = {
  dish_id: number;
  name: string;
  price: number;
  category: string;
};

export const ListDishes = () => {
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const[currentPage, setCurrentPage] = useState(1);
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

    const handleDelete = async (dishId: number) => {
        if (!confirm("Are you sure you want to delete this dish?")) return;
        const { error } = await supabase.from('Dishes').update({ dish_status: 'false' }).eq('dish_id', dishId);
        if (error) {
            setErrorMsg("Failed to delete dish: " + error.message);
            setSuccessMsg(null);
        } else {
            setSuccessMsg("Dish deleted successfully");
            setErrorMsg(null);
            queryClient.setQueryData<Dish[]>(['dishes'], (old) =>
            (old ?? []).filter((dish) => dish.dish_id !== dishId)
            );
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
      <div className="space-y-4">
        {successMsg && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-2">
                {successMsg}
            </div>
        )}

        {errorMsg && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-2">
                {errorMsg}
            </div>
        )}
        
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
                    setCurrentPage(1); // Reset page on search change
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
                        onClick={() => handleDelete(item.dish_id)}
                        className="px-4 py-1.5 rounded-lg text-sm font-medium border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/20 transition-all active:scale-95"
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

      </div>
    );
}