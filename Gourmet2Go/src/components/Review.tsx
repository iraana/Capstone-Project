import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { supabase } from "../../supabase-client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router";

const reviewSchema = z.object({
    rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot be more than 5"),
    comment: z.string().max(500, "Comment cannot exceed 500 characters").optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;


export const Review = () => {
    const { user, role } = useAuth();
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState<number | null>(null);
    const { dishId } = useParams<{ dishId: string }>();

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<ReviewFormData>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: 0,
            comment: "",
        },
    });

    const isAuthorized = user && (role === "USER" || role === "ADMIN");

    const onSubmit = async (data: ReviewFormData) => {
        try {
            const { error } = await supabase.from("Reviews").insert({
                user_id: user?.id,
                dish_id: Number(dishId),
                rating: data.rating,
                comment: data.comment,
                createdAt: new Date().toISOString(),
            });
            if (error) throw error;
            } catch (error) {
                console.error("Error submitting review:", error);
            }
    }

    return (
        <form className="p-6 space-y-6 max-w-xl mx-auto" onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900/50">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Review</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Share your thoughts about this dish</p>
                </div>
                <div className="p-6 space-y-6">
                    {isAuthorized ? (
                        <>
                            <div>
                                <label className="block text-blue-600 dark:text-blue-400 font-bold text-xs uppercase mb-1">Rating</label>
                                <div className="flex gap-2 mb-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoveredRating(star)}
                                            onMouseLeave={() => setHoveredRating(null)}
                                            className="transition-colors"
                                            style={{
                                                color: (hoveredRating !== null ? star <= hoveredRating : star <= rating) ? '#FFD700' : '#CCC',
                                                fontSize: '2rem',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: 0,
                                            }}
                                            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                                        >
                                            {(hoveredRating !== null ? star <= hoveredRating : star <= rating) ? '★' : '☆'}
                                        </button>
                                    ))}
                                </div>
                                {errors.rating && (
                                    <p className="text-red-600 text-sm mt-1">{errors.rating.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-blue-600 dark:text-blue-400 font-bold text-xs uppercase mb-1 mt-4">Comment</label>
                                <textarea
                                    className="w-full border rounded px-3 py-2 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                                    placeholder="Write your review here..."
                                    {...register("comment")}
                                />
                                {errors.comment && (
                                    <p className="text-red-600 text-sm mt-1">{errors.comment.message}</p>
                                )}
                            </div>

                            <div className="flex gap-4 mt-4">
                                <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-green-900/20 transition-all active:scale-95"
                                >
                                    Submit Review
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            You are not authorized to view this content.
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
}
