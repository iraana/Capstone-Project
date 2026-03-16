import React, { useState, useMemo, Suspense } from "react";
import { motion, type Variants } from "framer-motion";
import { Loader } from "../../../components/Loader";
import { Users, Clock, DollarSign, BarChart3, TrendingUp, TrendingDown, UtensilsCrossed, Download, LineChart, CircleDollarSign, CalendarDays, RefreshCcw, ShoppingBag, Award } from "lucide-react";
import { useAnalyticsData } from "../../../hooks/useAnalyticsData";
import type { TabOption } from "../../../types/analyticsTypes";
import { DateTime } from "luxon";

// The components are lazy loaded to reduce page load time
const TopDishesReport = React.lazy(() => import("./TopDishes").then(m => ({ default: m.TopDishes })));
const TopBuyersReport = React.lazy(() => import("./TopBuyers").then(m => ({ default: m.TopBuyers })));
const OrderTimesReport = React.lazy(() => import("./OrderTimes").then(m => ({ default: m.OrderTimes })));
const RevenueTrendReport = React.lazy(() => import("./RevenueTrend").then(m => ({ default: m.RevenueTrend })));
const RevenueByDayReport = React.lazy(() => import("./RevenueByDay").then(m => ({ default: m.RevenueByDay })));

const containerVariants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants: Variants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } };

