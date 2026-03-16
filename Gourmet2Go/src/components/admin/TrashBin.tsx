import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../supabase-client";
import { Loader } from "../Loader";
import { Trash2, RotateCcw } from "lucide-react";

type Dish = {
  dish_id: number;
  name: string;
  price: number;
  category: string;
};

export interface MenuDay {
  menu_day_id: number;
  date: string; 
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
}

const isForeignKeyError = (error: any) => {
  if (!error) return false;
  // 23503 is the Postgres FK violaion code
  if (error.code === "23503") return true;
  const text = (error.message || error.details || "").toString().toLowerCase();
  return /foreign key|violat|referenc/.test(text);
};

export const TrashBin = () => {
  const queryClient = useQueryClient();
  const[searchDishes, setSearchDishes] = useState("");
  const [searchMenus, setSearchMenus] = useState("");

  const { data: dishes = [], isLoading: dishesLoading, error: dishesError } = useQuery({
    queryKey:["dishes", "trash"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Dishes")
        .select("*")
        .eq("dish_status", false)
        .order("name", { ascending: true });

      if (error) throw error;
      return data as Dish[];
    },
  });

  const { data: menuDays =[], isLoading: menusLoading, error: menusError } = useQuery({
    queryKey: ["MenuDays", "trash"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("MenuDays")
        .select("*")
        .eq("status", false)
        .order("date", { ascending: true });

      if (error) throw error;
      return data as MenuDay[];
    },
  });

  const restoreDish = useMutation<void, Error, number>({
    mutationFn: async (dishId: number) => {
      const { error } = await supabase
        .from("Dishes")
        .update({ dish_status: true })
        .eq("dish_id", dishId);

      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dishes", "trash"] }),
  });

  const restoreMenuDay = useMutation<void, Error, number>({
    mutationFn: async (menuDayId: number) => {
      const { error } = await supabase
        .from("MenuDays")
        .update({ status: true })
        .eq("menu_day_id", menuDayId);

      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey:["MenuDays", "trash"] }),
  });

  const hardDeleteMenuDay = useMutation<void, Error, number>({
    mutationFn: async (menuDayId: number) => {
      const { error } = await supabase
        .from("MenuDays")
        .delete()
        .eq("menu_day_id", menuDayId);

      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["MenuDays", "trash"] }),
  });

  const attemptHardDeleteMenuDay = async (menuDayId: number) => {
    if (!window.confirm("Permanently delete this menu? This cannot be undone.")) return;

    try {
      await hardDeleteMenuDay.mutateAsync(menuDayId);
    } catch (err: any) {
      if (isForeignKeyError(err)) {
        window.alert(
          "This menu cannot be deleted because there are related orders. You will need to delete these orders manually before deleting the menu."
        );
      } else {
        window.alert("An unexpected error occurred while deleting the menu.");
      }
    }
  };

  if (dishesLoading || menusLoading) return <Loader fullScreen />;
  if (dishesError) return <p className="text-center mt-4 text-red-500">Error loading dishes: {dishesError.message}</p>;
  if (menusError) return <p className="text-center mt-4 text-red-500">Error loading menus: {menusError.message}</p>;

  const filteredDishes = dishes.filter((d) => {
    const q = searchDishes.trim().toLowerCase();
    return !q || d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q);
  });

  const filteredMenus = menuDays.filter((m) => {
    const q = searchMenus.trim().toLowerCase();
    return !q || m.day.toLowerCase().includes(q) || m.date.toLowerCase().includes(q);
  });

  return (
    <div className="mt-10 max-w-3xl mx-auto space-y-8">
      <section>
        <h2 className="text-lg font-semibold mb-2">Deleted Dishes</h2>
        <input
          type="text"
          placeholder="Search deleted dishes..."
          value={searchDishes}
          onChange={(e) => setSearchDishes(e.target.value)}
          className="w-full mb-4 rounded-lg border border-blue-200 bg-white dark:bg-zinc-800 dark:border-zinc-700 px-4 py-2 text-sm text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />

        {filteredDishes.length === 0 && (
          <p className="text-center text-sm text-gray-500 dark:text-zinc-400">No deleted dishes</p>
        )}

        <div className="space-y-3">
          {filteredDishes.map((dish) => (
            <div
              key={dish.dish_id}
              className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-blue-100 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 shadow-sm hover:shadow-md transition gap-4"
            >
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-400">{dish.name}</p>
                <p className="text-sm text-gray-500 dark:text-zinc-400">
                  {dish.category} • ${dish.price}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={restoreDish.isPending}
                  onClick={() => restoreDish.mutate(dish.dish_id)}
                  className="flex items-center rounded-md px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200"
                >
                  {restoreDish.isPending ? "Processing..." : (
                    <><RotateCcw size={14} className="mr-1" /> Recover</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Deleted Menus</h2>
        <input
          type="text"
          placeholder="Search deleted menus by date or day..."
          value={searchMenus}
          onChange={(e) => setSearchMenus(e.target.value)}
          className="w-full mb-4 rounded-lg border border-blue-200 bg-white dark:bg-zinc-800 dark:border-zinc-700 px-4 py-2 text-sm text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />

        {filteredMenus.length === 0 && (
          <p className="text-center text-sm text-gray-500 dark:text-zinc-400">No deleted menus</p>
        )}

        <div className="space-y-3">
          {filteredMenus.map((menu) => (
            <div
              key={menu.menu_day_id}
              className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-blue-100 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 shadow-sm hover:shadow-md transition gap-4"
            >
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-400">
                  {menu.day} — {menu.date}
                </p>
                <p className="text-sm text-gray-500 dark:text-zinc-400">Menu ID: {menu.menu_day_id}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={restoreMenuDay.isPending}
                  onClick={() => restoreMenuDay.mutate(menu.menu_day_id)}
                  className="flex items-center rounded-md px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200"
                >
                  {restoreMenuDay.isPending ? "Processing..." : (
                    <><RotateCcw size={14} className="mr-1" /> Recover</>
                  )}
                </button>

                <button
                  disabled={hardDeleteMenuDay.isPending}
                  onClick={() => attemptHardDeleteMenuDay(menu.menu_day_id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors disabled:opacity-50"
                  title="Permanently delete menu"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};