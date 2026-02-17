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
            {dishes.map((item) => (
              <tr className="border-b border-gray-200" key={item.dish_id}>
                <td className="px-3 py-2 text-center align-middle">{item.name}</td>
                <td className="px-3 py-2 text-center align-middle">{item.category}</td>
                <td className="px-3 py-2 text-center align-middle">{item.price}</td>
                <td className="px-3 py-2 text-center align-middle flex justify-center gap-2">
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
    );

    

}