export const Analytics = () => {
  const [activeTab, setActiveTab] = useState<TabOption>("revenue-trend"); // useState for the active tab, revenue-trend is the default
  const { dishStats, buyerStats, buyerStatsByOrders, timeStats, trendStats, dayStats, kpis, dayHourMatrix, dayHourMax, isLoading, error } = useAnalyticsData(); // All the stats from the useAnalyticsData hook

  // What the chart should show based on the active tab
  const { chartData, xDataKey, yDataKey } = useMemo(() => {
    switch (activeTab) {
      case "revenue-trend":
        return { chartData: trendStats ||[], xDataKey: "date", yDataKey: "revenue" };
      case "revenue-by-day":
        return { chartData: dayStats ||[], xDataKey: "day", yDataKey: "revenue" };
      case "revenue-by-dish":
        return { chartData:[...(dishStats || [])].sort((a, b) => b.revenue - a.revenue).slice(0, 10), xDataKey: "name", yDataKey: "revenue" };
      case "top-dishes":
        return { chartData: (dishStats ||[]).slice(0, 10), xDataKey: "name", yDataKey: "quantity" };
      case "lowest-dishes":
        return { chartData: ([...dishStats].reverse() ||[]).slice(0, 10), xDataKey: "name", yDataKey: "quantity" };
      case "top-buyers":
        return { chartData: (buyerStats ||[]).slice(0, 10), xDataKey: "name", yDataKey: "spent" };
      case "top-buyers-orders":
        return { chartData: (buyerStatsByOrders ||[]).slice(0, 10), xDataKey: "name", yDataKey: "orders" };
      case "order-times":
        return { chartData: (timeStats ||[]).slice(0, 10), xDataKey: "hourLabel", yDataKey: "count" };
      default:
        return { chartData:[], xDataKey: "", yDataKey: "" };
    }
  },[activeTab, dishStats, buyerStats, buyerStatsByOrders, timeStats, trendStats, dayStats]);

  // For the revenue trend table because it sorts by gross revenue instead of date
  const tableData = useMemo(() => {
    if (activeTab === "revenue-trend") {
      return [...chartData].sort((a, b) => b.revenue - a.revenue);
    }
    return chartData;
  }, [activeTab, chartData]);

  // For exporting to a CSV file
  const handleExportCSV = () => {
    let csvContent = "";
    const dateStr = DateTime.now().setZone("America/Toronto").toFormat("yyyy-MM-dd"); 
    const filename = `gourmet2go_${activeTab}_${dateStr}.csv`; // File name built from the active tab and date

    // All the data in the CSV
    if (activeTab === "revenue-trend") {
      csvContent = "Rank,Date,Revenue,Orders,AOV\n";
      tableData.forEach((item: any, idx: number) => { csvContent += `${idx + 1},${item.date},${item.revenue.toFixed(2)},${item.orders},${item.aov.toFixed(2)}\n`; });
    } else if (activeTab === "revenue-by-day") {
      csvContent = "Day,Revenue,Orders\n";
      tableData.forEach((item: any) => { csvContent += `${item.day},${item.revenue.toFixed(2)},${item.orders}\n`; });
    } else if (activeTab === "revenue-by-dish") {
      csvContent = "Rank,Dish Name,Gross Revenue\n";
      tableData.forEach((item: any, index: number) => {
        const name = `"${item.name.replace(/"/g, '""')}"`;
        csvContent += `${index + 1},${name},${item.revenue.toFixed(2)}\n`;
      });
    } else if (activeTab === "top-dishes" || activeTab === "lowest-dishes") {
      csvContent = "Rank,Dish Name,Quantity Sold,Estimated Revenue\n";
      tableData.forEach((item: any, index: number) => {
        const name = `"${item.name.replace(/"/g, '""')}"`;
        csvContent += `${index + 1},${name},${item.quantity},${item.revenue.toFixed(2)}\n`;
      });
    } else if (activeTab === "top-buyers" || activeTab === "top-buyers-orders") {
      csvContent = "Rank,Buyer Name,Total Spent,Orders Placed\n";
      tableData.forEach((item: any, index: number) => {
        const name = `"${item.name.replace(/"/g, '""')}"`;
        csvContent += `${index + 1},${name},${Number(item.spent).toFixed(2)},${item.orders}\n`;
      });
    } else if (activeTab === "order-times") {
      csvContent = "Rank,Time,Orders\n";
      tableData.forEach((item: any, index: number) => { csvContent += `${index + 1},${item.hourLabel},${item.count}\n`; });
    }

    if (!csvContent) return;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" }); // Creates a blob based on the csvContent
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) return <Loader fullScreen />;

  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-red-500 dark:text-red-400 p-6 text-center">
        <p className="font-bold text-lg mb-2">Error loading analytics</p>
        <p className="text-sm">{(error as any).message}</p>
      </div>
    );
  }

  // This is to map tabs to components
  const reportProps = {
    "revenue-trend": { component: RevenueTrendReport, props: { data: chartData, color: "#8b5cf6" } },
    "revenue-by-day": { component: RevenueByDayReport, props: { data: chartData, color: "#3b82f6" } },
    "revenue-by-dish": { component: TopDishesReport, props: { data: chartData, yKey: "revenue", color: "#ec4899" } },
    "top-dishes": { component: TopDishesReport, props: { data: chartData } },
    "lowest-dishes": { component: TopDishesReport, props: { data: chartData, color: "#f43f5e" } },
    "top-buyers": { component: TopBuyersReport, props: { data: chartData, yKey: "spent", color: "#10b981" } },
    "top-buyers-orders": { component: TopBuyersReport, props: { data: chartData, yKey: "orders", color: "#0ea5e9" } },
    "order-times": { component: OrderTimesReport, props: { dayHourMatrix, dayHourMax } }
  } as const;

  const ActiveReport = reportProps[activeTab].component as React.LazyExoticComponent<any>; // Dynamically chosing whcih chart to render
  const activeReportProps = reportProps[activeTab].props;

  const getTabClass = (tabName: string, activeColors: string) => {
    return `flex-1 min-w-[140px] py-4 px-2 flex items-center justify-center gap-2 transition-all font-semibold text-sm border-b-2 ${
      activeTab === tabName 
        ? `${activeColors} bg-white dark:bg-zinc-800` 
        : "text-zinc-500 dark:text-zinc-400 border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-800 dark:hover:text-zinc-200"
    }`;
  };

  const renderTableHeaders = () => {
    switch (activeTab) {
      case "revenue-trend":
        return (
          <>
            <th className="px-6 py-4 font-bold">Date</th>
            <th className="px-6 py-4 font-bold text-right">Gross Revenue</th>
            <th className="px-6 py-4 font-bold text-right">Orders</th>
            <th className="px-6 py-4 font-bold text-right">AOV</th>
          </>
        );
      case "revenue-by-day":
        return (
          <>
            <th className="px-6 py-4 font-bold">Menu Target Day</th>
            <th className="px-6 py-4 font-bold text-right">Revenue</th>
            <th className="px-6 py-4 font-bold text-right">Orders</th>
          </>
        );
      case "top-buyers":
      case "top-buyers-orders":
        return (
          <>
            <th className="px-6 py-4 font-bold">Buyer Name</th>
            <th className="px-6 py-4 font-bold text-right">Total Spent</th>
            <th className="px-6 py-4 font-bold text-right">Orders Placed</th>
          </>
        );
      default:
        return (
          <>
            <th className="px-6 py-4 font-bold">{activeTab === "order-times" ? "Time" : "Name"}</th>
            <th className="px-6 py-4 font-bold text-right">
              {activeTab === "revenue-by-dish" ? "Total Revenue" : activeTab === "order-times" ? "Total Orders" : "Quantity Sold"}
            </th>
          </>
        );
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-8xl mx-auto space-y-8 px-4 sm:px-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-[#00659B] dark:text-blue-400 rounded-2xl shadow-sm border border-blue-200 dark:border-blue-800/50">
          <BarChart3 size={28} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Analytics</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">BI for dish, menu, order, and customer data</p>
        </div>
      </div>

      {/* Key Performance Indicators (KPIs) */}
      {kpis && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div variants={itemVariants} className="bg-white dark:bg-zinc-800 p-5 rounded-2xl border border-gray-200 dark:border-zinc-700 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600 dark:text-green-400"><DollarSign size={24} /></div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase font-bold tracking-wider">Gross Revenue</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white leading-tight mt-0.5">${kpis.totalRevenue.toFixed(2)}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium bg-zinc-100 dark:bg-zinc-700/50 inline-block px-2 py-0.5 rounded-md">
                AOV: ${kpis.aov.toFixed(2)}
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white dark:bg-zinc-800 p-5 rounded-2xl border border-gray-200 dark:border-zinc-700 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400"><RefreshCcw size={24} /></div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase font-bold tracking-wider">Retention Rate</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white leading-tight mt-0.5">{kpis.repeatCustomerRate.toFixed(1)}%</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Repeat Customers</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white dark:bg-zinc-800 p-5 rounded-2xl border border-gray-200 dark:border-zinc-700 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-xl text-pink-600 dark:text-pink-400"><ShoppingBag size={24} /></div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase font-bold tracking-wider">Avg Basket</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white leading-tight mt-0.5">{kpis.avgBasketSize.toFixed(1)}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Items per Order</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white dark:bg-zinc-800 p-5 rounded-2xl border border-gray-200 dark:border-zinc-700 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-600 dark:text-amber-400"><Clock size={24} /></div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase font-bold tracking-wider">Avg Order Time</p>
              <p className="text-lg font-bold text-zinc-900 dark:text-white leading-tight mt-0.5">{kpis.avgTime}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Peak: {kpis.peakTime}</p>
            </div>
          </motion.div>
        </div>
      )}

      {/* All of the charts */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-200 dark:border-zinc-700 shadow-sm overflow-hidden">
        <div className="flex flex-nowrap overflow-x-auto border-b border-gray-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/80 custom-scrollbar">
          <button onClick={() => setActiveTab("revenue-trend")} className={getTabClass("revenue-trend", "text-purple-600 dark:text-purple-400 border-purple-600 dark:border-purple-400")}><LineChart size={18} /> Trend</button>
          <button onClick={() => setActiveTab("revenue-by-day")} className={getTabClass("revenue-by-day", "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400")}><CalendarDays size={18} /> Menu Days</button>
          <button onClick={() => setActiveTab("revenue-by-dish")} className={getTabClass("revenue-by-dish", "text-pink-600 dark:text-pink-400 border-pink-600 dark:border-pink-400")}><CircleDollarSign size={18} /> Dish Rev</button>
          <button onClick={() => setActiveTab("top-dishes")} className={getTabClass("top-dishes", "text-[#00659B] dark:text-blue-400 border-[#00659B] dark:border-blue-400")}><TrendingUp size={18} /> Highest</button>
          <button onClick={() => setActiveTab("lowest-dishes")} className={getTabClass("lowest-dishes", "text-rose-600 dark:text-rose-400 border-rose-600 dark:border-rose-400")}><TrendingDown size={18} /> Lowest</button>
          <button onClick={() => setActiveTab("top-buyers")} className={getTabClass("top-buyers", "text-emerald-600 dark:text-emerald-400 border-emerald-600 dark:border-emerald-400")}><Users size={18} /> Top Spenders</button>
          <button onClick={() => setActiveTab("top-buyers-orders")} className={getTabClass("top-buyers-orders", "text-sky-500 dark:text-sky-400 border-sky-500 dark:border-sky-400")}><Award size={18} /> Most Orders</button>
          <button onClick={() => setActiveTab("order-times")} className={getTabClass("order-times", "text-amber-600 dark:text-amber-400 border-amber-600 dark:border-amber-400")}><Clock size={18} /> Schedule</button>
        </div>

        <div className="p-6 h-100">
          <Suspense fallback={<Loader fullScreen={false} text="Loading report..." />}>
            <ActiveReport {...(activeReportProps as any)} />
          </Suspense>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-200 dark:border-zinc-700 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/80 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <UtensilsCrossed size={18} className="text-zinc-400 dark:text-zinc-500" /> Detailed Data Report
          </h3>
          <button
            onClick={handleExportCSV}
            disabled={tableData.length === 0}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-zinc-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            <Download size={16} /> Export to CSV
          </button>
        </div>

        <div className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider bg-white dark:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-700">
              <tr>
                <th className="px-6 py-4 font-bold">Idx</th>
                {renderTableHeaders()}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-700 text-zinc-900 dark:text-zinc-200">
              {tableData.map((item: any, index: number) => (
                <tr key={index} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-zinc-500 dark:text-zinc-400">
                    {activeTab === "revenue-by-day" ? `-` : `#${index + 1}`}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {activeTab === "revenue-trend" ? DateTime.fromISO(item.date).toFormat("MMM dd, yyyy") : item[xDataKey]}
                  </td>
                  
                  {activeTab === "revenue-trend" && (
                    <>
                      <td className="px-6 py-4 font-bold text-right text-emerald-600 dark:text-emerald-400">${Number(item.revenue).toFixed(2)}</td>
                      <td className="px-6 py-4 font-semibold text-right">{item.orders}</td>
                      <td className="px-6 py-4 font-semibold text-right">${Number(item.aov).toFixed(2)}</td>
                    </>
                  )}

                  {activeTab === "revenue-by-day" && (
                    <>
                      <td className="px-6 py-4 font-bold text-right text-blue-600 dark:text-blue-400">${Number(item.revenue).toFixed(2)}</td>
                      <td className="px-6 py-4 font-semibold text-right">{item.orders}</td>
                    </>
                  )}

                  {(activeTab === "top-buyers" || activeTab === "top-buyers-orders") && (
                    <>
                      <td className="px-6 py-4 font-bold text-right">${Number(item.spent ?? 0).toFixed(2)}</td>
                      <td className="px-6 py-4 text-right text-emerald-600 dark:text-emerald-400 font-semibold">{item.orders ?? "-"}</td>
                    </>
                  )}

                  {!["revenue-trend", "revenue-by-day", "top-buyers", "top-buyers-orders"].includes(activeTab) && (
                    <td className="px-6 py-4 font-bold text-right">
                      {activeTab === "revenue-by-dish" ? `$${Number(item.revenue).toFixed(2)}` : item[yDataKey]}
                    </td>
                  )}
                </tr>
              ))}
              {tableData.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/30 border-dashed border-2 border-zinc-200 dark:border-zinc-700 m-4 rounded-xl">
                    No data available for this selection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};