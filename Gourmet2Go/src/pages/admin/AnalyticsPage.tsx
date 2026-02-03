
import { useState } from "react";
import { KpiCard } from "../../components/admin/analytics/KpiCard"
import { BestDishesTable } from "../../components/admin/analytics/BestDishesTable";
import { TopCustomersTable } from "../../components/admin/analytics/TopCustomersTable";
import { DateFilter } from "../../components/admin/analytics/DateFilter";
import { ExportButton } from "../../components/admin/analytics/ExportButton";
import { CustomerTypeBreakdown } from "../../components/admin/analytics/CustomerTypeBreakdown";
import { OrderStatusStats } from "../../components/admin/analytics/OrderStatusStats";
import { CategoryBreakdown } from "../../components/admin/analytics/CategoryBreakdown";
import type { CustomerTypeStats } from "../../components/admin/analytics/CustomerTypeBreakdown";


// -------- SAMPLE DATA --------
const bestSellingDishes = [
  { name: "Steak", sold: 85 },
  { name: "Pasta", sold: 72 },
  { name: "Chicken Curry", sold: 61 },
];

const topCustomers = [
  { name: "John Doe", orders: 34 },
  { name: "Jane Smith", orders: 29 },
  { name: "Mike Johnson", orders: 25 },
];

const sampleCustomerType: CustomerTypeStats[] = [
  { type: "Repeat", count: 40 },
  { type: "One-Time", count: 25 },
];

const sampleOrderStatus = {
  completed: 120,
  cancelled: 15,
  noShow: 5,
};

const sampleCategoryData = [
  { category: "Soups", itemsOrdered: 120 },
  { category: "Entrees", itemsOrdered: 220 },
  { category: "Sides", itemsOrdered: 100 },
];

// ----------------------------

export const AnalyticsPage = () => {
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-01-31");

  const handleDateChange = (
    field: "start" | "end",
    value: string
  ) => {
    if (field === "start") {
    setStartDate(value);
    } else {
    setEndDate(value);
  }
  };

  const totalOrders = topCustomers.reduce(
    (sum, c) => sum + c.orders,
    0
  );

  const totalItemsOrdered = bestSellingDishes.reduce(
    (sum, d) => sum + d.sold,
    0
  );

  const handleExport = () => {
    const rows = [
      ["Start Date", startDate],
      ["End Date", endDate],
      [],
      ["Dish", "Sold"],
      ...bestSellingDishes.map((d) => [d.name, d.sold]),
      [],
      ["Customer", "Orders"],
      ...topCustomers.map((c) => [c.name, c.orders]),
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics_${startDate}_to_${endDate}.csv`;
    a.click();
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-wrap justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Analytics & Reports
        </h1>
        <ExportButton onExport={handleExport} />
      </div>

      <DateFilter
        startDate={startDate}
        endDate={endDate}
        onChange={handleDateChange}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard label="Total Orders" value={totalOrders} />
        <KpiCard label="Items Ordered" value={totalItemsOrdered} />
        <KpiCard
          label="Best Selling Dish"
          value={bestSellingDishes[0].name}
        />
        <KpiCard
          label="Top Customer"
          value={topCustomers[0].name}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BestDishesTable dishes={bestSellingDishes} />
        <TopCustomersTable customers={topCustomers} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <CategoryBreakdown data={sampleCategoryData} />
        <OrderStatusStats {...sampleOrderStatus} />
        <CustomerTypeBreakdown data={sampleCustomerType} />
      </div>
    </div>
  );
};
