import { AdminHome } from "../../components/admin/AdminHome"
import { RecentReviewsRow } from "../../components/admin/RecentReviewsRow";
import type { Review } from "../../components/admin/ReviewBubble";
import { TopDishesList, type TopDish } from "../../components/admin/TopDish";
import { TopUsersList, type TopUser } from "../../components/admin/TopUsersList";

const sampleReviews: Review[] = [
  { id: "r1", user: "Bonnie Green", date: "2026-01-26", rating: 5, comment: "Amazing service and delicious dishes!" },
  { id: "r2", user: "John Doe", date: "2026-01-25", rating: 4, comment: "Very satisfied, fast delivery." },
  { id: "r3", user: "Jane Smith", date: "2026-01-24", rating: 5, comment: "Loved the food, will order again!" },
  { id: "r4", user: "Mike Johnson", date: "2026-01-23", rating: 3, comment: "Good, but delivery was late." },
  { id: "r5", user: "Alice Brown", date: "2026-01-22", rating: 5, comment: "Perfect meals every time!" },
];

const topDishes: TopDish[] = [
  { id: "d1", name: "Steak", sold: 45 },
  { id: "d2", name: "Pasta", sold: 38 },
  { id: "d3", name: "Chicken Curry", sold: 35 },
];

const topUsers: TopUser[] = [
  { id: "u1", name: "John Doe", orders: 15 },
  { id: "u2", name: "Jane Smith", orders: 12 },
  { id: "u3", name: "Mike Johnson", orders: 10 },
];

export const AdminHomePage = () => {
    return (
        <div>
            <AdminHome />
            {/* Recent Reviews Row */}
            <RecentReviewsRow reviews={sampleReviews} link="/reviews" />

            {/* Top Users and Top Dishes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TopUsersList users={topUsers} />
                <TopDishesList dishes={topDishes} />
            </div>
        </div>
    )
}