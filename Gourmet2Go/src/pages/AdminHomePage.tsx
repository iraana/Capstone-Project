import { MenuCard, type MenuItem } from "../components/admin/MenuCard";
import { OrdersTable } from "../components/admin/OrdersTable";
import type { Order } from "../components/admin/OrdersTable";
import { RecentReviewsRow } from "../components/admin/RecentReviewsRow";
import type { Review } from "../components/admin/ReviewBubble";
import { TopDishesList, type TopDish } from "../components/admin/TopDishesList";
import { TopUsersList, type TopUser } from "../components/admin/TopUsersList";

// ------------------------------
// Just sample data for demonstration , we will need to replace this with real data fetching logic
const sampleMenu: { date: string; items: MenuItem[] }[] = [
  { date: "Jan 26, 2026", items: [{ name: "Salad", price: 5.5, category: "Appetizer"}, { name: "Soup", price: 4.0, category: "Appetizer" }, { name: "Steak", price: 15.0, category: "Main Course" }] },
  { date: "Jan 27, 2026", items: [{ name: "Pasta", price: 8.0, category: "Main Course" }, { name: "Chicken Curry", price: 12.0, category: "Main Course" }, { name: "Rice", price: 3.5, category: "Side Dish" }] },
  { date: "Jan 28, 2026", items: [{ name: "Fish", price: 14.0, category: "Main Course" }, { name: "Vegetables", price: 6.0, category: "Side Dish" }, { name: "Bread", price: 2.0, category:"Side Dish" }] },
];

const sampleOrders: Order[] = [
  { id: "1001", customer: "John Doe", items: 3, total: 45.5, status: "Pending", date: "2026-01-24" },
  { id: "1002", customer: "Jane Smith", items: 2, total: 30.0, status: "Completed", date: "2026-01-25" },
  { id: "1003", customer: "Mike Johnson", items: 5, total: 75.0, status: "Pending", date: "2026-01-25" },
];

const sampleReviews: Review[] = [
  { id: "r1", user: "Bonnie Green", date: "2026-01-26", rating: 5, comment: "Amazing service and delicious dishes!" },
  { id: "r2", user: "John Doe", date: "2026-01-25", rating: 4, comment: "Very satisfied, fast delivery." },
  { id: "r3", user: "Jane Smith", date: "2026-01-24", rating: 5, comment: "Loved the food, will order again!" },
  { id: "r4", user: "Mike Johnson", date: "2026-01-23", rating: 3, comment: "Good, but delivery was late." },
  { id: "r5", user: "Alice Brown", date: "2026-01-22", rating: 5, comment: "Perfect meals every time!" },
];

const topUsers: TopUser[] = [
  { id: "u1", name: "John Doe", orders: 15 },
  { id: "u2", name: "Jane Smith", orders: 12 },
  { id: "u3", name: "Mike Johnson", orders: 10 },
];

const topDishes: TopDish[] = [
  { id: "d1", name: "Steak", sold: 45 },
  { id: "d2", name: "Pasta", sold: 38 },
  { id: "d3", name: "Chicken Curry", sold: 35 },
];

//------------------------------

export const AdminHomePage = () => {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>


    {/* Menu Cards */}
      <div className="flex gap-6 flex-wrap">
        {sampleMenu.map((menu) => (
          <MenuCard key={menu.date} date={menu.date} items={menu.items} editable={false} />
        ))}
      </div>
    {/* Orders Table */}
      <OrdersTable orders={sampleOrders} ordersPageLink="/orders" />

    {/* Recent Reviews Row */}
      <RecentReviewsRow reviews={sampleReviews} link="/reviews" />

    {/* Top Users and Top Dishes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TopUsersList users={topUsers} />
        <TopDishesList dishes={topDishes} />
      </div>
    </div>
  );
};
