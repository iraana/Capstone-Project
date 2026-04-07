import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../../supabase-client.ts";
import { Loader } from "../../Loader.tsx";
import { Trash2, RotateCcw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

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
  const [searchDishes, setSearchDishes] = useState("");
  const [searchMenus, setSearchMenus] = useState("");
  const [menuToDelete, setMenuToDelete] = useState<MenuDay | null>(null);

  const { data: dishes = [], isLoading: dishesLoading, error: dishesError } = useQuery({
    queryKey: ["dishes", "trash"],
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

  const { data: menuDays = [], isLoading: menusLoading, error: menusError } = useQuery({
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["MenuDays", "trash"] }),
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

  const handleRestoreDish = async (dishId: number) => {
    const toastId = toast.loading("Recovering dish...");
    try {
      await restoreDish.mutateAsync(dishId);
      toast.success("Dish recovered successfully!", { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to recover dish. Please try again.", { id: toastId });
    }
  };

  const handleRestoreMenuDay = async (menuDayId: number) => {
    const toastId = toast.loading("Recovering menu...");
    try {
      await restoreMenuDay.mutateAsync(menuDayId);
      toast.success("Menu recovered successfully!", { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to recover menu. Please try again.", { id: toastId });
    }
  };

  const handleDeleteClick = (menu: MenuDay) => {
    setMenuToDelete(menu);
  };

  const confirmDelete = async () => {
    if (!menuToDelete) return;
    const menuId = menuToDelete.menu_day_id;
    setMenuToDelete(null);
    const toastId = toast.loading("Deleting menu...");

    try {
      await hardDeleteMenuDay.mutateAsync(menuId);
      toast.success("Menu permanently deleted!", { id: toastId });
    } catch (err: any) {
      console.error(err);
      if (isForeignKeyError(err)) {
        toast.error(
          "This menu cannot be deleted because there are related orders. You will need to delete these orders manually before deleting the menu.",
          { id: toastId, duration: 6000 } 
        );
      } else {
        toast.error("An unexpected error occurred while deleting the menu.", { id: toastId });
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
                  onClick={() => handleRestoreDish(dish.dish_id)}
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
                  onClick={() => handleRestoreMenuDay(menu.menu_day_id)}
                  className="flex items-center rounded-md px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200"
                >
                  {restoreMenuDay.isPending ? "Processing..." : (
                    <><RotateCcw size={14} className="mr-1" /> Recover</>
                  )}
                </button>

                <button
                  disabled={hardDeleteMenuDay.isPending}
                  onClick={() => handleDeleteClick(menu)}
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

      {menuToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full shrink-0">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Delete Menu</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">This action cannot be undone.</p>
                </div>
              </div>
              
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                Are you sure you want to permanently delete the menu for: <br/>
                <span className="font-semibold text-zinc-900 dark:text-white block mt-2">
                  {menuToDelete.day} — {menuToDelete.date}?
                </span>
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => setMenuToDelete(null)}
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
};