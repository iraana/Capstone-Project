import { NavLink} from "react-router";
import { supabase } from "../../../supabase-client";
import { useQuery } from '@tanstack/react-query';

type Dish = {
    dish_id: number;
    name: string;
    price: number;
    category: string;
};

export const ListDishes = () => {
    const { data: dishes = [] } = useQuery({
        queryKey: ['dishes'],
        queryFn: async () => {
        const { data, error } = await supabase.from('Dishes')
        .select('*');
        if (error) throw error;
        return data as Dish[];
        },
    });

    return (
      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
          <thead className="bg-gray-50 dark:bg-zinc-700">
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
          <tbody className="bg-white dark:bg-zinc-800 divide-y divide-gray-200 dark:divide-zinc-700">
            {dishes.map((item) => (
              <tr key={item.dish_id}>
                <td className="px-4 py-2 text-sm text-zinc-900 dark:text-white">{item.name}</td>
                <td className="px-4 py-2 text-sm text-zinc-900 dark:text-white">{item.category}</td>
                <td className="px-4 py-2 text-sm text-zinc-900 dark:text-white">${item.price.toFixed(2)}</td>
                <td className="px-4 py-2 text-center">
                  <NavLink
                    to={`/admin/edit-dish/${item.dish_id}`}
                    className="inline-block bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-green-700 transition"
                  >
                    Edit Item
                  </NavLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
}