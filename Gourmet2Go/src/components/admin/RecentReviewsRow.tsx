import { ReviewBubble } from "./ReviewBubble";
import type { Review } from "./ReviewBubble";
import { NavLink } from "react-router-dom";

export const RecentReviewsRow = ({ reviews, link }: { reviews: Review[]; link: string }) => {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-gray-800">Recent Reviews</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {reviews.map((review) => (
          <ReviewBubble key={review.id} review={review} link={link} />
        ))}
      </div>
      <NavLink
        to={link}
        className="inline-block text-blue-900 font-semibold hover:underline mt-1"
      >
        See All Reviews
      </NavLink>
    </div>
  );
};
