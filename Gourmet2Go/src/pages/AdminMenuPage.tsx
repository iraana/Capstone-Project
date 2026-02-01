import { useEffect, useState } from "react";
import { MenuCard } from "../components/admin/MenuCard";
import dayjs from "dayjs";
import { supabase } from "../../supabase-client";

const fetchMenus = async () => {
  const {data, error} = await supabase.from('MenuDays')
    .select('*, MenuDayDishes ( *, Dishes ( * ) )');
  if (error) {
    throw error;
  }
  return data;
};

type Dish = {
  dish_id: number;
  name: string;
  price: number;
  category: string;
}

type MenuDayDish = {
  dish_id: number;
  stock: number;
  Dishes: Dish;
}

type MenuDay = {
  menu_day_id: number;
  date: string;
  MenuDayDishes: MenuDayDish[];
}
// This function generates an array of dates for the week starting from 'startDate'
// I'm not sure if they would like this approach or would they always want to start from Monday every week no matter what day it is today
const getWeekDates = (startDate: dayjs.Dayjs) => {
  return Array.from({ length: 7 }).map((_, idx) => startDate.add(idx, "day"));
};

export const AdminMenuPage = () => {
  const [weekStart, setWeekStart] = useState(dayjs()); // today as start
  const [menus, setMenus] = useState<MenuDay[]>([]);
  const today = dayjs();

  const weekDates = getWeekDates(weekStart);

  const handlePrevWeek = () => setWeekStart(weekStart.subtract(1, "week"));
  const handleNextWeek = () => setWeekStart(weekStart.add(1, "week"));

  useEffect(() => {
    const loadMenus = async () => {
      try {
        const data = await fetchMenus();
        setMenus(data);
      } catch (error) {
        console.error("Error loading menus:", error);
      } 
    };
    loadMenus();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Weekly Menu</h1>

      {/* Week Navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={handlePrevWeek}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          &lt; Previous
        </button>
        <span className="font-semibold">
          {weekStart.format("MMM D, YYYY")} - {weekStart.add(6, "day").format("MMM D, YYYY")}
        </span>
        <button
          onClick={handleNextWeek}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          Next &gt;
        </button>
      </div>

      <div className="flex gap-6 flex-wrap">
        {weekDates.map((date) => {
            const dateStr = date.format("YYYY-MM-DD");
            const menuItems = menus.find(menu => dayjs(menu.date).format("YYYY-MM-DD") === dateStr)?.MenuDayDishes.map(md => md.Dishes) ?? [];
            const isPast = date.isBefore(today, "day");

            let editable = false;
            let empty = false;
            let actionLabel: "Add Menu" | "Edit Menu" | undefined;
            let actionLink: string | undefined;
            
            if (!isPast) {
                editable = true;
                empty = !menuItems.length;
                
                actionLabel = empty ? "Add Menu" : "Edit Menu";
                actionLink = empty
                ? `/menu/add/${dateStr}`
                : `/menu/edit/${dateStr}`;
            }
            
            return (
            <MenuCard
            key={dateStr}
            date={date.format("MMM D, YYYY")}
            items={menuItems || []}
            editable={editable}
            empty={empty}
            actionLabel={actionLabel}
            actionLink={actionLink}
            />
        );
        })}
      </div>
    </div>
  );
};
