import { useEffect, useState } from "react";
import { supabase } from "../../../supabase-client";
import { useNavigate } from "react-router";

type MenuCard = {
  menu_day_id: number;
  date: string;
  dishCount: number;
};

export const SelectMenuToEdit = () => {
  const [menus, setMenus] = useState<MenuCard[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenus = async () => {
      const { data, error } = await supabase
        .from("MenuDays")
        .select(`
          menu_day_id,
          date,
          MenuDayDishes ( dish_id )
        `)
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching menus:", error);
      } else {
        const formatted = data.map((menu: any) => ({
          menu_day_id: menu.menu_day_id,
          date: menu.date,
          dishCount: menu.MenuDayDishes?.length || 0
        }));

        setMenus(formatted);
      }

      setLoading(false);
    };

    fetchMenus();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-zinc-500">
        Loading menus...
      </div>
    );
  }

  if (menus.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          No menus created yet.
        </p>
        <button
          onClick={() => navigate("/admin/add-menu")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Create First Menu
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {menus.map((menu) => (
        <div
          key={menu.menu_day_id}
          className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                {menu.date}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {menu.dishCount} dishes
              </p>
            </div>

            <button
              onClick={() => navigate(`/admin/edit-menu/${menu.date}`)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
