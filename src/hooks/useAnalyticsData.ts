import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { supabase } from "../../supabase-client";
import type { Order, DishStat, BuyerStat, TrendStat, DayStat } from "../types/analyticsTypes";

export const useAnalyticsData = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["analytics_data_combined"],
    queryFn: async () => {
      const [ordersRes, menuDaysRes] = await Promise.all([
        supabase
          .from("Orders")
          .select(`
            order_id,
            timestamp,
            total,
            user_id,
            menu_id,
            profiles(first_name, last_name, email),
            OrderItems(quantity, dish_id, Dishes(name, price))
          `)
          .neq("status", "INACTIVE")
          .neq("status", "PENDING"),
        
        supabase.from("MenuDays").select("menu_day_id, date, day")
      ]);

      if (ordersRes.error) throw ordersRes.error;
      if (menuDaysRes.error) throw menuDaysRes.error;

      return {
        orders: ordersRes.data as unknown as Order[],
        menuDays: menuDaysRes.data as { menu_day_id: number; date: string; day: string }[]
      };
    }
  });

  const processed = useMemo(() => {
    const orders = data?.orders ||[];
    const menuDays = data?.menuDays ||[];

    const emptyMatrix = Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => 0));
    if (!orders.length && !menuDays.length) {
      return {
        dishStats: [] as DishStat[],
        buyerStats: [] as BuyerStat[],
        buyerStatsByOrders: [] as BuyerStat[],
        timeStats: [] as any[],
        trendStats:[] as TrendStat[],
        dayStats: [] as DayStat[],
        kpis: null as any,
        dayHourMatrix: emptyMatrix,
        dayHourMax: 0
      };
    }

    const dishMap = new Map<number, { name: string; quantity: number; revenue: number }>();
    const buyerMap = new Map<string, { id: string; name: string; orders: number; spent: number }>();
    const trendMap = new Map<string, { date: string; revenue: number; orders: number }>();
    const menuDaysById = new Map<number, { menu_day_id: number; date: string; day: string }>();
    
    menuDays.forEach(md => {
      menuDaysById.set(md.menu_day_id, md);
      trendMap.set(md.date, { date: md.date, revenue: 0, orders: 0 });
    });

    const daysOfWeek =["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const dayMapArray: DayStat[] = daysOfWeek.map((day, i) => ({ day, revenue: 0, orders: 0, index: i }));
    
    const getDayBucket = (dayStr: string) => {
      const normalized = dayStr.toLowerCase();
      return dayMapArray.find(d => d.day.toLowerCase().startsWith(normalized.substring(0, 3)));
    };

    const timeMap = new Array(24).fill(0);
    const matrix = Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => 0));

    let totalMinutesSinceMidnight = 0;
    let totalRevenue = 0;
    let totalItemsSold = 0;

    orders.forEach((order) => {
      const fName = order.profiles?.first_name || "";
      const lName = order.profiles?.last_name || "";
      const buyerName = `${fName} ${lName}`.trim() || order.profiles?.email || "Unknown User";

      if (!buyerMap.has(order.user_id)) {
        buyerMap.set(order.user_id, { id: order.user_id, name: buyerName, orders: 0, spent: 0 });
      }
      const buyer = buyerMap.get(order.user_id)!;
      buyer.orders += 1;
      buyer.spent += Number(order.total);

      const dt = DateTime.fromISO(order.timestamp).setZone("America/Toronto");
      const orderDateKey = dt.toFormat("yyyy-MM-dd");
      
      const hour = dt.hour;
      const weekdayIndex = dt.weekday - 1; 
      matrix[weekdayIndex][hour] += 1;
      timeMap[hour] += 1;
      totalMinutesSinceMidnight += hour * 60 + dt.minute;
      totalRevenue += Number(order.total);

      const menuDay = menuDaysById.get(order.menu_id);
      const trackingDate = menuDay ? menuDay.date : orderDateKey; 
      const trackingDayName = menuDay ? menuDay.day : dt.toFormat("EEEE");

      if (!trendMap.has(trackingDate)) {
        trendMap.set(trackingDate, { date: trackingDate, revenue: 0, orders: 0 });
      }
      const trend = trendMap.get(trackingDate)!;
      trend.revenue += Number(order.total);
      trend.orders += 1;

      const dayBucket = getDayBucket(trackingDayName);
      if (dayBucket) {
        dayBucket.revenue += Number(order.total);
        dayBucket.orders += 1;
      }

      const totalItemsInOrder = order.OrderItems.reduce((acc, item) => acc + item.quantity, 0);
      totalItemsSold += totalItemsInOrder;

      order.OrderItems.forEach((item) => {
        const dishName = item.Dishes?.name || "Unknown Dish";
        if (!dishMap.has(item.dish_id)) {
          dishMap.set(item.dish_id, { name: dishName, quantity: 0, revenue: 0 });
        }
        const dish = dishMap.get(item.dish_id)!;
        dish.quantity += item.quantity;
        
        if (item.Dishes?.price) {
          dish.revenue += item.quantity * item.Dishes.price;
        } else if (totalItemsInOrder > 0) {
          dish.revenue += (item.quantity / totalItemsInOrder) * Number(order.total);
        }
      });
    });

    const sortedDishes = Array.from(dishMap.values()).sort((a, b) => b.quantity - a.quantity);
    const sortedBuyersBySpent = Array.from(buyerMap.values()).sort((a, b) => b.spent - a.spent);
    const sortedBuyersByOrders = Array.from(buyerMap.values()).sort((a, b) => b.orders - a.orders);
    const totalUniqueBuyers = buyerMap.size;
    const repeatBuyers = Array.from(buyerMap.values()).filter(b => b.orders > 1).length;
    const repeatCustomerRate = totalUniqueBuyers > 0 ? (repeatBuyers / totalUniqueBuyers) * 100 : 0;
    const avgBasketSize = orders.length > 0 ? totalItemsSold / orders.length : 0;
    
    const trendStats: TrendStat[] = Array.from(trendMap.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(t => ({ ...t, aov: t.orders > 0 ? t.revenue / t.orders : 0 }));

    const formattedTimes = timeMap
      .map((count, hour) => {
        const period = hour >= 12 ? "PM" : "AM";
        const h = hour % 12 === 0 ? 12 : hour % 12;
        return { hourLabel: `${h} ${period}`, count, hour };
      })
      .filter((t) => t.count > 0)
      .sort((a, b) => a.hour - b.hour);

    const avgMinutes = orders.length > 0 ? Math.round(totalMinutesSinceMidnight / orders.length) : 0;
    const avgHour = Math.floor(avgMinutes / 60);
    const avgMin = avgMinutes % 60;
    const avgTimeStr = DateTime.fromObject({ hour: avgHour, minute: avgMin }).toFormat("h:mm a");
    const overallAov = orders.length > 0 ? totalRevenue / orders.length : 0;

    let peakHour = 0;
    let maxOrders = 0;
    timeMap.forEach((count, idx) => {
      if (count > maxOrders) {
        maxOrders = count;
        peakHour = idx;
      }
    });
    const peakPeriod = peakHour >= 12 ? "PM" : "AM";
    const peakH = peakHour % 12 === 0 ? 12 : peakHour % 12;

    let matrixMax = 0;
    matrix.forEach((row) => row.forEach((v) => { if (v > matrixMax) matrixMax = v; }));

    return {
      dishStats: sortedDishes as DishStat[],
      buyerStats: sortedBuyersBySpent as BuyerStat[],
      buyerStatsByOrders: sortedBuyersByOrders as BuyerStat[],
      timeStats: formattedTimes,
      trendStats,
      dayStats: dayMapArray,
      kpis: {
        topDish: sortedDishes.length > 0 ? sortedDishes[0] : null,
        topBuyer: sortedBuyersBySpent.length > 0 ? sortedBuyersBySpent[0] : null,
        avgTime: avgTimeStr,
        peakTime: `${peakH} ${peakPeriod}`,
        totalRevenue,
        aov: overallAov,
        repeatCustomerRate,
        avgBasketSize
      },
      dayHourMatrix: matrix,
      dayHourMax: matrixMax
    };
  }, [data]);

  return { ...processed, isLoading, error };
};