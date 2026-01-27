import { useState } from "react";
import { MenuCard } from "../components/admin/MenuCard";
import type { MenuItem } from "../components/admin/MenuCard";
import dayjs from "dayjs";

// Sample menus data we will need to replace this with real data fetching logic
const sampleMenus: Record<string, MenuItem[]> = {
  "2026-01-26": [
    { name: "Salad", price: 5.5, category: "Appetizer" },
    { name: "Soup", price: 4.0, category: "Appetizer" },
    { name: "Steak", price: 15.0, category: "Main Course" },
  ],
  "2026-01-27": [
    { name: "Pasta", price: 8.0, category: "Main Course" },
    { name: "Chicken Curry", price: 12.0, category: "Main Course" },
    { name: "Rice", price: 3.5, category: "Side Dish" },
  ],
  "2026-01-28": [
    { name: "Fish", price: 14.0, category: "Main Course" },
    { name: "Vegetables", price: 6.0, category: "Side Dish" },
    { name: "Bread", price: 2.0, category:"Side Dish" },
  ],
};

// This function generates an array of dates for the week starting from 'startDate'
// I'm not sure if they would like this approach or would they always want to start from Monday every week no matter what day it is today
const getWeekDates = (startDate: dayjs.Dayjs) => {
  return Array.from({ length: 7 }).map((_, idx) => startDate.add(idx, "day"));
};

export const AdminMenuPage = () => {
  const [weekStart, setWeekStart] = useState(dayjs()); // today as start
  const today = dayjs();

  const weekDates = getWeekDates(weekStart);

  const handlePrevWeek = () => setWeekStart(weekStart.subtract(1, "week"));
  const handleNextWeek = () => setWeekStart(weekStart.add(1, "week"));

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

      {/* Menu Cards */}
      <div className="flex gap-6 flex-wrap">
        {weekDates.map((date) => {
            const dateStr = date.format("YYYY-MM-DD");
            const menuItems = sampleMenus[dateStr];
            const isPast = date.isBefore(today, "day");

            let editable = false;
            let empty = false;
            let actionLabel: "Add Menu" | "Edit Menu" | undefined;
            let actionLink: string | undefined;
            
            if (!isPast) {
                editable = true;
                empty = !menuItems;

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
