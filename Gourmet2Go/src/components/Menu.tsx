import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabase-client";

export interface Dish {
  dish_id: number;
  name: string;
  category: 'Soups' | 'Salads' | 'Sandwiches' | 'Other'; 
  price: number;
}

export interface MenuDayDish {
  menu_day_dish_id: number;
  stock: number;
  Dishes: Dish; 
}

export interface MenuDay {
  menu_day_id: number;
  date: string; 
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  MenuDayDishes: MenuDayDish[];
}

export const Menu = () => {
  const { data: menuDays, isLoading, error } = useQuery({
    queryKey: ['menuDays'],
    queryFn: async () => {
      const { data: menuDays, error: menuDayError } = await supabase
        .from('MenuDays')
        .select(`
          menu_day_id,
          date,
          day,
          MenuDayDishes (
            menu_day_dish_id,
            stock,
            Dishes (
              dish_id,
              name,
              category,
              price
            )
          )
        `)
        .order('date', { ascending: true });
      if (menuDayError) throw menuDayError;
      return menuDays as unknown as MenuDay[];
    }
  });

  if (isLoading) return <p className="text-center mt-4">Loading...</p>;
  if (error) return <p className="text-center mt-4">Error: {error.message}</p>;

  return (
    <div className="flex flex-col items-center text-center">
      {menuDays?.map(day => {
        const dishesByCategory: Record<string, MenuDayDish[]> = {};
        day.MenuDayDishes.forEach(dishItem => {
          const category = dishItem.Dishes.category;
          if (!dishesByCategory[category]) dishesByCategory[category] = [];
          dishesByCategory[category].push(dishItem);
        });

        return (
          <div key={day.menu_day_id} className="mt-8 w-full max-w-lg">
            <h1 className="text-4xl font-bold mb-6">{day.day} - {day.date}</h1>

            {Object.entries(dishesByCategory).map(([category, dishes]) => (
              <div key={category} className="mb-6">
                <h2 className="text-2xl font-semibold mb-3">{category}</h2>
                <ul className="space-y-2">
                  {dishes.map(dishItem => (
                    <li key={dishItem.menu_day_dish_id}>
                      {dishItem.Dishes.name} - ${dishItem.Dishes.price} - Stock: {dishItem.stock}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};