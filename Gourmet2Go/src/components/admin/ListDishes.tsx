import { NavLink} from "react-router";
import { supabase } from "../../../supabase-client";
import { useQuery } from '@tanstack/react-query';
import { useState } from "react";

type Dish = {
    dish_id: number;
    name: string;
    price: number;
    category: string;
};

export const ListDishes = () => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const { data: dishes = [] } = useQuery({
        queryKey: ['dishes'],
        queryFn: async () => {
        const { data, error } = await supabase.from('Dishes')
        .select('*');
        if (error) throw error;
        return data as Dish[];
        },
    });

    const handleDelete = async (dishId: number) => {
        if (!confirm("Are you sure you want to delete this dish?")) return;
        const { error } = await supabase.from('Dishes').delete().eq('dish_id', dishId);
        if (error) {
            setErrorMsg("Failed to delete dish: " + error.message);
            setSuccessMsg(null);
        } else {
            setSuccessMsg("Dish deleted successfully");
            setErrorMsg(null);
        }
    };

    return (
      <div className="max-w-3xl mx-auto p-6">
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
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/50">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Dishes</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and edit your dishes below</p>
          </div>
          <div className="p-6">
            <div className="border rounded-xl border-gray-200 dark:border-zinc-700 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-zinc-700/50">
                  <tr>
                    <th className="p-3 font-semibold text-gray-600 dark:text-gray-300 text-center">Dish</th>
                    <th className="p-3 font-semibold text-gray-600 dark:text-gray-300 text-center">Category</th>
                    <th className="p-3 font-semibold text-gray-600 dark:text-gray-300 text-center">Price</th>
                    <th className="p-3 font-semibold text-gray-600 dark:text-gray-300 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-700">
                  {dishes.map((item) => (
                    <tr key={item.dish_id}>
                      <td className="p-3 text-center text-gray-900 dark:text-white">{item.name}</td>
                      <td className="p-3 text-center text-gray-900 dark:text-white">{item.category}</td>
                      <td className="p-3 text-center text-gray-900 dark:text-white">{item.price}</td>
                      <td className="p-3 text-center flex justify-center gap-2">
                        <NavLink
                          to={`/admin/edit-dish/${item.dish_id}`}
                          className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-xl font-semibold transition-all active:scale-95"
                        >
                          Edit Item
                        </NavLink>
                        <button
                          onClick={() => handleDelete(item.dish_id)}
                          className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-xl font-semibold transition-all active:scale-95"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );

    

}