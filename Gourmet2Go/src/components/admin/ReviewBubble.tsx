import { NavLink } from "react-router-dom";

export interface Review {
  id: string;
  user: string;
  date: string; 
  rating: number; 
  comment: string;
}

export const ReviewBubble = ({ review, link }: { review: Review; link: string }) => {
  return (
    <NavLink
      to={link}
      className="block flex-shrink-0 w-72 p-4 bg-blue-50 rounded-lg shadow-md hover:bg-blue-100 transition"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-blue-900">{review.user}</span>
        <span className="text-xs text-gray-500">{review.date}</span>
      </div>
      <div className="flex items-center mb-2">
        {Array.from({ length: review.rating }).map((_, i) => (
          <span key={i} className="text-yellow-400">★</span>
        ))}
        {Array.from({ length: 5 - review.rating }).map((_, i) => (
          <span key={i} className="text-gray-300">★</span>
        ))}
      </div>
      <p className="text-sm text-gray-700">{review.comment}</p>
    </NavLink>
  );
};
